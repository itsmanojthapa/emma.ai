import fs from "fs";
import { History } from "../store";

const printFile = () => {
  const text = JSON.stringify(History, null, 2);
  fs.writeFile("output.json", text, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
  });
};

export { printFile };
