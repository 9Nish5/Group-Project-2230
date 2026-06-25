const { JSDOM } = require("jsdom");
const {
    validateSignupInput,
    formatSignupData,
    calculateRoleBreakdown,
    removeSignupByIndex,
    handleEventSignupSubmit,
    handleDeleteSignup,
    initApp,
    getSignupsStorage,
    setSignupsStorage,
    STORAGE_KEY
} = require("./event-signup");

describe("Event Signup Component - Stage Two Rubric Tests", () => {

    beforeEach(() => {
        // Instantiate headless JSDOM browser explicitly for Node CI environments
        const dom = new JSDOM(`
          <!DOCTYPE html>
          <html>
          <body>
            <form id="eventSignupForm">
              <div><input type="text" id="eventName" /></div>
              <div><input type="text" id="repName" /></div>
              <div><input type="text" id="repEmail" /></div>
              <div>
                <select id="role">
                  <option value=""></option>
                  <option value="sponsor">Sponsor</option>
                  <option value="participant">Participant</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>
            </form>

            <section id="upcomingEventsSummary">
              <span id="countSponsor">0</span>
              <span id="countParticipant">0</span>
              <span id="countOrganizer">0</span>
            </section>

            <table>
              <tbody id="signupTableBody"></tbody>
            </table>
          </body>
          </html>
        `, { url: "http://localhost" });

        // Bind JSDOM simulated browser globals to Node runtime
        global.window = dom.window;
        global.document = dom.window.document;
        global.localStorage = dom.window.localStorage;
        global.Event = dom.window.Event;

        localStorage.clear();
        setSignupsStorage([]);
    });

    // ==========================================
    // STAGE TWO INTEGRATION TESTS
    // ==========================================

    test("Integration 1: Submitting form updates table and saves to localStorage", () => {
        document.getElementById("eventName").value = "Park Cleanup";
        document.getElementById("repName").value = "Nishant";
        document.getElementById("repEmail").value = "nish@rrc.ca";
        document.getElementById("role").value = "sponsor";

        handleEventSignupSubmit({ preventDefault: () => {} });

        const rows = document.querySelectorAll("#signupTableBody tr");
        expect(rows.length).toBe(1);
        expect(rows[0].innerHTML).toContain("Park Cleanup");

        const savedMemory = JSON.parse(localStorage.getItem(STORAGE_KEY));
        expect(savedMemory.length).toBe(1);
        expect(savedMemory[0].eventName).toBe("Park Cleanup");
    });

    test("Integration 2: Persisted localStorage data correctly hydrates table on page load", () => {
        const fakePriorSession = [
            { eventName: "Annual Gala", representative: "Nishant", email: "n@rrc.ca", role: "organizer" }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fakePriorSession));

        // Trigger exported application bootstrap directly
        initApp();

        const rows = document.querySelectorAll("#signupTableBody tr");
        expect(rows.length).toBe(1);
        expect(rows[0].innerHTML).toContain("Annual Gala");
        
        expect(document.getElementById("countOrganizer").textContent).toBe("1");
    });

    // ==========================================
    // STAGE TWO UNIT TESTS
    // ==========================================

    test("Unit 1: calculateRoleBreakdown outputs correct mathematical role tallies", () => {
        const dummySignups = [
            { role: "Sponsor" },
            { role: "sponsor" },
            { role: "Organizer" },
            { role: "Participant" }
        ];

        const tally = calculateRoleBreakdown(dummySignups);
        expect(tally).toEqual({ sponsor: 2, participant: 1, organizer: 1 });
    });

    test("Unit 2: Deleting a record removes it from localStorage and the DOM table", () => {
        const startState = [
            { eventName: "Event A", representative: "Dev 1", email: "a@a.com", role: "sponsor" },
            { eventName: "Event B", representative: "Dev 2", email: "b@b.com", role: "participant" }
        ];
        setSignupsStorage(startState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(startState));
        initApp();

        handleDeleteSignup(0);

        const memoryPostDelete = JSON.parse(localStorage.getItem(STORAGE_KEY));
        expect(memoryPostDelete.length).toBe(1);
        expect(memoryPostDelete[0].eventName).toBe("Event B");

        const rows = document.querySelectorAll("#signupTableBody tr");
        expect(rows.length).toBe(1);
        expect(rows[0].innerHTML).toContain("Event B");
    });

    test("Unit 3: Deleting a record successfully lowers the Summary Breakdown counters", () => {
        const startState = [
            { eventName: "Ev 1", representative: "N1", email: "1@a.com", role: "sponsor" },
            { eventName: "Ev 2", representative: "N2", email: "2@a.com", role: "sponsor" }
        ];
        setSignupsStorage(startState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(startState));
        initApp();

        expect(document.getElementById("countSponsor").textContent).toBe("2");

        handleDeleteSignup(0);

        expect(document.getElementById("countSponsor").textContent).toBe("1");
    });
});