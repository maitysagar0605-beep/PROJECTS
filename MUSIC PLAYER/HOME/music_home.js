// Element references
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const headerText = document.getElementById('header-text');
const signup = document.getElementById('sign-up');
const sideBarToggleBtn = document.getElementById('sidebar-toggle');
const sideBar = document.getElementById('side-bar');
const footerText = document.getElementById('footer-text');

// --- Helper Functions ---
function updateVolumeIcon(val) {
    const volTooltip = document.getElementById('bar-vol-tooltip');
    if (volTooltip) {
        volTooltip.innerText = Math.round(val * 100) + '%';
    }

    const iconWrapper = document.getElementById('bar-vol-icon-wrapper');
    if (!iconWrapper) return;

    const floatVal = parseFloat(val);

    if (floatVal === 0) {
        iconWrapper.innerHTML = '<i class="fa-solid fa-volume-xmark" id="bar-vol-icon"></i>';
    } else if (floatVal < 0.5) {
        iconWrapper.innerHTML = '<i class="fa-solid fa-volume-low" id="bar-vol-icon"></i>';
    } else {
        iconWrapper.innerHTML = '<i class="fa-solid fa-volume-high" id="bar-vol-icon"></i>';
    }
}

function formateTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;

    return `${mins}:${secs}`;
}

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
function applyTheme(theme) {
    const sectionHeaders = document.querySelectorAll('.section-header h2, #header-text');

    if (theme === 'day') {
        body.style.backgroundColor = '#f4f4f4';
        if (themeToggleBtn) {
            themeToggleBtn.textContent = 'Night🌙';
            themeToggleBtn.style.backgroundColor = '#333';
            themeToggleBtn.style.color = '#fff';
        }
        sectionHeaders.forEach(h2 => {
            h2.style.color = '#222';
        });
        if (footerText) {
            footerText.style.color = '#222';
        }
    } else {
        body.style.backgroundColor = '#333';
        if (themeToggleBtn) {
            themeToggleBtn.textContent = 'Day🌞';
            themeToggleBtn.style.backgroundColor = '#fff';
            themeToggleBtn.style.color = '#000';
        }
        sectionHeaders.forEach(h2 => {
            h2.style.color = '#fff';
        });
        if (footerText) {
            footerText.style.color = '#fff';
        }
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
document.addEventListener("DOMContentLoaded", function () {
    localStorage.setItem('current_visited_page', window.location.href);

    const activeUser = JSON.parse(localStorage.getItem("currentUser"));
    const navContainer = document.querySelector(".nav-btn");

    if (activeUser && activeUser.username && navContainer) {
        const firstLetter = activeUser.username.trim().charAt(0).toUpperCase();
        const loginBtn = document.getElementById("log-in");
        const signupBtn = document.getElementById("sign-up");

        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";

        const avatarWrapper = document.createElement("div");
        avatarWrapper.className = "avatar-wrapper";
        avatarWrapper.style.position = "relative";

        const accAvatar = document.createElement("div");
        accAvatar.className = "acc-avatar";
        accAvatar.textContent = firstLetter;
        accAvatar.title = `${activeUser.username}`;

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

        avatarWrapper.appendChild(accAvatar);
        avatarWrapper.appendChild(dropdownMenu);

        const themeBtn = document.getElementById("theme-toggle");
        if (themeBtn) {
            navContainer.insertBefore(avatarWrapper, themeBtn);
        } else {
            navContainer.appendChild(avatarWrapper);
        }

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

        const logoutBtn = dropdownMenu.querySelector("#logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                localStorage.removeItem("currentUser");
                alert("You have been logged out Successfully.");
                window.location.href = "../HOME/music_home.html";
            });
        }
    }

  // --- 4. Filter Chips & Dynamic Card Play Event Listeners ---
    const chips = document.querySelectorAll('.chip');
    const targetMap = {
        'quick picks': 'Quick Picks',
        'forgotten favourites': 'Forgotten Favourites',
        'shows for you': 'Shows For You',
        'songs': 'Your Songs',
        'albums': 'Albums',
        'artists': 'Your Artists',
        'profiles': 'Trending Profiles'
    };

    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const chipText = this.textContent.toLowerCase().trim();
            const matchingKeyword = Object.keys(targetMap).find(key => chipText.includes(key));

            if (matchingKeyword) {
                const targetTitle = targetMap[matchingKeyword];
                const headings = document.querySelectorAll('.section-header h2');

                headings.forEach(heading => {
                    if (heading.innerText.trim().toLowerCase() === targetTitle.toLowerCase()) {
                        heading.closest('.explore-section').scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });
    });

    // Attach click handlers to music cards dynamically
    const musicCards = document.querySelectorAll('.music-card');
    musicCards.forEach(card => {
        const cardPlayBtn = card.querySelector('.play-btn');
        if (!cardPlayBtn) return;

        cardPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            const title = card.querySelector('h3') ? card.querySelector('h3').innerText.trim() : 'Unknown Title';
            const artist = card.querySelector('p') ? card.querySelector('p').innerText.split('•')[0].trim() : 'Unknown Artist';
            const coverImg = card.querySelector('.card-img-wrapper img') ? card.querySelector('.card-img-wrapper img').src : '';

            // Default audio source map (Add audio file path for Tu Zaroori)
            let audioSrc = '../assests/music.mp3'; 
            if (title.toLowerCase() === 'tu zaroori') {
                audioSrc = '../assests/Tu_Zaroori.mp3'; // Replace with your exact audio path for Tu Zaroori
            }

            const activeTrackData = {
                title: title,
                artist: artist,
                cover: coverImg,
                src: audioSrc,
                currentTime: 0,
                isPlaying: true,
                volume: 1
            };

            // Update local storage and redirect to player page
            localStorage.setItem('activeTrack', JSON.stringify(activeTrackData));
            window.location.href = '../REAL PLAYER/index10.html';
        });
    });

    // --- 5. Bottom Music Player Initialization ---
    const savedTrackData = localStorage.getItem('activeTrack');
    if (!savedTrackData) return; // Exit cleanly without breaking scoped functions

    const track = JSON.parse(savedTrackData);
    
    const bar = document.getElementById('bottom-player-bar');
    const barCover = document.getElementById('bar-cover');
    const barTitle = document.getElementById('bar-title');
    const barArtist = document.getElementById('bar-artist');
    const PlayBtn = document.getElementById('bar-play-btn');
    const prevBtn = document.getElementById('bar-prev-btn');
    const nextBtn = document.getElementById('bar-next-btn');
    const audio = document.getElementById('bar-audio');

    const progress = document.getElementById('bar-progress');
    const currentTimeEl = document.getElementById('bar-current-time');
    const totalTimeEl = document.getElementById('bar-total-time');
    const volumeBar = document.getElementById('bar-volume');

    if (bar) bar.classList.remove('hidden');
    if (barCover) barCover.src = track.cover;
    if (barTitle) barTitle.innerText = track.title;
    if (barArtist) barArtist.innerText = track.artist;
    if (audio) audio.src = track.src;

    const savedVolume = track.volume !== undefined ? track.volume : 1;
    if (audio) audio.volume = savedVolume;
    if (volumeBar) {
        volumeBar.value = savedVolume;
        updateVolumeIcon(savedVolume);
    }

    if (audio) {
        audio.onloadedmetadata = function () {
            if (progress) {
                progress.max = audio.duration;
                progress.value = track.currentTime || 0;
            }

            if (currentTimeEl) currentTimeEl.innerText = formateTime(track.currentTime || 0);
            if (totalTimeEl) totalTimeEl.innerText = formateTime(audio.duration);

            if (track.currentTime) {
                audio.currentTime = track.currentTime;
            }
        };

        async function toggleBottomPlayPause(action = null) {
            const shouldPlay = action === 'play' || (action !== 'pause' && audio.paused);

            if (shouldPlay) {
                try {
                    await audio.play();
                    if (PlayBtn) PlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    track.isPlaying = true;
                } catch (err) {
                    console.log('Playback blocked on home bar:', err);
                    if (PlayBtn) PlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                    track.isPlaying = false;
                }
            } else {
                audio.pause();
                if (PlayBtn) PlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                track.isPlaying = false;
            }
            localStorage.setItem('activeTrack', JSON.stringify(track));
        }

        if (track.isPlaying) {
            toggleBottomPlayPause('play');
        }

        if (PlayBtn) {
            PlayBtn.addEventListener('click', () => toggleBottomPlayPause());
        }

        audio.ontimeupdate = function () {
            if (progress) progress.value = audio.currentTime;
            if (currentTimeEl) currentTimeEl.innerText = formateTime(audio.currentTime);

            track.currentTime = audio.currentTime;
            localStorage.setItem('activeTrack', JSON.stringify(track));
        };

        if (progress) {
            progress.onchange = function () {
                audio.currentTime = progress.value;
                if (currentTimeEl) currentTimeEl.innerText = formateTime(audio.currentTime);

                if (audio.paused) {
                    toggleBottomPlayPause('play');
                }
            };

            progress.oninput = function () {
                if (currentTimeEl) currentTimeEl.innerText = formateTime(progress.value);
            };
        }

        audio.onended = function () {
            if (progress) progress.value = 0;
            audio.currentTime = 0;
            if (currentTimeEl) currentTimeEl.innerText = "00:00";
            if (PlayBtn) PlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            track.isPlaying = false;
            localStorage.setItem('activeTrack', JSON.stringify(track));
        };

        document.addEventListener('keydown', function (event) {

            if (event.code === 'ArrowRight' || event.key === 'ArrowRight' || event.keyCode === 39) {
                event.preventDefault();
                const duration = isNaN(audio.duration) ? Infinity : audio.duration;
                audio.currentTime = Math.min(duration, audio.currentTime + 5);
                if (progress) progress.value = audio.currentTime;
            }

            if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft' || event.keyCode === 37) {
                event.preventDefault();
                let time = audio.currentTime || 0;
                audio.currentTime = Math.max(0, time - 5);
                if (progress) progress.value = audio.currentTime;
            }
        });

        if (volumeBar) {
            volumeBar.addEventListener('input', function () {
                audio.volume = volumeBar.value;
                track.volume = volumeBar.value;
                updateVolumeIcon(volumeBar.value);
                localStorage.setItem('activeTrack', JSON.stringify(track));
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                audio.currentTime = Math.max(0, audio.currentTime - 5);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                const duration = isNaN(audio.duration) ? Infinity : audio.duration;
                audio.currentTime = Math.min(duration, audio.currentTime + 5);
            });
        }
    }

    // Expand Button Listener
   const expandBtn = document.getElementById('bar-expand-btn');
   if (expandBtn) {
         expandBtn.addEventListener('click', () => {
           // Save current playback state so full player can resume seamlessly
            if (audio) {
                  track.currentTime = audio.currentTime;
                  track.isPlaying = !audio.paused;
                  localStorage.setItem('activeTrack', JSON.stringify(track));
            }
        
        // Navigate to the player page
        window.location.href = '../REAL PLAYER/index10.html';
    });
  }
});

const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
let debounceTimer;

// Event Listener for live search typing
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();

  clearTimeout(debounceTimer);

  if (!query) {
    searchDropdown.classList.add('hidden');
    searchDropdown.innerHTML = '';
    return;
  }

  // Delay network request by 300ms while user types
  debounceTimer = setTimeout(() => {
    fetchMusicData(query);
  }, 300);
});

// Fetch results using iTunes API
async function fetchMusicData(query) {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=8`
    );
    const data = await response.json();
    renderDropdown(data.results);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

// Render dropdown list
function renderDropdown(items) {
  if (!items || items.length === 0) {
    searchDropdown.innerHTML = `<div class="dropdown-item"><span class="title">No results found</span></div>`;
    searchDropdown.classList.remove('hidden');
    return;
  }

  searchDropdown.innerHTML = items
    .map((item) => {
      // Scale artwork thumbnail image resolution
      const artwork = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '120x120bb') : '';
      const title = item.trackName || item.collectionName || item.artistName;
      const artist = item.artistName || 'Unknown Artist';
      const type = item.wrapperType === 'track' ? 'Song' : 'Album';

      return `
        <div class="dropdown-item" onclick="selectItem('${escapeHtml(title)}', '${item.trackViewUrl || '#'}')">
          <img src="${artwork}" alt="${escapeHtml(title)}" />
          <div class="info">
            <span class="title">${escapeHtml(title)}</span>
            <span class="subtitle"><span class="badge">${type}</span> • ${escapeHtml(artist)}</span>
          </div>
        </div>
      `;
    })
    .join('');

  searchDropdown.classList.remove('hidden');
}

// Action when user clicks a suggestion
function selectItem(title, url) {
  searchInput.value = title;
  searchDropdown.classList.add('hidden');
  if (url && url !== '#') {
    window.open(url, '_blank'); // Opens track in Apple Music/iTunes
  }
}

// Helper to escape special HTML chars
function escapeHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    searchDropdown.classList.add('hidden');
  }
});