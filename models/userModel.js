// import { promises as fs } from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
import pool from '../db.js';
import { deletePostImage } from './postModel.js';
import { deleteImage } from '../routes/postRoutes.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export async function getUserLogin(email) {
    try {
        const [rows] = await pool.query(
            `SELECT userId, password FROM Users WHERE email = ?;`,
            [email],
        );
        return rows ? rows[0] : null;
    } catch (error) {
        console.error('로그인 에러: ', error);
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM Users WHERE userId = ${userId}`,
        );
        return rows[0];
    } catch (error) {
        console.error('유저 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postUsernameEdit(username, userId) {
    try {
        const [rows] = await pool.query(
            `SELECT EXISTS (SELECT 1 FROM Users WHERE username = ? AND userId != ?) AS userExists`,
            [username, userId],
        );
        return rows[0].userExists;
    } catch (error) {
        console.error('닉네임 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postUsername(username) {
    try {
        const [rows] = await pool.query(
            `SELECT EXISTS (SELECT 1 FROM Users WHERE username = ?) AS userExists`,
            [username],
        );
        return rows[0].userExists;
    } catch (error) {
        console.error('닉네임 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postEmail(email) {
    try {
        const [rows] = await pool.query(
            `SELECT EXISTS (SELECT 1 FROM Users WHERE email = ?) AS userExists`,
            [email],
        );
        return rows[0].userExists;
    } catch (error) {
        console.error('이메일 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postUser(userData) {
    try {
        await pool.query(
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
    }
}

export async function patchUser(userId, userData) {
    try {
        if (userData.profileImage) {
            const [deleteImageName] = await pool.query(
                `SELECT profileImage From Users Where userId = ?;`,
                [userId],
            );
            deleteImage(deleteImageName[0].profileImage);
            await pool.query(
                `UPDATE Users SET username = ?, profileImage = ? WHERE userId = ?;`,
                [userData.username, userData.profileImage, userId],
            );
        } else {
            await pool.query(
                `UPDATE Users SET username = ?  WHERE userId = ?;`,
                [userData.username, userId],
            );
        }
        return true;
    } catch (error) {
        console.error('회원 정보 수정 도중 에러: ', error);
        throw error;
    }
}

export async function patchPassword(userId, password) {
    try {
        await pool.query(`UPDATE Users SET password = ?  WHERE userId = ?;`, [
            password,
            userId,
        ]);
    } catch (error) {
        console.error('비밀번호 수정 도중 에러: ', error);
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        // post 사진들 지우기
        const [postToBeDeleted] = await pool.query(
            `SELECT postImage From Posts Where userId = ?;`,
            [userId],
        );

        for (const eachPost of postToBeDeleted) {
            await deletePostImage(eachPost.postImage);
        }

        // user 프로필 사진 지우기
        const [deleteImageName] = await pool.query(
            `SELECT profileImage From Users Where userId = ?;`,
            [userId],
        );
        deleteImage(deleteImageName[0].profileImage);

        await pool.query(`DELETE FROM Users WHERE userId = ?;`, [userId]);
    } catch (error) {
        console.error('회원 삭제 에러: ', error);
        throw error;
    }
}

// export async function deleteImage(userImage) {
//     if (userImage === null || userImage === '') return;
//     const userImagePath = `../images/${userImage}`;
//     if (userImagePath) {
//         const filePath = path.join(__dirname, userImagePath);
//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 console.error('파일 삭제 실패:', err);
//             } else {
//                 console.log('파일 삭제 성공');
//             }
//         });
//     }
// }
