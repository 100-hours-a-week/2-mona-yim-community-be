import express from 'express';
import multer from 'multer';
import {
    selfInfo,
    userInfo,
    loginUser,
    signinUser,
    usernameCheck,
    emailCheck,
    editProfile,
    editPassword,
    deleteUser,
} from '../controllers/userController.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', loginUser);
router.get('/users/me', selfInfo);
router.get('/users/:id', userInfo);
router.post('/signin', upload.single('profileImage'), signinUser);
router.post('/users/email/check', emailCheck);
router.post('/users/username/check', usernameCheck);
router.patch('/users/profile', upload.single('profileImage'), editProfile);
// router.patch('/users/profile', editProfile);
router.patch('/users/password', editPassword);
router.delete('/users/delete', deleteUser);

export default router;
