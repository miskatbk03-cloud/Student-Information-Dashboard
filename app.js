
const demoStudents = [
    {
        name: "Rahim Ahmed",
        id: "C253067",
        dept: "CSE",
        sec: "A",
        semester: 2,
        gender: "Male"
    },
    {
        name: "Nusrat Jahan",
        id: "E238950",
        dept: "EEE",
        sec: "C",
        semester: 6,
        gender: "Female"
    },
    {
        name: "Tanvir Hasan",
        id: "CE253120",
        dept: "Civil",
        sec: "B",
        semester: 4,
        gender: "Male"
    },
    {
        name: "Sadia Islam",
        id: "B238951",
        dept: "BBA",
        sec: "D",
        semester: 8,
        gender: "Female"
    },
    {
        name: "Fahim Hossain",
        id: "CC253145",
        dept: "CCE",
        sec: "A",
        semester: 3,
        gender: "Male"
    },
    {
        name: "Mim Akter",
        id: "ET238970",
        dept: "ETE",
        sec: "C",
        semester: 5,
        gender: "Female"
    },
    {
        name: "Sakib Rahman",
        id: "E239010",
        dept: "English",
        sec: "B",
        semester: 7,
        gender: "Male"
    },
    {
        name: "Ayesha Khan",
        id: "P238980",
        dept: "Pharmacy",
        sec: "D",
        semester: 1,
        gender: "Female"
    }
];


// Main Data

let students = [...demoStudents];
let apiStudents = [];

let favorites = JSON.parse(
    localStorage.getItem("favoriteStudents")
) || [];


// HTML Elements

const studentTableBody = document.getElementById("studentTableBody");
const favoriteTableBody = document.getElementById("favoriteTableBody");
const recentStudentsBody = document.getElementById("recentStudentsBody");

const totalStudents = document.getElementById("totalStudents");
const maleStudents = document.getElementById("maleStudents");
const femaleStudents = document.getElementById("femaleStudents");

const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const sectionFilter = document.getElementById("sectionFilter");
const semesterFilter = document.getElementById("semesterFilter");

const studentStatus = document.getElementById("studentStatus");
const loadApiBtn = document.getElementById("loadApiBtn");

const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");


// Save Favorites

function saveFavorites() {

    localStorage.setItem(
        "favoriteStudents",
        JSON.stringify(favorites)
    );

}


// Display Students

function displayStudents(studentList, tableBody) {

    if (studentList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = studentList.map(student => {

        const isFavorite = favorites.includes(student.id);

        return `
            <tr>
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.dept}</td>
                <td>${student.sec}</td>
                <td>${student.semester}</td>
                <td>${student.gender}</td>
                <td>
                    <button class="view-btn"
                        data-id="${student.id}">
                        View
                    </button>

                    <button class="favorite-btn"
                        data-id="${student.id}">
                        ${isFavorite ? "Remove ★" : "Favorite ☆"}
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}


// Recent Students

function displayRecentStudents() {

    const recentStudents = students.slice(-5).reverse();

    recentStudentsBody.innerHTML = recentStudents.map(student => `
        <tr>
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.dept}</td>
            <td>${student.semester}</td>
        </tr>
    `).join("");

}


// Update Statistics

function updateStatistics() {

    totalStudents.textContent = students.length;

    maleStudents.textContent = students.filter(
        student => student.gender === "Male"
    ).length;

    femaleStudents.textContent = students.filter(
        student => student.gender === "Female"
    ).length;

}


// Search and Filter

function filterStudents() {

    const searchValue = searchInput.value.toLowerCase();

    const selectedDepartment = departmentFilter.value;
    const selectedSection = sectionFilter.value;
    const selectedSemester = semesterFilter.value;

    const filteredStudents = students.filter(student => {

        const matchSearch =
            student.name.toLowerCase().includes(searchValue) ||
            student.id.toLowerCase().includes(searchValue);

        const matchDepartment =
            selectedDepartment === "" ||
            student.dept === selectedDepartment;

        const matchSection =
            selectedSection === "" ||
            student.sec === selectedSection;

        const matchSemester =
            selectedSemester === "" ||
            student.semester === Number(selectedSemester);

        return matchSearch &&
               matchDepartment &&
               matchSection &&
               matchSemester;

    });

    displayStudents(filteredStudents, studentTableBody);

    studentStatus.textContent =
        `Showing ${filteredStudents.length} of ${students.length} students`;

}


// Favorite Students

function displayFavorites() {

    const favoriteStudents = students.filter(
        student => favorites.includes(student.id)
    );

    displayStudents(favoriteStudents, favoriteTableBody);

}


// Toggle Favorite

function toggleFavorite(studentId) {

    if (favorites.includes(studentId)) {

        favorites = favorites.filter(
            id => id !== studentId
        );

    }
    else {

        favorites.push(studentId);

    }

    saveFavorites();

    filterStudents();
    displayFavorites();

}


// View Student Details

function viewStudent(studentId) {

    const student = students.find(
        student => student.id === studentId
    );

    if (!student) return;

    document.getElementById("detailName").textContent = student.name;
    document.getElementById("detailId").textContent = student.id;
    document.getElementById("detailDept").textContent = student.dept;
    document.getElementById("detailSection").textContent = student.sec;
    document.getElementById("detailSemester").textContent = student.semester;
    document.getElementById("detailGender").textContent = student.gender;

    studentModal.style.display = "flex";

}


// Table Event Handling

function handleTableClick(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const studentId = button.dataset.id;

    if (button.classList.contains("view-btn")) {
        viewStudent(studentId);
    }

    if (button.classList.contains("favorite-btn")) {
        toggleFavorite(studentId);
    }

}

studentTableBody.addEventListener("click", handleTableClick);
favoriteTableBody.addEventListener("click", handleTableClick);


// Close Modal

closeModal.addEventListener("click", function() {

    studentModal.style.display = "none";

});

studentModal.addEventListener("click", function(event) {

    if (event.target === studentModal) {
        studentModal.style.display = "none";
    }

});

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        studentModal.style.display = "none";
    }

});


// Search and Filter Events

searchInput.addEventListener("input", filterStudents);

departmentFilter.addEventListener("change", filterStudents);

sectionFilter.addEventListener("change", filterStudents);

semesterFilter.addEventListener("change", filterStudents);


// API Integration

loadApiBtn.addEventListener("click", async function() {

    loadApiBtn.disabled = true;
    loadApiBtn.textContent = "Loading...";

    studentStatus.textContent = "Loading API students...";

    try {

        apiStudents = await fetchStudentsFromAPI();

        students = [...demoStudents, ...apiStudents];

        updateStatistics();
        displayRecentStudents();
        filterStudents();
        displayFavorites();

        studentStatus.textContent =
            `${apiStudents.length} API demo students loaded successfully.`;

        loadApiBtn.textContent = "API Data Loaded";

    }
    catch (error) {

        studentStatus.textContent =
            "Error loading API data. Please try again.";

        loadApiBtn.textContent = "Retry API";

    }
    finally {

        loadApiBtn.disabled = false;

    }

});


// Navigation

const navLinks = document.querySelectorAll(".nav-link");
const pageSections = document.querySelectorAll(".page-section");

navLinks.forEach(link => {

    link.addEventListener("click", function() {

        const page = this.dataset.page;

        pageSections.forEach(section => {
            section.classList.add("hidden");
        });

        document.getElementById(page).classList.remove("hidden");

        navLinks.forEach(nav => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

        document.getElementById("pageTitle").textContent =
            this.textContent;

        if (page === "favorites") {
            displayFavorites();
        }

    });

});


// Initial Display

displayStudents(students, studentTableBody);

updateStatistics();

displayRecentStudents();

filterStudents();

displayFavorites();
