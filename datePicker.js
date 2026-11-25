(function (global) {
  'use strict';

  var MS_PER_DAY = 86400000;
  var MIN_YEAR = 1950;
  var MAX_YEAR = 2050;
  var initialized = false;
  var currentRegion = 'KR';
  var sDate = null;
  var eDate = null;
  var startPicker = null;
  var endPicker = null;
  var dom = {};

  function formatDate(date) {
    return global.HolidayService.formatDateByRegion(date, currentRegion);
  }

  function isValidYMD(year, month, day) {
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    var d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
  }

  function parseTypedDate(raw) {
    var str = String(raw || '').trim();
    if (!str) return null;

    var y, m, d, match;

    if (/^\d{8}$/.test(str)) {
      y = parseInt(str.slice(0, 4), 10);
      m = parseInt(str.slice(4, 6), 10);
      d = parseInt(str.slice(6, 8), 10);
      return isValidYMD(y, m, d) ? new Date(y, m - 1, d) : null;
    }

    match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str);
    if (match) {
      y = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
      d = parseInt(match[3], 10);
      return isValidYMD(y, m, d) ? new Date(y, m - 1, d) : null;
    }

    match = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(str);
    if (match) {
      y = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
      d = parseInt(match[3], 10);
      return isValidYMD(y, m, d) ? new Date(y, m - 1, d) : null;
    }

    match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(str);
    if (match) {
      d = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
      y = parseInt(match[3], 10);
      return isValidYMD(y, m, d) ? new Date(y, m - 1, d) : null;
    }

    match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str);
    if (match) {
      y = parseInt(match[3], 10);
      if (currentRegion === 'US') {
        m = parseInt(match[1], 10);
        d = parseInt(match[2], 10);
      } else {
        d = parseInt(match[1], 10);
        m = parseInt(match[2], 10);
      }
      return isValidYMD(y, m, d) ? new Date(y, m - 1, d) : null;
    }

    return null;
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  function computePreciseDiff(d1, d2) {
    var utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    var utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    var start = utc1 <= utc2 ? d1 : d2;
    var end = utc1 <= utc2 ? d2 : d1;

    var totalDays = Math.round(Math.abs(utc2 - utc1) / MS_PER_DAY);

    var years = end.getFullYear() - start.getFullYear();
    var months = end.getMonth() - start.getMonth();
    var days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      var prevMonthYear = end.getMonth() === 0 ? end.getFullYear() - 1 : end.getFullYear();
      var prevMonthIndex = end.getMonth() === 0 ? 11 : end.getMonth() - 1;
      days += daysInMonth(prevMonthYear, prevMonthIndex);
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return {
      years: years,
      months: months,
      days: days,
      totalMonths: years * 12 + months,
      totalWeeks: Math.floor(totalDays / 7),
      remainWeekDays: totalDays % 7,
      totalDays: totalDays
    };
  }

  function renderGap(d1, d2) {
    var diff = computePreciseDiff(d1, d2);
    dom.resultAll.textContent = '= ' + diff.years + ' year(s), ' + diff.months + ' month(s), ' + diff.days + ' day(s)';
    dom.resultMonth.textContent = '= ' + diff.totalMonths + ' month(s), ' + diff.days + ' day(s)';
    dom.resultWeek.textContent = '= ' + diff.totalWeeks + ' week(s), ' + diff.remainWeekDays + ' day(s)';
    dom.resultDay.textContent = '= ' + diff.totalDays + ' day(s)';
  }

  function updatePlaceholders() {
    var info = global.HolidayService.SUPPORTED_REGIONS[currentRegion];
    var fmt = info ? info.dateFormat : 'YYYY-MM-DD';
    dom.startInput.placeholder = fmt;
    dom.endInput.placeholder = fmt;
  }

  // 경량 네이티브 인라인 데이트피커 (Pikaday 대체)
  function createNativePicker(containerEl, initialDate, onSelectDate) {
    var viewYear = initialDate.getFullYear();
    var viewMonth = initialDate.getMonth();
    var selectedDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate());
    var todayKey = global.CalendarCore.formatDateKey(new Date());

    var monthOptions = global.CalendarCore.MONTH_TITLES.map(function (name, idx) {
      return '<option value="' + idx + '">' + name + '</option>';
    }).join('');

    var yearOptions = [];
    for (var y = MIN_YEAR; y <= MAX_YEAR; y++) {
      yearOptions.push('<option value="' + y + '">' + y + '</option>');
    }

    containerEl.innerHTML =
      '<div class="npicker">' +
        '<div class="npicker-header">' +
          '<button type="button" class="npicker-nav npicker-prev" aria-label="Previous Month"><i class="fa-solid fa-chevron-left"></i></button>' +
          '<div class="npicker-selects">' +
            '<select class="npicker-month" aria-label="Month">' + monthOptions + '</select>' +
            '<select class="npicker-year" aria-label="Year">' + yearOptions.join('') + '</select>' +
          '</div>' +
          '<button type="button" class="npicker-nav npicker-next" aria-label="Next Month"><i class="fa-solid fa-chevron-right"></i></button>' +
        '</div>' +
        '<div class="npicker-body"></div>' +
      '</div>';

    var prevBtn = containerEl.querySelector('.npicker-prev');
    var nextBtn = containerEl.querySelector('.npicker-next');
    var monthSelect = containerEl.querySelector('.npicker-month');
    var yearSelect = containerEl.querySelector('.npicker-year');
    var bodyEl = containerEl.querySelector('.npicker-body');

    function ensureYearOption(yNum) {
      if (yNum >= MIN_YEAR && yNum <= MAX_YEAR) return;
      if (!yearSelect.querySelector('option[value="' + yNum + '"]')) {
        var opt = document.createElement('option');
        opt.value = String(yNum);
        opt.textContent = String(yNum);
        yearSelect.appendChild(opt);
      }
    }

    function render() {
      ensureYearOption(viewYear);
      monthSelect.value = String(viewMonth);
      yearSelect.value = String(viewYear);

      var holidayMap = global.CalendarCore.buildYearHolidayLookup(currentRegion, viewYear);
      bodyEl.innerHTML = global.CalendarCore.buildMonthTableHtml({
        year: viewYear,
        monthIndex: viewMonth,
        holidayMap: holidayMap,
        todayKey: todayKey,
        selectedKey: global.CalendarCore.formatDateKey(selectedDate),
        clickable: true,
        showTitle: false,
        variant: 'picker'
      });
    }

    function loadYearHolidays() {
      var targetYear = viewYear;
      var targetRegion = currentRegion;
      global.HolidayService.ensureYearLoaded(targetRegion, targetYear).then(function () {
        if (viewYear === targetYear && currentRegion === targetRegion) {
          render();
        }
      });
    }

    prevBtn.addEventListener('click', function () {
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      render();
      loadYearHolidays();
    });

    nextBtn.addEventListener('click', function () {
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      render();
      loadYearHolidays();
    });

    monthSelect.addEventListener('change', function () {
      viewMonth = parseInt(this.value, 10);
      render();
    });

    yearSelect.addEventListener('change', function () {
      viewYear = parseInt(this.value, 10);
      render();
      loadYearHolidays();
    });

    bodyEl.addEventListener('click', function (e) {
      var cell = e.target.closest('td[data-date]');
      if (!cell) return;
      var parts = cell.getAttribute('data-date').split('-');
      selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      viewYear = selectedDate.getFullYear();
      viewMonth = selectedDate.getMonth();
      render();
      onSelectDate(selectedDate);
    });

    global.CalendarCore.bindDelegatedTooltip(bodyEl);

    render();
    loadYearHolidays();

    return {
      setDate: function (date) {
        selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        viewYear = selectedDate.getFullYear();
        viewMonth = selectedDate.getMonth();
        render();
        loadYearHolidays();
      },
      refresh: function () {
        render();
        loadYearHolidays();
      }
    };
  }

  function bindManualInput(inputEl, isStart) {
    inputEl.addEventListener('input', function () {
      var parsed = parseTypedDate(inputEl.value);
      if (!parsed) {
        inputEl.classList.add('input-invalid');
        return;
      }

      inputEl.classList.remove('input-invalid');
      if (isStart) {
        sDate = parsed;
        startPicker.setDate(parsed);
      } else {
        eDate = parsed;
        endPicker.setDate(parsed);
      }
      renderGap(sDate, eDate);
    });

    function commitInput() {
      var parsed = parseTypedDate(inputEl.value);
      inputEl.classList.remove('input-invalid');
      if (parsed) {
        if (isStart) {
          sDate = parsed;
          startPicker.setDate(parsed);
        } else {
          eDate = parsed;
          endPicker.setDate(parsed);
        }
        inputEl.value = formatDate(parsed);
        renderGap(sDate, eDate);
      } else {
        inputEl.value = formatDate(isStart ? sDate : eDate);
      }
    }

    inputEl.addEventListener('blur', commitInput);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        commitInput();
        inputEl.blur();
      }
    });
  }

  global.onRegionChange = function (regionCode) {
    currentRegion = regionCode;
    if (!initialized) return;
    updatePlaceholders();
    dom.startInput.classList.remove('input-invalid');
    dom.endInput.classList.remove('input-invalid');
    dom.startInput.value = formatDate(sDate);
    dom.endInput.value = formatDate(eDate);
    if (startPicker) startPicker.refresh();
    if (endPicker) endPicker.refresh();
  };

  global.initDurationCalculator = function (regionCode) {
    if (regionCode) {
      currentRegion = regionCode;
    } else if (typeof global.getActiveRegion === 'function') {
      currentRegion = global.getActiveRegion();
    }

    if (initialized) {
      updatePlaceholders();
      dom.startInput.value = formatDate(sDate);
      dom.endInput.value = formatDate(eDate);
      startPicker.refresh();
      endPicker.refresh();
      return;
    }
    initialized = true;

    var now = new Date();
    sDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    eDate = new Date(sDate.getTime());

    dom.startInput = document.getElementById('start_datepicker');
    dom.endInput = document.getElementById('end_datepicker');
    dom.startPickerBox = document.getElementById('start_picker_box');
    dom.endPickerBox = document.getElementById('end_picker_box');
    dom.resultAll = document.getElementById('result-all');
    dom.resultMonth = document.getElementById('result-month');
    dom.resultWeek = document.getElementById('result-week');
    dom.resultDay = document.getElementById('result-day');

    updatePlaceholders();
    var todayFormatted = formatDate(sDate);
    dom.startInput.value = todayFormatted;
    dom.endInput.value = todayFormatted;
    renderGap(sDate, eDate);

    startPicker = createNativePicker(dom.startPickerBox, sDate, function (date) {
      sDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      dom.startInput.classList.remove('input-invalid');
      dom.startInput.value = formatDate(sDate);
      renderGap(sDate, eDate);
    });

    endPicker = createNativePicker(dom.endPickerBox, eDate, function (date) {
      eDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      dom.endInput.classList.remove('input-invalid');
      dom.endInput.value = formatDate(eDate);
      renderGap(sDate, eDate);
    });

    bindManualInput(dom.startInput, true);
    bindManualInput(dom.endInput, false);
  };
})(window);
