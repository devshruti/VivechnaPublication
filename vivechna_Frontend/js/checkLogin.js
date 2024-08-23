const UserCreds = JSON.parse(localStorage.getItem("user-creds"));
const UserInfo = JSON.parse(localStorage.getItem("user-info"));

const LogoutBtn = document.getElementById("logoutButton")
const LoginNavItem = document.getElementById("loginNavItem");
const LogoutNavItem = document.getElementById("logoutNavItem");

const Logout = () => {
    localStorage.removeItem("user-creds");
    localStorage.removeItem("user-info");
    window.location.href = "login.html";
}

const CheckCred = () => {
    if (!localStorage.getItem("user-creds")) {
        // User is not logged in
        console.log(localStorage.getItem("user-creds"))
        LoginNavItem.style.display = 'block'; // Show the "Login" link
        LogoutNavItem.style.display = 'none'; // Hide the "Logout" button
    } else {
        // User is logged in
        LoginNavItem.style.display = 'none'; // Hide the "Login" link
        LogoutNavItem.style.display = 'block'; // Show the "Logout" button
    }
}

LogoutBtn.addEventListener('click', Logout);
CheckCred();