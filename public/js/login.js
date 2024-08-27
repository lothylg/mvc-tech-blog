const loginSubmit = document.querySelector("#loginSubmit");
const createSubmit = document.querySelector("#createSubmit");

loginSubmit?.addEventListener("click", function(event){
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
            window.location.href('/dashboard');
        } else {

            if (response.status === 401) {
                alert("Invalid username and password");
            } else {
                alert(response.statusText);
            }
        }
    }
})
createSubmit?.addEventListener("click", function(event){
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
            window.location.href('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
})