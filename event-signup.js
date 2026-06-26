// ==========================================
// STAGE ONE STATE (Preserved for legacy tests)
// ==========================================
let tempSignupObject = {};

// ==========================================
// STAGE TWO STATE
// ==========================================
let signupsStorage = [];
const STORAGE_KEY = "pixell_event_signups";

/**
 * PURE FUNCTION 1: Validates raw inputs
 */
function validateSignupInput(eventName, repName, repEmail, role) {
    const errors = {};
    if (!eventName || eventName.trim() === "") errors.eventName = "Event Name is required.";
    if (!repName || repName.trim() === "") errors.repName = "Representative Name is required.";
    
    if (!repEmail || repEmail.trim() === "") {
        errors.repEmail = "Email address is required.";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(repEmail.trim())) {
            errors.repEmail = "Please enter a valid email format (e.g., name@domain.com).";
        }
    }

    if (!role || role.trim() === "") errors.role = "Please select an intended role.";
    return errors;
}

/**
 * PURE FUNCTION 2: Formats valid data
 */
function formatSignupData(eventName, repName, repEmail, role) {
    return {
        eventName: eventName.trim(),
        representative: repName.trim(),
        email: repEmail.trim(),
        role: role.trim()
    };
}

/**
 * PURE FUNCTION 3 (Stage 2): Calculates role summary breakdown purely
 */
function calculateRoleBreakdown(signupsList) {
    const counts = { sponsor: 0, participant: 0, organizer: 0 };
    if (!signupsList || !Array.isArray(signupsList)) return counts;

    signupsList.forEach(item => {
        const r = item.role ? item.role.toLowerCase() : "";
        if (counts[r] !== undefined) counts[r]++;
    });
    return counts;
}

/**
 * PURE FUNCTION 4 (Stage 2): Removes an item from an array purely by index
 */
function removeSignupByIndex(signupsList, indexToRemove) {
    if (!signupsList || !Array.isArray(signupsList)) return [];
    return signupsList.filter((_, idx) => idx !== indexToRemove);
}

// ==========================================
// DOM UI HELPERS
// ==========================================

function showError(inputElement, message) {
    const container = inputElement.parentElement;
    const existingError = container.querySelector(".error-message");
    if (existingError) existingError.remove();

    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error-message";
    container.appendChild(errorDisplay);
}

function clearAllErrors() {
    document.querySelectorAll(".error-message").forEach(el => el.remove());
}

/**
 * STAGE 2 DOM: Updates the Summary Counters
 */
function renderSummaryBreakdown(signupsList) {
    const breakdown = calculateRoleBreakdown(signupsList);
    const elSponsor = document.getElementById("countSponsor");
    const elParticipant = document.getElementById("countParticipant");
    const elOrganizer = document.getElementById("countOrganizer");

    if (elSponsor) elSponsor.textContent = breakdown.sponsor;
    if (elParticipant) elParticipant.textContent = breakdown.participant;
    if (elOrganizer) elOrganizer.textContent = breakdown.organizer;
}

/**
 * STAGE 2 DOM: Renders the Signups Table
 */
function renderSignupsTable(signupsList) {
    const tbody = document.getElementById("signupTableBody");
    if (!tbody) return;

    tbody.innerHTML = ""; 

    signupsList.forEach((signup, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${signup.eventName}</td>
            <td>${signup.representative}</td>
            <td>${signup.email}</td>
            <td style="text-transform: capitalize;">${signup.role}</td>
            <td><button class="delete-btn" data-index="${index}" style="background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Delete</button></td>
        `;

        tbody.appendChild(row);
    });

    // Bind delete event listeners to the new buttons
    tbody.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const idx = parseInt(this.getAttribute("data-index"), 10);
            handleDeleteSignup(idx);
        });
    });
}

/**
 * STAGE 2 DOM ACTION: Deletes a record from storage and UI
 */
function handleDeleteSignup(index) {
    signupsStorage = removeSignupByIndex(signupsStorage, index);
    
    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(signupsStorage));
    }

    renderSignupsTable(signupsStorage);
    renderSummaryBreakdown(signupsStorage);
}

/**
 * STAGE 2 DOM ACTION: Hydrates state from browser LocalStorage
 */
function loadSignupsFromStorage() {
    if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY);
        signupsStorage = raw ? JSON.parse(raw) : [];
    } else {
        signupsStorage = [];
    }
}

// ==========================================
// MAIN FORM SUBMISSION HANDLER
// ==========================================
function handleEventSignupSubmit(event) {
    if (event) event.preventDefault();
    clearAllErrors();

    const eventNameInput = document.getElementById("eventName");
    const repNameInput = document.getElementById("repName");
    const repEmailInput = document.getElementById("repEmail");
    const roleInput = document.getElementById("role");

    const eventVal = eventNameInput ? eventNameInput.value : "";
    const nameVal = repNameInput ? repNameInput.value : "";
    const emailVal = repEmailInput ? repEmailInput.value : "";
    const roleVal = roleInput ? roleInput.value : "";

    const validationErrors = validateSignupInput(eventVal, nameVal, emailVal, roleVal);

    if (Object.keys(validationErrors).length > 0) {
        if (validationErrors.eventName && eventNameInput) showError(eventNameInput, validationErrors.eventName);
        if (validationErrors.repName && repNameInput) showError(repNameInput, validationErrors.repName);
        if (validationErrors.repEmail && repEmailInput) showError(repEmailInput, validationErrors.repEmail);
        if (validationErrors.role && roleInput) showError(roleInput, validationErrors.role);
        return false;
    }

    // 1. Populate Stage 1 Legacy Object
    tempSignupObject = formatSignupData(eventVal, nameVal, emailVal, roleVal);

    // 2. STAGE 2: Push to master array & save to browser local storage
    signupsStorage.push(tempSignupObject);

    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(signupsStorage));
    }

    // 3. Re-render UI
    renderSignupsTable(signupsStorage);
    renderSummaryBreakdown(signupsStorage);

    // 4. Clear the form fields
    const form = document.getElementById("eventSignupForm");
    if (form) form.reset();

    return true;
}

// Hook to the browser DOM
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("eventSignupForm");
        if (form) form.addEventListener("submit", handleEventSignupSubmit);

        // STAGE 2 BOOTSTRAP: Load existing data safely
        loadSignupsFromStorage();
        renderSignupsTable(signupsStorage);
        renderSummaryBreakdown(signupsStorage);
    });
}

// Node.js Jest Exports
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validateSignupInput,
        formatSignupData,
        calculateRoleBreakdown,
        removeSignupByIndex,
        handleEventSignupSubmit,
        handleDeleteSignup,
        getTempObject: () => tempSignupObject,
        resetTempObject: () => { tempSignupObject = {}; },
        getSignupsStorage: () => signupsStorage,
        setSignupsStorage: (arr) => { signupsStorage = arr; },
        STORAGE_KEY
    };
}