import express, { Request, Response } from "express";
import { sendMessageToLex } from "./lex/chatbot";
import cors from "cors";


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({origin : "*"}))

app.post("/chat", async (req: Request, res: Response) : Promise<any> => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  const botResponse = await sendMessageToLex(userId, message);
  res.json({ reply: botResponse });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
