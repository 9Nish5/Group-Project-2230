document.getElementById("volunteerForm").addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    let charityName = document.getElementById("charityName").value;
    let hours = document.getElementById("hours").value;
    let date = document.getElementById("date").value;
    let rating = document.getElementById("rating").value;

    let isValid = false;

    if (charityName == "") {
        showError(document.getElementById("charityName"), "Charity name is required");
        isValid = true;
    }

    if (hours == "") {
        showError(document.getElementById("hours"), "Hours are required");
        isValid = true;
    }

    if (date == "") {
        showError(document.getElementById("date"), "Date is required");
        isValid = true;
    }

    if (rating == "") {
        showError(document.getElementById("rating"), "Rating is required");
        isValid = true;
    }

    if (isValid) return;

    console.log(document.getElementById("error"));

    document.querySelectorAll(".error-message").forEach(e => e.remove());


    if (charityName == "") {
        showError(document.getElementById("charityName"), "Charity name is required");
        return;
    }

    if (hours == "") {
        showError(document.getElementById("hours"), "Hours are required");
        return;
    }

    if (date == "") {
        showError(document.getElementById("date"), "Date is required");
        return;
    }

    if (rating == "") {
        showError(document.getElementById("rating"), "Experience rating is required");
        return;
    }


    if (!/^[0-9]+(\.[0-9]+)?$/.test(hours)) {
        showError(document.getElementById("hours"), "Invalid Number");
        return;
    }

    if (hours <= 0) {
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

    return volunteerData;
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