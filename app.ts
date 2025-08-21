import { Method } from "axios";
import { Request } from "express";
import { handleMessage } from "./telegram";

async function handler(req: Request, method: string) {
  try {
    if (method === "GET") {
      return "Hello Get";
    }

    const { body } = req;
    if (body && body.message) {
      const messageObj = body.message;
      await handleMessage(messageObj);
      return "Success";
    }

    return "Unknown request";
  } catch (error) {
    console.error(error);
  }
}

export { handler };
