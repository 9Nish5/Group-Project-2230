// get form
const form = document.getElementById("donationForm");

// temporary array to store donations
let donations = [];

// form submit event
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // get values
  const charity = document.getElementById("charity").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const message = document.getElementById("message").value;

  // validation
  if (charity === "" || amount === "" || date === "") {
    alert("Please fill all required fields");
    return;
  }

  if (Number(amount) <= 0) {
    alert("Enter valid amount");
    return;
  }

  // create object
  const donation = {
    charity: charity,
    amount: Number(amount),
    date: date,
    message: message
  };

  // push into array
  donations.push(donation);

  // update table
  updateTable();

  // reset form
  form.reset();
});

// function to update table
function updateTable() {
  const tableBody = document.getElementById("tableBody");

  tableBody.innerHTML = "";

  donations.forEach(function (d, index) {
    const row = `
      <tr>
        <td>${d.charity}</td>
        <td>${d.amount}</td>
        <td>${d.date}</td>
        <td>${d.message}</td>
        <td><button onclick="deleteDonation(${index})">Delete</button></td>
      </tr>
    `;

    tableBody.innerHTML += row;
  });
}