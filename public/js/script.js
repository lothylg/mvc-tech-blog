const homeBtn = document.querySelector("#homeBtn");
const dashBtn = document.querySelector("#dashBtn");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const loginSubmit = document.querySelector("#loginSubmit");
const createSubmit = document.querySelector("#createSubmit");
const logToggle = document.querySelector("#logToggle");
document.addEventListener('DOMContentLoaded', function(){

loginSubmit?.addEventListener("submit", function(event){
    event.preventDefault();

    // Collect values from the login form
    const username = document.querySelector('#name-signIn').value.trim();
    const password = document.querySelector('#password-signIn').value.trim();

    if (username && password) {
        // Send a POST request to the API endpoint
        const response =  fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // If successful, redirect the browser to the profile page
            document.location.replace('/dashboard');
        } else {

            if (response.status === 401) {
                alert("Invalid username and password");
            } else {
                alert(response.statusText);
            }
        }
    }
})
createSubmit?.addEventListener("submit", function(event){
    event.preventDefault();

    const username = document.querySelector('#name-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && password) {
        const response = fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
})


homeBtn.addEventListener("click", function () {
    window.location = '/'
});
dashBtn.addEventListener("click", function () {
    window.location = '/dashboard'
});

logToggle.addEventListener("click", function () {
    window.location = '/login'
});
logoutBtn?.addEventListener("click", function () {
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => {

            window.location.href = '/loggedout';

        })
        .catch(error => console.error('Error:', error));
});





})