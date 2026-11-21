
async function fetchStudentsFromAPI() {

    const response = await fetch("https://dummyjson.com/users?limit=20");

    if (!response.ok) {
        throw new Error("Failed to load API data.");
    }

    const data = await response.json();

    const departments = [
        "CSE", "EEE", "Civil", "BBA",
        "CCE", "ETE", "English", "Pharmacy"
    ];

    const prefixes = {
        CSE: "C",
        EEE: "E",
        CCE: "CC",
        ETE: "ET",
        Civil: "CE",
        Pharmacy: "P",
        BBA: "B",
        English: "E"
    };

    return data.users.map((user, index) => {

        const dept = departments[index % departments.length];

        return {
            name: user.firstName + " " + user.lastName,
            id: prefixes[dept] + String(250000 + user.id).padStart(6, "0"),
            dept: dept,
            sec: ["A", "B", "C", "D"][index % 4],
            semester: (index % 8) + 1,
            gender: user.gender === "male" ? "Male" : "Female"
        };

    });

}
