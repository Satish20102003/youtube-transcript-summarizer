
const express = require("express");
const cors = require("cors");
const { getTranscript } = require("youtube-transcript-api"); // External package for YouTube transcript fetching.

const app = express();
const PORT = 5000;

// Middleware to enable CORS
app.use(cors());

// Route to handle transcript summarization
app.get("/summarize", async (req, res) => {
  const { url, language } = req.query;

  // Validate input
  if (!url || !language) {
    return res.status(400).json({ error: "Missing YouTube URL or language parameter." });
  }

  // Extract video ID from URL
  const videoId = url.split("v=")[1]?.split("&")[0];
  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL." });
  }

  try {
    // Fetch transcript using the video ID and language
    const transcript = await getTranscript(videoId, { lang: language });

    // Combine all transcript text into a single string
    const allText = transcript.map((entry) => entry.text).join(" ");

    // Generate a basic summary (first 50 words)
    const summary = allText.split(" ").slice(0, 50).join(" ") + "...";

    // Send summary as a JSON response
    res.json({ summary });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching transcript:", error);

    // Respond with an appropriate error message
    const errorMessage =
      error.message.includes("No transcript found")
        ? "No transcript available for this video in the requested language."
        : "Unable to fetch transcript. Please try again later.";
    res.status(500).json({ error: errorMessage });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
