import fs from "fs";
import path from "path";

/**
 * Deletes temporary upload files.
 */
export const deleteTempFile = (filePath) => {
  try {
    const resolved = path.resolve(filePath);
    if (fs.existsSync(resolved)) {
      try {
        fs.unlinkSync(resolved);
        console.log(`[CLEANUP] Deleted temporary file: ${resolved}`);
      } catch (e) {
        console.error('[CLEANUP] Failed to delete file', resolved, e);
      }
    }
  } catch (err) {
    console.error("[CLEANUP ERROR]", err);
  }
};

/**
 * Clears all files from the uploads directory.
 */
export const clearUploadsFolder = () => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  try {
    if (!fs.existsSync(uploadsDir)) return;

    fs.readdirSync(uploadsDir).forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('[CLEANUP] Failed to remove file during clearUploadsFolder', filePath, e);
      }
    });
    console.log("[CLEANUP] Cleared all uploads.");
  } catch (err) {
    console.error("[CLEANUP ERROR]", err);
  }
};
