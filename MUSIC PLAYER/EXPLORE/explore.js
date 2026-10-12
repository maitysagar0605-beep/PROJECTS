document.addEventListener("DOMContentLoaded", function () {
    localStorage.setItem('current_visited_page', window.location.href);

    
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const sideBarToggleBtn = document.getElementById('sidebar-toggle');
    const sideBar = document.getElementById('side-bar');

    // --- 1. Sidebar Setup ---
    if (sideBar) {
        sideBar.classList.add('sideBar');

        const closeBtn = document.createElement('button');
        closeBtn.id = 'sidebar-closebtn';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: transparent;
            border: none;
            color: #ffcc00;
            font-size: 28px;
            cursor: pointer;
            display: none;
            width: 35px;
            height: 35px;
            line-height: 32px;
            text-align: center;
            border-radius: 50%;
            transition: background-color 0.3s ease, color 0.3s ease;
        `;

        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.backgroundColor = 'rgba(255, 204, 0, 0.2)';
            closeBtn.style.color = '#ffffff';
        });

        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#ffcc00';
        });

        sideBar.style.position = 'relative';
        sideBar.insertBefore(closeBtn, sideBar.firstChild);
        sideBar.classList.add('collapsed');

        function openSideBar() {
            sideBar.classList.remove('collapsed');
            closeBtn.style.display = 'block';
        }

        function closeSideBar() {
            sideBar.classList.add('collapsed');
            closeBtn.style.display = 'none';
        }

        if (sideBarToggleBtn) {
            sideBarToggleBtn.addEventListener('click', () => {
                if (sideBar.classList.contains('collapsed')) {
                    openSideBar();
                } else {
                    closeSideBar();
                }
            });
        }

        closeBtn.addEventListener('click', closeSideBar);
    }

    // --- 2. Theme Toggle ---
    function applyTheme(theme){
        const sectionHeaders = document.querySelectorAll('.section-header h2');

        if(theme === 'day'){
            body.style.backgroundColor = '#f4f4f4'
            if(themeToggleBtn){
            themeToggleBtn.textContent = 'Night🌙';
            themeToggleBtn.style.backgroundColor = '#333';
            themeToggleBtn.style.color = '#fff';
            }
            sectionHeaders.forEach(h2 => {
                h2.style.color = '#222';
            });
        }else{
           body.style.backgroundColor = '#333'
            if(themeToggleBtn){
            themeToggleBtn.textContent = 'Day🌞';
            themeToggleBtn.style.backgroundColor = '#fff';
            themeToggleBtn.style.color = '#000';
            }
            sectionHeaders.forEach(h2 => {
                h2.style.color = '#fff';
            });
        }    
    }
    
    const currentSavedTheme = localStorage.getItem('buzzbee_theme') || 'night';
    applyTheme(currentSavedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const savedTheme = localStorage.getItem('buzzbee_theme') || 'night';
            const newTheme = savedTheme === 'night' ? 'day' : 'night';

            localStorage.setItem('buzzbee_theme', newTheme);
            applyTheme(newTheme);
        });
    }
// --- 3. Unified Authentication & UI Flow ---
const activeUser = JSON.parse(localStorage.getItem("currentUser"));
const navContainer = document.querySelector(".nav-btn");

if (navContainer) {
    // 1. Always create the avatar wrapper
    const avatarWrapper = document.createElement("div");
    avatarWrapper.className = "avatar-wrapper";
    avatarWrapper.style.position = "relative";

    const accAvatar = document.createElement("div");
    accAvatar.className = "acc-avatar";

    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu";
    dropdownMenu.style.cssText = `
        display: none;
        position: absolute;
        top: 50px;
        right: 0;
        background-color: #222;
        border: 1px solid #ffcc00;
        border-radius: 10px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        min-width: 140px;
        text-align: center;
    `;

    // 2. Check if a user is logged in
    if (activeUser && activeUser.username) {
        // Logged-in State: Display First Letter
        const firstLetter = activeUser.username.trim().charAt(0).toUpperCase();
        accAvatar.textContent = firstLetter;
        accAvatar.title = activeUser.username;

        dropdownMenu.innerHTML = `
            <p style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 6px;">
               ${activeUser.username}
            </p>
            <button id="logout-btn" style="
                width: 100%;
                background-color: #ffcc00;
                color: #222;
                border: none;
                padding: 8px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            ">Log Out <i class="fa-solid fa-right-from-bracket"></i></button>
        `;
    } else {
        // Logged-out / Guest State: Display User Icon
        accAvatar.innerHTML = '<i class="fa-solid fa-user"></i>';
        accAvatar.title = "Guest / Sign In";

        dropdownMenu.innerHTML = `
            <p style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 6px;">
               Not Signed In
            </p>
            <a href="../LOG IN/login.html" style="
                display: block;
                width: 100%;
                background-color: #ffcc00;
                color: #222;
                padding: 8px 0;
                border-radius: 6px;
                font-weight: 600;
                text-decoration: none;
                box-sizing: border-box;
            ">Log In</a>
        `;
    }

    // 3. Attach avatar and dropdown to navigation
    avatarWrapper.appendChild(accAvatar);
    avatarWrapper.appendChild(dropdownMenu);

    if (themeToggleBtn) {
        navContainer.insertBefore(avatarWrapper, themeToggleBtn);
    } else {
        navContainer.appendChild(avatarWrapper);
    }

    // 4. Toggle Dropdown Menu
    accAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display === "block";
        dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    document.addEventListener("click", function () {
        dropdownMenu.style.display = "none";
    });

    dropdownMenu.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // 5. Handle Logout Click Event
    const logoutBtn = dropdownMenu.querySelector("#logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Clear user session
            localStorage.removeItem("currentUser");
            
            alert("You have been logged out Successfully.");
            window.location.href = "../EXPLORE/explore.html";
        });
    }
}

// --- 4. Main Content Interactions & Section Jumping ---

    // Filter Chips Interactivity with Auto-Scroll
    const chips = document.querySelectorAll('.chip');
    
    // Map chip button text keywords to their corresponding section header titles
    const targetMap = {
        'new releases': 'New Release Albums',
        'charts': 'Top Trending Charts',
        'podcasts': 'Trending Podcasts',
        'moods & genres': 'Moods & Genres'
    };

    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Active visual state toggle
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // Find target heading text by matching keywords
            const chipText = this.innerText.toLowerCase().trim();
            const matchingKeyword = Object.keys(targetMap).find(key => chipText.includes(key));
            
            if (matchingKeyword) {
                const targetTitle = targetMap[matchingKeyword];
                const headings = document.querySelectorAll('.section-header h2');
                
                headings.forEach(heading => {
                    if (heading.innerText.trim().toLowerCase() === targetTitle.toLowerCase()) {
                        // Smoothly scroll the targeted section into view
                        heading.closest('.explore-section').scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });
    });

    // Genre Cards Interaction
    const genreCards = document.querySelectorAll('.genre-card');
    genreCards.forEach(genre => {
        genre.addEventListener('click', function() {
            console.log(`Filtering by genre: ${this.innerText.trim()}`);
        });
    });
});