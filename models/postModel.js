import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAllPosts() {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM Posts');
        connection.release();
        return rows;
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function getPostById(postId) {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM Posts WHERE postId = ?`,
            [postId],
        );
        connection.release();
        return rows;
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postPost(userId, postData) {
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Posts (title, time, postImage, postContent, userId) VALUES (?, ?, ?, ?, ?);`,
            [
                postData.title,
                postData.time,
                postData.postImage,
                postData.postContent,
                userId,
            ],
        );
        connection.release();
    } catch (error) {
        console.error('게시글 추가 에러: ', error);
        throw error;
    }
}

export async function patchPost(postId, postData) {
    try {
        const connection = await pool.getConnection();
        if (postData.postImage) {
            const deleteImageName = await connection.query(
                `SELECT postImage From Posts Where postId = ?;`,
                [postId],
            );
            deletePostImage(deleteImageName);
            await connection.query(
                `UPDATE Posts SET title = ?, postContent = ?, postImage = ? WHERE postId = ?;`,
                [
                    postData.title,
                    postData.postContent,
                    postData.postImage,
                    postId,
                ],
            );
        } else {
            await connection.query(
                `UPDATE Posts SET title = ?, postContent = ? WHERE postId = ?;`,
                [postData.title, postData.postContent, postId],
            );
        }
        connection.release();
    } catch (error) {
        console.error('게시글 데이터 수정 도중 에러: ', error);
        throw error;
    }
}

export async function deletePost(postId) {
    try {
        const connection = await pool.getConnection();

        const deleteImageName = await connection.query(
            `SELECT postImage From Posts Where postId = ?;`,
            [postId],
        );
        deletePostImage(deleteImageName);

        await connection.query(`DELETE FROM Posts WHERE postId = ?;`, [postId]);
        connection.release();
    } catch (error) {
        console.error('게시글 삭제 에러: ', error);
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

export async function editLikeCount(postId) {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT COUNT(*) AS likeCount FROM Likes WHERE postId = ?;`,
            [postId],
        );
        const likeCount = Number(rows.likeCount);

        await connection.query(`UPDATE Posts SET likes = ? WHERE postId = ?;`, [
            likeCount,
            postId,
        ]);
        return likeCount;
    } catch (error) {
        console.error('게시글 좋아요 수정 중 에러: ', error);
        throw error;
    }
}

export async function editCommentCount(postId) {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT COUNT(*) AS commentCount FROM Comments WHERE postId = ?;`,
            [postId],
        );
        const commentCount = Number(rows.commentCount);

        await connection.query(
            `UPDATE Posts SET comments = ? WHERE postId = ?;`,
            [commentCount, postId],
        );
    } catch (error) {
        console.error('댓글수 수정 중 에러: ', error);
        throw error;
    }
}
