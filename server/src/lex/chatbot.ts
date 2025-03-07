import { RecognizeTextCommand, LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2";
import dotenv from "dotenv";

dotenv.config();

const lexClient = new LexRuntimeV2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendMessageToLex(userId: string, message: string) {
  const params = {
    botAliasId: process.env.BOT_ALIAS_ID,
    botId: process.env.BOT_ID,
    localeId: "en_US",
    sessionId: userId,
    text: message,
  };

  try {
    const command = new RecognizeTextCommand(params);
    const response = await lexClient.send(command);
    return response.messages?.[0]?.content || "No response from bot.";
  } catch (error) {
    console.error("Lex error:", error);
    return "Error processing your request.";
  }
}
