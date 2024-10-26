// Getting the elements
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Toggle between SignUp and SignIn panels
signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Handle signup form submission
document.addEventListener('DOMContentLoaded', function () {
  const signupButton = document.getElementById('signupButton');

  signupButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get user-entered data (name, email, password)
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple validation
    if (!name || !email || !password) {
      alert("Please fill in all the fields");
      return;
    }

    // Prepare the data to send
    const formData = {
      name: name,
      email: email,
      password: password
    };

    // AJAX POST request to send signup data to the server
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (response.ok) {
        // Redirect to FarmerReg.html if signup is successful
        window.location.href = 'FarmerReg.html';
      } else {
        throw new Error('Signup failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Signup failed. Please try again.');
    });
  });
});
