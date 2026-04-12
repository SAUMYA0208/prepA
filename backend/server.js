require("dotenv").config()   // must be first line
console.log("ENV CHECK:", process.env.GROQ_API_KEY ? "Present" : "Missing");

const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
