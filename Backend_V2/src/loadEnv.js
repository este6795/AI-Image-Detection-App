import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
console.log(`[ENV] Loaded env from: ${envPath}`);
console.log(
	`[ENV] Keys: MONGO_URI=${!!process.env.MONGO_URI}, JWT_SECRET=${!!process.env.JWT_SECRET}, API_USER=${!!process.env.API_USER}, API_SECRET=${!!process.env.API_SECRET}`
);

export default envPath;
