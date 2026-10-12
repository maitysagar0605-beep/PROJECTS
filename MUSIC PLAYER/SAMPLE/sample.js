let progress = document.getElementById('progress-bar');
let song = document.getElementById('song');
let ctrlIcon = document.getElementById('ctrl-icon');
let playCard = document.getElementById('paly-card');

let audioCtx;
let analyser;
let source;
let dataArray;
let animationId;

const playList = [
    {title: "Peace", src: "../assests/Peace.mp3" },
    {title: "Beats", src: "../assests/Beats.mp3" },
    {title: "Playhouse", src: "../assests/Playhouse.mp3" },
    {title: "Motivation", src: "../assests/Motivation.mp3" }
];

let currentIndex = 0;


function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;

        source = audioCtx.createMediaElementSource(song);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
}
function changeSong(newIndex){
   currentIndex = newIndex;

   song.src = playList[currentIndex].src;
   song.load();

   let titleElement = document.querySelector('.music-player h1');
   if(titleElement){
    titleElement.innerText = playList[currentIndex].title;
   }
   progress.value = 0;
    document.getElementById('current-time').innerText = "00:00";

    // 4. Play new song while preserving Web Audio API context & glow
    initAudioContext();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    song.play().then(() => {
        document.getElementById('ctrl-btn').innerHTML = '<i class="fa-solid fa-pause" id="ctrl-icon"></i>';
        renderGlow();
    }).catch(err => console.log('Playback error:', err));
}


/* --- LIGHT GRAY GLOW EFFECT --- */
function renderGlow() {
    if (!song.paused && analyser) {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        let bassBins = 8;
        for (let i = 0; i < bassBins; i++) {
            sum += dataArray[i];
        }
        let avgBass = sum / bassBins;

        let glowsize = Math.max(0, (avgBass / 255) * 30);
        let opacity = Math.max(0, (avgBass / 255) * 0.9 + 0.1);

        // Light gray glow color (RGB: 220, 220, 220)
        playCard.style.setProperty('--glow-color', `rgba(220, 220, 220, ${opacity})`);
        playCard.style.setProperty('--glow-size', `${glowsize}px`);

        animationId = requestAnimationFrame(renderGlow);
    } else {
        stopGlow();
    }
}

function stopGlow() {
    cancelAnimationFrame(animationId);
    playCard.style.setProperty('--glow-size', '0px');
    playCard.style.setProperty('--glow-color', 'rgba(220, 220, 220, 0)');
}

function formateTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity || !seconds) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;

    return `${mins}:${secs}`;
}

/* --- DURATION FIXES --- */
function updateDuration() {
    if (song.duration && !isNaN(song.duration) && song.duration !== Infinity) {
        progress.max = song.duration;
        document.getElementById('total-time').innerText = formateTime(song.duration);
    }
}

// Triggered when metadata has loaded
song.addEventListener('loadedmetadata', function () {
    progress.max = song.duration;
    progress.value = song.currentTime;
    document.getElementById('current-time').innerText = formateTime(song.currentTime);
    updateDuration();
});

// Fallback: If metadata was already cached/loaded prior to script execution
if (song.readyState >= 1) {
    updateDuration();
}

async function togglePlayPause() {
    initAudioContext();
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
    const ctrlBtn = document.getElementById('ctrl-btn');
    if (song.paused) {
        try {
            await song.play();
            updateDuration(); // Secondary fallback for audio duration
            ctrlBtn.innerHTML = '<i class="fa-solid fa-pause" id="ctrl-icon"></i>';
            renderGlow();
        } catch (err) {
            console.log('Playback interrupted or blocked:', err);
        }
    } else {
        song.pause();
        ctrlBtn.innerHTML = '<i class="fa-solid fa-play" id="ctrl-icon"></i>';
        stopGlow();
    }
}

song.ontimeupdate = function () {
    progress.value = song.currentTime;
    document.getElementById('current-time').innerText = formateTime(song.currentTime);
    updateDuration(); // Continually check duration as FLAC buffers
};

progress.onchange = function () {
    song.currentTime = progress.value;
    document.getElementById('current-time').innerText = formateTime(song.currentTime);

    initAudioContext();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (song.paused) {
        song.play();
        document.getElementById('ctrl-btn').innerHTML = '<i class="fa-solid fa-pause" id="ctrl-icon"></i>';
        renderGlow();
    }
};

song.onended = function () {
 let index = (currentIndex + 1) % playList.length;
 changeSong(index);
};

/* --- KEYBOARD CONTROLS --- */
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' || event.key === ' ' || event.keyCode === 32) {
        event.preventDefault();
        togglePlayPause();
    }

    if (event.code === 'ArrowRight' || event.key === 'ArrowRight' || event.keyCode === 39) {
        event.preventDefault();
        const duration = isNaN(song.duration) ? Infinity : song.duration;
        song.currentTime = Math.min(duration, song.currentTime + 5);
        progress.value = song.currentTime;
    }

    if (event.code === 'ArrowLeft' || event.key === 'ArrowLeft' || event.keyCode === 37) {
        event.preventDefault();
        let time = song.currentTime || 0;
        song.currentTime = Math.max(0, time - 5);
        progress.value = song.currentTime;
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

/* --- VOLUME CONTROLS --- */
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

document.addEventListener('DOMContentLoaded', function () {
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
            song.volume = volBar.value;
            updateVolumeIcon(volBar.value);
        });
    }
});

function updateVolumeIcon(val) {
    let volTooltip = document.getElementById('volume-tooltip');
    if (volTooltip) {
        volTooltip.innerText = Math.round(val * 100) + '%';
    }

    if (parseFloat(val) === 0) {
        document.getElementById('volume-icon').innerHTML = '<i class="fa-solid fa-volume-xmark" id="volume-icon"></i>';
    } else if (parseFloat(val) < 0.5) {
        document.getElementById('volume-icon').innerHTML = '<i class="fa-solid fa-volume-low" id="volume-icon"></i>';
    } else {
        document.getElementById('volume-icon').innerHTML = '<i class="fa-solid fa-volume-high" id="volume-icon"></i>';
    }
}

document.addEventListener('click', function () {
    const volBar = document.getElementById('volume-bar');
    const volTooltip = document.getElementById('volume-tooltip');
    if (volBar) {
        volBar.classList.remove('active');
    }

    if (volTooltip) {
        volTooltip.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', function () {
 let backBtn = document.getElementById('back-btn');

    if (backBtn) {
        backBtn.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Check if there is history in the current tab session
            if (window.history.length > 1 && document.referrer !== "") {
                window.history.back();
            } else {
                // Fallback destination if opened in a fresh tab directly
                window.location.href = '../HOME/music_home.html';
            }
        });
    }

    
    let backWardBtn = document.getElementById('backward-btn');
    if(backWardBtn){
        backWardBtn.addEventListener('click', function(){
            let nextIndex = (currentIndex -1 + playList.length) % playList.length;
            changeSong(nextIndex);
        })
    }

    let forwardBtn = document.getElementById('forward-btn');
    if (forwardBtn) {
        forwardBtn.addEventListener('click', function () {
            let nextIndex = (currentIndex + 1) % playList.length;
            changeSong(nextIndex);
        });
    }
});