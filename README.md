# 🚀 PrepAI – AI Powered Interview Preparation & Resume Analyzer

PrepAI is a full-stack GenAI application that helps users prepare for interviews by analyzing their resume, job description, and self-description. It generates personalized technical and behavioral questions, evaluates candidate-job fit, and provides a structured preparation plan.

---

## 🧠 Features

* 📄 Resume + Job Description Analysis
* 🎯 Match Score between candidate and job role
* 💻 AI-generated Technical Questions with answers
* 🗣️ Behavioral Interview Questions with insights
* 📉 Skill Gap Analysis
* 📅 Personalized Preparation Plan
* 📑 Resume PDF generation (ATS-friendly)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### AI Integration

* Groq API (LLMs like LLaMA, Mixtral, Gemma)

### Database

* MongoDB

### Other Tools

* Puppeteer (PDF generation)
* Postman (API testing)

---

## ⚙️ How It Works

1. User provides:

   * Resume
   * Job Description
   * Self Description

2. Backend sends this data to AI model

3. AI generates:

   * Match score
   * Interview questions
   * Skill gaps
   * Preparation plan

4. Optional:

   * Resume is converted into a professional PDF

---

## 📂 Project Structure

```
prepAI/
│
├── frontend/     # React frontend
├── backend/      # Node.js backend
```

---

## 🔐 Environment Variables

Create a `.env` file inside backend folder:

```
GROQ_API_KEY=your_api_key
MONGO_URI=your_mongodb_uri
```

---

## 🚀 Run Locally

### 1. Clone the repo

```
git clone https://github.com/SAUMYA0208/prepAI.git
```

### 2. Backend setup

```
cd backend
npm install
npm start
```

### 3. Frontend setup

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Future Improvements

* User authentication (login/signup)
* Dashboard to track progress
* Mock interview simulation
* Better UI/UX enhancements

---

## 🙌 Author

**Saumya**
Engineering Student

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub and share with others!
