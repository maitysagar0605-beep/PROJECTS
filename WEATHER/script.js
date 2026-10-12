const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const statusText = document.querySelector("#statusText");
const weatherImage = document.querySelector("#weatherImage");
const temperature = document.querySelector("#temperature");
const cityName = document.querySelector("#cityName");
const updatedTime = document.querySelector("#updatedTime");
const windSpeed = document.querySelector("#windSpeed");
const humidity = document.querySelector("#humidity");
const conditionLabel = document.querySelector("#conditionLabel");

const imageMap = {
    clear: "assets/images/CLEAR.jpg",
    drizzle: "assets/images/DRIZZEL.jpg",
    mist: "assets/images/MIST.jpg",
    snow: "assets/images/SNOW.jpg",
    thunder: "assets/images/THUDER STROM.jpg"
};

const weatherCodes = {
    0: ["Clear sky", "clear"],
    1: ["Mainly clear", "clear"],
    2: ["Partly cloudy", "mist"],
    3: ["Overcast", "mist"],
    45: ["Fog", "mist"],
    48: ["Depositing rime fog", "mist"],
    51: ["Light drizzle", "drizzle"],
    53: ["Drizzle", "drizzle"],
    55: ["Heavy drizzle", "drizzle"],
    56: ["Freezing drizzle", "drizzle"],
    57: ["Heavy freezing drizzle", "drizzle"],
    61: ["Light rain", "drizzle"],
    63: ["Rain", "drizzle"],
    65: ["Heavy rain", "drizzle"],
    66: ["Freezing rain", "drizzle"],
    67: ["Heavy freezing rain", "drizzle"],
    71: ["Light snow", "snow"],
    73: ["Snow", "snow"],
    75: ["Heavy snow", "snow"],
    77: ["Snow grains", "snow"],
    80: ["Light rain showers", "drizzle"],
    81: ["Rain showers", "drizzle"],
    82: ["Violent rain showers", "drizzle"],
    85: ["Light snow showers", "snow"],
    86: ["Snow showers", "snow"],
    95: ["Thunderstorm", "thunder"],
    96: ["Thunderstorm with hail", "thunder"],
    99: ["Thunderstorm with heavy hail", "thunder"]
};

const fallbackLocation = {
    latitude: 52.52,
    longitude: 13.41,
    label: "Berlin"
};

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        setStatus("Type a city name to search.");
        return;
    }

    await searchCity(city);
});

async function searchCity(city) {
    try {
        setLoading(`Searching weather for ${city}...`);
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City search failed");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            setStatus(`No weather location found for "${city}".`);
            return;
        }

        const place = data.results[0];
        const label = [place.name, place.admin1, place.country].filter(Boolean).join(", ");

        await getWeather({
            latitude: place.latitude,
            longitude: place.longitude,
            label
        });
    } catch (error) {
        setStatus("Could not search that city right now. Check your internet and try again.");
    }
}

function loadCurrentLocation() {
    if (!navigator.geolocation) {
        getWeather(fallbackLocation);
        setStatus("Location is unavailable, showing Berlin by default.");
        return;
    }

    setLoading("Finding your current location...");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            getWeather({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                label: "Your location"
            });
        },
        () => {
            getWeather(fallbackLocation);
            setStatus("Location permission was not allowed, showing Berlin by default.");
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

async function getWeather(location) {
    try {
        setLoading(`Loading live weather for ${location.label}...`);
        const params = new URLSearchParams({
            latitude: location.latitude,
            longitude: location.longitude,
            current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
            hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",
            timezone: "auto"
        });
        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather request failed");
        }

        const data = await response.json();
        renderWeather(data, location.label);
    } catch (error) {
        setStatus("Could not load live weather. Please try another city.");
    }
}

function renderWeather(data, label) {
    const current = data.current;
    const unit = data.current_units || {};
    const codeInfo = weatherCodes[current.weather_code] || ["Misty weather", "mist"];
    const imageKey = codeInfo[1];

    temperature.textContent = `${Math.round(current.temperature_2m)}${unit.temperature_2m || "°C"}`;
    windSpeed.textContent = `${Math.round(current.wind_speed_10m)} ${unit.wind_speed_10m || "km/h"}`;
    humidity.textContent = `${current.relative_humidity_2m}${unit.relative_humidity_2m || "%"}`;
    cityName.textContent = label;
    conditionLabel.textContent = codeInfo[0];
    weatherImage.src = imageMap[imageKey];
    weatherImage.alt = codeInfo[0];
    updatedTime.textContent = `Updated ${formatWeatherTime(current.time)}`;
    setStatus("Live data from Open-Meteo");
}

function formatWeatherTime(value) {
    if (!value) {
        return "just now";
    }

    const date = new Date(value);

    return date.toLocaleString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function setLoading(message) {
    statusText.textContent = message;
    searchForm.classList.add("is-loading");
}

function setStatus(message) {
    statusText.textContent = message;
    searchForm.classList.remove("is-loading");
}

loadCurrentLocation();
