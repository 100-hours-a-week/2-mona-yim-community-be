import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/posts.json');

export async function getAllPosts() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function getPostById(postId) {
    try {
        const posts = await getAllPosts();
        const post = posts.find((post) => post.postId === postId);
        return post;
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function writePost(posts) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(posts, null, 2));
    } catch (error) {
        console.error('게시글 추가 도중 에러: ', error);
        throw error;
    }
}
