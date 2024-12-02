import { deleteLike, getLikesStatus, postLike } from '../models/likeModel.js';
import { editLikeCount } from '../models/postModel.js';

/**
 * 게시글의 좋아요 상태를 가져오는 함수
 */
export const likeStatusPost = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    const userId = req.session.sessionId;

    try {
        const isLiked = await getLikesStatus(postId, userId);
        res.status(200).json({ liked: isLiked });
    } catch (error) {
        console.error(
            `Error fetching like status for post ${postId} by user ${userId}:`,
            error,
        );
        res.status(500).json({
            message: '서버 오류: 좋아요 상태를 가져올 수 없습니다.',
        });
    }
};

/**
 * 게시글에 좋아요를 추가하는 함수
 */
export const likePost = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    const userId = req.session.sessionId;

    try {
        await postLike(postId, userId);
        const likeCount = await editLikeCount(postId);
        res.status(200).json({ likes: likeCount }); // 200 OK로 변경
    } catch (error) {
        console.error(`Error liking post ${postId} by user ${userId}:`, error);
        res.status(500).json({
            message: '서버 오류: 좋아요를 추가할 수 없습니다.',
        });
    }
};

/**
 * 게시글의 좋아요를 제거하는 함수
 */
export const unlikePost = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    const userId = req.session.sessionId;

    try {
        await deleteLike(postId, userId);
        const likeCount = await editLikeCount(postId);
        res.status(200).json({ likes: likeCount }); // 200 OK로 변경
    } catch (error) {
        console.error(
            `Error unliking post ${postId} by user ${userId}:`,
            error,
        );
        res.status(500).json({
            message: '서버 오류: 좋아요를 제거할 수 없습니다.',
        });
    }
};
