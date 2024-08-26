const router = require('express').Router();
const { Comment, Post, User } = require('../../models');

// Get all posts
// router.get('/', async (req, res) => {
//     try {
//         const posts = await Post.findAll({
//             include: [
//                 { model: Comment, as: "comments" },
//                 { model: User, as: "user" }
//             ]
//         });
//         res.json({ status: "success", payload: posts });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json(err);
//     }
// });

// Get post by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [
                { model: Comment, as: "comments", include: {model: User, as: "user"} },
                { model: User, as: "user" }
            ]
        });
        res.render('post', {post})
        res.json({ status: "success", payload: post });

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Get post by user
router.get('/users/:id', async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: { user_id: req.params.id },
            include: [
                { model: Comment, as: "comments", include: {model: User, as: "user"}  },
                { model: User, as: "user" }
            ]
        });

        if (userPosts.length > 0) {
            res.json({ status: "success", payload: userPosts });
        } else {
            res.status(404).json({ status: "error", message: "No posts found for this user." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "An error occurred while fetching posts." });
    }
});

// Edit a post
router.put('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const loggedInUserId = req.user.id;

        const post = await Post.findByPk(postId, {
            include: { model: User, as: "user" }
        });

        if (post && post.userId === loggedInUserId) {
            await post.update(req.body);
            res.json({ status: "success", message: "Post updated successfully", payload: post });
        } else if (!post) {
            res.status(404).json({ status: "error", message: "Post not found" });
        } else {
            res.status(403).json({ status: "error", message: "You are not authorized to edit this post" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "An error occurred while updating the post." });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create(req.body);
        res.json({ status: "success", payload: newPost });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        await Post.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
