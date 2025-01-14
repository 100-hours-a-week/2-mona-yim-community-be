import {
    getUserById,
    postEmail,
    postUsername,
    postUser,
    patchUser,
    patchPassword,
    deleteUser,
    getUserLogin,
    postUsernameEdit,
} from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../utils/function.js';

/**
 * 사용자 로그인 처리 함수
 */
export const loginUser = async (req, res) => {
    // 이미 로그인된 상태라면 리다이렉트 (클라이언트 사이드에서 처리 권장)
    // if (req.session.sessionId) return res.redirect('/posts');

    const { email, password } = req.body;

    try {
        const user = await getUserLogin(email);
        // 유저가 존재하지 않거나 비밀번호 불일치 시
        if (!user || !(await verifyPassword(password, user.password))) {
            return res
                .status(401)
                .json({ message: '로그인 실패: 잘못된 이메일 또는 비밀번호' });
        }

        req.session.sessionId = user.userId;
        return res
            .status(200)
            .json({ message: '로그인 성공', userId: user.userId });
    } catch (error) {
        console.error('로그인 에러:', error);
        return res
            .status(500)
            .json({ message: '로그인 에러', error: error.message });
    }
};

/**
 * 닉네임 중복 확인 함수
 */
export const usernameCheck = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: '닉네임을 제공해야 합니다.' });
    }

    try {
        if (req.session.sessionId) {
            // 프로필 편집 시
            const userId = req.session.sessionId;
            const existUser = await postUsernameEdit(username, userId);
            if (existUser) {
                return res.status(409).json({ message: '중복된 닉네임' });
            }
            return res.status(200).json({ message: '닉네임 사용 가능' });
        } else {
            // 회원가입 시
            const existUser = await postUsername(username);
            if (existUser) {
                return res.status(409).json({ message: '중복된 닉네임' });
            }
            return res.status(200).json({ message: '닉네임 사용 가능' });
        }
    } catch (error) {
        console.error('닉네임 중복 확인 에러:', error);
        return res
            .status(500)
            .json({ message: '닉네임 확인 에러', error: error.message });
    }
};

/**
 * 이메일 중복 확인 함수
 */
export const emailCheck = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: '이메일을 제공해야 합니다.' });
    }

    try {
        const existEmail = await postEmail(email);
        if (existEmail) {
            return res.status(409).json({ message: '중복된 이메일' });
        }
        return res.status(200).json({ message: '이메일 사용 가능' });
    } catch (error) {
        console.error('이메일 중복 확인 에러:', error);
        return res
            .status(500)
            .json({ message: '이메일 확인 에러', error: error.message });
    }
};

/**
 * 사용자 회원가입 처리 함수
 */
export const signinUser = async (req, res) => {
    const userData = req.body;
    console.log(req.body);
    const profileImagePath = req.body.profileImage
        ? req.body.profileImage
        : null;

    if (!userData.username || !userData.email || !userData.password) {
        return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
    }

    try {
        const [existUser, existEmail] = await Promise.all([
            postUsername(userData.username),
            postEmail(userData.email),
        ]);

        if (existUser || existEmail) {
            return res
                .status(409)
                .json({ message: '회원 가입 실패: 중복된 닉네임 또는 이메일' });
        }

        const hashedPassword = await hashPassword(userData.password);
        const newUserData = {
            ...userData,
            password: hashedPassword,
            profileImage: profileImagePath,
        };

        await postUser(newUserData);
        return res.status(201).json({ message: '회원 가입 완료' });
    } catch (error) {
        console.error('회원 가입 에러:', error);
        return res
            .status(500)
            .json({ message: '회원 가입 에러', error: error.message });
    }
};

/**
 * 사용자 프로필 수정 함수
 */
export const editProfile = async (req, res) => {
    const userId = req.session.sessionId;
    if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const userData = req.body;
    const profileImagePath = req.body.profileImage
        ? req.body.profileImage
        : null;
    const newUserData = { ...userData, profileImage: profileImagePath };

    try {
        const updated = await patchUser(userId, newUserData);
        if (!updated) {
            return res
                .status(404)
                .json({ message: '사용자를 찾을 수 없습니다.' });
        }
        return res.status(200).json({ message: '프로필 수정 완료' });
    } catch (error) {
        console.error('프로필 수정 에러:', error);
        return res
            .status(500)
            .json({ message: '프로필 수정 에러', error: error.message });
    }
};

/**
 * 사용자 비밀번호 수정 함수
 */
export const editPassword = async (req, res) => {
    const userId = req.session.sessionId;
    if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: '비밀번호를 제공해야 합니다.' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const updated = await patchPassword(hashedPassword, userId);
        if (!updated) {
            return res
                .status(404)
                .json({ message: '사용자를 찾을 수 없습니다.' });
        }
        return res.status(200).json({ message: '비밀번호 수정 완료' });
    } catch (error) {
        console.error('비밀번호 수정 에러:', error);
        return res
            .status(500)
            .json({ message: '비밀번호 수정 에러', error: error.message });
    }
};

/**
 * 사용자 탈퇴 처리 함수
 */
export const removeUser = async (req, res) => {
    const userId = req.session.sessionId;
    if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    try {
        const deleted = await deleteUser(userId);
        if (!deleted) {
            return res
                .status(404)
                .json({ message: '사용자를 찾을 수 없습니다.' });
        }
        // 세션 제거
        delete req.session.sessionId;
        return res.status(204).json({ message: '회원 탈퇴 완료' });
    } catch (error) {
        console.error('회원 탈퇴 에러:', error);
        return res
            .status(500)
            .json({ message: '회원 탈퇴 에러', error: error.message });
    }
};

/**
 * 사용자 로그아웃 처리 함수
 */
export const logoutUser = async (req, res) => {
    try {
        if (req.session.sessionId) {
            delete req.session.sessionId; // sessionId 속성 제거
            return res.status(200).json({ message: '로그아웃 성공' });
        }
        return res.status(400).json({ message: '로그인 상태가 아닙니다.' });
    } catch (error) {
        console.error('로그아웃 처리 중 에러:', error.message);
        return res
            .status(500)
            .json({ message: '로그아웃 에러', error: error.message });
    }
};

/**
 * 특정 사용자의 정보 가져오기 함수
 */
export const userInfo = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        return res
            .status(400)
            .json({ message: '유효하지 않은 사용자 ID입니다.' });
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: '사용자를 찾을 수 없습니다.' });
        }
        return res.status(200).json({
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.error(`사용자 정보 가져오기 에러 (ID: ${userId}):`, error);
        return res.status(500).json({
            message: '사용자 정보 가져오기 에러',
            error: error.message,
        });
    }
};

/**
 * 현재 로그인된 사용자의 정보 가져오기 함수
 */
export const selfInfo = async (req, res) => {
    const userId = req.session.sessionId;
    if (!userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ message: '사용자를 찾을 수 없습니다.' });
        }
        return res.status(200).json({
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.error(`자기 정보 가져오기 에러 (ID: ${userId}):`, error);
        return res
            .status(500)
            .json({ message: '자기 정보 가져오기 에러', error: error.message });
    }
};
