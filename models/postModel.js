import posts from '../data/posts.json' assert { type: 'json' };

export const getAllPosts = () => posts;

export const getPostById = (postId) =>
    posts.find((post) => post.postId === postId);
