const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); 

    // Seed users
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    console.log('Users seeded successfully');

    // Seed posts with associated users
    const posts = await Promise.all(postData.map(async (post) => {
      const user = users[Math.floor(Math.random() * users.length)]; // Get a random user
      return await Post.create({ ...post, user_id: user.id });
    }));

    console.log('Posts seeded successfully');

    // Seed comments with associated users and posts
    const comments = await Promise.all(commentData.map(async (comment) => {
      const user = users[Math.floor(Math.random() * users.length)]; // Get a random user
      const post = posts[Math.floor(Math.random() * posts.length)]; // Get a random post
      return await Comment.create({ ...comment, user_id: user.id, post_id: post.id });
    }));

    console.log('Comments seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1); 
  } finally {
    process.exit(0); 
  }
};

seedDatabase();