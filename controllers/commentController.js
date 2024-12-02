import {
    deleteComment,
    getCommentsById,
    patchComment,
    postComment,
} from '../models/commentModel.js';
import { editCommentCount } from '../models/postModel.js';

/**
 * 댓글 목록을 가져오는 함수
 */
export const getComments = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    try {
        const comments = await getCommentsById(postId);
        res.status(200).json(comments);
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        res.status(500).json({
            message: '서버 오류: 댓글을 가져올 수 없습니다.',
        });
    }
};

/**
 * 새로운 댓글을 업로드하는 함수
 */
export const uploadComment = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    const userId = req.session.sessionId;
    const commentData = req.body;

    try {
        await postComment(userId, postId, commentData);
        await editCommentCount(postId);
        res.status(201).json({ message: '댓글 생성 성공' });
    } catch (error) {
        console.error(`Error uploading comment for post ${postId}:`, error);
        res.status(500).json({
            message: '서버 오류: 댓글을 생성할 수 없습니다.',
        });
    }
};

/**
 * 기존 댓글을 수정하는 함수
 */
export const editComment = async (req, res) => {
    const { commentId } = req.params;
    const parsedCommentId = parseInt(commentId, 10);
    const { content } = req.body;

    try {
        await patchComment(parsedCommentId, content);
        res.status(200).json({ message: '댓글 수정 성공' });
    } catch (error) {
        console.error(`Error editing comment ${parsedCommentId}:`, error);
        res.status(500).json({
            message: '서버 오류: 댓글을 수정할 수 없습니다.',
        });
    }
};

/**
 * 댓글을 삭제하는 함수
 */
export const removeComment = async (req, res) => {
    const { id, commentId } = req.params;
    const postId = parseInt(id, 10);
    const parsedCommentId = parseInt(commentId, 10);

    try {
        await deleteComment(parsedCommentId);
        await editCommentCount(postId);
        res.status(204).json({ message: '댓글 삭제 성공' });
    } catch (error) {
        console.error(
            `Error deleting comment ${parsedCommentId} for post ${postId}:`,
            error,
        );
        res.status(500).json({
            message: '서버 오류: 댓글을 삭제할 수 없습니다.',
        });
    }
};
