// 1. Temporary Data Object required by Stage One Rubric
let tempSignupObject = {};

/**
 * PURE FUNCTION 1: Validates raw inputs. 
 * Returns an object containing { inputId: "Error message" } for any failing fields.
 */
function validateSignupInput(eventName, repName, repEmail, role) {
    const errors = {};

    // Validate completeness (No empty fields)
    if (!eventName || eventName.trim() === "") {
        errors.eventName = "Event Name is required.";
    }

    if (!repName || repName.trim() === "") {
        errors.repName = "Representative Name is required.";
    }

    if (!repEmail || repEmail.trim() === "") {
        errors.repEmail = "Email address is required.";
    } else {
        // Validate correctness: standard basic Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(repEmail.trim())) {
            errors.repEmail = "Please enter a valid email format (e.g., name@domain.com).";
        }
    }

    if (!role || role.trim() === "") {
        errors.role = "Please select an intended role.";
    }

    return errors;
}

/**
 * PURE FUNCTION 2: Formats valid data into the final object structure
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
 * DOM HELPER: Injects error spans matching Harmandeep's CSS layout
 */
function showError(inputElement, message) {
    const container = inputElement.parentElement;

    // Scrub any existing error message from this specific div
    const existingError = container.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }

    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error-message";

    container.appendChild(errorDisplay);
}

function clearAllErrors() {
    document.querySelectorAll(".error-message").forEach(el => el.remove());
}

/**
 * MAIN FORM SUBMISSION HANDLER (Triggered by DOM)
 */
function handleEventSignupSubmit(event) {
    if (event) event.preventDefault();

    clearAllErrors();

    // Grab raw DOM nodes
    const eventNameInput = document.getElementById("eventName");
    const repNameInput = document.getElementById("repName");
    const repEmailInput = document.getElementById("repEmail");
    const roleInput = document.getElementById("role");

    // Extract values safely
    const eventVal = eventNameInput ? eventNameInput.value : "";
    const nameVal = repNameInput ? repNameInput.value : "";
    const emailVal = repEmailInput ? repEmailInput.value : "";
    const roleVal = roleInput ? roleInput.value : "";

    // Run pure validation
    const validationErrors = validateSignupInput(eventVal, nameVal, emailVal, roleVal);

    // If the error object has any keys, validation failed
    if (Object.keys(validationErrors).length > 0) {
        if (validationErrors.eventName && eventNameInput) showError(eventNameInput, validationErrors.eventName);
        if (validationErrors.repName && repNameInput) showError(repNameInput, validationErrors.repName);
        if (validationErrors.repEmail && repEmailInput) showError(repEmailInput, validationErrors.repEmail);
        if (validationErrors.role && roleInput) showError(roleInput, validationErrors.role);
        
        return false;
    }

    // Passed validation! Populate the temporary data object
    tempSignupObject = formatSignupData(eventVal, nameVal, emailVal, roleVal);
    
    return true;
}

// Hook to the browser DOM once loaded
if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("eventSignupForm");
        if (form) {
            form.addEventListener("submit", handleEventSignupSubmit);
        }
    });
}

// Exported specifically for Node.js / Jest testing environment
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validateSignupInput,
        formatSignupData,
        handleEventSignupSubmit,
        getTempObject: () => tempSignupObject,
        resetTempObject: () => { tempSignupObject = {}; }
    };
}