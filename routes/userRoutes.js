/* eslint-disable no-undef */
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

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

import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + '-' + file.originalname);
        },
    }),
});

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images/');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     },
// });

// const upload = multer({ storage });

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
