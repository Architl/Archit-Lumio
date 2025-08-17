import { useState } from "react";
import axios from "axios";

function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  // 🔹 Call backend for summary
  const handleSummarize = async () => {
    try {
      setStatus("Generating summary...");
      const res = await axios.post("http://localhost:5000/summarize", {
        transcript,
        prompt,
      });
      setSummary(res.data.summary);
      setStatus("Summary generated ✅");
    } catch (error) {
      console.error(error);
      setStatus("Error generating summary ❌");
    }
  };

  // 🔹 Call backend to send email
  const handleSendEmail = async () => {
    try {
      setStatus("Sending email...");
      await axios.post("http://localhost:5000/send-email", {
        to: email,
        subject: "Meeting Summary",
        text: summary,
      });
      setStatus("Email sent ✅");
    } catch (error) {
      console.error(error);
      setStatus("Error sending email ❌");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h1>AI Meeting Notes Summarizer 📝</h1>

      {/* Transcript Upload (text area) */}
      <textarea
        placeholder="Paste your transcript here..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        style={{ width: "100%", height: "120px", marginBottom: "10px" }}
      />

      {/* Custom Instruction */}
      <input
        type="text"
        placeholder="Enter custom prompt (e.g., Summarize for executives)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button onClick={handleSummarize} style={{ padding: "10px", marginBottom: "20px" }}>
        Generate Summary
      </button>

      {/* Summary Editor */}
      {summary && (
        <div>
          <h2>Generated Summary</h2>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ width: "100%", height: "150px", marginBottom: "10px" }}
          />
        </div>
      )}

      {/* Email Section */}
      {summary && (
        <div>
          <input
            type="email"
            placeholder="Enter recipient email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={handleSendEmail} style={{ padding: "10px" }}>
            Share via Email
          </button>
        </div>
      )}

      {/* Status */}
      <p style={{ marginTop: "20px", color: "blue" }}>{status}</p>
    </div>
  );
}

export default App;
