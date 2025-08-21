import express from "express";
import cors from "cors";
import { getENV } from "./lib/env";
import { handler } from "./app";
import { setWebhook } from "./methods";

const PORT = getENV({ key: "PORT" }) || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/{*splat}", async (req, res) => {
  res.send(await handler(req, "POST"));
});
app.get("/{*splat}", async (req, res) => {
  res.send(await handler(req, "GET"));
});

(async () => {
  if (await setWebhook()) {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on Port: ${PORT}`);
    });
  } else {
    console.log("❌ Failed to set webhook");
  }
})();
