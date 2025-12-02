import multer from "multer";
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "uploads");
const upload = multer({ dest: uploadsDir });

// Export a startup-only cleanup function. Do NOT run on module import to avoid
// deleting files while uploads are in progress (race condition).
export function clearUploadsFolder() {
  const folder = uploadsDir;
  try {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    const files = fs.readdirSync(folder);
    for (const file of files) {
      try {
        fs.unlinkSync(path.join(folder, file));
      } catch (e) {
        // Non-fatal; log and continue
        console.error('[INIT] Failed to remove file during startup cleanup', file, e);
      }
    }
    console.log("[INIT] Uploads folder cleared");
  } catch (err) {
    console.error('[INIT] Error clearing uploads folder', err);
  }
}

export default upload;
