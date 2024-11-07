import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/comments.json');

export async function getAllComments() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function writeComment(comments) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(comments, null, 2));
    } catch (error) {
        console.error('댓글 추가 도중 에러: ', error);
        throw error;
    }
}
