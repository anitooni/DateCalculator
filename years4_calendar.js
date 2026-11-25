(function (global) {
  'use strict';

  var initialized = false;
  var baseYearCache = new Date().getFullYear();

  function getRegion() {
    return typeof global.getActiveRegion === 'function' ? global.getActiveRegion() : 'KR';
  }

  function renderAllFourYears() {
    var region = getRegion();
    var todayKey = global.CalendarCore.formatDateKey(new Date());
    var monthIds = global.CalendarCore.MONTH_IDS;

    for (var offset = 0; offset < 4; offset++) {
      var yearNum = baseYearCache + offset;
      var suffix = '_y' + (offset + 1);
      var yearLabel = document.getElementById('year_' + (offset + 1));
      if (yearLabel) {
        yearLabel.textContent = yearNum;
      }

      var holidayMap = global.CalendarCore.buildYearHolidayLookup(region, yearNum);
      for (var m = 0; m < 12; m++) {
        var el = document.getElementById(monthIds[m] + suffix);
        if (el) {
          el.innerHTML = global.CalendarCore.buildMonthTableHtml({
            year: yearNum,
            monthIndex: m,
            holidayMap: holidayMap,
            todayKey: todayKey,
            clickable: false,
            variant: 'mini'
          });
        }
      }
    }
  }

  function loadAllFourYearsHolidays() {
    var region = getRegion();
    var tasks = [];
    for (var i = 0; i < 4; i++) {
      tasks.push(global.HolidayService.ensureYearLoaded(region, baseYearCache + i));
    }
    return Promise.all(tasks).then(function () {
      if (getRegion() === region) {
        renderAllFourYears();
      }
    });
  }

  global.refreshFourYearCalendarHolidays = function () {
    if (!initialized) return;
    renderAllFourYears();
    loadAllFourYearsHolidays();
  };

  function bindScrollButtons(containerEl) {
    if (!containerEl) return;
    containerEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.year-scroll-btn');
      if (!btn) return;
      var targetId = btn.getAttribute('data-scroll-target');
      var targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  global.initFourYearCalendar = function (startYear) {
    if (initialized) return;
    initialized = true;

    baseYearCache = startYear || new Date().getFullYear();
    var containerEl = document.getElementById('cal_4y');
    global.CalendarCore.bindDelegatedTooltip(containerEl);
    bindScrollButtons(containerEl);
    renderAllFourYears();
    loadAllFourYearsHolidays();
  };
})(window);
