(function (global) {
  'use strict';

  var MS_PER_DAY = 86400000;
  var initialized = false;
  var sDate = null;
  var eDate = null;
  var startPicker = null;
  var endPicker = null;
  var dom = {};

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function formatYYYYMMDD(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function parseYYYYMMDD(dateString) {
    var parts = dateString.split('-');
    if (parts.length !== 3) return new Date();
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  function daysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  // 두 날짜 간 정확한 달력 기준 년/월/일, 총 월/일, 총 주/일, 총 일수 계산
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

  function createPickerOptions(fieldEl, onSelectCallback) {
    return {
      field: fieldEl,
      format: 'YYYY-MM-DD',
      position: 'bottom left',
      showWeekNumber: true,
      bound: false,
      toString: function (date) {
        return formatYYYYMMDD(date);
      },
      parse: function (dateString) {
        return parseYYYYMMDD(dateString);
      },
      onSelect: onSelectCallback
    };
  }

  global.initDurationCalculator = function () {
    if (initialized) return;
    initialized = true;

    var now = new Date();
    sDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    eDate = new Date(sDate.getTime());

    dom.startInput = document.getElementById('start_datepicker');
    dom.endInput = document.getElementById('end_datepicker');
    dom.resultAll = document.getElementById('result-all');
    dom.resultMonth = document.getElementById('result-month');
    dom.resultWeek = document.getElementById('result-week');
    dom.resultDay = document.getElementById('result-day');

    var todayStr = formatYYYYMMDD(sDate);
    dom.startInput.value = todayStr;
    dom.endInput.value = todayStr;
    renderGap(sDate, eDate);

    startPicker = new Pikaday(
      createPickerOptions(dom.startInput, function (date) {
        sDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        dom.startInput.value = formatYYYYMMDD(sDate);
        renderGap(sDate, eDate);
      })
    );

    endPicker = new Pikaday(
      createPickerOptions(dom.endInput, function (date) {
        eDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        dom.endInput.value = formatYYYYMMDD(eDate);
        renderGap(sDate, eDate);
      })
    );

    startPicker.setDate(sDate, true);
    endPicker.setDate(eDate, true);
    startPicker.show();
    endPicker.show();
  };
})(window);
