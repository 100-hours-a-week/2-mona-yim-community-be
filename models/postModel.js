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

export async function deletePostImage(postImage) {
    if (postImage === null || postImage === '') return;
    const postImagePath = `../images/${postImage}`;
    if (postImagePath) {
        const filePath = path.join(__dirname, postImagePath);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('파일 삭제 실패:', err);
            } else {
                console.log('파일 삭제 성공');
            }
        });
    }
}

export async function editLike(postId, likeCount) {
    try {
        const rawData = await fs.readFile(dataPath, 'utf-8');
        const data = JSON.parse(rawData);
        const datumIndex = data.findIndex((datum) => datum.postId === postId);
        // if (datumIndex === -1)
        data[datumIndex].likes = likeCount.toString();
        await writePost(data);
    } catch (error) {
        console.error('게시글 좋아요 수정 중 에러: ', error);
        throw error;
    }
}
