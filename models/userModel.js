import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/users.json');

export async function getAllUsers() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('유저 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function addUser(newUserData) {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const users = JSON.parse(data);
        users.push(newUserData);
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('새로운 유저 데이터 삽입 에러: ', error);
        throw error;
    }
}
