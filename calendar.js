let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let isDaySelected = false;

// Function to generate the calendar for the current month
function generateCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ""; // Clear existing calendar
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // Day of the week for the 1st day of the month
    const prevMonthDays = new Date(year, month, 0).getDate(); // Days in the previous month

    // Display month and year
    const calendarHeader = `<div class="calendar-header">
        <button onclick="changeMonth('prev')">&#8592;</button>
        <span>${monthNames[month]} ${year}</span>
        <button onclick="changeMonth('next')">&#8594;</button>
    </div>`;
    calendar.insertAdjacentHTML('beforebegin', calendarHeader);

    let day = 1;
    for (let i = 0; i < 6; i++) {
        const weekRow = document.createElement('div');
        weekRow.classList.add('week-row');
        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');

            // Fill in the empty cells from the previous month
            if (i === 0 && j < firstDay) {
                dayCell.textContent = prevMonthDays - firstDay + j + 1;
                dayCell.classList.add('inactive');
            }
            // Fill in the days for the current month
            else if (day <= daysInMonth) {
                dayCell.textContent = day;
                dayCell.addEventListener('click', () => selectDay(dayCell));
                day++;
            }
            weekRow.appendChild(dayCell);
        }
        calendar.appendChild(weekRow);
    }
}

// Function to change month with slide-up and slide-down effects
function changeMonth(direction) {
    const calendar = document.getElementById('calendar');
    calendar.classList.add(direction === 'next' ? 'slide-down' : 'slide-up');

    setTimeout(() => {
        if (direction === 'next') {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        } else if (direction === 'prev') {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
        }

        generateCalendar(currentMonth, currentYear);

        setTimeout(() => {
            calendar.classList.remove('slide-up', 'slide-down');
        }, 500); // Reset after the transition
    }, 500); // Wait for slide animation to finish before regenerating calendar
}

// Function to select a day
function selectDay(dayElement) {
    if (isDaySelected) return;  // Ignore if a day is already selected
    isDaySelected = true;
    dayElement.classList.add('selected'); // Add 'selected' class for visual feedback
    openEventForm(dayElement.textContent); // Open the event form
}

// Function to open the event form
function openEventForm(day) {
    const eventForm = document.getElementById('event-form');
    eventForm.classList.add('show');
    document.getElementById('event-title').value = ""; // Clear previous values
    document.getElementById('save-event-btn').onclick = () => saveEvent(day);
    document.getElementById('close-event-btn').onclick = closeEventForm;
}

// Function to save an event
function saveEvent(day) {
    const title = document.getElementById('event-title').value;
    if (title.trim() === "") return; // Don't save if title is empty
    alert(`Event "${title}" saved for day ${day}!`);
    closeEventForm();
}

// Function to close the event form
function closeEventForm() {
    const eventForm = document.getElementById('event-form');
    eventForm.classList.remove('show');
    isDaySelected = false;
    deselectDay();
}

// Function to deselect the day
function deselectDay() {
    const selectedDay = document.querySelector('.day.selected');
    if (selectedDay) {
        selectedDay.classList.remove('selected');
    }
}

// Listen for clicks outside the calendar to deselect
document.addEventListener('click', (event) => {
    const calendarContainer = document.getElementById('calendar-container');
    if (!calendarContainer.contains(event.target)) {
        deselectDay();
        closeEventForm();
    }
});

// Generate the initial calendar for the current month
generateCalendar(currentMonth, currentYear);
