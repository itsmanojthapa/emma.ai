// TODO: Gemini Generated Example, implement clean up ever 24 hours, Delete History of username whos lastUpdate is older than 24 hours.

/**
 * @fileoverview This script demonstrates how to periodically clean up a record
 * of user chat histories, removing entries that haven't been updated in over 24 hours.
 */
// Make this file a module to avoid polluting the global scope in the project build.
export {};

// Define a type for the content of the chat history.
// This can be customized to fit your application's data structure.
type ChatContent = {
  role: "user" | "assistant";
  parts: { text: string }[];
};

// Define the structure for each user's entry in the History record.
type HistoryEntry = {
  lastUpdate: Date;
  history: ChatContent[];
};

// The main data store for user chat histories.
// The key is the username (string), and the value is the HistoryEntry.
const History: Record<string, HistoryEntry> = {};

/**
 * Iterates through the History record and deletes entries that are older than 24 hours.
 * This function is designed to be called periodically by setInterval.
 */
const cleanupExpiredHistories = (): void => {
  const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
  const now = new Date().getTime();

  console.log(`[${new Date().toISOString()}] Running cleanup job...`);

  // We'll keep track of which users are being checked.
  const usersChecked: string[] = [];

  for (const username in History) {
    // Use Object.prototype.hasOwnProperty.call for safer iteration over object properties.
    if (Object.prototype.hasOwnProperty.call(History, username)) {
      usersChecked.push(username);
      const userHistory = History[username];
      const lastUpdateTime = userHistory.lastUpdate.getTime();

      // Check if the time elapsed since the last update is greater than 24 hours.
      if (now - lastUpdateTime > twentyFourHoursInMillis) {
        console.log(
          `  - Deleting expired history for user: "${username}". Last update was at ${userHistory.lastUpdate.toISOString()}`
        );
        delete History[username];
      } else {
        console.log(
          `  - History for user "${username}" is still valid. Last update was at ${userHistory.lastUpdate.toISOString()}`
        );
      }
    }
  }

  if (usersChecked.length === 0) {
    console.log("  - No user histories to check.");
  }

  console.log("  - Cleanup job finished.");
  console.log("  - Current History state:", JSON.stringify(History, null, 2));
};

// --- DEMONSTRATION SETUP ---

console.log("--- Initializing Demonstration ---");

// Add some sample data to the History record to simulate a real-world scenario.

// 1. An expired record: This user's data is 2 days old and should be deleted.
const expiredUsername = "user_expired";
History[expiredUsername] = {
  lastUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 48 hours ago
  history: [{ role: "user", parts: [{ text: "This is an old message." }] }],
};

// 2. An active record: This user's data is recent (1 hour old) and should be kept.
const activeUsername = "user_active";
History[activeUsername] = {
  lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  history: [{ role: "user", parts: [{ text: "This is a recent message." }] }],
};

console.log("Initial History state:", JSON.stringify(History, null, 2));

// --- SCHEDULING THE CLEANUP JOB ---

const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

// For this demonstration, we'll run the cleanup function every 5 seconds
// so you can see it in action without waiting 24 hours.
const demonstrationInterval = 5000; // 5 seconds

// In a real production application, you would use the 24-hour interval:
// const cleanupInterval = setInterval(cleanupExpiredHistories, twentyFourHoursInMillis);

const cleanupInterval: ReturnType<typeof setInterval> = setInterval(
  cleanupExpiredHistories,
  demonstrationInterval
);

console.log(
  `\nCleanup job has been scheduled to run every ${
    demonstrationInterval / 1000
  } seconds for this demo.`
);
console.log(
  "In a production environment, this would be set to run every 24 hours."
);
console.log("To stop this script, press Ctrl+C.\n");

// Note: setInterval will keep the Node.js process running.
// If you need to stop it programmatically, you can call `clearInterval(cleanupInterval)`.
