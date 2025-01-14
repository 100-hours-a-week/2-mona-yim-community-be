/* eslint-disable no-undef */
import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import {
    selfInfo,
    userInfo,
    loginUser,
    signinUser,
    usernameCheck,
    emailCheck,
    editProfile,
    editPassword,
    removeUser,
    logoutUser,
} from '../controllers/userController.js';

dotenv.config();

// AWS S3 설정
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer 설정 (로컬 저장소에 임시 저장)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
});

// S3에 파일 업로드 함수
const uploadFileToS3 = async (file) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
};

// 라우터 설정
const router = express.Router();

router.post('/', loginUser);
router.post('/logout', logoutUser);
router.get('/users/me', selfInfo);
router.get('/users/:id', userInfo);
router.post(
    '/signin',
    upload.single('profileImage'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).send({ error: 'No file uploaded' });
            }
            const fileUrl = await uploadFileToS3(req.file);
            req.body.profileImageUrl = fileUrl; // 업로드된 파일 URL을 다음 미들웨어로 전달
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Failed to upload file' });
        }
    },
    signinUser,
);
router.post('/users/email/check', emailCheck);
router.post('/users/username/check', usernameCheck);
router.patch(
    '/users/profile',
    upload.single('profileImage'),
    async (req, res, next) => {
        try {
            if (req.file) {
                const fileUrl = await uploadFileToS3(req.file);
                req.body.profileImageUrl = fileUrl; // 업로드된 파일 URL을 다음 미들웨어로 전달
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Failed to upload file' });
        }
    },
    editProfile,
);
router.patch('/users/password', editPassword);
router.delete('/users/delete', removeUser);

export default router;
