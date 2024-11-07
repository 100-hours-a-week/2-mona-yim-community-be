import express from 'express';
import {
    loginUser,
    signinUser,
    usernameCheck,
    emailCheck,
    editProfile,
    editPassword,
    deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/users/login', loginUser);
router.post('/users/signin', signinUser);
router.post('/users/email/check', emailCheck);
router.post('/users/username/check', usernameCheck);
router.patch('/users/profile', editProfile);
router.patch('/users/password', editPassword);
router.delete('/users/delete', deleteUser);

export default router;
