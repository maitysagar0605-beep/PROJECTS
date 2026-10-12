document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    let togglePasswordIcon = document.getElementById("toggle-password");
    const rememberCheckbox = document.querySelector('input[name="remember"]');

    // Retrieve registered users and remember-me state from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));

    function updateVisibility() {
        // Re-query in case Font Awesome replaced the element in the DOM
        togglePasswordIcon = document.getElementById("toggle-password");
        if (togglePasswordIcon && passwordInput) {
            togglePasswordIcon.style.display = passwordInput.value.length > 0 ? "block" : "none";
        }
    }

    // --- 1. Auto-fill credentials if "Remember Me" was checked previously ---
    if (rememberedUser && usernameInput && passwordInput) {
        usernameInput.value = rememberedUser.username || "";
        passwordInput.value = rememberedUser.password || "";
        if (rememberCheckbox) rememberCheckbox.checked = true;
        updateVisibility();
    }

    // --- 2. Password Visibility Toggle ---
    if (passwordInput) {
        // Toggle visibility state on user input
        passwordInput.addEventListener("input", updateVisibility);

        // Event listener for toggle click (using event delegation for Font Awesome SVG compatibility)
        document.addEventListener("click", function (e) {
            const iconTarget = e.target.closest("#toggle-password");
            if (!iconTarget || !passwordInput) return;

            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");

            // Handle SVG vs WebFont Font Awesome structures
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

    // --- 3. Dynamic password suggestions based on entered username ---
    if (usernameInput && passwordInput) {
        usernameInput.addEventListener("input", function () {
            const enteredName = usernameInput.value.trim().toLowerCase();

            // Find matching user in registered users
            const matchedUser = registeredUsers.find(
                (user) => user.username.trim().toLowerCase() === enteredName
            );

            if (matchedUser) {
                // Auto-populate password field when matching username is typed
                passwordInput.value = matchedUser.password;
            } else {
                passwordInput.value = "";
            }
            updateVisibility();
        });
    }

    // --- 4. Handle Form Submission & Authentication ---
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                alert("Please fill in all required fields.");
                return;
            }

            // Authenticate user against stored registration records
            const authenticatedUser = registeredUsers.find(
                (user) =>
                    user.username.trim().toLowerCase() === username.toLowerCase() &&
                    user.password === password
            );

            if (authenticatedUser) {
                // Set active session for music_home.js
                localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));

                // Save or clear "Remember Me" state based on checkbox
                if (rememberCheckbox && rememberCheckbox.checked) {
                    localStorage.setItem("rememberedUser", JSON.stringify({
                        username: authenticatedUser.username,
                        password: authenticatedUser.password
                    }));
                } else {
                    localStorage.removeItem("rememberedUser");
                }

                // Redirect to music_home.html page
                window.location.href = "../HOME/music_home.html";
            } else {
                alert("Invalid username or password. Please try again or sign up.");
            }
        });
    }
});