// import functions
const { updateTable, deleteDonation } = require("./donation");

describe("Donation Tracker", () => {

  // run before each test
  beforeEach(() => {
    document.body.innerHTML = `
      <table>
        <tbody id="tableBody"></tbody>
      </table>
      <span id="total"></span>
    `;

    // reset donations array
    global.donations = [];
  });

  // test table update
  test("adds donation to table", () => {
    global.donations.push({
      charity: "Test NGO",
      amount: 100,
      date: "2026-01-01",
      message: "Test"
    });

    updateTable();

    const rows = document.querySelectorAll("tr");
    expect(rows.length).toBe(1);
  });

  // test total calculation
  test("calculates total correctly", () => {
    global.donations.push(
      { charity: "A", amount: 50, date: "2026-01-01", message: "" },
      { charity: "B", amount: 100, date: "2026-01-02", message: "" }
    );

    updateTable();

    expect(document.getElementById("total").textContent).toBe("150");
  });

  // test delete function
  test("delete donation works", () => {
    global.donations.push({ charity: "Test", amount: 100 });

    deleteDonation(0);

    expect(global.donations.length).toBe(0);
  });

});