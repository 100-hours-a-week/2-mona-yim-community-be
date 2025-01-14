/* eslint-disable no-undef */
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk'; // AWS SDK 가져오기
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
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Multer 설정
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `uploads/${uniqueSuffix}-${file.originalname}`);
        },
    }),
});

const router = express.Router();

router.post('/', loginUser);
router.post('/logout', logoutUser);
router.get('/users/me', selfInfo);
router.get('/users/:id', userInfo);
router.post('/signin', upload.single('profileImage'), signinUser);
router.post('/users/email/check', emailCheck);
router.post('/users/username/check', usernameCheck);
router.patch('/users/profile', upload.single('profileImage'), editProfile);
router.patch('/users/password', editPassword);
router.delete('/users/delete', removeUser);

export default router;
