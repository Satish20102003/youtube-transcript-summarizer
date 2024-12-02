import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null); // To handle errors

  const handleUrlChange = (e) => setVideoUrl(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleSummarize = async () => {
    setError(null); // Clear any previous errors
    setSummary(""); // Clear previous summary
    try {
      const response = await axios.get("http://localhost:5000/summarize", {
        params: { url: videoUrl, language },
      });
      setSummary(response.data.summary);
    } catch (err) {
      console.error("Error fetching the summary:", err);
      setError("Failed to fetch the summary. Please check the URL or try again.");
    }
  };

  return (
    <div className="App">
      <h1>YouTube Transcript Summarizer</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter YouTube Video URL"
          value={videoUrl}
          onChange={handleUrlChange}
        />
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="ml">Malayalam</option>
        </select>
        <button onClick={handleSummarize}>Summarize</button>
      </div>
      {error && (
        <div className="error-container">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
      {summary && (
        <div className="summary-container">
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
