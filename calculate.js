(function (global) {
  'use strict';

  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var COPY_BTN_COUNT = 6;

  var now = new Date();
  var todayKey = '';
  var currentYear = now.getFullYear();
  var mobileMonth = now.getMonth();
  var activeRegion = 'KR';
  var startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var endDate = new Date(startDate.getTime());
  var toastTimer = null;

  var dom = {};

  function formatDisplayDate(date) {
    return global.HolidayService.formatDateByRegion(date, activeRegion) + ' (' + WEEKDAYS[date.getDay()] + ')';
  }

  function formatTodayLabel(date) {
    return 'Today: ' + global.HolidayService.formatDateByRegion(date, activeRegion);
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

  function blinkSelectedDate() {
    var el = dom.selectedDate;
    if (!el) return;
    el.classList.remove('blink');
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

  function renderGlobalHolidays() {
    var countries = [activeRegion].concat(
      global.HolidayService.REGION_ORDER.filter(function (code) {
        return code !== activeRegion;
      })
    );

    for (var i = 0; i < dom.globalRows.length; i++) {
      var code = countries[i];
      var row = dom.globalRows[i];
      if (!code) continue;

      var hName = global.HolidayService.match(code, endDate);
      row.codeEl.textContent = code + ':';
      row.resultEl.textContent = hName;
      row.rowEl.style.color = hName !== 'Working day' ? '#f03e3e' : '#343a40';
    }
  }

  function updateHolidayLabels() {
    var primaryHoliday = global.HolidayService.match(activeRegion, endDate);
    dom.holiday.textContent = primaryHoliday;
    var primaryColor = primaryHoliday !== 'Working day' ? '#f03e3e' : '#4263eb';
    dom.holiday.style.color = primaryColor;
    dom.calculatedDate.style.color = primaryColor;

    renderGlobalHolidays();
  }

  function renderYearCalendar() {
    var holidayMap = global.CalendarCore.buildYearHolidayLookup(activeRegion, currentYear);
    var selectedKey = global.CalendarCore.formatDateKey(startDate);

    for (var m = 0; m < 12; m++) {
      dom.monthEls[m].innerHTML = global.CalendarCore.buildMonthTableHtml({
        year: currentYear,
        monthIndex: m,
        holidayMap: holidayMap,
        todayKey: todayKey,
        selectedKey: selectedKey,
        clickable: true,
        variant: 'year'
      });
    }
  }

  function updateSelectedCellHighlight() {
    var prev = dom.viewCal.querySelector('td.ncal-selected');
    if (prev) prev.classList.remove('ncal-selected');
    var targetKey = global.CalendarCore.formatDateKey(startDate);
    var next = dom.viewCal.querySelector('td.ncal-day:not(.ncal-other)[data-date="' + targetKey + '"]');
    if (next) next.classList.add('ncal-selected');
  }

  function calculateDate() {
    var yOffset = parseInt(dom.yearCont.value, 10) || 0;
    var wOffset = (parseInt(dom.weekCont.value, 10) || 0) * 7;
    var dOffset = parseInt(dom.dayCont.value, 10) || 0;

    endDate = new Date(startDate.getFullYear() + yOffset, startDate.getMonth(), startDate.getDate() + wOffset + dOffset);

    dom.selectedDate.textContent = formatDisplayDate(startDate);
    dom.calculatedDate.textContent = formatDisplayDate(endDate);

    var includeYear = !!(dom.includeYearChks && dom.includeYearChks[0] && dom.includeYearChks[0].checked);
    var startFormats = global.HolidayService.getCopyFormatsByRegion(startDate, activeRegion, includeYear);
    var endFormats = global.HolidayService.getCopyFormatsByRegion(endDate, activeRegion, includeYear);

    for (var i = 0; i < COPY_BTN_COUNT; i++) {
      dom.startCopyBtns[i].textContent = startFormats[i] || '';
      dom.endCopyBtns[i].textContent = endFormats[i] || '';
    }

    updateHolidayLabels();

    var targetYear = endDate.getFullYear();
    global.HolidayService.ensureAllCountriesLoaded(targetYear).then(function () {
      if (endDate.getFullYear() === targetYear) {
        updateHolidayLabels();
      }
    });
  }

  function loadHolidaysForCalendarYear(year) {
    global.HolidayService.ensureYearLoaded(activeRegion, year).then(function () {
      if (currentYear === year) {
        renderYearCalendar();
        updateHolidayLabels();
      }
    });
  }

  function updateCalendarYear(targetYear) {
    if (targetYear === currentYear) return;
    currentYear = targetYear;
    dom.selectedYear.textContent = currentYear;
    global.CalendarCore.hideTooltip();
    renderYearCalendar();
    loadHolidaysForCalendarYear(currentYear);
  }

  function applyRegion(regionCode, savePreference) {
    if (!global.HolidayService.SUPPORTED_REGIONS[regionCode]) return;
    activeRegion = regionCode;
    if (savePreference) {
      global.HolidayService.saveUserRegion(regionCode);
    }
    if (dom.regionSelector) {
      dom.regionSelector.value = activeRegion;
    }

    dom.showToday.textContent = formatTodayLabel(now);
    calculateDate();
    renderYearCalendar();
    loadHolidaysForCalendarYear(currentYear);

    if (typeof global.onRegionChange === 'function') {
      global.onRegionChange(activeRegion);
    }
    if (typeof global.refreshFourYearCalendarHolidays === 'function') {
      global.refreshFourYearCalendarHolidays();
    }
  }

  var currentTab = 'menu1';
  var resizeRafId = null;
  var MOBILE_BREAKPOINT = 768;

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function updateMobileMonthView() {
    if (!dom.monthEls || !dom.monthEls.length) return;
    for (var i = 0; i < dom.monthEls.length; i++) {
      dom.monthEls[i].classList.toggle('mobile-active-month', i === mobileMonth);
    }
    if (dom.mobileMonthLabel) {
      dom.mobileMonthLabel.textContent = currentYear + '. ' + global.CalendarCore.pad2(mobileMonth + 1);
    }
  }

  function shiftMobileMonth(delta) {
    mobileMonth += delta;
    if (mobileMonth < 0) {
      mobileMonth = 11;
      updateCalendarYear(currentYear - 1);
    } else if (mobileMonth > 11) {
      mobileMonth = 0;
      updateCalendarYear(currentYear + 1);
    }
    updateMobileMonthView();
  }

  function fitActiveTabToViewport() {
    var mobile = isMobileViewport();
    document.documentElement.classList.toggle('is-mobile', mobile);

    if (mobile) {
      document.documentElement.classList.remove('fit-viewport', 'tab-4y');
      dom.endDatePanel.style.transform = '';
      dom.gapCalcPanel.style.transform = '';
      dom.cal4yPanel.style.transform = '';
      dom.cal4yPanel.style.marginBottom = '';
      updateMobileMonthView();
      return;
    }

    if (dom.navControls) {
      dom.navControls.classList.remove('mobile-open');
    }

    var isFitTab = currentTab === 'menu1' || currentTab === 'menu3';
    var is4yTab = currentTab === 'menu2';
    document.documentElement.classList.toggle('fit-viewport', isFitTab);
    document.documentElement.classList.toggle('tab-4y', is4yTab);

    var availW = Math.max(320, window.innerWidth - 160);
    var availH = Math.max(320, window.innerHeight - 50 - 80);

    var PROJECTION_RATIO = 0.85;

    if (is4yTab) {
      dom.endDatePanel.style.transform = '';
      dom.gapCalcPanel.style.transform = '';
      dom.cal4yPanel.style.transform = 'none';
      dom.cal4yPanel.style.marginBottom = '0px';

      var w4 = dom.cal4yPanel.offsetWidth;
      var h4 = dom.cal4yPanel.offsetHeight;
      if (!w4 || !h4) return;

      var scale4 = Math.max(0.45, Math.min(availW / w4, 1.55) * PROJECTION_RATIO);
      dom.cal4yPanel.style.transform = 'scale(' + scale4.toFixed(4) + ')';
      // scale 후 실제 시각 높이에 맞춰 하단 여백 보정 (빈 스크롤 제거 + 하단 여백 유지)
      dom.cal4yPanel.style.marginBottom = Math.round(h4 * (scale4 - 1)) + 'px';
      return;
    }

    dom.cal4yPanel.style.transform = '';
    dom.cal4yPanel.style.marginBottom = '';

    var targetEl = currentTab === 'menu1' ? dom.endDatePanel : dom.gapCalcPanel;
    targetEl.style.transform = 'none';

    var naturalW = targetEl.offsetWidth;
    var naturalH = targetEl.offsetHeight;
    if (!naturalW || !naturalH) return;

    var maxScale = currentTab === 'menu1' ? 1.75 : 1.45;
    var scale = Math.min(availW / naturalW, availH / naturalH, maxScale) * PROJECTION_RATIO;
    scale = Math.max(0.45, scale);

    targetEl.style.transform = 'scale(' + scale.toFixed(4) + ')';
  }

  function scheduleFitViewport() {
    if (resizeRafId) global.cancelAnimationFrame(resizeRafId);
    resizeRafId = global.requestAnimationFrame(function () {
      resizeRafId = null;
      fitActiveTabToViewport();
    });
  }

  function switchTab(tabId) {
    currentTab = tabId;
    global.CalendarCore.hideTooltip();

    dom.endDatePanel.style.display = tabId === 'menu1' ? 'flex' : 'none';
    dom.cal4yPanel.style.display = tabId === 'menu2' ? 'block' : 'none';
    dom.gapCalcPanel.style.display = tabId === 'menu3' ? 'flex' : 'none';

    for (var i = 0; i < dom.navLinks.length; i++) {
      dom.navLinks[i].classList.toggle('on', dom.navLinks[i].id === tabId);
    }

    if (tabId === 'menu2' && typeof global.initFourYearCalendar === 'function') {
      global.initFourYearCalendar(now.getFullYear());
    } else if (tabId === 'menu3' && typeof global.initDurationCalculator === 'function') {
      global.initDurationCalculator(activeRegion);
    }

    scheduleFitViewport();
  }

  var FONT_URLS = {
    jetbrains: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
    inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  };
  var loadedFonts = Object.create(null);

  function ensureFontLoaded(fontKey) {
    if (!FONT_URLS[fontKey] || loadedFonts[fontKey]) return;
    loadedFonts[fontKey] = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_URLS[fontKey];
    document.head.appendChild(link);
  }

  function cacheDom() {
    dom.navLinks = document.querySelectorAll('nav a[data-tab]');
    dom.navControls = document.getElementById('nav_controls');
    dom.mobileSettingsBtn = document.getElementById('mobile_settings_btn');
    dom.mobilePrevMonth = document.getElementById('mobile_prev_month');
    dom.mobileNextMonth = document.getElementById('mobile_next_month');
    dom.mobileTodayBtn = document.getElementById('mobile_today_btn');
    dom.mobileMonthLabel = document.getElementById('mobile_month_label');
    dom.fontSelector = document.getElementById('font_selector');
    dom.themeSelector = document.getElementById('theme_selector');
    dom.regionSelector = document.getElementById('region_selector');
    dom.endDatePanel = document.getElementById('end_date_calculator');
    dom.cal4yPanel = document.getElementById('cal_4y');
    dom.gapCalcPanel = document.getElementById('gap_calculate');

    dom.viewCal = document.getElementById('viewCal');
    dom.selectedYear = document.getElementById('selected_year');
    dom.selectedDate = document.getElementById('selected_date');
    dom.calculatedDate = document.getElementById('calculated_date');
    dom.calculatedDiv = document.getElementById('calculated_div');
    dom.showToday = document.getElementById('showToday');
    dom.holiday = document.getElementById('holiday');

    dom.yearCont = document.getElementById('yearCont');
    dom.weekCont = document.getElementById('weekCont');
    dom.dayCont = document.getElementById('dayCont');
    dom.includeYearChks = document.querySelectorAll('.include-year-chk');

    dom.btnPrev = document.getElementById('prev');
    dom.btnNext = document.getElementById('next');
    dom.calculateSidebar = document.getElementById('calculate');
    dom.toast = document.getElementById('toast-container');

    dom.monthEls = global.CalendarCore.MONTH_IDS.map(function (id) {
      return document.getElementById(id);
    });

    dom.startCopyBtns = [];
    dom.endCopyBtns = [];
    for (var i = 1; i <= COPY_BTN_COUNT; i++) {
      dom.startCopyBtns.push(document.getElementById('f1-' + i));
      dom.endCopyBtns.push(document.getElementById('f2-' + i));
    }

    dom.globalRows = [];
    var rowEls = document.querySelectorAll('#global_holiday .global-holiday-row');
    for (var r = 0; r < rowEls.length; r++) {
      dom.globalRows.push({
        rowEl: rowEls[r],
        codeEl: rowEls[r].querySelector('.country-code'),
        resultEl: rowEls[r].querySelector('.country-result')
      });
    }
  }

  function bindEvents() {
    for (var i = 0; i < dom.navLinks.length; i++) {
      dom.navLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        switchTab(this.getAttribute('data-tab'));
      });
    }

    if (dom.fontSelector) {
      dom.fontSelector.addEventListener('change', function () {
        var fontKey = this.value;
        ensureFontLoaded(fontKey);
        document.documentElement.setAttribute('data-font', fontKey);
        try {
          global.localStorage.setItem('dc_font', fontKey);
        } catch (_) {}
        showToast('Font: ' + this.options[this.selectedIndex].text, 1000);
      });
    }

    if (dom.themeSelector) {
      dom.themeSelector.addEventListener('change', function () {
        var theme = this.value;
        document.documentElement.setAttribute('data-theme', theme);
        try {
          global.localStorage.setItem('dc_theme', theme);
        } catch (_) {}
        showToast('Theme: ' + this.options[this.selectedIndex].text, 1000);
        scheduleFitViewport();
      });
    }

    window.addEventListener('resize', scheduleFitViewport);

    if (dom.regionSelector) {
      dom.regionSelector.addEventListener('change', function () {
        applyRegion(this.value, true);
        var info = global.HolidayService.SUPPORTED_REGIONS[activeRegion];
        showToast('Region changed to ' + info.shortLabel + ' (' + info.dateFormat + ')', 1400);
      });
    }

    dom.yearCont.addEventListener('input', calculateDate);
    dom.weekCont.addEventListener('input', calculateDate);
    dom.dayCont.addEventListener('input', calculateDate);
    for (var y = 0; y < dom.includeYearChks.length; y++) {
      dom.includeYearChks[y].addEventListener('change', function () {
        var checked = this.checked;
        for (var k = 0; k < dom.includeYearChks.length; k++) {
          dom.includeYearChks[k].checked = checked;
        }
        calculateDate();
      });
    }

    dom.btnPrev.addEventListener('click', function () {
      updateCalendarYear(currentYear - 1);
    });

    dom.btnNext.addEventListener('click', function () {
      updateCalendarYear(currentYear + 1);
    });

    dom.showToday.addEventListener('click', function () {
      mobileMonth = now.getMonth();
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      updateCalendarYear(now.getFullYear());
      updateMobileMonthView();
      updateSelectedCellHighlight();
      blinkSelectedDate();
      calculateDate();
    });

    if (dom.mobilePrevMonth) {
      dom.mobilePrevMonth.addEventListener('click', function () { shiftMobileMonth(-1); });
    }
    if (dom.mobileNextMonth) {
      dom.mobileNextMonth.addEventListener('click', function () { shiftMobileMonth(1); });
    }
    if (dom.mobileTodayBtn) {
      dom.mobileTodayBtn.addEventListener('click', function () {
        mobileMonth = now.getMonth();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        updateCalendarYear(now.getFullYear());
        updateMobileMonthView();
        updateSelectedCellHighlight();
        calculateDate();
      });
    }
    if (dom.mobileSettingsBtn && dom.navControls) {
      dom.mobileSettingsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dom.navControls.classList.toggle('mobile-open');
      });
      document.addEventListener('click', function (e) {
        if (!dom.navControls.classList.contains('mobile-open')) return;
        if (!e.target.closest('#nav_controls') && !e.target.closest('#mobile_settings_btn')) {
          dom.navControls.classList.remove('mobile-open');
        }
      });
    }

    // 단일 이벤트 위임으로 12개월 모든 날짜 클릭 처리
    dom.viewCal.addEventListener('click', function (e) {
      var cell = e.target.closest('td[data-date]');
      if (!cell) return;
      var parts = cell.getAttribute('data-date').split('-');
      startDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      mobileMonth = startDate.getMonth();
      blinkSelectedDate();
      updateSelectedCellHighlight();
      calculateDate();
      if (isMobileViewport() && cell.getAttribute('data-holiday')) {
        showToast(cell.getAttribute('data-holiday'), 1400);
      }
    });

    global.CalendarCore.bindDelegatedTooltip(dom.viewCal);

    dom.calculatedDiv.addEventListener('click', function () {
      blinkSelectedDate();
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      dom.yearCont.value = 0;
      dom.weekCont.value = 0;
      dom.dayCont.value = 0;
      if (startDate.getFullYear() !== currentYear) {
        mobileMonth = startDate.getMonth();
        updateCalendarYear(startDate.getFullYear());
      } else {
        mobileMonth = startDate.getMonth();
        updateSelectedCellHighlight();
      }
      updateMobileMonthView();
      calculateDate();
      showToast('END DATE is moved to START DATE.', 1800);
    });

    dom.calculateSidebar.addEventListener('click', function (e) {
      var stepBtn = e.target.closest('.step-btn');
      if (stepBtn) {
        var targetInput = document.getElementById(stepBtn.getAttribute('data-target'));
        if (!targetInput) return;
        var delta = parseInt(stepBtn.getAttribute('data-step'), 10) || 0;
        var minVal = parseInt(targetInput.min, 10);
        var maxVal = parseInt(targetInput.max, 10);
        var nextVal = (parseInt(targetInput.value, 10) || 0) + delta;
        if (!isNaN(minVal) && nextVal < minVal) nextVal = minVal;
        if (!isNaN(maxVal) && nextVal > maxVal) nextVal = maxVal;
        targetInput.value = nextVal;
        calculateDate();
        return;
      }

      var btn = e.target.closest('.txt');
      if (!btn) return;
      var text = btn.textContent.trim();
      copyToClipboard(text);
      showToast("'" + text + "' is copied", 700);
    });
  }

  function sortRegionDropdown(accessRegion) {
    if (!dom.regionSelector) return;
    var ordered = [accessRegion].concat(
      global.HolidayService.REGION_ORDER.filter(function (code) {
        return code !== accessRegion;
      })
    );
    var optionsByValue = Object.create(null);
    var opts = dom.regionSelector.options;
    for (var i = 0; i < opts.length; i++) {
      optionsByValue[opts[i].value] = opts[i];
    }
    for (var j = 0; j < ordered.length; j++) {
      if (optionsByValue[ordered[j]]) {
        dom.regionSelector.appendChild(optionsByValue[ordered[j]]);
      }
    }
  }

  global.getActiveRegion = function () {
    return activeRegion;
  };

  document.addEventListener('DOMContentLoaded', function () {
    todayKey = global.CalendarCore.formatDateKey(now);
    cacheDom();
    if (dom.fontSelector) {
      var initialFont = document.documentElement.getAttribute('data-font') || 'plex';
      ensureFontLoaded(initialFont);
      dom.fontSelector.value = initialFont;
    }
    if (dom.themeSelector) {
      var initialTheme = document.documentElement.getAttribute('data-theme') || 'classic';
      dom.themeSelector.value = initialTheme;
    }
    var accessRegion = global.HolidayService.detectAccessRegion();
    sortRegionDropdown(accessRegion);
    activeRegion = global.HolidayService.detectUserRegion();
    if (dom.regionSelector) {
      dom.regionSelector.value = activeRegion;
    }

    dom.selectedYear.textContent = currentYear;
    dom.showToday.textContent = formatTodayLabel(now);
    dom.endDatePanel.style.display = 'flex';
    dom.gapCalcPanel.style.display = 'none';
    dom.cal4yPanel.style.display = 'none';

    bindEvents();
    renderYearCalendar();
    calculateDate();
    loadHolidaysForCalendarYear(currentYear);
    fitActiveTabToViewport();
  });
})(window);
