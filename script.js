// get form
const form = document.getElementById("donationForm");

// form submit event
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // get values
  const charity = document.getElementById("charity").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  // validation
  if (charity === "" || amount === "" || date === "") {
    alert("Please fill all required fields");
    return;
  }

  if (Number(amount) <= 0) {
    alert("Enter valid amount");
    return;
  }

  // success
  alert("Form submitted successfully!");
});