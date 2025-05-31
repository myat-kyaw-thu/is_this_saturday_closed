class MyanmarSaturdayStatusChecker {
    constructor() {
        this.baseSunday = new Date('2024-04-28');
        this.isBaseSundayWorking = true;
        this.selectedSaturday = null;
        this.currentCalendarMonth = new Date().getMonth();
        this.selectedCountry = 'myanmar';

        // Myanmar Public Holidays 2025 (Latest official holidays)
        this.myanmarHolidays2025 = [
            { date: '2025-01-01', name: 'New Year Day' },
            { date: '2025-01-04', name: 'Independence Day' },
            { date: '2025-02-12', name: 'Union Day' },
            { date: '2025-03-02', name: 'Peasants Day' },
            { date: '2025-03-27', name: 'Armed Forces Day' },
            { date: '2025-04-13', name: 'Thingyan Water Festival (Day 1)' },
            { date: '2025-04-14', name: 'Thingyan Water Festival (Day 2)' },
            { date: '2025-04-15', name: 'Thingyan Water Festival (Day 3)' },
            { date: '2025-04-16', name: 'Thingyan Water Festival (Day 4)' },
            { date: '2025-04-17', name: 'Myanmar New Year Day' },
            { date: '2025-05-01', name: 'Labour Day' },
            { date: '2025-05-12', name: 'Buddha Day (Vesak Day)' },
            { date: '2025-07-19', name: 'Martyrs Day' },
            { date: '2025-10-14', name: 'Thadingyut Festival (Day 1)' },
            { date: '2025-10-15', name: 'Thadingyut Festival (Day 2)' },
            { date: '2025-10-16', name: 'Thadingyut Festival (Day 3)' },
            { date: '2025-11-02', name: 'Tazaungdaing Festival (Day 1)' },
            { date: '2025-11-03', name: 'Tazaungdaing Festival (Day 2)' },
            { date: '2025-12-25', name: 'Christmas Day' },
            { date: '2025-12-31', name: 'New Year Eve' }
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.updateCurrentDateInfo();
        this.populateSaturdaySelect();
        this.renderCalendar();
        this.calculateStatistics();
        this.renderHolidayList();
        this.checkTodayStatus();
    }

    initializeElements() {
        this.countrySelect = document.getElementById('countrySelect');
        this.monthSelect = document.getElementById('monthSelect');
        this.saturdaySelect = document.getElementById('saturdaySelect');
        this.calendarMonth = document.getElementById('calendarMonth');
        this.baseSundayInput = document.getElementById('baseSunday');
        this.isBaseSundayWorkingCheckbox = document.getElementById('isBaseSundayWorking');
        this.patternNameInput = document.getElementById('patternName');
        this.statusLabel = document.getElementById('statusLabel');
        this.statusExplanation = document.getElementById('statusExplanation');
        this.statusDetails = document.getElementById('statusDetails');
        this.holidayInfo = document.getElementById('holidayInfo');
        this.currentDateInfo = document.getElementById('currentDateInfo');
        this.calendarContainer = document.getElementById('calendarContainer');
        this.holidayList = document.getElementById('holidayList');

        // Buttons
        this.todayBtn = document.getElementById('todayBtn');
        this.nextSatBtn = document.getElementById('nextSatBtn');
        this.randomBtn = document.getElementById('randomBtn');
        this.exportBtn = document.getElementById('exportBtn');
    }

    setupEventListeners() {
        this.countrySelect.addEventListener('change', () => this.updateCountry());
        this.monthSelect.addEventListener('change', () => this.populateSaturdaySelect());
        this.saturdaySelect.addEventListener('change', () => this.updateStatus());
        this.calendarMonth.addEventListener('change', () => this.renderCalendar());

        // Button events
        this.todayBtn.addEventListener('click', () => this.goToToday());
        this.nextSatBtn.addEventListener('click', () => this.goToNextSaturday());
        this.randomBtn.addEventListener('click', () => this.selectRandomSaturday());
        this.exportBtn.addEventListener('click', () => this.exportCalendar());
    }

    updateCountry() {
        this.selectedCountry = this.countrySelect.value;
        this.renderCalendar();
        this.calculateStatistics();
        this.renderHolidayList();
        this.updateStatus();
    }

    isPublicHoliday(date) {
        if (this.selectedCountry !== 'myanmar') return null;

        // Fix timezone issue by using local date components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        return this.myanmarHolidays2025.find(holiday => holiday.date === dateStr);
    }

    updateCurrentDateInfo() {
        const today = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const nextSaturday = this.getNextSaturday(today);
        const nextSaturdayStr = nextSaturday ? nextSaturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None in 2025';

        this.currentDateInfo.innerHTML = `
            <strong>Today:</strong> ${today.toLocaleDateString('en-US', options)}<br>
            <strong>Next Saturday in 2025:</strong> ${nextSaturdayStr}
        `;
    }

    populateSaturdaySelect() {
        const monthIndex = parseInt(this.monthSelect.value);
        this.saturdaySelect.innerHTML = '<option value="">Select Saturday</option>';

        if (isNaN(monthIndex)) {
            // Show all Saturdays in 2025
            for (let month = 0; month < 12; month++) {
                const saturdays = this.getSaturdaysInMonth(2025, month);
                saturdays.forEach(saturday => {
                    const option = document.createElement('option');
                    option.value = saturday.toISOString().split('T')[0];
                    const holiday = this.isPublicHoliday(saturday);
                    const holidayText = holiday ? ` (${holiday.name})` : '';
                    option.textContent = saturday.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }) + holidayText;
                    this.saturdaySelect.appendChild(option);
                });
            }
        } else {
            const saturdays = this.getSaturdaysInMonth(2025, monthIndex);
            saturdays.forEach(saturday => {
                const option = document.createElement('option');
                option.value = saturday.toISOString().split('T')[0];
                const holiday = this.isPublicHoliday(saturday);
                const holidayText = holiday ? ` (${holiday.name})` : '';
                option.textContent = saturday.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }) + holidayText;
                this.saturdaySelect.appendChild(option);
            });
        }
    }

    getSaturdaysInMonth(year, month) {
        const saturdays = [];
        const date = new Date(year, month, 1);

        while (date.getDay() !== 6) {
            date.setDate(date.getDate() + 1);
        }

        while (date.getMonth() === month) {
            saturdays.push(new Date(date));
            date.setDate(date.getDate() + 7);
        }

        return saturdays;
    }

    getConsecutiveClosedDays(saturday) {
        let consecutiveDays = 0;
        let currentDate = new Date(saturday);

        // Check current Saturday
        if (this.isSaturdayClosedForAnyReason(currentDate)) {
            consecutiveDays++;

            // Check previous Saturdays
            let prevSaturday = new Date(currentDate);
            prevSaturday.setDate(prevSaturday.getDate() - 7);

            while (prevSaturday.getFullYear() === 2025 && this.isSaturdayClosedForAnyReason(prevSaturday)) {
                consecutiveDays++;
                prevSaturday.setDate(prevSaturday.getDate() - 7);
            }

            // Check next Saturdays
            let nextSaturday = new Date(currentDate);
            nextSaturday.setDate(nextSaturday.getDate() + 7);

            while (nextSaturday.getFullYear() === 2025 && this.isSaturdayClosedForAnyReason(nextSaturday)) {
                consecutiveDays++;
                nextSaturday.setDate(nextSaturday.getDate() + 7);
            }
        }

        return consecutiveDays;
    }

    isSaturdayClosedForAnyReason(saturday) {
        // Check if it's a public holiday first
        const holiday = this.isPublicHoliday(saturday);
        if (holiday) return true;

        // Then check normal pattern
        return !this.isSaturdayOpen(saturday);
    }

    renderCalendar() {
        const monthIndex = parseInt(this.calendarMonth.value);
        const year = 2025;

        this.calendarContainer.innerHTML = '';

        // Create calendar grid
        const calendar = document.createElement('div');
        calendar.className = 'calendar-grid';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.textContent = day;
            calendar.appendChild(header);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day disabled';
            calendar.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthIndex, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            if (date.getDay() === 6) { // Saturday
                dayElement.classList.add('saturday');

                const holiday = this.isPublicHoliday(date);
                if (holiday) {
                    // Holiday Saturdays are always shown as closed
                    dayElement.classList.add('closed');
                    dayElement.classList.add('holiday');
                    dayElement.title = `Closed - Public Holiday: ${holiday.name}`;
                } else {
                    const isOpen = this.isSaturdayOpen(date);
                    dayElement.classList.add(isOpen ? 'open' : 'closed');
                }

                // Check for consecutive closed days
                const consecutiveDays = this.getConsecutiveClosedDays(date);
                if (consecutiveDays >= 3) {
                    dayElement.classList.add('consecutive-closed');
                    dayElement.setAttribute('data-consecutive', consecutiveDays.toString());
                    dayElement.title = (dayElement.title || '') + ` (${consecutiveDays} consecutive closed days)`;
                }

                dayElement.addEventListener('click', () => {
                    this.selectSaturday(date);
                });
            } else {
                dayElement.classList.add('disabled');

                // Check if it's a public holiday on other days
                const holiday = this.isPublicHoliday(date);
                if (holiday) {
                    dayElement.style.background = 'rgba(139, 92, 246, 0.2)';
                    dayElement.title = `Public Holiday: ${holiday.name}`;
                }
            }

            calendar.appendChild(dayElement);
        }

        this.calendarContainer.appendChild(calendar);
    }

    selectSaturday(date) {
        this.selectedSaturday = date;
        this.monthSelect.value = date.getMonth().toString();
        this.populateSaturdaySelect();
        this.saturdaySelect.value = date.toISOString().split('T')[0];
        this.updateStatus();
        this.renderCalendar();
    }

    updateStatus() {
        const selectedDate = this.saturdaySelect.value;
        if (!selectedDate) {
            this.statusLabel.textContent = 'SELECT DATE';
            this.statusLabel.className = 'status-label';
            this.statusExplanation.textContent = 'Please select a Saturday to check its status';
            this.statusDetails.textContent = '';
            this.holidayInfo.textContent = '';
            return;
        }

        this.selectedSaturday = new Date(selectedDate);
        const holiday = this.isPublicHoliday(this.selectedSaturday);

        let isOpen, statusReason;

        if (holiday) {
            isOpen = false;
            statusReason = 'Public Holiday';
        } else {
            isOpen = this.isSaturdayOpen(this.selectedSaturday);
            statusReason = 'Alternating Pattern';
        }

        // Animate status change
        this.statusLabel.style.transform = 'scale(0.8)';
        this.statusLabel.style.opacity = '0.5';

        setTimeout(() => {
            this.statusLabel.textContent = isOpen ? 'OPEN' : 'CLOSED';
            this.statusLabel.className = `status-label ${isOpen ? 'status-open' : 'status-closed'}`;
            this.statusLabel.style.transform = 'scale(1)';
            this.statusLabel.style.opacity = '1';
        }, 150);

        if (holiday) {
            this.statusExplanation.textContent =
                `This Saturday is Closed due to ${holiday.name}.`;
            this.statusDetails.textContent =
                `Public holidays override the regular alternating pattern.`;
            this.holidayInfo.textContent = `🎉 ${holiday.name}`;
        } else {
            const nextSunday = this.getNextSunday(this.selectedSaturday);
            const isNextSundayWorking = this.isSundayWorking(nextSunday);

            this.statusExplanation.textContent =
                `This Saturday is ${isOpen ? 'Open' : 'Closed'} based on alternating Sunday logic.`;

            this.statusDetails.textContent =
                `Next Sunday (${nextSunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}) is ${isNextSundayWorking ? 'a working' : 'an off'} Sunday.`;

            this.holidayInfo.textContent = '';
        }

        // Check for consecutive closed days
        const consecutiveDays = this.getConsecutiveClosedDays(this.selectedSaturday);
        if (consecutiveDays >= 3) {
            this.holidayInfo.textContent += ` ⚠️ ${consecutiveDays} consecutive closed Saturdays`;
        }
    }

    calculateStatistics() {
        let totalSaturdays = 0;
        let openSaturdays = 0;
        let holidaySaturdays = 0;

        for (let month = 0; month < 12; month++) {
            const saturdays = this.getSaturdaysInMonth(2025, month);
            totalSaturdays += saturdays.length;

            saturdays.forEach(saturday => {
                const holiday = this.isPublicHoliday(saturday);
                if (holiday) {
                    holidaySaturdays++;
                    // Holiday Saturdays count as closed, not separate
                } else if (this.isSaturdayOpen(saturday)) {
                    openSaturdays++;
                }
            });
        }

        const closedSaturdays = totalSaturdays - openSaturdays; // Holiday Saturdays are included in closed count
        const openPercentage = Math.round((openSaturdays / totalSaturdays) * 100);

        document.getElementById('totalSaturdays').textContent = totalSaturdays;
        document.getElementById('openSaturdays').textContent = openSaturdays;
        document.getElementById('closedSaturdays').textContent = closedSaturdays;
        document.getElementById('holidaySaturdays').textContent = holidaySaturdays;
        document.getElementById('progressFill').style.width = `${openPercentage}%`;
    }

    renderHolidayList() {
        this.holidayList.innerHTML = '';

        this.myanmarHolidays2025.forEach(holiday => {
            const holidayDate = new Date(holiday.date);
            const isSaturday = holidayDate.getDay() === 6;

            const holidayItem = document.createElement('div');
            holidayItem.className = `holiday-item ${isSaturday ? 'holiday-saturday' : ''}`;

            holidayItem.innerHTML = `
                <div>
                    <div class="holiday-date">${holidayDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short'
                    })}</div>
                    <div class="holiday-name">${holiday.name}</div>
                </div>
                ${isSaturday ? '<span style="color: var(--warning-color); font-weight: bold;">📅 Saturday</span>' : ''}
            `;

            this.holidayList.appendChild(holidayItem);
        });
    }

    goToToday() {
        const today = new Date();
        if (today.getFullYear() === 2025) {
            const nextSaturday = this.getNextSaturday(today);
            if (nextSaturday) {
                this.selectSaturday(nextSaturday);
            }
        } else {
            const firstSaturday = this.getSaturdaysInMonth(2025, 0)[0];
            this.selectSaturday(firstSaturday);
        }
    }

    goToNextSaturday() {
        const today = new Date();
        let nextSaturday;

        if (today.getFullYear() === 2025) {
            if (today.getDay() === 6) {
                nextSaturday = new Date(today);
                nextSaturday.setDate(today.getDate() + 7);
            } else {
                nextSaturday = new Date(today);
                const daysUntilSaturday = 6 - today.getDay();
                nextSaturday.setDate(today.getDate() + daysUntilSaturday);
            }

            if (nextSaturday.getFullYear() === 2025) {
                this.selectSaturday(nextSaturday);
                return;
            }
        }

        const firstSaturday = this.getSaturdaysInMonth(2025, 0)[0];
        this.selectSaturday(firstSaturday);
    }

    selectRandomSaturday() {
        const allSaturdays = [];
        for (let month = 0; month < 12; month++) {
            allSaturdays.push(...this.getSaturdaysInMonth(2025, month));
        }

        const randomIndex = Math.floor(Math.random() * allSaturdays.length);
        this.selectSaturday(allSaturdays[randomIndex]);
    }

    exportCalendar() {
        const data = {
            year: 2025,
            country: this.selectedCountry,
            baseSunday: this.baseSunday.toISOString().split('T')[0],
            isBaseSundayWorking: this.isBaseSundayWorking,
            saturdays: [],
            holidays: this.myanmarHolidays2025
        };

        for (let month = 0; month < 12; month++) {
            const saturdays = this.getSaturdaysInMonth(2025, month);
            saturdays.forEach(saturday => {
                const holiday = this.isPublicHoliday(saturday);
                const status = holiday ? 'HOLIDAY' : (this.isSaturdayOpen(saturday) ? 'OPEN' : 'CLOSED');

                data.saturdays.push({
                    date: saturday.toISOString().split('T')[0],
                    status: status,
                    holiday: holiday ? holiday.name : null,
                    consecutiveClosed: this.getConsecutiveClosedDays(saturday)
                });
            });
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'myanmar-saturday-schedule-2025.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    isSaturdayOpen(saturday) {
        const nextSunday = this.getNextSunday(saturday);
        return this.isSundayWorking(nextSunday);
    }

    getNextSunday(saturday) {
        const nextSunday = new Date(saturday);
        nextSunday.setDate(saturday.getDate() + 1);
        return nextSunday;
    }

    isSundayWorking(sunday) {
        const timeDiff = sunday.getTime() - this.baseSunday.getTime();
        const weeksDiff = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
        const isEvenWeeks = weeksDiff % 2 === 0;

        return isEvenWeeks ? this.isBaseSundayWorking : !this.isBaseSundayWorking;
    }

    checkTodayStatus() {
        const today = new Date();
        if (today.getFullYear() === 2025) {
            const nextSaturday = this.getNextSaturday(today);
            if (nextSaturday) {
                this.selectSaturday(nextSaturday);
            }
        }
    }

    getNextSaturday(date) {
        const nextSaturday = new Date(date);
        const daysUntilSaturday = (6 - date.getDay()) % 7;

        if (daysUntilSaturday === 0 && date.getDay() !== 6) {
            nextSaturday.setDate(date.getDate() + 7);
        } else {
            nextSaturday.setDate(date.getDate() + daysUntilSaturday);
        }

        return nextSaturday.getFullYear() === 2025 ? nextSaturday : null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MyanmarSaturdayStatusChecker();
});
