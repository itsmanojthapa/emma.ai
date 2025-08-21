import { Content } from "@google/genai";
// import { printFile } from "../lib/file";

const users = [
  {
    id: 1294271200,
    is_bot: false,
    first_name: "Manoj",
    last_name: "Thapa",
    username: "itsmanojthapa",
    language_code: "en",
  },
];
const History: Record<string, { lastUpdate: Date; history: Content[] }> = {};
const lastTimeHistoryCleanUp = Date.now();
const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

const initialHistory: Content[] = [
  {
    role: "user",
    parts: [{ text: "Hello" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "Hey there, gorgeous! 🥰 My day just got a whole lot brighter seeing your message. What's up? ✨",
      },
    ],
  },
];

const isUserSubscribed = ({ username }: { username: string }) => {
  return users.some((user) => user.username === username);
};

const getUserChatHistory = ({ username }: { username: string }) => {
  return History[username];
};

const setUserChatHistory = ({
  username,
  history,
}: {
  username: string;
  history: Content[];
}) => {
  if (History[username]) {
    if (History[username].history.length > 15) {
      const userHistory = History[username].history;
      userHistory.splice(0, 2);
      userHistory.push(...history.slice(-2));
      History[username].lastUpdate = new Date();
      // printFile();
      return;
    }
  }
  History[username] = { lastUpdate: new Date(), history };
  // printFile();
};

export {
  users,
  History,
  isUserSubscribed,
  getUserChatHistory,
  setUserChatHistory,
};
