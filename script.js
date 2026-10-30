
const USERS_KEY = "nova_users";
const SESSION_KEY = "nova_session";

function getUsers() {
    try {
        return JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );
    } catch {
        return [];
    }
}

function showMessage(message, type = "error") {
    const element = document.getElementById("message");

    if (element) {
        element.textContent = message;
        element.className = `message show ${type}`;
    }
}

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

// SIGNUP PAGE
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = normalizeEmail(
            document.getElementById("signupEmail").value
        );
        const password =
            document.getElementById("signupPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (name.length < 2) {
            return showMessage("Enter your full name.");
        }

        if (password.length < 6) {
            return showMessage(
                "Password must contain at least 6 characters."
            );
        }

        if (password !== confirmPassword) {
            return showMessage("Passwords do not match.");
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            return showMessage(
                "This email is already registered."
            );
        }

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

        showMessage(
            "Account created successfully! Redirecting to login...",
            "success"
        );

        signupForm.reset();

        setTimeout(() => {
            window.location.href = "index.html?created=1";
        }, 1000);
    });
}

// LOGIN PAGE
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const params = new URLSearchParams(window.location.search);

    if (params.get("created") === "1") {
        showMessage(
            "Account created. Please sign in.",
            "success"
        );
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = normalizeEmail(
            document.getElementById("loginEmail").value
        );
        const password =
            document.getElementById("loginPassword").value;

        const user = getUsers().find(
            item =>
                item.email === email &&
                item.password === password
        );

        if (!user) {
            return showMessage(
                "Incorrect email or password. Please try again."
            );
        }

        // Store only the signed-in user's display information.
        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                name: user.name,
                email: user.email
            })
        );

        window.location.href = "home.html";
    });
}

// FORGOT PASSWORD PAGE
const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = normalizeEmail(
            document.getElementById("forgotEmail").value
        );

        const user = getUsers().find(
            item => item.email === email
        );

        if (!user) {
            return showMessage(
                "No demo account found. Check the email address."
            );
        }

        showMessage(
            "Demo account found. Real password reset requires a backend.",
            "success"
        );
    });
}

// HOME PAGE
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    let session = null;

    try {
        session = JSON.parse(
            localStorage.getItem(SESSION_KEY) || "null"
        );
    } catch {
        session = null;
    }

    if (!session) {
        window.location.replace("index.html");
    } else {
        document.getElementById("userName").textContent =
            session.name;

        document.getElementById("welcomeTitle").textContent =
            `Welcome, ${session.name}!`;
    }

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "index.html";
    });
}
