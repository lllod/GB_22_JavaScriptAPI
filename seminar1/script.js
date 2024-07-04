const initialSchedule = [
    {
        id: 1,
        name: "Йога",
        time: "10:00 - 11:00",
        maxParticipants: 15,
        currentParticipants: 8
    },
    {
        id: 2,
        name: "Пилатес",
        time: "11:30 - 12:30",
        maxParticipants: 10,
        currentParticipants: 5
    },
    {
        id: 3,
        name: "Кроссфит",
        time: "13:00 - 14:00",
        maxParticipants: 20,
        currentParticipants: 15
    },
    {
        id: 4,
        name: "Танцы",
        time: "14:30 - 15:30",
        maxParticipants: 12,
        currentParticipants: 10
    },
    {
        id: 5,
        name: "Бокс",
        time: "16:00 - 17:00",
        maxParticipants: 8,
        currentParticipants: 6
    }
];

let schedule = JSON.parse(localStorage.getItem('schedule')) || initialSchedule;
let userEnrollments = JSON.parse(localStorage.getItem('userEnrollments')) || [];

function saveData() {
    localStorage.setItem('schedule', JSON.stringify(schedule));
    localStorage.setItem('userEnrollments', JSON.stringify(userEnrollments));
}

function updateTable() {
    const tbody = document.querySelector('#schedule-table tbody');
    tbody.innerHTML = '';
    schedule.forEach((classItem) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${classItem.name}</td>
            <td>${classItem.time}</td>
            <td>${classItem.maxParticipants}</td>
            <td id="current-participants-${classItem.id}">${classItem.currentParticipants}</td>
            <td>
                <button id="enroll-${classItem.id}" ${classItem.currentParticipants >= classItem.maxParticipants || userEnrollments.includes(classItem.id) ? 'disabled' : ''}>Записаться</button>
            </td>
            <td>
                <button id="cancel-${classItem.id}" ${userEnrollments.includes(classItem.id) ? '' : 'disabled'}>Отменить запись</button>
            </td>
        `;
        tbody.appendChild(tr);

        document.querySelector(`#enroll-${classItem.id}`).addEventListener('click', () => enroll(classItem.id));
        document.querySelector(`#cancel-${classItem.id}`).addEventListener('click', () => cancelEnrollment(classItem.id));
    });
}

function enroll(classId) {
    const classItem = schedule.find(item => item.id === classId);
    if (classItem.currentParticipants < classItem.maxParticipants && !userEnrollments.includes(classId)) {
        classItem.currentParticipants++;
        userEnrollments.push(classId);
        saveData();
        updateTable();
    }
}

function cancelEnrollment(classId) {
    const classItem = schedule.find(item => item.id === classId);
    if (userEnrollments.includes(classId)) {
        classItem.currentParticipants--;
        userEnrollments = userEnrollments.filter(id => id !== classId);
        saveData();
        updateTable();
    }
}

updateTable();
