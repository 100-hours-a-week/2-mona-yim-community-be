import {
    deleteLike,
    getAllLikes,
    getLikesStatus,
    postLike,
    writeLike,
} from '../models/likeModel.js';
import { editLikeCount } from '../models/postModel.js';

export const likeStatusPost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = 1;
    // const userId = await req.session.sessionId;
    const isLiked = await getLikesStatus(postId, userId);

    if (isLiked) {
        return res.status(200).json({ liked: true });
    } else return res.status(200).json({ liked: false });
};

export const likePost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = 1;
    // const userId = await req.session.sessionId;
    await postLike(postId, userId);
    const likeCount = await editLikeCount(postId);
    return res.status(201).json({ likes: likeCount.toString() });
};

export const unlikePost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = 1;
    // const userId = await req.session.sessionId;
    await deleteLike(postId, userId);
    const likeCount = await editLikeCount(postId);

    return res.status(201).json({ likes: likeCount });
};

export async function deleteAllLikeByPostId(postId) {
    const likes = await getAllLikes();
    const filteredLikes = likes.filter((like) => like.postId !== postId);
    await writeLike(filteredLikes);
}

export async function deleteAllLikeByUserId(userId) {
    const likes = await getAllLikes();
    const filteredLikes = likes.filter((like) => like.userId !== userId);
    await writeLike(filteredLikes);
}
