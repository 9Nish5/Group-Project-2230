// get form
const form = document.getElementById("donationForm");

// temporary array to store donations
let donations = [];

// use test data if exists (Jest)
if (typeof global !== "undefined" && global.donations) {
  donations = global.donations;
} 
// otherwise use browser localStorage
else if (typeof window !== "undefined") {
  donations = JSON.parse(localStorage.getItem("donations")) || [];
}

// form submit event
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // get values
    const charity = document.getElementById("charity").value.trim();
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;
    const message = document.getElementById("message").value;

    // validation
    if (!charity || !amount || !date) {
      return;
    }

    if (Number(amount) <= 0) {
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

    syncData(); // 
    updateTable();

    // reset form
    form.reset();
  });
}

// function to update table
function updateTable() {

  const tableBody =
    document.getElementById("tableBody") ||
    document.querySelector("tbody");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  let total = 0;

  donations.forEach(function (d, index) {
    total += d.amount;

    const row = document.createElement("tr");

   row.innerHTML = `
  <td>${d.charity}</td>
  <td>${d.amount}</td>
  <td>${d.date}</td>
  <td>${d.message}</td>
  <td><button class="deleteBtn" data-index="${index}">Delete</button></td>
`;
    tableBody.appendChild(row);
  });

  // update total
  const totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.textContent = total;
  }

  // add event listeners instead of inline onclick
  const buttons = document.querySelectorAll(".deleteBtn");
  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      deleteDonation(index);
    });
  });

  syncData(); // 
}

// delete function
function deleteDonation(index) {

  donations.splice(index, 1);

  syncData(); // 
  updateTable();
}

function syncData() {
  // save only in browser
  if (typeof window !== "undefined") {
    localStorage.setItem("donations", JSON.stringify(donations));
  }

  // sync for test
  if (typeof global !== "undefined") {
    global.donations = donations;
  }
}

// load data when page opens (browser only)
if (typeof window !== "undefined") {
  updateTable();
}

// export for testing
if (typeof module !== "undefined") {
  module.exports = {
    updateTable,
    deleteDonation
  };
}

