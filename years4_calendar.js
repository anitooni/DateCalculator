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
    var chips = document.querySelectorAll('#mobile_4y_nav .year-chip');

    for (var offset = 0; offset < 4; offset++) {
      var yearNum = baseYearCache + offset;
      var suffix = '_y' + (offset + 1);
      var yearLabel = document.getElementById('year_' + (offset + 1));
      if (yearLabel) {
        yearLabel.textContent = yearNum;
      }
      if (chips[offset]) {
        chips[offset].textContent = yearNum;
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
      var btn = e.target.closest('.year-scroll-btn, .year-chip');
      if (btn) {
        var targetId = btn.getAttribute('data-scroll-target');
        var targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // 모바일 터치 시 공휴일명 토스트 표시
      if (window.innerWidth <= 768) {
        var holidayCell = e.target.closest('td[data-holiday]');
        if (holidayCell) {
          var toast = document.getElementById('toast-container');
          if (toast) {
            toast.textContent = holidayCell.getAttribute('data-holiday');
            toast.classList.add('show');
            clearTimeout(toast._t);
            toast._t = setTimeout(function () { toast.classList.remove('show'); }, 1400);
          }
        }
      }
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
