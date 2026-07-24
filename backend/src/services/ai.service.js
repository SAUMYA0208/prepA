require("dotenv").config();
const Groq = require("groq-sdk")
const puppeteer = require("puppeteer")


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY})

const MODEL_CANDIDATES = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
    "mixtral-8x7b-32768",
]

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

function isRateLimitError(err) {
    const msg = err?.message || ""
    const status = err?.status || 0
    return status === 429 || msg.includes("429") || msg.toLowerCase().includes("rate limit")
}

async function generateWithRetry(prompt, { maxTokens = 1500, jsonMode = false } = {}) {
    const MAX_ATTEMPTS = 3
    const BASE_DELAY = 2000
    let lastError

    for (const model of MODEL_CANDIDATES) {
        console.log(`[AI] Trying model: ${model}`)
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                console.log(`[AI] ${model} — attempt ${attempt}`)
                const requestOptions = {
                    model,
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: maxTokens,
                    temperature: 0.3,
                }
                if (jsonMode) requestOptions.response_format = { type: "json_object" }
                const response = await groq.chat.completions.create(requestOptions)
                const text = response.choices[0]?.message?.content || ""
                console.log(`[AI] ✅ Success with ${model}`)
                return text
            } catch (err) {
                lastError = err
                console.warn(`[AI] ⚠️  ${model} attempt ${attempt} failed: ${err?.message}`)
                if (isRateLimitError(err)) {
                    if (attempt < MAX_ATTEMPTS) {
                        const delay = BASE_DELAY * Math.pow(2, attempt - 1)
                        console.log(`[AI] Rate limited. Waiting ${delay}ms...`)
                        await sleep(delay)
                    } else {
                        console.warn(`[AI] ${model} exhausted. Moving to next model.`)
                        break
                    }
                } else {
                    console.error(`[AI] ${model} non-retryable error. Skipping.`)
                    break
                }
            }
        }
        await sleep(300)
    }
    throw new Error(`All models failed. Last error: ${lastError?.message}`)
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert interview coach. Analyze the resume, self description, and job description below.
Return ONLY a valid JSON object — no markdown, no extra text.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return this exact JSON structure:
{
  "title": "job title string",
  "matchScore": number between 0 and 100,
  "technicalQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "behavioralQuestions": [
    { "question": "string", "intention": "string", "answer": "string" }
  ],
  "skillGaps": [
    { "skill": "string", "severity": "low or medium or high" }
  ],
  "preparationPlan": [
    { "day": 1, "focus": "string", "tasks": ["string"] }
  ]
}`

    const text = await generateWithRetry(prompt, { maxTokens: 1500, jsonMode: true })
    try {
        return JSON.parse(text.replace(/```json|```/g, "").trim())
    } catch (err) {
        console.error("❌ JSON parse failed:", text)
        throw new Error("Model returned invalid JSON")
    }
}

let browserInstance = null

async function getBrowser() {
    if (!browserInstance || !browserInstance.isConnected()) {
        browserInstance = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        })
        process.on("exit", () => browserInstance?.close())
        process.on("SIGINT", async () => { await browserInstance?.close(); process.exit(0) })
    }
    return browserInstance
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await getBrowser()
    const page = await browser.newPage()
    try {
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })
        return await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
        })
    } finally {
        await page.close()
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `
    const text = await generateWithRetry(prompt, { maxTokens: 1500, jsonMode: true })
    let jsonContent
    try {
        jsonContent = JSON.parse(text.replace(/```json|```/g, "").trim())
    } catch (err) {
        console.error("❌ JSON parse failed for resume HTML:", text)
        throw new Error("Model returned invalid JSON for resume")
    }
    if (!jsonContent.html) throw new Error("Response missing 'html' field")
    return await generatePdfFromHtml(jsonContent.html)
}

module.exports = { generateInterviewReport, generateResumePdf }
