import { getAllLikes, getLikesById, writeLike } from '../models/likeModel.js';
import { editLike } from '../models/postModel.js';

export const likeStatusPost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const likes = await getAllLikes();
    const userId = 1; // temp

    const isLiked = likes.some(
        (like) => like.postId === postId && like.userId === userId,
    );
    if (isLiked) {
        return res.status(200).json({ liked: true });
    } else return res.status(200).json({ liked: false });
};

export const likePost = async (req, res) => {
    const likes = await getAllLikes();
    const likeData = req.body;
    likes.push(likeData);
    await writeLike(likes);
    const likeCount = likes.filter(
        (like) => like.postId === likeData.postId,
    ).length;
    await editLike(likeData.postId, likeCount);
    return res.status(201).json({ likes: likeCount.toString() });
};

export const unlikePost = async (req, res) => {
    const likes = await getAllLikes();
    const likeData = req.body;

    const newLikes = likes.filter(
        (like) =>
            !(
                like.userId === likeData.userId &&
                like.postId === likeData.postId
            ),
    );

    await writeLike(newLikes);

    const likeCount =
        newLikes.filter((like) => like.postId === likeData.postId).length || 0;

    await editLike(likeData.postId, likeCount);

    return res.status(201).json({ likes: likeCount });
};