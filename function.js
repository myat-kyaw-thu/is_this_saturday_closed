class EnhancedSaturdayStatusChecker {
  constructor() {
      this.baseSunday = new Date('2024-04-28');
      this.isBaseSundayWorking = true;
      this.selectedSaturday = null;
      this.currentCalendarMonth = new Date().getMonth();
      this.savedPatterns = this.loadFromStorage('patterns') || {};

      this.initializeElements();
      this.setupEventListeners();
      this.updateCurrentDateInfo();
      this.populateMonthSelect();
      this.renderCalendar();
      this.calculateStatistics();
      this.checkTodayStatus();
      this.loadSettings();
  }

  initializeElements() {
      this.monthSelect = document.getElementById('monthSelect');
      this.saturdaySelect = document.getElementById('saturdaySelect');
      this.calendarMonth = document.getElementById('calendarMonth');
      this.baseSundayInput = document.getElementById('baseSunday');
      this.isBaseSundayWorkingCheckbox = document.getElementById('isBaseSundayWorking');
      this.patternNameInput = document.getElementById('patternName');
      this.statusLabel = document.getElementById('statusLabel');
      this.statusExplanation = document.getElementById('statusExplanation');
      this.statusDetails = document.getElementById('statusDetails');
      this.currentDateInfo = document.getElementById('currentDateInfo');
      this.calendarContainer = document.getElementById('calendarContainer');
      this.statsGrid = document.getElementById('statsGrid');

      // Buttons
      this.todayBtn = document.getElementById('todayBtn');
      this.nextSatBtn = document.getElementById('nextSatBtn');
      this.randomBtn = document.getElementById('randomBtn');
      this.exportBtn = document.getElementById('exportBtn');
      this.savePatternBtn = document.getElementById('savePattern');
      this.loadPatternBtn = document.getElementById('loadPattern');
      this.resetPatternBtn = document.getElementById('resetPattern');
  }

  setupEventListeners() {
      this.monthSelect.addEventListener('change', () => this.populateSaturdaySelect());
      this.saturdaySelect.addEventListener('change', () => this.updateStatus());
      this.calendarMonth.addEventListener('change', () => this.renderCalendar());
      this.baseSundayInput.addEventListener('change', () => this.updateBaseSunday());
      this.isBaseSundayWorkingCheckbox.addEventListener('change', () => this.updateBaseSundayWorking());

      // Button events
      this.todayBtn.addEventListener('click', () => this.goToToday());
      this.nextSatBtn.addEventListener('click', () => this.goToNextSaturday());
      this.randomBtn.addEventListener('click', () => this.selectRandomSaturday());
      this.exportBtn.addEventListener('click', () => this.exportCalendar());
      this.savePatternBtn.addEventListener('click', () => this.savePattern());
      this.loadPatternBtn.addEventListener('click', () => this.loadPattern());
      this.resetPatternBtn.addEventListener('click', () => this.resetPattern());

      // Auto-save settings
      this.baseSundayInput.addEventListener('change', () => this.saveSettings());
      this.isBaseSundayWorkingCheckbox.addEventListener('change', () => this.saveSettings());
      this.patternNameInput.addEventListener('change', () => this.saveSettings());
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
                  option.textContent = saturday.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                  });
                  this.saturdaySelect.appendChild(option);
              });
          }
      } else {
          const saturdays = this.getSaturdaysInMonth(2025, monthIndex);
          saturdays.forEach(saturday => {
              const option = document.createElement('option');
              option.value = saturday.toISOString().split('T')[0];
              option.textContent = saturday.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
              });
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
              const isOpen = this.isSaturdayOpen(date);
              dayElement.classList.add(isOpen ? 'open' : 'closed');

              dayElement.addEventListener('click', () => {
                  this.selectSaturday(date);
              });
          } else {
              dayElement.classList.add('disabled');
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
      this.renderCalendar(); // Re-render to show selection
  }

  updateBaseSunday() {
      this.baseSunday = new Date(this.baseSundayInput.value);
      this.updateStatus();
      this.renderCalendar();
      this.calculateStatistics();
  }

  updateBaseSundayWorking() {
      this.isBaseSundayWorking = this.isBaseSundayWorkingCheckbox.checked;
      this.updateStatus();
      this.renderCalendar();
      this.calculateStatistics();
  }

  updateStatus() {
      const selectedDate = this.saturdaySelect.value;
      if (!selectedDate) {
          this.statusLabel.textContent = 'SELECT DATE';
          this.statusLabel.className = 'status-label';
          this.statusExplanation.textContent = 'Please select a Saturday to check its status';
          this.statusDetails.textContent = '';
          return;
      }

      this.selectedSaturday = new Date(selectedDate);
      const isOpen = this.isSaturdayOpen(this.selectedSaturday);

      // Animate status change
      this.statusLabel.style.transform = 'scale(0.8)';
      this.statusLabel.style.opacity = '0.5';

      setTimeout(() => {
          this.statusLabel.textContent = isOpen ? 'OPEN' : 'CLOSED';
          this.statusLabel.className = `status-label ${isOpen ? 'status-open' : 'status-closed'}`;
          this.statusLabel.style.transform = 'scale(1)';
          this.statusLabel.style.opacity = '1';
      }, 150);

      const nextSunday = this.getNextSunday(this.selectedSaturday);
      const isNextSundayWorking = this.isSundayWorking(nextSunday);

      this.statusExplanation.textContent =
          `This Saturday is ${isOpen ? 'Open' : 'Closed'} based on alternating Sunday logic.`;

      this.statusDetails.textContent =
          `Next Sunday (${nextSunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}) is ${isNextSundayWorking ? 'a working' : 'an off'} Sunday.`;
  }

  calculateStatistics() {
      let totalSaturdays = 0;
      let openSaturdays = 0;

      for (let month = 0; month < 12; month++) {
          const saturdays = this.getSaturdaysInMonth(2025, month);
          totalSaturdays += saturdays.length;

          saturdays.forEach(saturday => {
              if (this.isSaturdayOpen(saturday)) {
                  openSaturdays++;
              }
          });
      }

      const closedSaturdays = totalSaturdays - openSaturdays;
      const openPercentage = Math.round((openSaturdays / totalSaturdays) * 100);

      document.getElementById('totalSaturdays').textContent = totalSaturdays;
      document.getElementById('openSaturdays').textContent = openSaturdays;
      document.getElementById('closedSaturdays').textContent = closedSaturdays;
      document.getElementById('openPercentage').textContent = `${openPercentage}%`;
      document.getElementById('progressFill').style.width = `${openPercentage}%`;
  }

  goToToday() {
      const today = new Date();
      if (today.getFullYear() === 2025) {
          const nextSaturday = this.getNextSaturday(today);
          if (nextSaturday) {
              this.selectSaturday(nextSaturday);
          }
      } else {
          // If not 2025, go to first Saturday of 2025
          const firstSaturday = this.getSaturdaysInMonth(2025, 0)[0];
          this.selectSaturday(firstSaturday);
      }
  }

  goToNextSaturday() {
      const today = new Date();
      const nextSaturday = this.getNextSaturday(today);
      if (nextSaturday && nextSaturday.getFullYear() === 2025) {
          this.selectSaturday(nextSaturday);
      } else {
          // Get first Saturday of 2025
          const firstSaturday = this.getSaturdaysInMonth(2025, 0)[0];
          this.selectSaturday(firstSaturday);
      }
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
          baseSunday: this.baseSunday.toISOString().split('T')[0],
          isBaseSundayWorking: this.isBaseSundayWorking,
          saturdays: []
      };

      for (let month = 0; month < 12; month++) {
          const saturdays = this.getSaturdaysInMonth(2025, month);
          saturdays.forEach(saturday => {
              data.saturdays.push({
                  date: saturday.toISOString().split('T')[0],
                  status: this.isSaturdayOpen(saturday) ? 'OPEN' : 'CLOSED'
              });
          });
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'saturday-schedule-2025.json';
      a.click();
      URL.revokeObjectURL(url);
  }

  savePattern() {
      const patternName = this.patternNameInput.value.trim();
      if (!patternName) {
          alert('Please enter a pattern name');
          return;
      }

      this.savedPatterns[patternName] = {
          baseSunday: this.baseSunday.toISOString().split('T')[0],
          isBaseSundayWorking: this.isBaseSundayWorking
      };

      this.saveToStorage('patterns', this.savedPatterns);

      // Show success feedback
      const originalText = this.savePatternBtn.textContent;
      this.savePatternBtn.textContent = 'Saved!';
      this.savePatternBtn.style.background = 'var(--success-color)';

      setTimeout(() => {
          this.savePatternBtn.textContent = originalText;
          this.savePatternBtn.style.background = '';
      }, 2000);
  }

  loadPattern() {
      const patternNames = Object.keys(this.savedPatterns);
      if (patternNames.length === 0) {
          alert('No saved patterns found');
          return;
      }

      const selectedPattern = prompt(`Select pattern:\n${patternNames.join('\n')}`);
      if (selectedPattern && this.savedPatterns[selectedPattern]) {
          const pattern = this.savedPatterns[selectedPattern];
          this.baseSundayInput.value = pattern.baseSunday;
          this.isBaseSundayWorkingCheckbox.checked = pattern.isBaseSundayWorking;
          this.patternNameInput.value = selectedPattern;

          this.updateBaseSunday();
          this.updateBaseSundayWorking();
      }
  }

  resetPattern() {
      this.baseSundayInput.value = '2024-04-28';
      this.isBaseSundayWorkingCheckbox.checked = true;
      this.patternNameInput.value = 'Default Pattern';

      this.updateBaseSunday();
      this.updateBaseSundayWorking();
  }

  saveSettings() {
      const settings = {
          baseSunday: this.baseSunday.toISOString().split('T')[0],
          isBaseSundayWorking: this.isBaseSundayWorking,
          patternName: this.patternNameInput.value
      };
      this.saveToStorage('settings', settings);
  }

  loadSettings() {
      const settings = this.loadFromStorage('settings');
      if (settings) {
          this.baseSundayInput.value = settings.baseSunday;
          this.isBaseSundayWorkingCheckbox.checked = settings.isBaseSundayWorking;
          this.patternNameInput.value = settings.patternName || 'Default Pattern';

          this.updateBaseSunday();
          this.updateBaseSundayWorking();
      }
  }

  saveToStorage(key, data) {
      try {
          localStorage.setItem(`saturdayChecker_${key}`, JSON.stringify(data));
      } catch (e) {
          console.warn('Could not save to localStorage:', e);
      }
  }

  loadFromStorage(key) {
      try {
          const data = localStorage.getItem(`saturdayChecker_${key}`);
          return data ? JSON.parse(data) : null;
      } catch (e) {
          console.warn('Could not load from localStorage:', e);
          return null;
      }
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
  new EnhancedSaturdayStatusChecker();
});
