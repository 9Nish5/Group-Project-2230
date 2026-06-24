function handleSubmit(event) {
    event.preventDefault();

    let charityName = document.getElementById("charityName").value;
    let hours = document.getElementById("hours").value;
    let date = document.getElementById("date").value;
    let rating = document.getElementById("rating").value;

    let isValid = true;

    console.log(document.getElementById("error"));

    document.querySelectorAll(".error-message").forEach(e => e.remove());


    if (charityName == "") {
        showError(document.getElementById("charityName"), "Charity name is required");
        isValid = false;
    }

    if (hours == "") {
        showError(document.getElementById("hours"), "Hours are required");
        isValid = false;
    }

    if (date == "") {
        showError(document.getElementById("date"), "Date is required");
        isValid = false;
    }

    if (rating == "") {
        showError(document.getElementById("rating"), "Experience rating is required");
        isValid = false;
    }

    if (!isValid) {
    return;
    }

    if (hours < 0) {
        showError(document.getElementById("hours"), "Hours cannot be negative");
        return
    }

    if (!/^[0-9]+(\.[0-9]+)?$/.test(hours)) {
        showError(document.getElementById("hours"), "Invalid Number");
        return;
    }


    if (hours == 0) {
        showError(document.getElementById("hours"), "Hours must be greater than 0");
        return;
    }
    


    if (!/^[1-5]$/.test(rating)) {
        showError(document.getElementById("rating"), "Rating must be between 1 and 5");
        return;
    }

    let volunteerData = {
        charityName: charityName,
        hoursVolunteered: Number(hours),
        date: date,
        rating: Number(rating)
    };

    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    volunteers.push(volunteerData);
    localStorage.setItem("volunteers", JSON.stringify(volunteers));

    return volunteerData;
}

function loadVolunteers() {

    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

    let tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    volunteers.forEach((v, index) => {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${v.charityName}</td>
            <td>${v.hoursVolunteered}</td>
            <td>${v.date}</td>
            <td>${v.rating}</td>
            <td><button onclick="deleteVolunteer(${index})">Delete</button></td>
        `;

        tableBody.appendChild(row);
    });
}

function totalHours() {

    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    let total = 0;

    volunteers.forEach(v => {
        total += Number(v.hoursVolunteered);
    });
    document.getElementById("totalHours").innerText = total;
}

function deleteVolunteer(index) {
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    let newVolunteers = [];

    for (let i = 0; i < volunteers.length; i++) {

        if (i != index) {
            newVolunteers[newVolunteers.length] = volunteers[i];
        }
    }

    localStorage.setItem("volunteers", JSON.stringify(newVolunteers));
    loadVolunteers();
    totalHours();
}


function showError(inputElement, message) {
    const container = inputElement.parentElement;

    const existingError = container.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }

    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error-message";

    container.appendChild(errorDisplay);
}


if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("volunteerForm");
        if (form) {
            form.addEventListener("submit", handleSubmit);
        }
        loadVolunteers()
        totalHours();
    });
}

if (typeof module !== "undefined") {
    module.exports = { handleSubmit };
}