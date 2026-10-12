let toastBox = document.getElementById('toastBox');

let successMsg = '<i class="fa-solid fa-circle-check"></i> Successfully Submitted!!';
let errorMsg = '<i class="fa-solid fa-circle-xmark"></i> Please fix the error!';
let invalidMsg = '<i class="fa-solid fa-circle-exclamation"></i> Invalid input, check again';

function showToast(msg) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = msg;
    toastBox.appendChild(toast);

    // Apply specific classes for proper icon colors
    if (msg.includes('fa-circle-xmark')) {
        toast.classList.add('error');
    }
    if (msg.includes('fa-circle-exclamation')) {
        toast.classList.add('invalid');
    }

    // Automatically remove toast after 4 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}