/* eslint-disable no-undef */
import express from 'express';
import multer from 'multer';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import {
    getPosts,
    getPost,
    uploadPost,
    editPost,
    removePost,
} from '../controllers/postController.js';
import {
    getComments,
    uploadComment,
    editComment,
    removeComment,
} from '../controllers/commentController.js';
import {
    likePost,
    unlikePost,
    likeStatusPost,
} from '../controllers/likeController.js';

dotenv.config();

// AWS S3 설정
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer 설정 (로컬 메모리에 파일 저장)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// S3 업로드 함수
const uploadFileToS3 = async (file) => {
    const imageName = `${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${imageName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return imageName;
};

// S3 삭제 함수
export async function deleteImage(imageName) {
    if (!imageName) return;

    // S3에서 삭제할 Key 설정
    const key = `uploads/${postImage}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
        console.log('S3 파일 삭제 성공:', key);
    } catch (error) {
        console.error('S3 파일 삭제 실패:', error);
    }
}

const router = express.Router();

// S3 업로드 미들웨어 통합
router.post(
    '/posts',
    upload.single('postImage'),
    async (req, res, next) => {
        try {
            if (req.file) {
                const imageName = await uploadFileToS3(req.file);
                req.body.postImage = imageName; // 업로드된 URL을 req.body에 추가
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: '파일 업로드 실패' });
        }
    },
    uploadPost,
);

router.patch(
    '/posts/:id',
    upload.single('postImage'),
    async (req, res, next) => {
        try {
            if (req.file) {
                const imageName = await uploadFileToS3(req.file);
                req.body.postImage = imageName; // 업로드된 URL을 req.body에 추가
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: '파일 업로드 실패' });
        }
    },
    editPost,
);

// 나머지 라우트
router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.delete('/posts/:id', removePost);

router.get('/posts/:id/like', likeStatusPost);
router.post('/posts/:id/like', likePost);
router.delete('/posts/:id/unlike', unlikePost);

router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', uploadComment);
router.patch('/posts/:id/comments/:commentId', editComment);
router.delete('/posts/:id/comments/:commentId', removeComment);

export default router;
