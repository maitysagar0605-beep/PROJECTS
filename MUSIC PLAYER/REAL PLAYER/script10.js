// --- DOM Element References ---
let progress;
let song;
let playCard;

// --- Web Audio API Context Variables (Audio Visualizer Glow) ---
let audioCtx;
let analyser;
let source;
let dataArray;
let animationId;

// --- Helper Functions ---
function initAudioContext() {
    if (!audioCtx && song) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;

        source = audioCtx.createMediaElementSource(song);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
}

function renderGlow() {
    if (song && !song.paused && analyser) {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        let bassBins = 8;
        for (let i = 0; i < bassBins; i++) {
            sum += dataArray[i];
        }
        let avgBass = sum / bassBins;

        let glowsize = Math.max(0, (avgBass / 255) * 30);
        let opacity = Math.max(0, (avgBass / 255) * 0.9 + 0.1);

        if (playCard) {
            playCard.style.setProperty('--glow-size', `${glowsize}px`);
            playCard.style.setProperty('--glow-opacity', opacity);
        }

        animationId = requestAnimationFrame(renderGlow);
    } else {
        stopGlow();
    }
}

function stopGlow() {
    cancelAnimationFrame(animationId);
    if (playCard) {
        playCard.style.setProperty('--glow-size', '0px');
        playCard.style.setProperty('--glow-opacity', '0');
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

function updateVolumeIcon(val) {
    let volTooltip = document.getElementById('volume-tooltip');
    if (volTooltip) {
        volTooltip.innerText = Math.round(val * 100) + '%';
    }

    const volBtn = document.getElementById('volume-btn');
    if (!volBtn) return;

    let iconClass = 'fa-solid fa-volume-high';
    const volumeLevel = parseFloat(val);

    if (volumeLevel === 0) {
        iconClass = 'fa-solid fa-volume-xmark';
    } else if (volumeLevel < 0.5) {
        iconClass = 'fa-solid fa-volume-low';
    }

    // Direct innerHTML update safely forces FontAwesome to re-render the SVG icon
    volBtn.innerHTML = `<i class="${iconClass}" id="volume-icon"></i>`;
}

let volTimeout;
function showVolumeBarTemp(barElement) {
    let volToolTip = document.getElementById('volume-tooltip');

    barElement.classList.add('active');
    if (volToolTip) {
        volToolTip.classList.add('active');
    }

    clearTimeout(volTimeout);
    volTimeout = setTimeout(function () {
        barElement.classList.remove('active');
        if (volToolTip) {
            volToolTip.classList.remove('active');
        }
    }, 1500);
}

// --- Dynamic Icon Updater (Fixes FontAwesome SVG Replacement Issue) ---
function updatePlayPauseIcon(isPlaying) {
    const ctrlBtn = document.getElementById('ctrl-btn');
    if (!ctrlBtn) return;

    // Direct innerHTML re-render forces FontAwesome to replace the icon correctly
    if (isPlaying) {
        ctrlBtn.innerHTML = '<i class="fa-solid fa-pause" id="ctrl-icon"></i>';
    } else {
        ctrlBtn.innerHTML = '<i class="fa-solid fa-play" id="ctrl-icon"></i>';
    }
}

// --- Playback Controls ---
async function togglePlayPause(action = null) {
    if (!song) return;

    initAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    const shouldPlay = action === 'play' || (action !== 'pause' && song.paused);

    if (shouldPlay) {
        try {
            await song.play();
            updatePlayPauseIcon(true);
            renderGlow();
        } catch (err) {
            console.log('Playback blocked by browser policy:', err);
            updatePlayPauseIcon(false);
        }
    } else {
        song.pause();
        updatePlayPauseIcon(false);
        stopGlow();
    }
}

// --- Audio & Range Input Events setup helper ---
function bindAudioEvents() {
    if (!song) return;

    song.onloadedmetadata = function () {
        if (progress) {
            progress.max = song.duration;
            progress.value = song.currentTime;
        }

        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');

        if (currentTimeEl) currentTimeEl.innerText = formateTime(song.currentTime);
        if (totalTimeEl) totalTimeEl.innerText = formateTime(song.duration);
    };

    song.ontimeupdate = function () {
        if (progress) progress.value = song.currentTime;
        const currentTimeEl = document.getElementById('current-time');
        if (currentTimeEl) currentTimeEl.innerText = formateTime(song.currentTime);
    };

    song.onended = function () {
        if (progress) progress.value = 0;
        song.currentTime = 0;
        const currentTimeEl = document.getElementById('current-time');

        if (currentTimeEl) currentTimeEl.innerText = "00:00";
        updatePlayPauseIcon(false);
        stopGlow();
    };

    if (progress) {
        progress.onchange = function () {
            song.currentTime = progress.value;

            const currentTimeEl = document.getElementById('current-time');
            if (currentTimeEl) currentTimeEl.innerText = formateTime(song.currentTime);

            initAudioContext();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (song.paused) {
                togglePlayPause('play');
            }
        };
    }
}

// --- Global Event Listeners ---
document.addEventListener('keydown', function (event) {
    if (!song) return;

    if (event.code === 'Space' || event.key === ' ' || event.keyCode === 32) {
        event.preventDefault();
        togglePlayPause();
    }

    if (event.code === 'ArrowRight' || event.key === 'ArrowRight' || event.keyCode === 39) {
        event.preventDefault();
        const duration = isNaN(song.duration) ? Infinity : song.duration;
        song.currentTime = Math.min(duration, song.currentTime + 5);
        if (progress) progress.value = song.currentTime;
    }

    if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft' || event.keyCode === 37) {
        event.preventDefault();
        let time = song.currentTime || 0;
        song.currentTime = Math.max(0, time - 5);
        if (progress) progress.value = song.currentTime;
    }

    if (event.code === 'ArrowUp' || event.key === 'ArrowUp' || event.keyCode === 38) {
        event.preventDefault();
        let volBarn = document.getElementById('volume-bar');
        let volN = Math.min(1, song.volume + 0.05);
        song.volume = volN;

        if (volBarn) {
            volBarn.value = volN;
            showVolumeBarTemp(volBarn);
        }
        updateVolumeIcon(volN);
    }

    if (event.code === 'ArrowDown' || event.key === 'ArrowDown' || event.keyCode === 40) {
        event.preventDefault();
        let volBarn = document.getElementById('volume-bar');
        let volN = Math.max(0, song.volume - 0.05);
        song.volume = volN;

        if (volBarn) {
            volBarn.value = volN;
            showVolumeBarTemp(volBarn);
        }
        updateVolumeIcon(volN);
    }
});

document.addEventListener('click', function () {
    const volBar = document.getElementById('volume-bar');
    const volTooltip = document.getElementById('volume-tooltip');
    if (volBar) volBar.classList.remove('active');
    if (volTooltip) volTooltip.classList.remove('active');
});

// --- Main Initializer on Page Load ---
document.addEventListener("DOMContentLoaded", function () {
    progress = document.getElementById('progress-bar');
    song = document.getElementById('song');
    playCard = document.getElementById('paly-card');

    bindAudioEvents();

    // 1. Fetch data from LocalStorage
    const savedTrack = localStorage.getItem('activeTrack');
    let shouldAutoplay = false; 

    if (savedTrack) {
        const track = JSON.parse(savedTrack);

        const songImage = document.querySelector('.song-img');
        const songTitle = document.querySelector('.music-player h1');
        const songArtist = document.querySelector('.music-player p');

        if (songImage && track.cover) songImage.src = track.cover;
        if (songTitle && track.title) songTitle.innerText = track.title;
        if (songArtist && track.artist) songArtist.innerText = track.artist;

        if (song && track.src) {
            song.src = track.src;
            song.currentTime = track.currentTime || 0;
            if (track.volume !== undefined) {
                song.volume = track.volume;
                const volBar = document.getElementById('volume-bar');
                if (volBar) volBar.value = track.volume;
                updateVolumeIcon(track.volume);
            }
        }
        shouldAutoplay = track.isPlaying;
    }

    // 2. Setup Navigation Back Button
    const backBtn = document.getElementById("back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", function () {
            const activeTrack = {
                title: document.querySelector('.music-player h1')?.innerText || "Master the Blaster",
                artist: document.querySelector('.music-player p')?.innerText || "Anirudh Ravichander",
                cover: document.querySelector('.song-img')?.src || "https://picsum.photos/seed/pick1/300/300",
                src: song ? song.src || song.querySelector('source')?.src || "" : "",
                currentTime: song ? song.currentTime || 0 : 0,
                volume: song && song.volume !== undefined ? song.volume : 1,
                isPlaying: song ? !song.paused : false
            };
            localStorage.setItem("activeTrack", JSON.stringify(activeTrack));
            window.location.href = "../HOME/music_home.html";
        });
    }

    // 3. Play/Pause Button Listener (Binds both click and pointerdown for maximum touch/mouse compatibility)
    const ctrlBtn = document.getElementById('ctrl-btn');
    if (ctrlBtn) {
        ctrlBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePlayPause();
        });
    }

    // 4. Volume Controls Listener
    let volBtn = document.getElementById('volume-btn');
    let volBar = document.getElementById('volume-bar');

    if (volBtn && volBar) {
        volBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            volBar.classList.toggle('active');
        });

        volBar.onclick = function (e) {
            e.stopPropagation();
        };

        volBar.addEventListener('input', function () {
            if (song) song.volume = volBar.value;
            updateVolumeIcon(volBar.value);
        });
    }

    // 5. Try Autoplay if specified
    if (shouldAutoplay) {
        togglePlayPause('play');
    }
});