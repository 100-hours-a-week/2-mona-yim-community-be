import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import { deletePostImage } from './postModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getUserLogin(email) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT userId, password FROM Users WHERE email = ?;`,
            [email],
        );
        return rows ? rows : null;
    } catch (error) {
        console.error('로그인 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function getUserById(userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM Users WHERE userId = ${userId}`,
        );
        return rows;
    } catch (error) {
        console.error('유저 데이터 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function postUsernameEdit(username, userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT EXISTS (SELECT 1 FROM Users WHERE username = ? AND userId != ?) AS userExists`,
            [username, userId],
        );
        return rows.userExists;
    } catch (error) {
        console.error('닉네임 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function postUsername(username) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT EXISTS (SELECT 1 FROM Users WHERE username = ?) AS userExists`,
            [username],
        );
        return rows.userExists;
    } catch (error) {
        console.error('닉네임 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function postEmail(email) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT EXISTS (SELECT 1 FROM Users WHERE email = ?) AS userExists`,
            [email],
        );
        return rows.userExists;
    } catch (error) {
        console.error('이메일 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function postUser(userData) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Users (email, password, username, profileImage) VALUES (?, ?, ?, ?);`,
            [
                userData.email,
                userData.password,
                userData.username,
                userData.profileImage,
            ],
        );
    } catch (error) {
        console.error('회원가입 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function patchUser(userId, userData) {
    let connection;
    try {
        connection = await pool.getConnection();
        if (userData.profileImage) {
            const [deleteImageName] = await connection.query(
                `SELECT profileImage From Users Where userId = ?;`,
                [userId],
            );
            deleteImage(deleteImageName.profileImage);
            await connection.query(
                `UPDATE Users SET username = ?, profileImage = ? WHERE userId = ?;`,
                [userData.username, userData.profileImage, userId],
            );
        } else {
            await connection.query(
                `UPDATE Users SET username = ?  WHERE userId = ?;`,
                [userData.username, userId],
            );
        }
        return true;
    } catch (error) {
        console.error('회원 정보 수정 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function patchPassword(userId, password) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `UPDATE Users SET password = ?  WHERE userId = ?;`,
            [password, userId],
        );
    } catch (error) {
        console.error('비밀번호 수정 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function deleteUser(userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        // post 사진들 지우기
        const postToBeDeleted = await connection.query(
            `SELECT postImage From Posts Where userId = ?;`,
            [userId],
        );

        for (const eachPost of postToBeDeleted) {
            await deletePostImage(eachPost.postImage);
        }

        // user 프로필 사진 지우기
        const [deleteImageName] = await connection.query(
            `SELECT profileImage From Users Where userId = ?;`,
            [userId],
        );
        deleteImage(deleteImageName.profileImage);

        await connection.query(`DELETE FROM Users WHERE userId = ?;`, [userId]);
    } catch (error) {
        console.error('회원 삭제 에러: ', error);
        throw error;
    } finally {
        connection.release();
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
