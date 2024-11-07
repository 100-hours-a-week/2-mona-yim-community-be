import { getAllUsers, addUser } from '../models/userModel.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await getAllUsers();
        const user = users.find((user) => user.email === email);

        if (user) {
            res.status(200).json({ message: '로그인 성공' });
        } else {
            res.status(401).json({ message: '로그인 실패' });
        }
    } catch (error) {
        res.status(500).json({ message: '로그인 에러', error: error.message });
    }
};

export const usernameCheck = async (req, res) => {
    const { username } = req.query;
    const users = await getAllUsers();
    const existUser = users.find((user) => user.username === username);
    if (!existUser) {
        res.status(200).json({ message: '닉네임 사용가능' });
    } else {
        res.status(409).json({ message: '중복된 닉네임' });
    }
};

export const emailCheck = async (req, res) => {
    const { email } = req.query;
    const users = await getAllUsers();
    const existEmail = users.find((user) => user.email === email);
    if (!existEmail) {
        res.status(200).json({ message: '이메일 사용가능' });
    } else {
        res.status(409).json({ message: '중복된 이메일' });
    }
};

export const signinUser = async (req, res) => {
    const { email, username } = req.body;
    const users = await getAllUsers();
    const existUser = users.find((user) => user.username === username);
    const existEmail = users.find((user) => user.email === email);
    if (!existUser && !existEmail) {
        addUser(req.body);
        res.status(201).json({ message: '회원 가입 완료' });
    } else {
        res.status(400).json({ message: '회원 가입 실패' });
    }
};

export const editProfile = async (req, res) => {};

export const editPassword = async (req, res) => {};

export const deleteUser = async (req, res) => {};

export const logoutUser = async (req, res) => {};
