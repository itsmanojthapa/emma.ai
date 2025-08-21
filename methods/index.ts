import FormData from "form-data";
import fs from "fs";
import path from "path";
import { getENV } from "../lib/env";
import { getAxiosInstance } from "../lib/axios";

const MY_TOKEN = getENV({ key: "TELEGRAM_BOT_TOKEN" });
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance({ BASE_URL });

const setWebhook = async (): Promise<boolean> => {
  const res = await axiosInstance
    .post({
      method: "setWebhook",
      data: {
        url: getENV({ key: "PUBLIC_WEBHOOK_URL" }),
      },
    })
    .catch((error: any) => {
      console.error(error);
    });
  return res?.data.ok;
};

/**
 * Use this method to get basic info about a file and prepare it for downloading.
 * @param param0
 * @returns
 */
const getFileDataById = async ({ fileId }: { fileId: string }) => {
  try {
    const fileData = await axiosInstance.get({
      method: "getFile",
      params: { file_id: fileId },
    });
    // @ts-ignore
    return {
      url: `https://api.telegram.org/file/bot${MY_TOKEN}/${fileData.data.result.file_path}`,
      file_size: fileData.data.result.file_size,
    };
  } catch (error) {
    console.error(error);
  }
};

/**
  * const res = await sendFile({
      chatId: 1294271200,
      type: "photo",
      filePath: `${path.resolve(__dirname, "./drive/spide.jpg")}`,
    });

  * const res = await sendFile({
      chatId: 1294271200,
      type: "audio",
      filePath: `${path.resolve(__dirname, "./drive/Type Beat  - KPOP.mp3")}`,
    });
  
  * const res = await sendFile({
      chatId: 1294271200,
      type: "animation",
      filePath: `${path.resolve(__dirname, "./drive/Y1iS.gif")}`,
    });
 */

const sendFile = async ({
  chatId,
  type,
  filePath,
}: {
  chatId: number;
  type: "audio" | "photo" | "animation";
  filePath: string;
}) => {
  // 1. Create a new FormData instance.
  // This is what will be sent as the request body.
  const form = new FormData();

  // 2. Get the filename from the path.
  const fileName = path.basename(filePath);

  // 3. Create a read stream from the file.
  // This is more memory-efficient than reading the entire file into memory.
  const fileStream = fs.createReadStream(filePath);

  // 4. Append the file stream to the form data.
  // The first argument 'file' is the field name that the server will expect.
  // You might need to change this depending on the server's API.
  form.append(type, fileStream, fileName);
  form.append("chat_id", chatId);

  return await axiosInstance
    .post({
      method: `send${type}`,
      data: form,
      headers: form.getHeaders(),
    })
    .catch((error: any) => {
      console.error(error);
    });
};

const sendChatAction = ({
  chatId,
  action,
}: {
  chatId: number;
  action:
    | "typing"
    | "upload_photo"
    | "upload_video"
    | "record_voice"
    | "upload_voice"
    | "choose_sticker";
}) => {
  axiosInstance.post({
    method: "sendChatAction",
    data: {
      chat_id: chatId,
      action,
    },
  });
  return;
};

const sendMessage = async ({
  chatId,
  messageText,
}: {
  chatId: number;
  messageText: string;
}) => {
  await axiosInstance
    .post({
      method: "sendMessage",
      data: {
        chat_id: chatId,
        text: messageText,
      },
    })
    .catch((error: any) => {
      console.error(error);
    });
};
const sendAnimationUrl = async ({
  chatId,
  animationUrl,
}: {
  chatId: number;
  animationUrl: string;
}) => {
  return await axiosInstance
    .post({
      method: "sendAnimation",
      data: {
        chat_id: chatId,
        animation: animationUrl,
      },
    })
    .catch((error: any) => {
      console.error(error);
    });
};

const sendAnimationPath = async ({
  chatId,
  file,
}: {
  chatId: number;
  file: string;
}) => {
  return await axiosInstance
    .post({
      method: "sendAnimation",
      data: {
        chat_id: chatId,
        animation: file,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .catch((error: any) => {
      console.error(error);
    });
};

export {
  getFileDataById,
  sendFile,
  sendChatAction,
  sendMessage,
  sendAnimationUrl,
  sendAnimationPath,
  setWebhook,
};
