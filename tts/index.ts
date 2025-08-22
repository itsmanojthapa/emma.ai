import { GoogleGenAI } from "@google/genai";
import { Lame } from "node-lame";
import fs from "fs";
import path from "path";
import { getENV } from "../lib/env";

const GEMINI_API_KEY = getENV({ key: "GEMINI_API_KEY" });
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function saveMp3File({
  fileName,
  audioBuffer,
}: {
  fileName: string;
  audioBuffer: Buffer;
}): Promise<boolean> {
  const outputDir = "./downloads";
  await fs.promises.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, fileName);

  console.log(`Encoding audio to ${outputPath}...`);

  const encoder = new Lame({
    output: outputPath,
    bitrate: 192,
    raw: true, // Specify that the input is raw PCM data
    sfreq: 24, // Input sample rate in kHz (24000 Hz)
    bitwidth: 16, // Input bit width
    mode: "m", // Mono
  }).setBuffer(audioBuffer);

  return new Promise((resolve, reject) => {
    encoder
      .encode()
      .then(() => {
        resolve(true);
      })
      .catch((error: any) => {
        console.error("❌ Something went wrong during encoding.", error);
        reject(false);
      });
  });
}

// Text-To-Speech (TTS)
const TTS = async ({ fileName, text }: { fileName: string; text: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const data =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data) {
      console.log("No data.");
      return;
    }
    const audioBuffer = Buffer.from(data, "base64");
    return await saveMp3File({ fileName, audioBuffer });
  } catch (error) {
    console.error("❌ Something went wrong during TTS.", error);
  }
};

export { TTS };
