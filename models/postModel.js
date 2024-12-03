import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAllPosts() {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query(
            'SELECT * FROM Posts ORDER BY postID DESC',
        );
        return rows;
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function getPostById(postId) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `UPDATE Posts SET views = views +  1 WHERE postId = ?`,
            [postId],
        );
        const [rows] = await connection.query(
            `SELECT * FROM Posts WHERE postId = ?`,
            [postId],
        );
        return rows;
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function postPost(userId, postData) {
    let connection;
    try {
        connection = await pool.getConnection();
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
    } catch (error) {
        console.error('게시글 추가 에러: ', error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function patchPost(postId, postData) {
    let connection;
    try {
        connection = await pool.getConnection();
        if (postData.postImage) {
            const [deleteImageName] = await connection.query(
                `SELECT postImage From Posts Where postId = ?;`,
                [postId],
            );
            deletePostImage(deleteImageName.postImage);
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
    } catch (error) {
        console.error('게시글 데이터 수정 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function deletePost(postId) {
    let connection;
    try {
        connection = await pool.getConnection();

        const [deleteImageName] = await connection.query(
            `SELECT postImage From Posts Where postId = ?;`,
            [postId],
        );
        deletePostImage(deleteImageName.postImage);

        await connection.query(`DELETE FROM Posts WHERE postId = ?;`, [postId]);
    } catch (error) {
        console.error('게시글 삭제 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
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
    let connection;
    try {
        connection = await pool.getConnection();
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
    } finally {
        if (connection) connection.release();
    }
}

export async function editCommentCount(postId) {
    let connection;
    try {
        connection = await pool.getConnection();
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
    } finally {
        if (connection) connection.release();
    }
}
