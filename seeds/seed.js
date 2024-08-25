const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    // Seed users
    await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    // Seed posts
    await Discussion.bulkCreate(postData, {
      returning: true,
    });

    console.log('Post seeded successfully');

    // Seed comments
    await Comment.bulkCreate(commentData, {
      returning: true,
    });

    console.log('Comments seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    process.exit(0);
  }
};

seedDatabase();