import { getAllUsers, writeUser, deleteImage } from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../utils/function.js';
import { deleteAllCommentByUserId } from './commentController.js';
import { deleteAllLikeByUserId } from './likeController.js';
import { deleteAllPostByUserId } from './postController.js';

export const loginUser = async (req, res) => {
    if (req.session.sessionId) res.redirect('/posts');

    const { email, password } = req.body;
    try {
        const users = await getAllUsers();
        const matchPromises = users.map(async (tempUser) => {
            const isMatch = await verifyPassword(password, tempUser.password);
            return isMatch && tempUser.email === email ? tempUser : null;
        });

        const results = await Promise.all(matchPromises);
        const user = results.find((result) => result !== null);

        if (user) {
            req.session.sessionId = user.userId;
            console.log(req.session);
            return res.status(200).json({ message: '로그인 성공' });
        } else {
            return res.status(401).json({ message: '로그인 실패' });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: '로그인 에러', error: error.message });
    }
};

export const usernameCheck = async (req, res) => {
    const { username } = req.query;
    const users = await getAllUsers();
    const existUser = users.find((user) => user.username === username);
    if (!existUser) {
        return res.status(200).json({ message: '닉네임 사용가능' });
    } else {
        return res.status(409).json({ message: '중복된 닉네임' });
    }
};

export const emailCheck = async (req, res) => {
    const { email } = req.query;
    const users = await getAllUsers();
    const existEmail = users.find((user) => user.email === email);
    if (!existEmail) {
        return res.status(200).json({ message: '이메일 사용가능' });
    } else {
        return res.status(409).json({ message: '중복된 이메일' });
    }
};

export const signinUser = async (req, res) => {
    const users = await getAllUsers();
    const userData = req.body;
    const profileImagePath = req.file ? req.file.filename : null;
    const existUser = users.find((user) => user.username === userData.username);
    const existEmail = users.find((user) => user.email === userData.email);
    if (!existUser && !existEmail) {
        const userId =
            users.length > 0 ? users[users.length - 1].userId + 1 : 1;
        const hashedPassword = await hashPassword(userData.password);
        const newUserData = {
            userId,
            ...userData,
            password: hashedPassword,
            profileImage: profileImagePath,
        };
        users.push(newUserData);
        await writeUser(users);
        return res.status(201).json({ message: '회원 가입 완료' });
    } else {
        return res.status(400).json({ message: '회원 가입 실패' });
    }
};

export const editProfile = async (req, res) => {
    const { userId, username } = req.body;
    const users = await getAllUsers();
    const userIndex = users.findIndex((user) => user.userId === Number(userId));

    const profileImagePath = req.file
        ? req.file.filename
        : users[userIndex].profileImage;
    if (req.file) deleteImage(users[userIndex].profileImage);
    users[userIndex] = {
        ...users[userIndex],
        username,
        profileImage: profileImagePath,
    };
    await writeUser(users);
    return res.status(200).json({ message: '프로필 수정 완료' });
};

export const editPassword = async (req, res) => {
    const { userId, password } = req.body;
    const users = await getAllUsers();
    const userIndex = users.findIndex((user) => user.userId === userId);
    const hashedPassword = hashPassword(password);
    users[userIndex] = { ...users[userIndex], password: hashedPassword };
    await writeUser(users);
    return res.status(200).json({ message: '비밀번호 수정 완료' });
};

export const deleteUser = async (req, res) => {
    const users = await getAllUsers();
    const userId = req.body.userId;
    const user = users.find((user) => user.userId === userId);
    deleteImage(user.profileImage);
    const deletedUsers = users.filter((user) => user.userId !== userId);
    await writeUser(deletedUsers);
    await deleteAllPostByUserId(userId);
    await deleteAllCommentByUserId(userId);
    await deleteAllLikeByUserId(userId);
    return res.status(204).json({ message: '회원탈퇴 완료' });
};

export const logoutUser = async (req, res) => {};

export const userInfo = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const users = await getAllUsers();
    const user = users.find((user) => user.userId === userId);
    return res.status(200).json({
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
    });
};
