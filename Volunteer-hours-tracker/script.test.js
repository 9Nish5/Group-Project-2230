const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(
    path.resolve(__dirname, "index.html"),
    "utf-8"
);

const { handleSubmit, loadVolunteers, totalHours, deleteVolunteer} = require("./script");

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


test("table updates correctly after data is added to localStorage", () => {

    localStorage.setItem("volunteers", JSON.stringify([
        {
            charityName: "Foodgrains Bank",
            hoursVolunteered: 5,
            date: "2026-06-22",
            rating: 4
        }
    ]));

    loadVolunteers();

    expect(document.querySelectorAll("#tableBody tr").length).toBe(1);
});


test("data from localStorage is displayed in table", () => {

    localStorage.setItem("volunteers", JSON.stringify([
        {
            charityName: "Foodgrains Bank",
            hoursVolunteered: 8,
            date: "2026-06-24",
            rating: 5
        }
    ]));

    loadVolunteers();

    let table = document.getElementById("tableBody").textContent;
    expect(table).toContain("Foodgrains Bank");
    expect(table).toContain("8");
    expect(table).toContain("2026-06-24");
    expect(table).toContain("5");
});



test("totalHours calculates correctly", () => {

    localStorage.setItem("volunteers", JSON.stringify([
        {
            charityName: "Foodgrains Bank",
            hoursVolunteered: 7
        },
        {
            charityName: "Food Bank",
            hoursVolunteered: 3
        }
    ]));

    totalHours();

    expect(document.getElementById("totalHours").innerText)
        .toBe("10");
});


test("deleteVolunteer updates localStorage and table correctly ", () => {

    localStorage.setItem("volunteers", JSON.stringify([
        {
            charityName: "Foodgrains Bank",
            hoursVolunteered: 7
        },
        {
            charityName: "Food Bank",
            hoursVolunteered: 3
        }
    ]));

    deleteVolunteer(0);

    let volunteers =
        JSON.parse(localStorage.getItem("volunteers"));

    expect(volunteers.length).toBe(1);
});



test("total hours updates after delete", () => {

    localStorage.setItem("volunteers", JSON.stringify([
        {
            charityName: "Foodgrains Bank",
            hoursVolunteered: 7
        },
        {
            charityName: "Food Bank",
            hoursVolunteered: 3
        }
    ]));

    deleteVolunteer(0);

    expect(document.getElementById("totalHours").innerText)
        .toBe("3");
});

