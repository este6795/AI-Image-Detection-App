import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

// Clean uploads folder on startup
(function clearUploadsFolder() {
  const folder = "uploads";
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  const files = fs.readdirSync(folder);
  for (const file of files) {
    fs.unlinkSync(`${folder}/${file}`);
  }
  console.log("[INIT] Uploads folder cleared");
})();

export default upload;
