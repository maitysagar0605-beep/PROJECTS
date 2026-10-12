// DOM Elements
const stars = document.querySelectorAll(".star");
const ratingText = document.querySelector(".rating-text");
const submitBtn = document.querySelector(".submit-btn");
const thankyou = document.querySelector(".thank-you");

let currentRating = 0;

const ratingMsgs = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
};

stars.forEach((star) => {
    star.addEventListener("mouseenter", () => {
        const value = parseInt(star.dataset.value);
        highlightStars(value, "hover");
        ratingText.textContent = ratingMsgs[value];
    });

    star.addEventListener("mouseleave", () => {
        highlightStars(currentRating, "active");
        updateRatingText();
    });

    star.addEventListener("click", () => {
        currentRating = parseInt(star.dataset.value);
        highlightStars(currentRating, "active");
        updateRatingText();
        submitBtn.disabled = false;
    });
});

function highlightStars(count, className) {
    stars.forEach((star) => {
        star.classList.remove("hover", "active");
        if (parseInt(star.dataset.value) <= count) {
            star.classList.add(className);
        }
    });
}

function updateRatingText() {
    if (currentRating > 0) {
        ratingText.textContent = `You Rated: ${ratingMsgs[currentRating]}`;
        ratingText.classList.add("selected");
    } else {
        ratingText.textContent = "Click To Rate";
        ratingText.classList.remove("selected");
    }
}

submitBtn.addEventListener("click", () => {
    if (currentRating === 0) return;

    thankyou.classList.remove("hidden");

    // Reset after 3 seconds
    setTimeout(() => {
        thankyou.classList.add("hidden");
        currentRating = 0;
        highlightStars(0, "active");
        updateRatingText();
        submitBtn.disabled = true;
    }, 3000);
});