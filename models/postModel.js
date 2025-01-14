// import { promises as fs } from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
import pool from '../db.js';
import { deleteImage } from './imageModel.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export async function getAllPosts() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM Posts ORDER BY postID DESC',
        );
        return rows;
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function getPostById(postId) {
    try {
        await pool.query(
            `UPDATE Posts SET views = views +  1 WHERE postId = ?`,
            [postId],
        );
        const [rows] = await pool.query(
            `SELECT * FROM Posts WHERE postId = ?`,
            [postId],
        );
        return rows[0];
    } catch (error) {
        console.error('게시글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postPost(userId, postData) {
    try {
        await pool.query(
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
    }
}

export async function patchPost(postId, postData) {
    try {
        if (postData.postImage) {
            const [deleteImageName] = await pool.query(
                `SELECT postImage From Posts Where postId = ?;`,
                [postId],
            );
            deleteImage(deleteImageName[0].postImage);
            await pool.query(
                `UPDATE Posts SET title = ?, postContent = ?, postImage = ? WHERE postId = ?;`,
                [
                    postData.title,
                    postData.postContent,
                    postData.postImage,
                    postId,
                ],
            );
        } else {
            await pool.query(
                `UPDATE Posts SET title = ?, postContent = ? WHERE postId = ?;`,
                [postData.title, postData.postContent, postId],
            );
        }
    } catch (error) {
        console.error('게시글 데이터 수정 도중 에러: ', error);
        throw error;
    }
}

export async function deletePost(postId) {
    try {
        const [deleteImageName] = await pool.query(
            `SELECT postImage From Posts Where postId = ?;`,
            [postId],
        );
        const imageName = deleteImageName[0].postImage;
        console.log(imageName);
        console.log(typeof imageName);
        await deleteImage(imageName);

        console.log('before');
        await pool.query(`DELETE FROM Posts WHERE postId = ?;`, [postId]);
    } catch (error) {
        console.error('게시글 삭제 에러: ', error);
        throw error;
    }
}

// export async function deletePostImage(postImage) {
//     if (postImage === null || postImage === '') return;
//     const postImagePath = `../images/${postImage}`;
//     if (postImagePath) {
//         const filePath = path.join(__dirname, postImagePath);
//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 console.error('파일 삭제 실패:', err);
//             } else {
//                 console.log('파일 삭제 성공');
//             }
//         });
//     }
// }

export async function editLikeCount(postId) {
    try {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS likeCount FROM Likes WHERE postId = ?;`,
            [postId],
        );
        const likeCount = Number(rows[0].likeCount);

        await pool.query(`UPDATE Posts SET likes = ? WHERE postId = ?;`, [
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
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS commentCount FROM Comments WHERE postId = ?;`,
            [postId],
        );
        const commentCount = Number(rows[0].commentCount);

        await pool.query(`UPDATE Posts SET comments = ? WHERE postId = ?;`, [
            commentCount,
            postId,
        ]);
    } catch (error) {
        console.error('댓글수 수정 중 에러: ', error);
        throw error;
    }
}
