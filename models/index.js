const Post = require('./postModel');
const Comment = require('./commentModel');
const User = require('./userModel');

User.hasMany(Post, {
    foreignKey: 'user_id'
}); 

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
}); 

Post.hasMany(Comment, {
    foreignKey: 'post_id'
}); 

Comment.belongsTo(User, {
    foreignKey: 'user_id'
}); 

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

module.exports = { Post, Comment, User };