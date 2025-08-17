import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -----------------------------
// 🔹 Summarization Route
// -----------------------------
app.post("/summarize", async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    if (!transcript || !prompt) {
      return res.status(400).json({ error: "Transcript and prompt are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Transcript: ${transcript}\n\nInstruction: ${prompt}`
    );

    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// -----------------------------
// 🔹 Email Sending Route
// -----------------------------
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: "To, subject, and text are required" });
    }

    // ✅ Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // use "outlook" or others if needed
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Email details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// -----------------------------
// 🔹 Health Check
// -----------------------------
app.get("/", (req, res) => {
  res.send("AI Meeting Notes Summarizer Backend is running 🚀");
});

// -----------------------------
// 🔹 Start Server
// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
