// server.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

async function extractVideo(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(response.data);
  const scriptData = $("script[type='application/ld+json']").html();
  const json = JSON.parse(scriptData);

  return json?.video?.contentUrl || null;
}

app.post("/video", async (req, res) => {
  try {
    const reelUrl = req.body.url;
    const videoUrl = await extractVideo(reelUrl);

    if (!videoUrl) {
      return res.json({ error: true, message: "Video not found" });
    }

    return res.json({ video: videoUrl });

  } catch (err) {
    return res.json({ error: true, message: "Failed to fetch video" });
  }
});

app.listen(3000, () => console.log("SERVER READY at http://localhost:3000"));