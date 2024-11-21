import {
    getUserById,
    postEmail,
    postUsername,
    postUser,
    patchUser,
    patchPassword,
    deleteUser,
    getUserLogin,
} from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../utils/function.js';

export const loginUser = async (req, res) => {
    // if (req.session.sessionId) return res.redirect('/posts');

    const { email, password } = req.body;
    try {
        const user = await getUserLogin(email);

        // 유저가 존재하지 않을 경우
        if (!user) {
            return res
                .status(401)
                .json({ message: '로그인 실패: 잘못된 이메일 또는 비밀번호' });
        }

        // 비밀번호 검증
        const isPasswordMatch = await verifyPassword(password, user.password);
        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({ message: '로그인 실패: 잘못된 이메일 또는 비밀번호' });
        }

        req.session.sessionId = user.userId;
        return res
            .status(200)
            .json({ message: '로그인 성공', userId: user.userId });
    } catch (error) {
        return res
            .status(500)
            .json({ message: '로그인 에러', error: error.message });
    }
};

export const usernameCheck = async (req, res) => {
    const { username } = req.query;
    const existUser = await postUsername(username);
    if (!existUser) {
        return res.status(200).json({ message: '닉네임 사용가능' });
    } else {
        return res.status(409).json({ message: '중복된 닉네임' });
    }
};

export const emailCheck = async (req, res) => {
    const { email } = req.query;
    const existEmail = await postEmail(email);
    if (!existEmail) {
        return res.status(200).json({ message: '이메일 사용가능' });
    } else {
        return res.status(409).json({ message: '중복된 이메일' });
    }
}; //test 안해봄

export const signinUser = async (req, res) => {
    const userData = req.body;
    const profileImagePath = req.file ? req.file.filename : null;
    const existUser = await postUsername(userData.username);
    const existEmail = await postEmail(userData.email);
    if (!existUser && !existEmail) {
        const hashedPassword = await hashPassword(userData.password);
        const newUserData = {
            ...userData,
            password: hashedPassword,
            profileImage: profileImagePath,
        };
        postUser(newUserData);
        return res.status(201).json({ message: '회원 가입 완료' });
    } else {
        return res.status(400).json({ message: '회원 가입 실패' });
    }
};

export const editProfile = async (req, res) => {
    // const userId = req.session.sessionId;
    const userId = 4;
    const userData = req.body;
    const profileImagePath = req.file ? req.file.filename : null;
    const newUserData = { ...userData, profileImage: profileImagePath };

    await patchUser(userId, newUserData);
    return res.status(200).json({ message: '프로필 수정 완료' });
};

export const editPassword = async (req, res) => {
    // const userId = req.session.sessionId;
    const userId = 4;
    const { password } = req.body;
    const hashedPassword = await hashPassword(password);
    await patchPassword(hashedPassword, userId);
    return res.status(200).json({ message: '비밀번호 수정 완료' });
};

export const removeUser = async (req, res) => {
    const userId = 5;
    // const userId = req.session.sessionId;
    deleteUser(userId);
    return res.status(204).json({ message: '회원탈퇴 완료' });
};

export const logoutUser = async (req, res) => {};

export const userInfo = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = await getUserById(userId);
    return res.status(200).json({
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
    });
};

export const selfInfo = async (req, res) => {
    // const userId = req.session.sessionId;
    const userId = 1;
    const user = await getUserById(userId);
    return res.status(200).json({
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
    });
};
