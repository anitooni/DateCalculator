(function (global) {
  'use strict';

  var MONTH_IDS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var COUNTRIES = [
    { key: 'cn', rowId: 'CN_holiday', resultId: 'CN_result' },
    { key: 'ge', rowId: 'GE_holiday', resultId: 'GE_result' },
    { key: 'jp', rowId: 'JP_holiday', resultId: 'JP_result' },
    { key: 'uk', rowId: 'UK_holiday', resultId: 'UK_result' },
    { key: 'us', rowId: 'US_holiday', resultId: 'US_result' }
  ];
  var COPY_FORMATS = ['DMmm', 'DMmmYY', 'MD', 'YYMD', 'YYYYMMDD'];

  var now = new Date();
  var currentYear = now.getFullYear();
  var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var endDate = new Date(startDate.getTime());
  var calendars = [];
  var toastTimer = null;

  var dom = {};

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function formatDisplayDate(date) {
    return (
      date.getFullYear() + '-' +
      pad2(date.getMonth() + 1) + '-' +
      pad2(date.getDate()) +
      ' (' + WEEKDAYS[date.getDay()] + ')'
    );
  }

  function formatTodayLabel(date) {
    return (
      'Today: ' +
      date.getFullYear() + '-' +
      pad2(date.getMonth() + 1) + '-' +
      pad2(date.getDate())
    );
  }

  function formatCopyDate(date, type) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    switch (type) {
      case 'DMmm':
        return day + ' ' + MONTH_IDS[month] + (month === 4 ? '' : '.');
      case 'DMmmYY':
        return day + ' ' + MONTH_IDS[month] + (month === 4 ? '' : '.') + ' ' + String(year).slice(-2);
      case 'MD':
        return (month + 1) + '/' + day;
      case 'YYMD':
        return "'" + String(year).slice(-2) + '.' + (month + 1) + '/' + day;
      case 'YYYYMMDD':
        return year + '-' + pad2(month + 1) + '-' + pad2(day);
      default:
        return '';
    }
  }

  function showToast(message, durationMs) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      dom.toast.classList.remove('show');
    }, durationMs || 800);
  }

  function showTooltip(targetEl, text) {
    var tip = dom.tooltip;
    if (!tip || !text) return;
    tip.textContent = text;
    tip.classList.add('visible');

    var rect = targetEl.getBoundingClientRect();
    var tipRect = tip.getBoundingClientRect();
    var left = rect.left + (rect.width - tipRect.width) / 2 + window.scrollX;
    var top = rect.top - tipRect.height - 8 + window.scrollY;

    if (left < 4) left = 4;
    if (top < 4) top = rect.bottom + 8 + window.scrollY;

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function hideTooltip() {
    if (dom.tooltip) {
      dom.tooltip.classList.remove('visible');
    }
  }

  function blinkSelectedDate() {
    var el = dom.selectedDate;
    if (!el) return;
    el.classList.remove('blink');
    // Reflow to restart CSS animation cleanly
    void el.offsetWidth;
    el.classList.add('blink');
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function calculateDate() {
    var yOffset = parseInt(dom.yearCont.value, 10) || 0;
    var wOffset = (parseInt(dom.weekCont.value, 10) || 0) * 7;
    var dOffset = parseInt(dom.dayCont.value, 10) || 0;

    endDate = new Date(startDate.getFullYear() + yOffset, startDate.getMonth(), startDate.getDate() + wOffset + dOffset);

    var endDateFormatted = formatDisplayDate(endDate);
    dom.calculatedDate.textContent = endDateFormatted;

    for (var i = 0; i < COPY_FORMATS.length; i++) {
      var fmt = COPY_FORMATS[i];
      dom.startCopyBtns[i].textContent = formatCopyDate(startDate, fmt);
      dom.endCopyBtns[i].textContent = formatCopyDate(endDate, fmt);
    }

    var koHoliday = global.HolidayService.match('ko', endDateFormatted);
    dom.holiday.textContent = koHoliday;
    var koColor = koHoliday !== 'Working day' ? '#f03e3e' : '#4263eb';
    dom.holiday.style.color = koColor;
    dom.calculatedDate.style.color = koColor;

    for (var c = 0; c < dom.countryNodes.length; c++) {
      var item = dom.countryNodes[c];
      var hName = global.HolidayService.match(item.key, endDateFormatted);
      item.resultEl.textContent = hName;
      item.rowEl.style.color = hName !== 'Working day' ? '#f03e3e' : '#343a40';
    }
  }

  function updateCalendarYear(targetYear) {
    if (targetYear === currentYear && calendars.length === 12) return;
    currentYear = targetYear;
    dom.selectedYear.textContent = currentYear;
    hideTooltip();

    for (var i = 0; i < calendars.length; i++) {
      calendars[i].gotoDate(new Date(currentYear, i, 1));
    }
  }

  function initCalendars() {
    var holidayEventsSource = function (fetchInfo, successCallback) {
      successCallback(global.HolidayService.getKoreanHolidayEvents(fetchInfo.start, fetchInfo.end));
    };

    for (var i = 0; i < MONTH_IDS.length; i++) {
      var cal = new FullCalendar.Calendar(document.getElementById(MONTH_IDS[i]), {
        initialDate: new Date(currentYear, i, 1),
        headerToolbar: { start: 'title', center: '', end: '' },
        titleFormat: { month: 'long' },
        aspectRatio: 1,
        contentHeight: 'auto',
        nowIndicator: true,
        editable: false,
        selectable: false,
        weekNumbers: true,
        weekText: '',
        showNonCurrentDates: true,
        events: holidayEventsSource,
        eventDidMount: function (info) {
          var title = info.event.title;
          info.el.addEventListener('mouseenter', function () {
            showTooltip(info.el, title);
          });
          info.el.addEventListener('mouseleave', hideTooltip);
        },
        dateClick: function (info) {
          blinkSelectedDate();
          startDate = new Date(info.date.getFullYear(), info.date.getMonth(), info.date.getDate());
          dom.selectedDate.textContent = formatDisplayDate(startDate);
          calculateDate();
        }
      });
      calendars.push(cal);
    }

    for (var j = 0; j < calendars.length; j++) {
      calendars[j].render();
    }

    calculateDate();
  }

  function switchTab(tabId) {
    hideTooltip();

    dom.endDatePanel.style.display = tabId === 'menu1' ? 'block' : 'none';
    dom.cal4yPanel.style.display = tabId === 'menu2' ? 'block' : 'none';
    dom.gapCalcPanel.style.display = tabId === 'menu3' ? 'flex' : 'none';

    for (var i = 0; i < dom.navLinks.length; i++) {
      dom.navLinks[i].classList.toggle('on', dom.navLinks[i].id === tabId);
    }

    // 지연 초기화: 사용자가 해당 탭을 처음 열 때만 무거운 4년 달력 / 피커를 생성
    if (tabId === 'menu2' && typeof global.initFourYearCalendar === 'function') {
      global.initFourYearCalendar(now.getFullYear());
    } else if (tabId === 'menu3' && typeof global.initDurationCalculator === 'function') {
      global.initDurationCalculator();
    }
  }

  function cacheDom() {
    dom.navLinks = document.querySelectorAll('nav a[data-tab]');
    dom.endDatePanel = document.getElementById('end_date_calculator');
    dom.cal4yPanel = document.getElementById('cal_4y');
    dom.gapCalcPanel = document.getElementById('gap_calculate');

    dom.selectedYear = document.getElementById('selected_year');
    dom.selectedDate = document.getElementById('selected_date');
    dom.calculatedDate = document.getElementById('calculated_date');
    dom.calculatedDiv = document.getElementById('calculated_div');
    dom.showToday = document.getElementById('showToday');
    dom.holiday = document.getElementById('holiday');

    dom.yearCont = document.getElementById('yearCont');
    dom.weekCont = document.getElementById('weekCont');
    dom.dayCont = document.getElementById('dayCont');

    dom.btnPrev = document.getElementById('prev');
    dom.btnNext = document.getElementById('next');
    dom.calculateSidebar = document.getElementById('calculate');
    dom.toast = document.getElementById('toast-container');
    dom.tooltip = document.getElementById('holiday-tooltip');

    dom.startCopyBtns = [];
    dom.endCopyBtns = [];
    for (var i = 1; i <= COPY_FORMATS.length; i++) {
      dom.startCopyBtns.push(document.getElementById('f1-' + i));
      dom.endCopyBtns.push(document.getElementById('f2-' + i));
    }

    dom.countryNodes = COUNTRIES.map(function (c) {
      return {
        key: c.key,
        rowEl: document.getElementById(c.rowId),
        resultEl: document.getElementById(c.resultId)
      };
    });
  }

  function bindEvents() {
    for (var i = 0; i < dom.navLinks.length; i++) {
      dom.navLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        switchTab(this.getAttribute('data-tab'));
      });
    }

    dom.yearCont.addEventListener('input', calculateDate);
    dom.weekCont.addEventListener('input', calculateDate);
    dom.dayCont.addEventListener('input', calculateDate);

    dom.btnPrev.addEventListener('click', function () {
      updateCalendarYear(currentYear - 1);
    });

    dom.btnNext.addEventListener('click', function () {
      updateCalendarYear(currentYear + 1);
    });

    dom.showToday.addEventListener('click', function () {
      updateCalendarYear(now.getFullYear());
    });

    dom.calculatedDiv.addEventListener('click', function () {
      blinkSelectedDate();
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      dom.selectedDate.textContent = formatDisplayDate(startDate);
      dom.yearCont.value = 0;
      dom.weekCont.value = 0;
      dom.dayCont.value = 0;
      updateCalendarYear(startDate.getFullYear());
      calculateDate();
      showToast('END DATE is moved to START DATE.', 1800);
    });

    // 이벤트 위임으로 복사 버튼 10개를 단일 리스너로 처리
    dom.calculateSidebar.addEventListener('click', function (e) {
      var btn = e.target.closest('.txt');
      if (!btn) return;
      var text = btn.textContent.trim();
      copyToClipboard(text);
      showToast("'" + text + "' is copied", 700);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    cacheDom();
    dom.selectedYear.textContent = currentYear;
    dom.selectedDate.textContent = formatDisplayDate(startDate);
    dom.calculatedDate.textContent = formatDisplayDate(endDate);
    dom.showToday.textContent = formatTodayLabel(now);
    dom.gapCalcPanel.style.display = 'none';
    dom.cal4yPanel.style.display = 'none';

    bindEvents();
    initCalendars();
  });
})(window);
