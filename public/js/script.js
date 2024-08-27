const homeBtn = document.querySelector("#homeBtn");
const dashBtn = document.querySelector("#dashBtn");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");

const logToggle = document.querySelector("#logToggle");
const dashCreate = document.querySelector('#dashCreate');

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