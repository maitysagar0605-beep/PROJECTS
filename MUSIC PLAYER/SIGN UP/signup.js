document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("form");
    const usernameInput = document.getElementById("username");
    const gmailInput = document.getElementById("gmail");
    const passwordInput = document.getElementById("password");
    let togglePasswordIcon = document.getElementById("toggle-password");

    // --- 1. Password Visibility Toggle Logic ---
    function updateVisibility() {
        // Re-query in case Font Awesome replaced the <i> with an <svg> element
        togglePasswordIcon = document.getElementById("toggle-password");
        if (togglePasswordIcon && passwordInput) {
            if (passwordInput.value.length > 0) {
                togglePasswordIcon.style.setProperty("display", "block", "important");
            } else {
                togglePasswordIcon.style.setProperty("display", "none", "important");
            }
        }
    }

    if (passwordInput) {
        // Toggle icon visibility on input
        passwordInput.addEventListener("input", updateVisibility);

        // Event listener for toggle click (using event delegation for Font Awesome SVG compatibility)
        document.addEventListener("click", function (e) {
            const iconTarget = e.target.closest("#toggle-password");
            if (!iconTarget || !passwordInput) return;

            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");

            // Handle Font Awesome SVG vs WebFont modes
            const svgIcon = iconTarget.tagName.toLowerCase() === "svg" 
                ? iconTarget 
                : iconTarget.querySelector("svg");

            if (svgIcon) {
                // Font Awesome JS/SVG mode
                svgIcon.setAttribute("data-icon", isPassword ? "eye-slash" : "eye");
                svgIcon.classList.toggle("fa-eye", !isPassword);
                svgIcon.classList.toggle("fa-eye-slash", isPassword);
            } else {
                // Font Awesome CSS/WebFont mode
                iconTarget.classList.toggle("fa-eye", !isPassword);
                iconTarget.classList.toggle("fa-eye-slash", isPassword);
            }
        });
    }

    // --- 2. Handle Form Submission & Registration ---
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = usernameInput ? usernameInput.value.trim() : "";
            const gmail = gmailInput ? gmailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (!username || !gmail || !password) {
                alert("Please fill in all required fields.");
                return;
            }

            if (password.length < 8) {
                alert("Password must be at least 8 characters long.");
                return;
            }

            const userData = {
                username: username,
                gmail: gmail,
                password: password
            };

            // Retrieve registered users array
            let existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

            // Case-insensitive check to prevent duplicate usernames/emails
            const userExists = existingUsers.some(
                (user) => user.username.trim().toLowerCase() === username.toLowerCase() ||
                          user.gmail.trim().toLowerCase() === gmail.toLowerCase()
            );

            if (userExists) {
                alert("Account already exists with this username or email!");
                return;
            }

            // Save new user data
            existingUsers.push(userData);
            localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

            // Set current active session for music_home.js
            localStorage.setItem("currentUser", JSON.stringify(userData));

            alert("You Have Been Signed Up Successfully.");
            window.location.href = "../HOME/music_home.html";
        });
    }
});