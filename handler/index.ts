import { Emma } from "../emma";
import { getFileDataById, sendChatAction, sendMessage } from "../methods";
import { animation, audio, photo } from "../types";
import { GoogleGenAI } from "@google/genai";
import { getENV } from "../lib/env";

const GEMINI_API_KEY = getENV({ key: "GEMINI_API_KEY" });
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const handleChat = async ({
  username,
  name,
  chatId,
  message,
}: {
  username: string;
  name: string;
  chatId: number;
  message: string;
}) => {
  try {
    sendChatAction({ chatId, action: "typing" });
    const response = await Emma({ username, name, text: message });
    await sendMessage({
      chatId,
      messageText: response || "Oops! Something went wrong.",
    });
    return;
  } catch (error) {
    console.error(error);
    await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
    return;
  }
};

const handleImage = async ({
  username,
  name,
  chatId,
  photo,
  caption,
}: {
  username: string;
  name: string;
  chatId: number;
  photo: photo;
  caption: string;
}) => {
  try {
    sendChatAction({ chatId, action: "typing" });
    const fileData = await getFileDataById({ fileId: photo.file_id });

    if (!fileData) {
      await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
      return;
    }

    if (fileData.file_size > 8 * 1024 * 1024) {
      await sendMessage({
        chatId,
        messageText: "File size exceeds 8MB limit.",
      });
      return;
    }

    const imageResponse = await fetch(fileData.url);
    if (!imageResponse.ok) {
      await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
      return;
    }
    const imageData = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageData);
    const imageBlob = new Blob([imageBuffer], { type: "image/jpeg" });
    const uploadedFile = await ai.files.upload({
      file: imageBlob,
      config: { mimeType: "image/jpeg" },
    });

    if (!uploadedFile.uri) {
      await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
      return;
    }

    sendChatAction({ chatId, action: "typing" });
    const text = await Emma({
      username,
      name,
      file: { fileUrl: uploadedFile.uri, mimeType: "image/jpeg" },
      caption,
    });

    if (!text) {
      await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
      return;
    }
    await sendMessage({ chatId, messageText: text });
    return;
  } catch (error) {
    console.error(error);
    await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
    return;
  }
};

const handleAnimation = async ({
  username,
  name,
  chatId,
  animation,
  caption,
}: {
  username: string;
  name: string;
  chatId: number;
  animation: animation;
  caption: string;
}) => {
  sendChatAction({ chatId, action: "typing" });
  const fileData = await getFileDataById({ fileId: animation.file_id });

  if (!fileData) {
    await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
    return;
  }

  if (fileData.file_size > 8 * 1024 * 1024) {
    await sendMessage({
      chatId,
      messageText: "File size exceeds 8MB limit.",
    });
    return;
  }
  const animationResponse = await fetch(fileData.url);
  if (!animationResponse.ok) {
    await sendMessage({
      chatId,
      messageText: "Oops! Something went wrong.",
    });
    return;
  }
  const animationData = await animationResponse.arrayBuffer();
  const animationBuffer = Buffer.from(animationData);
  const animationBlob = new Blob([animationBuffer], { type: "video/mp4" });
  const uploadedFile = await ai.files.upload({
    file: animationBlob,
    config: { mimeType: "video/mp4" },
  });

  if (!uploadedFile.uri) {
    await sendMessage({
      chatId,
      messageText: "Oops! Something went wrong.",
    });
    return;
  }

  sendChatAction({ chatId, action: "typing" });

  const response = await Emma({
    username,
    name,
    file: {
      fileUrl: uploadedFile.uri,
      mimeType: "video/mp4",
    },
    caption,
  });
  await sendMessage({
    chatId,
    messageText: response || "Oops! Something went wrong.",
  });
  return;
};

const handleAudio = async ({
  username,
  name,
  chatId,
  audio,
  caption,
}: {
  username: string;
  name: string;
  chatId: number;
  audio: audio;
  caption: string;
}) => {
  try {
    sendChatAction({ chatId, action: "record_voice" });
    const fileData = await getFileDataById({ fileId: audio.file_id });

    if (!fileData) {
      await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
      return;
    }

    if (fileData.file_size > 8 * 1024 * 1024) {
      await sendMessage({
        chatId,
        messageText: "File size exceeds 8MB limit.",
      });
      return;
    }

    const audioResponse = await fetch(fileData.url);
    if (!audioResponse.ok) {
      await sendMessage({
        chatId,
        messageText: "Oops! Something went wrong.",
      });
      return;
    }
    const audioData = await audioResponse.arrayBuffer();
    const audioBuffer = Buffer.from(audioData);
    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const uploadedFile = await ai.files.upload({
      file: audioBlob,
      config: { mimeType: "audio/mpeg" },
    });

    if (!uploadedFile.uri) {
      await sendMessage({
        chatId,
        messageText: "Oops! Something went wrong.",
      });
      return;
    }

    sendChatAction({ chatId, action: "typing" });

    const response = await Emma({
      username,
      name,
      file: {
        fileUrl: uploadedFile.uri,
        mimeType: "audio/mpeg",
      },
      caption,
    });
    await sendMessage({
      chatId,
      messageText: response || "Oops! Something went wrong.",
    });
    return;
  } catch (error) {
    console.error(error);
    await sendMessage({ chatId, messageText: "Oops! Something went wrong." });
    return;
  }
};

export { handleChat, handleImage, handleAnimation, handleAudio };
