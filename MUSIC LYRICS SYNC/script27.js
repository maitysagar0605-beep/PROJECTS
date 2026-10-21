const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const queueList = document.querySelector("#queue-list");
const queueCount = document.querySelector("#queue-count");
const queueMessage = document.querySelector("#queue-message");
const trackTitle = document.querySelector("#track-title");
const trackArtist = document.querySelector("#track-artist");
const trackNumber = document.querySelector("#track-number");
const artwork = document.querySelector("#artwork");
const artworkPlaceholder = document.querySelector("#artwork-placeholder");
const previewLabel = document.querySelector("#preview-label");
const audio = document.querySelector("#audio-player");
const playButton = document.querySelector("#play-button");
const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const favoriteButton = document.querySelector("#favorite-button");
const fullTrackButton = document.querySelector("#full-track-button");
const fullTrackInput = document.querySelector("#full-track-input");
const progress = document.querySelector("#progress");
const currentTimeLabel = document.querySelector("#current-time");
const durationLabel = document.querySelector("#duration");
const volume = document.querySelector("#volume");
const playerStatus = document.querySelector("#player-status");
const syncStatus = document.querySelector("#sync-status");
const lyricsEmpty = document.querySelector("#lyrics-empty");
const lyricsList = document.querySelector("#lyrics-list");
const lyricsViewport = document.querySelector("#lyrics-viewport");
const lyricsCredit = document.querySelector("#lyrics-credit");

let queue = [];
let currentIndex = -1;
let lyricLines = [];
let activeLyricIndex = -1;
let loadToken = 0;
let searchToken = 0;
let lyricFrame = 0;
let localTrackUrl = null;
const favorites = new Set();

function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const minutes = Math.floor(seconds / 60);
	const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
	return `${minutes}:${remainder}`;
}

function setRangeFill(input) {
	const minimum = Number(input.min) || 0;
	const maximum = Number(input.max) || 1;
	const value = Number(input.value) || 0;
	const percentage = ((value - minimum) / (maximum - minimum)) * 100;
	input.style.setProperty("--range-progress", `${percentage}%`);
}

function setPlayerStatus(message) {
	playerStatus.textContent = message;
}

function artworkUrl(track, size = 600) {
	return (track.artworkUrl100 || "").replace(/100x100bb\.(jpg|png)/i, `${size}x${size}bb.$1`);
}

function renderQueue() {
	queueList.replaceChildren();
	queueCount.textContent = String(queue.length);
	queueMessage.hidden = queue.length > 0;
	queue.forEach((track, index) => {
		const item = document.createElement("li");
		item.className = `queue-item${index === currentIndex ? " is-current" : ""}`;
		item.tabIndex = 0;
		item.setAttribute("role", "button");
		item.setAttribute("aria-label", `Play ${track.trackName} by ${track.artistName}`);

		const number = document.createElement("span");
		number.className = "queue-index";
		number.textContent = String(index + 1).padStart(2, "0");

		const image = document.createElement("img");
		image.className = "queue-art";
		image.src = artworkUrl(track, 100);
		image.alt = "";
		image.loading = "lazy";

		const copy = document.createElement("span");
		copy.className = "queue-track";
		const title = document.createElement("span");
		title.className = "queue-title";
		title.textContent = track.trackName;
		const artist = document.createElement("span");
		artist.className = "queue-artist";
		artist.textContent = track.artistName;
		copy.append(title, artist);
		item.append(number, image, copy);
		item.addEventListener("click", () => playTrack(index));
		item.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				playTrack(index);
			}
		});
		queueList.append(item);
	});
}

function setSyncStatus(label, synced = false) {
	syncStatus.lastChild.textContent = ` ${label}`;
	syncStatus.classList.toggle("is-synced", synced);
}

function renderLyrics(lines, message) {
	lyricLines = lines;
	activeLyricIndex = -1;
	lyricsList.replaceChildren();
	if (lines.length === 0) {
		lyricsList.hidden = true;
		lyricsEmpty.hidden = false;
		lyricsEmpty.querySelector("p").textContent = message;
		return;
	}

	lyricsEmpty.hidden = true;
	lyricsList.hidden = false;
	lines.forEach((line, index) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "lyric-line";
		button.textContent = line.text || "...";
		button.setAttribute("aria-label", `Seek to ${formatTime(line.time)}`);
		button.addEventListener("click", () => {
			if (Number.isFinite(line.time)) audio.currentTime = line.time;
		});
		lyricsList.append(button);
		line.element = button;
	});
}

function parseLrc(lrc) {
	const lines = [];
	const timestampPattern = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
	lrc.split(/\r?\n/).forEach((row) => {
		const timestamps = [...row.matchAll(timestampPattern)];
		const text = row.replace(timestampPattern, "").trim();
		timestamps.forEach((match) => {
			const fraction = match[3] ? Number(`0.${match[3]}`) : 0;
			const time = Number(match[1]) * 60 + Number(match[2]) + fraction;
			lines.push({ time, text });
		});
	});
	return lines.sort((first, second) => first.time - second.time);
}

function updateActiveLyric() {
	if (lyricLines.length === 0) return;
	let nextIndex = -1;
	for (let index = 0; index < lyricLines.length; index += 1) {
		if (lyricLines[index].time <= audio.currentTime) nextIndex = index;
		else break;
	}
	if (nextIndex === activeLyricIndex) return;
	if (activeLyricIndex >= 0) lyricLines[activeLyricIndex].element.classList.remove("is-active");
	activeLyricIndex = nextIndex;
	if (activeLyricIndex < 0) {
		lyricsList.style.transform = "";
		return;
	}

	const activeLine = lyricLines[activeLyricIndex].element;
	activeLine.classList.add("is-active");
	const lineCenter = activeLine.offsetTop + activeLine.offsetHeight / 2;
	lyricsList.style.transform = `translateY(-${lineCenter}px)`;
}

function syncLyricsFrame() {
	updateActiveLyric();
	if (!audio.paused && !audio.ended) lyricFrame = requestAnimationFrame(syncLyricsFrame);
	else lyricFrame = 0;
}

function releaseLocalTrack() {
	if (!localTrackUrl) return;
	URL.revokeObjectURL(localTrackUrl);
	localTrackUrl = null;
}

async function loadLyrics(track, token) {
	renderLyrics([], "Finding the words for this track...");
	lyricsCredit.textContent = "LYRICS BY LRCLIB";
	setSyncStatus("LOADING");
	const parameters = new URLSearchParams({
		artist_name: track.artistName,
		track_name: track.trackName,
		duration: String(Math.round((track.trackTimeMillis || 0) / 1000))
	});

	try {
		const response = await fetch(`https://lrclib.net/api/get?${parameters}`);
		if (token !== loadToken) return;
		let data = response.ok ? await response.json() : null;
		if (!data?.syncedLyrics && !data?.plainLyrics) {
			const searchParameters = new URLSearchParams({ track_name: track.trackName, artist_name: track.artistName });
			const searchResponse = await fetch(`https://lrclib.net/api/search?${searchParameters}`);
			if (token !== loadToken) return;
			if (searchResponse.ok) {
				const matches = await searchResponse.json();
				data = matches.find((match) => match.syncedLyrics) || matches.find((match) => match.plainLyrics) || null;
			}
		}
		if (!data) throw new Error("Lyrics not found");

		if (data.syncedLyrics) {
			const lines = parseLrc(data.syncedLyrics);
			renderLyrics(lines, "Timed lyrics are not available for this track.");
			setSyncStatus(lines.length ? "IN SYNC" : "NO TIMESTAMPS", lines.length > 0);
			updateActiveLyric();
			return;
		}
		if (data.plainLyrics) {
			const plainLines = data.plainLyrics.split(/\r?\n/).filter(Boolean).map((text) => ({ time: Infinity, text }));
			renderLyrics(plainLines, "Timed lyrics are not available for this track.");
			setSyncStatus("UNSYNCED");
			lyricsCredit.textContent = "LYRICS BY LRCLIB · UNSYNCED";
			updateActiveLyric();
			return;
		}
		throw new Error("Lyrics not found");
	} catch (error) {
		if (token !== loadToken) return;
		renderLyrics([], "Timed lyrics aren't available for this track yet.");
		setSyncStatus("NOT FOUND");
	}
}

async function playTrack(index, autoplay = true) {
	if (index < 0 || index >= queue.length) return;
	currentIndex = index;
	const track = queue[index];
	const token = ++loadToken;
	renderQueue();
	trackTitle.textContent = track.trackName;
	trackArtist.textContent = track.artistName;
	trackNumber.textContent = `${String(index + 1).padStart(2, "0")} / ${String(queue.length).padStart(2, "0")}`;
	artwork.src = artworkUrl(track, 600);
	artwork.alt = `Album artwork for ${track.collectionName || track.trackName}`;
	artwork.hidden = false;
	artworkPlaceholder.hidden = true;
	previewLabel.textContent = "30-SECOND PREVIEW";
	if (localTrackUrl) {
		audio.pause();
		audio.removeAttribute("src");
		audio.load();
		releaseLocalTrack();
	}
	audio.src = track.previewUrl;
	audio.load();
	progress.disabled = false;
	playButton.disabled = false;
	previousButton.disabled = false;
	nextButton.disabled = false;
	favoriteButton.disabled = false;
	fullTrackButton.disabled = false;
	progress.value = "0";
	currentTimeLabel.textContent = "0:00";
	durationLabel.textContent = "0:30";
	setRangeFill(progress);
	updateFavoriteButton();
	setPlayerStatus("Loading your preview...");
	loadLyrics(track, token);

	if (autoplay) {
		try {
			await audio.play();
			setPlayerStatus("Playing a 30-second preview.");
		} catch (error) {
			if (token === loadToken) setPlayerStatus("Press play to start this preview.");
		}
	} else {
		setPlayerStatus("Preview ready. Press play when you are.");
	}
}

function updateFavoriteButton() {
	const track = queue[currentIndex];
	if (!track) return;
	const isFavorite = favorites.has(track.trackId);
	favoriteButton.classList.toggle("is-favorite", isFavorite);
	favoriteButton.setAttribute("aria-label", isFavorite ? "Remove from saved songs" : "Save this song");
	favoriteButton.title = isFavorite ? "Remove from saved songs" : "Save this song";
}

async function searchSongs(term) {
	const requestToken = ++searchToken;
	++loadToken;
	audio.pause();
	audio.removeAttribute("src");
	audio.load();
	releaseLocalTrack();
	progress.disabled = true;
	playButton.disabled = true;
	previousButton.disabled = true;
	nextButton.disabled = true;
	favoriteButton.disabled = true;
	fullTrackButton.disabled = true;
	trackTitle.textContent = "Searching the catalog...";
	trackArtist.textContent = "Your next song is just a moment away";
	trackNumber.textContent = "-- / --";
	artwork.hidden = true;
	artworkPlaceholder.hidden = false;
	renderLyrics([], "Choose a track to see its lyrics.");
	setSyncStatus("WAITING");
	queueMessage.textContent = "Searching the music catalog...";
	queueMessage.hidden = false;
	queueList.replaceChildren();
	queue = [];
	currentIndex = -1;
	renderQueue();
	setPlayerStatus("Searching songs...");

	try {
		const parameters = new URLSearchParams({ term, entity: "song", media: "music", limit: "15" });
		const response = await fetch(`https://itunes.apple.com/search?${parameters}`);
		if (!response.ok) throw new Error("Music search is unavailable");
		const data = await response.json();
		if (requestToken !== searchToken) return;
		queue = data.results.filter((track) => track.previewUrl && track.trackName && track.artistName);
		if (queue.length === 0) {
			queueMessage.textContent = "No playable previews found. Try another artist or song.";
			setPlayerStatus("No previews found. Try a different search.");
		} else {
			queueMessage.textContent = "Search for an artist, song, or mood. Your results will land here.";
			setPlayerStatus(`${queue.length} previews ready. Choose a song to listen.`);
		}
		renderQueue();
		if (queue.length > 0) await playTrack(0, false);
	} catch (error) {
		if (requestToken !== searchToken) return;
		queue = [];
		currentIndex = -1;
		renderQueue();
		queueMessage.textContent = "Couldn't reach the music catalog. Check your connection and try again.";
		setPlayerStatus("Music search failed. Please try again.");
	}
}

searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const term = searchInput.value.trim();
	if (term) searchSongs(term);
});

playButton.addEventListener("click", async () => {
	if (!audio.src) return;
	if (audio.paused) {
		try {
			await audio.play();
			setPlayerStatus("Playing a 30-second preview.");
		} catch (error) {
			setPlayerStatus("Playback couldn't start. Choose another preview and try again.");
		}
	} else {
		audio.pause();
	}
});

fullTrackButton.addEventListener("click", () => fullTrackInput.click());

fullTrackInput.addEventListener("change", async () => {
	const file = fullTrackInput.files[0];
	if (!file) return;
	if (!file.type.startsWith("audio/")) {
		setPlayerStatus("Choose a supported audio file.");
		fullTrackInput.value = "";
		return;
	}

	audio.pause();
	releaseLocalTrack();
	localTrackUrl = URL.createObjectURL(file);
	audio.src = localTrackUrl;
	audio.load();
	previewLabel.textContent = "FULL TRACK · LOCAL FILE";
	setPlayerStatus("Full track loaded. Lyrics follow the selected song.");
	try {
		await audio.play();
	} catch (error) {
		setPlayerStatus("Full track loaded. Press play to start.");
	}
	fullTrackInput.value = "";
});

previousButton.addEventListener("click", () => {
	if (currentIndex > 0) playTrack(currentIndex - 1);
	else if (queue.length > 0) playTrack(queue.length - 1);
});

nextButton.addEventListener("click", () => {
	if (queue.length > 0) playTrack((currentIndex + 1) % queue.length);
});

favoriteButton.addEventListener("click", () => {
	const track = queue[currentIndex];
	if (!track) return;
	if (favorites.has(track.trackId)) favorites.delete(track.trackId);
	else favorites.add(track.trackId);
	updateFavoriteButton();
});

audio.addEventListener("play", () => {
	playButton.classList.add("is-playing");
	playButton.setAttribute("aria-label", "Pause");
	playButton.title = "Pause";
	lyricsViewport.classList.add("is-playing");
	updateActiveLyric();
	if (!lyricFrame) lyricFrame = requestAnimationFrame(syncLyricsFrame);
});

audio.addEventListener("pause", () => {
	playButton.classList.remove("is-playing");
	playButton.setAttribute("aria-label", "Play");
	playButton.title = "Play";
	lyricsViewport.classList.remove("is-playing");
	if (lyricFrame) cancelAnimationFrame(lyricFrame);
	lyricFrame = 0;
});

audio.addEventListener("timeupdate", () => {
	const duration = Number.isFinite(audio.duration) ? audio.duration : 30;
	progress.max = String(duration);
	progress.value = String(audio.currentTime);
	currentTimeLabel.textContent = formatTime(audio.currentTime);
	durationLabel.textContent = formatTime(duration);
	setRangeFill(progress);
	updateActiveLyric();
});

audio.addEventListener("loadedmetadata", () => {
	const duration = Number.isFinite(audio.duration) ? audio.duration : 30;
	progress.max = String(duration);
	durationLabel.textContent = formatTime(duration);
});

audio.addEventListener("ended", () => {
	if (queue.length > 1) playTrack((currentIndex + 1) % queue.length);
	else setPlayerStatus("Preview ended. Play it again or search for another song.");
});

audio.addEventListener("error", () => {
	if (audio.src) setPlayerStatus("This preview is unavailable. Try another song.");
});

progress.addEventListener("input", () => {
	audio.currentTime = Number(progress.value);
	currentTimeLabel.textContent = formatTime(audio.currentTime);
	setRangeFill(progress);
	updateActiveLyric();
});

volume.addEventListener("input", () => {
	audio.volume = Number(volume.value);
	setRangeFill(volume);
});

audio.volume = Number(volume.value);
setRangeFill(progress);
setRangeFill(volume);
