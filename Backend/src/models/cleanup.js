import fs from "fs";
import path from "path";

/**
 * Deletes temporary upload files.
 */
export const deleteTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[CLEANUP] Deleted temporary file: ${filePath}`);
    }
  } catch (err) {
    console.error("[CLEANUP ERROR]", err);
  }
};

/**
 * Clears all files from the uploads directory.
 */
export const clearUploadsFolder = () => {
  const uploadsDir = "uploads";
  try {
    if (!fs.existsSync(uploadsDir)) return;

    fs.readdirSync(uploadsDir).forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      fs.unlinkSync(filePath);
    });
    console.log("[CLEANUP] Cleared all uploads.");
  } catch (err) {
    console.error("[CLEANUP ERROR]", err);
  }
};
