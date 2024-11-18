import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/likes.json');

export async function getAllLikes() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('좋아요 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function getLikesById(postId) {
    try {
        const likes = await getAllLikes();
        const like = likes.find((like) => like.postId === postId);
        return like;
    } catch (error) {
        console.error('좋아요 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function writeLike(likes) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(likes, null, 2));
    } catch (error) {
        console.error('댓글 추가 도중 에러: ', error);
        throw error;
    }
}
