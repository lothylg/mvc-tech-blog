const router = require('express').Router()
const { Comment, Post, User } = require('../../models')

//get all posts
router.get('/', async (req, res) => {
    try {
        const post = await Post.findAll({
            include: { model: Comment, as: "comments", model: User, as: "users" }
        })
        res.json({ status: "success", payload: post })
    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
})

//get post by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: { model: Comment, as: "comments", model: User, as: "users" }
        })
        res.json({ status: "success", payload: post })
    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
})


//get post by user
router.get('/users/:id', async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: { user_id: req.params.id }, 
            include: [
                { model: Comment, as: "comments" },  
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

//edit a post
router.put('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const loggedInUserId = req.user.id; 
        
        // Find the post by its ID
        const post = await Post.findByPk(postId, {
            include: { model: User, as: "user" }
        });

        // Check if the post exists and if the logged-in user is the owner of the post
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
//create a new post
router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create(req.body);

    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }


})
//delete a post


// This is where we look up all discussions by a movie id provided in the query params
router.get('/', async (req, res) => {
    console.log(req.query)
    const Post = await Post.findAll({
        where: { movie_id: movieId }, include: { model: Comment, as: "comments" }
    })
    res.json({ status: "success", payload: discussions })
});

router.get('/:id', async (req, res) => { //I updated
    try {
        const discussion = await Discussion.findByPk(req.params.id, { include: { model: Comment, as: "comments" } })
        res.json({ status: "success", payload: discussion })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", payload: err.message })
    }
});


router.post('/', async (req, res) => {
    const discussionData = { movie_id: req.body.movie_id, user_id: req.body.user_id, text: req.body.text }
    console.log(discussionData)
    try {
        const result = await Discussion.create(discussionData);

        console.log(result)
        const parsedResult = result.get({ plain: true })

        // if a comment was also supplied, let's add that also
        if (result.id && req.body.comment) {
            await Comment.create({
                text: req.body.comment,
                discussion_id: parsedResult.id
            })
        }

        res.status(200).json({ status: "success", payload: result });
    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Post.destroy({
            where: {
                id: req.params.id
            },
        });
        res.status(200).json({ status: "ok" });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
