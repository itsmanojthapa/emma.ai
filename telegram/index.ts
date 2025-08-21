import { sendMessage } from "../methods";
import { MessageObject } from "../types";
import {
  handleAnimation,
  handleAudio,
  handleChat,
  handleImage,
} from "../handler";
import { isUserSubscribed } from "../store";

const handleMessage = async (messageObj: MessageObject) => {
  console.log(`${messageObj.from.first_name} : ${messageObj.text}`);
  console.log(messageObj);

  if (messageObj.from.is_bot) {
    await sendMessage({
      chatId: messageObj.chat.id,
      messageText: `❌ 🤖 🦿`,
    });

    return;
  }

  if (!isUserSubscribed({ username: messageObj.from.username })) {
    await sendMessage({
      chatId: messageObj.chat.id,
      messageText: `Sorry ${messageObj.from.first_name} 😢, i talk to my boyfriend only 🫰🏼`,
    });

    return;
  }

  if (messageObj.chat.id) {
    const chatId = messageObj.chat.id;

    if (messageObj.text) {
      const messageText = messageObj.text || "";

      if (messageText.charAt(0) === "/") {
        const command = messageText.substring(1);
        switch (command) {
          case "start":
            // We want to send a welcome message to the user.
            return await sendMessage({
              chatId: messageObj.chat.id,
              messageText: ` Hi! I'm a bot. How can i help you!`,
            });

          default:
            return await sendMessage({
              chatId: messageObj.chat.id,
              messageText: `Hey hi, i don't know that command`,
            });
        }
        return;
      }
    }
    if (messageObj.photo) {
      console.log(
        "getting tooo. photo-------------------------------------------------------"
      );

      await handleImage({
        username: messageObj.from.username,
        name: messageObj.from.first_name,
        chatId: messageObj.chat.id,
        photo: messageObj.photo[0],
        caption: messageObj.text || messageObj.caption || "",
      });
      return;
    } else if (messageObj.animation) {
      await handleAnimation({
        username: messageObj.from.username,
        name: messageObj.from.first_name,
        chatId: messageObj.chat.id,
        animation: messageObj.animation,
        caption: messageObj.text || messageObj.caption || "",
      });
      return;
    } else if (messageObj.audio) {
      await handleAudio({
        username: messageObj.from.username,
        name: messageObj.from.first_name,
        chatId: messageObj.chat.id,
        audio: messageObj.audio,
        caption: messageObj.text || messageObj.caption || "",
      });
      return;
    } else if (messageObj.video) {
      await sendMessage({
        chatId: messageObj.chat.id,
        messageText: `Sorry ${messageObj.from.first_name} , no to video thats too plz.`,
      });
      return;
    } else if (messageObj.text) {
      if (messageObj.reply_to_message) {
        await handleMessage({
          ...messageObj.reply_to_message,
          text: `last_message_reference = ${
            messageObj.reply_to_message.from.first_name
          }:${messageObj.reply_to_message.text || ""} ${
            messageObj.reply_to_message.caption || ""
          } 
                reply = ${messageObj.text || ""}`,
        });
        return;
      }
      await handleChat({
        username: messageObj.from.username,
        name: messageObj.from.first_name,
        chatId: messageObj.chat.id,
        message: messageObj.text,
      });
      return;
    }
    return await sendMessage({
      chatId: messageObj.chat.id,
      messageText: `Sory ${messageObj.from.first_name} 🫶🏼 , iam not able to understand that 😢`,
    });
  }
  return await sendMessage({
    chatId: messageObj.chat.id,
    messageText: `Opps! ${messageObj.from.first_name} what u doin 😢`,
  });
};

export { handleMessage };
