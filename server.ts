import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side API endpoint for secure AI comment generation using Gemini 3.5-flash
app.post("/api/ai-comment", async (req, res) => {
  try {
    const { subject, marks, total, studentName } = req.body;
    
    // Default fallback if no key is present or configured
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ 
        comment: `Excellent effort in ${subject}! Scored ${marks}/${total}. Keep up the great work and target perfect score next time.` 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Write a 2 line student performance feedback in Hinglish (Hindi written in English script) for student ${studentName || 'the student'} with marks: ${subject}: ${marks}/${total}. The comment should be highly realistic, friendly, and contain a mix of simple Hindi and English. Keep it strictly to 2 lines and do not prepend bullet points or prefixes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text || `Good effort in ${subject}!`;
    res.json({ comment: text.trim() });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Graceful error fallback for Hinglish comment
    const fallbackComment = `Acha performance hai ${req.body.subject} mein. Marks ${req.body.marks}/${req.body.total} hain. Agli baar thoda aur hard work karo toh top karoge!`;
    res.json({ comment: fallbackComment });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
