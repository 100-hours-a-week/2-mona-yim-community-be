import { getAllComments, writeComment } from '../models/commentModel.js';
import { editCommentCount } from '../models/postModel.js';

export const getComments = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const comments = await getAllComments();
    const commentsById = comments.filter(
        (comment) => comment.postId === postId,
    );
    res.status(200).json(commentsById);
};

export const uploadComment = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const comments = await getAllComments();
    const commentData = req.body;
    const commentId =
        comments.length > 0 ? comments[comments.length - 1].commentId + 1 : 1;
    const newCommentData = { commentId, ...commentData };
    comments.push(newCommentData);
    if (!comments) return res.status(400).json({ message: '댓글 생성 실패' });
    writeComment(comments);
    const commentCount = comments.filter(
        (comment) => comment.postId === postId,
    ).length;
    await editCommentCount(postId, commentCount);
    return res.status(201).json({ message: '댓글 생성 성공' });
};

export const editComment = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const commentId = parseInt(req.params.commentId, 10);
    const comments = await getAllComments();
    const newCommentData = req.body;
    const commentIndex = comments.findIndex(
        (comment) => comment.commentId === commentId,
    );

    if (commentIndex === -1) {
        return res.status(404).json({ message: '존재하지않는 댓글' });
    }

    comments[commentIndex] = { ...comments[commentIndex], ...newCommentData };
    writeComment(comments);
    return res.status(200).json({ message: '댓글 수정 성공' });
};

export const deleteComment = async (req, res) => {
    const comments = await getAllComments();
    const postId = parseInt(req.params.id, 10);
    const commentId = parseInt(req.params.commentId, 10);
    const deletedComments = comments.filter(
        (comment) => comment.commentId !== commentId,
    );
    if (comments.length === deletedComments.length)
        return res.status(404).json({ message: '존재하지않는 댓글' });
    writeComment(deletedComments);
    const commentCount = deletedComments.filter(
        (comment) => comment.postId === postId,
    ).length;
    await editCommentCount(postId, commentCount);
    return res.status(204).json({ message: '댓글 삭제 성공' });
};

export async function deleteAllCommentByPostId(postId) {
    const comments = await getAllComments();
    const filteredComments = comments.filter(
        (comment) => comment.postId !== postId,
    );
    await writeComment(filteredComments);
}

export async function deleteAllCommentByUserId(userId) {
    const comments = await getAllComments();
    const filteredComments = comments.filter(
        (comment) => comment.userId !== userId,
    );
    await writeComment(filteredComments);
}
