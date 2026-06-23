const fs = require("fs");
const path = require("path");
const { validateSignupInput, handleEventSignupSubmit } = require("./event-signup");

const html = fs.readFileSync(path.resolve(__dirname, "event-signup.html"), "utf-8");

describe("Event Signup Component - Stage One Rubric Tests", () => {
    beforeEach(() => {
        // Reset the fake Jest DOM before every single test
        document.documentElement.innerHTML = html.toString();
    });

    test("Integration 1: Submitting invalid email triggers DOM error message", () => {
        document.getElementById("eventName").value = "Charity Gala";
        document.getElementById("repName").value = "Nishant";
        document.getElementById("repEmail").value = "plain-text-not-an-email"; 
        document.getElementById("role").value = "sponsor";

        // Manually fire the submit handler, passing a dummy event to satisfy preventDefault()
        handleEventSignupSubmit({ preventDefault: () => {} });

        const errorSpans = document.querySelectorAll(".error-message");
        expect(errorSpans.length).toBe(1);
        expect(errorSpans[0].innerText).toContain("valid email format");
    });

    test("Integration 2: Submitting valid form clears all errors", () => {
        document.getElementById("eventName").value = "Charity Gala";
        document.getElementById("repName").value = "Nishant";
        document.getElementById("repEmail").value = "nishantm@rrc.ca";
        document.getElementById("role").value = "sponsor";

        handleEventSignupSubmit({ preventDefault: () => {} });

        const errorSpans = document.querySelectorAll(".error-message");
        expect(errorSpans.length).toBe(0);
    });

    test("Unit 1: PURE FUNCTION validateSignupInput correctly catches 4 empty fields", () => {
        const resultObject = validateSignupInput("", "", "", "");
        expect(resultObject).toHaveProperty("eventName");
        expect(resultObject).toHaveProperty("repName");
        expect(resultObject).toHaveProperty("repEmail");
        expect(resultObject).toHaveProperty("role");
    });
});