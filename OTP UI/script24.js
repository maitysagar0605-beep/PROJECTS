const inputs = document.querySelectorAll(".otp-input");
const container = document.querySelector(".otp-container");
const resendBtn = document.getElementById("resend-btn");
const continueBtn = document.getElementById("continue-btn");
const feedback = document.getElementById("feedback-ui");

inputs.forEach((input, i) => {
  input.addEventListener("input", (e) => {
    // Prevent typing anything other than a number
    if (!/^\d$/.test(e.target.value)) {
      e.target.value = "";
      return;
    }

    // Focus next input when a number is typed
    if (e.target.value && i < inputs.length - 1) inputs[i + 1].focus();

    // Show feedback once all OTP inputs are filled
    if ([...inputs].every((inp) => inp.value)) {
      setTimeout(() => {
        container.style.display = "none";
        resendBtn.style.display = "none";
        feedback.classList.remove("hidden");
      }, 400);
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && i > 0) {
      inputs[i - 1].focus();
    }
  });
});

// Redirect to target page when clicking Continue
continueBtn.addEventListener("click", () => {
  window.location.href = "index24_A.html"; // Replace with your target HTML file name or path
});

inputs[0].focus();