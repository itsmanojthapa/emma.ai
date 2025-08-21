import https from "https";
import fs from "fs";
import path from "path";
import { getFileDataById } from "../methods";

const outputFolder = "../downloads";

const download = async ({ fileId }: { fileId: string }) => {
  try {
    const fileData = await getFileDataById({ fileId });
    if (!fileData) {
      console.error("File data is not available.");
      return;
    }
    if (fileData.file_size > 8 * 1024 * 1024) {
      console.error("File size exceeds 8MB limit.");
      return;
    }

    const fileName = path.basename(fileData.url);
    console.log(fileName);

    const outputPath = path.join(__dirname, outputFolder);
    fs.mkdirSync(path.join(__dirname, outputFolder), { recursive: true }); // Ensure the output directory exists, create it if it doesn't
    const fileStream = fs.createWriteStream(path.join(outputPath, fileName)); // Create a writable stream to save the file

    // Make the HTTP GET request
    const request = https.get(fileData.url, (response) => {
      // Check if the request was successful (status code 200)
      if (response.statusCode !== 200) {
        console.error(
          `Download failed with status code: ${response.statusCode}`
        );
        return;
      }

      // Pipe the response data directly to the file stream
      // Pipe redirects the data from the response to the file stream
      response.pipe(fileStream);
    });

    // EVENT HANDLING
    // When the file has been fully written, this event is triggered
    fileStream.on("finish", () => {
      fileStream.close(); // Close the file stream
      console.log("✅ Download complete!");
    });

    // Handle errors during the download
    request.on("error", (err) => {
      console.error(err);
      fs.unlink(outputPath, () => {}); // Delete the partially downloaded file
    });

    // Handle errors during file writing
    fileStream.on("error", (err) => {
      console.error(err);
      fs.unlink(outputPath, () => {}); // Delete the partially downloaded file
    });
  } catch (error) {
    console.error(error);
  }
};

export { download };
