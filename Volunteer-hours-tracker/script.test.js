const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
    path.resolve(__dirname, "index.html"),
    "utf-8"
);

const { handleSubmit } = require("./script");

beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
});


/** INTEGRATION TESTS */

describe("Volunteer Form Tests", () => {

    test("valid form", () => {
        document.getElementById("charityName").value = "Foodgrain Bank";
        document.getElementById("hours").value = "7";
        document.getElementById("date").value = "2026-06-22";
        document.getElementById("rating").value = "5";


        handleSubmit(new Event("submit"));
        expect(document.querySelectorAll(".error-message").length).toBe(0);
    });

    test("empty form", () => {
        document.getElementById("charityName").value = "";
        document.getElementById("hours").value = "";
        document.getElementById("date").value = "";
        document.getElementById("rating").value = "";

        handleSubmit(new Event("submit"));
        expect(document.querySelectorAll(".error-message").length).toBe(4);
    });



    /**UNIT TESTS */
    test("invalid hours", () => {
        document.getElementById("charityName").value = "Foodgrain Bank";
        document.getElementById("hours").value = "0";
        document.getElementById("date").value = "2026-06-22";
        document.getElementById("rating").value = "5";
        handleSubmit(new Event("submit"));
        expect(document.querySelectorAll(".error-message").length).toBe(1);
    });

    test("invalid rating", () => {
        document.getElementById("charityName").value = "Foodgrain Bank";
        document.getElementById("hours").value = "5";
        document.getElementById("date").value = "2026-06-22";
        document.getElementById("rating").value = "9";

        handleSubmit(new Event("submit"));

        expect(document.querySelectorAll(".error-message").length).toBe(1);
    });


    test("invalid hours type", () => {
        document.getElementById("charityName").value = "Food Bank";
        document.getElementById("hours").value = "abc";
        document.getElementById("date").value = "2026-06-22";
        document.getElementById("rating").value = "4";

        handleSubmit(new Event("submit"));
        let errors = document.querySelectorAll(".error-message");

        expect(errors.length).toBe(1);
    });


    test("invalid rating shows error", () => {
        document.getElementById("charityName").value = "Food Bank";
        document.getElementById("hours").value = "5";
        document.getElementById("date").value = "2026-06-22";
        document.getElementById("rating").value = "9";

        handleSubmit(new Event("submit"));
        let errors = document.querySelectorAll(".error-message");

        expect(errors.length).toBe(1);
    });


});

