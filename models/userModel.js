import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/users.json');

export async function getAllUsers() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('유저 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const users = await getAllUsers();
        const user = users.find((user) => user.userId === userId);
        return user;
    } catch (error) {
        console.error('유저 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function writeUser(user) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(user, null, 2));
    } catch (error) {
        console.error('새로운 유저 데이터 삽입 에러: ', error);
        throw error;
    }
}

export async function deleteImage(userImage) {
    if (userImage === null || userImage === '') return;
    const userImagePath = `../images/${userImage}`;
    if (userImagePath) {
        const filePath = path.join(__dirname, userImagePath);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('파일 삭제 실패:', err);
            } else {
                console.log('파일 삭제 성공');
            }
        });
    }
}
