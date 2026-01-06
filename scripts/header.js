const dropdownTrigger = document.getElementById('dropdown-trigger');
const profileDropdown = document.getElementById('profile-dropdown');

dropdownTrigger.addEventListener('click', function (event) {
    event.stopPropagation();
    profileDropdown.classList.toggle('active');
});

document.addEventListener('click', function (event) {
    if (!profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove('active');
    }
});