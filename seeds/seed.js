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

    // Seed posts
    const posts = await Post.bulkCreate(postData, {
      returning: true,
    });

    console.log('Posts seeded successfully');

    // Seed comments
    const comments = await Comment.bulkCreate(commentData, {
      returning: true,
    });

    console.log('Comments seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1); 
  } finally {
    process.exit(0); 
  }
};

seedDatabase();
