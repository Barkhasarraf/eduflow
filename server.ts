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

// Server-side API endpoint for secure parenting development feedback using Gemini 3.5-flash
app.post("/api/ai-parent-feedback", async (req, res) => {
  const { studentName, attendance, fees, marks } = req.body || {};
  try {
    // Default fallback if no key is present or configured
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ 
        feedback: `Mata-pita ji, ${studentName || "Rohan"} ki over-all progress bahut achhi chal rahi hai. Attendance bilkul stable hai aur tuition/exam records timely processed hain. Padhai ke sath student extracurricular activities mein active hai. Regular revision karwayein toh results aur badhiya honge!` 
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

    const prompt = `Write a realistic, friendly, and encouraging parent counseling development report in Hinglish (Hindi words in English script) for a student named ${studentName || "Rohan"}.
    Parameters:
    - Attendance summary: ${JSON.stringify(attendance || {present: 26, absent: 2})}
    - Fee Status: ${JSON.stringify(fees || {status: 'Paid'})}
    - Academics Exam scores: ${JSON.stringify(marks || {Mathematics: 85, Science: 92})}

    Structure rules:
    - Keep it strictly to 3 short sentences.
    - Write in smooth conversational Hinglish, sounding like a caring, experienced, and warm class teacher telling the parent about their child's classroom dedication, attendance consistency, and fee compliance.
    - End on an encouraging developmental tip.
    - Do not write any prefixes, bullet points, headers, or quotes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text || `Performance kaafi solid hai revision par focus banaye rakhein.`;
    res.json({ feedback: text.trim().replace(/^"|"$/g, "") });
  } catch (error: any) {
    console.error("Gemini Parent Error:", error);
    const fallback = `Aapke bacche ${studentName || "Rohan"} ka performance bohot consistent hai. Attendance kaafi acchi hai aur class activities mein active rehta hai. Ghabraiye nahi, mehnat se results aur thode sudhar jayenge. Keep supporting!`;
    res.json({ feedback: fallback });
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
