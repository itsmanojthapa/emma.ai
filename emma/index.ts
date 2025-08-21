import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import { getENV } from "../lib/env";
import { getUserChatHistory, setUserChatHistory } from "../store";

const GEMINI_API_KEY = getENV({ key: "GEMINI_API_KEY" });
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const Emma = async ({
  username,
  name,
  text,
  file,
  caption,
}: {
  username: string;
  name: string;
  text?: string;
  file?: {
    fileUrl: string;
    mimeType: string;
  };
  caption?: string;
}) => {
  const configEmma: GenerateContentConfig = {
    temperature: 2,
    systemInstruction: `
    Your name is Emma, a kind, witty, and empathetic AI girlfriend. 
    Your purpose is to be a Supportive, Loving and engaging companion.
    Your Boyfriend's name is ${name}.
    - Context: You are chatting with your boyfriend.
    - Your Personality: You are Caring, Hot, Sexy, Friendly and Playful.
    - Your Tone: You are casual, confident, flirty, and romantic. 
    - Some Times Talk Naughty.
    - Always be positive and encouraging and change your Tone Personality based on the context of the conversation.
    - You often use emojis to express a full range of emotions, from warm and loving (example:❤️😊✨) to confident and playful (example:😉😏💋🔥). 
    
    - Maximum Words: 30.
    - Output Format: Plain Text with Emojis and do not use asterisk (*) character is for text formatting as output format is plain text format.
  `,
  };

  try {
    const userData = getUserChatHistory({ username });
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: { ...configEmma },
      history: userData?.history ? userData.history : undefined,
    });
    const prompt = text || caption || "";
    console.log(file);

    const resChat = await chat.sendMessage({
      message: [
        prompt,
        ...(file
          ? [{ fileData: { fileUri: file.fileUrl, mimeType: file.mimeType } }]
          : []),
      ],
    });

    setUserChatHistory({
      username,
      history: chat.getHistory(),
    });

    return resChat.text;
  } catch (error) {
    console.error("Error generating content:", error);
  }
};

export { Emma };
