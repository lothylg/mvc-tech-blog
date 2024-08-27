const homeBtn = document.querySelector("#homeBtn");
const dashBtn = document.querySelector("#dashBtn");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const logToggle = document.querySelector("#logToggle");
const dashCreate = document.querySelector('#dashCreate');
const commentBtn = document.querySelector('#commentBtn');



document.addEventListener('DOMContentLoaded', function(){

homeBtn.addEventListener("click", function () {
    window.location = '/'
});
dashBtn.addEventListener("click", function () {
    window.location = '/dashboard'
    
});

logToggle.addEventListener("click", function () {
    window.location = '/login'
});

commentBtn.addEventListener("click", function() {
    const commentContent = document.getElementById('blogContent').value;
    const postId = 'your_post_id'; // Replace 'your_post_id' with the actual post ID
    const userId = 'your_user_id'; // Replace 'your_user_id' with the actual user ID
    const datePosted = new Date().toISOString(); // Get the current date and time

    const commentData = {
        content: commentContent,
        postId: postId,
        userId: userId,
        datePosted: datePosted
    };

    try {
        const response =  fetch('/addComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            // Comment added successfully, update the UI as needed
            console.log('Comment added successfully!');
        } else {
            console.error('Failed to add comment.');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
    }
})

logoutBtn?.addEventListener("click", function () {
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => {

            window.location.href = '/logout';

        })
        .catch(error => console.error('Error:', error));
});





})