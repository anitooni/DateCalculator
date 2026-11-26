(function (global) {
  'use strict';

  var STORAGE_ORIGIN = 'dc_tz_origin_v1';
  var STORAGE_TARGETS = 'dc_tz_targets_v2';
  var STORAGE_24H = 'dc_tz_24h_v1';

  var CITIES = [
    { id: 'Asia/Seoul', city: 'Seoul', country: 'KR', flag: '🇰🇷', region: 'Asia' },
    { id: 'Asia/Tokyo', city: 'Tokyo', country: 'JP', flag: '🇯🇵', region: 'Asia' },
    { id: 'Asia/Shanghai', city: 'Shanghai', country: 'CN', flag: '🇨🇳', region: 'Asia' },
    { id: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'HK', flag: '🇭🇰', region: 'Asia' },
    { id: 'Asia/Taipei', city: 'Taipei', country: 'TW', flag: '🇹🇼', region: 'Asia' },
    { id: 'Asia/Singapore', city: 'Singapore', country: 'SG', flag: '🇸🇬', region: 'Asia' },
    { id: 'Asia/Bangkok', city: 'Bangkok', country: 'TH', flag: '🇹🇭', region: 'Asia' },
    { id: 'Asia/Ho_Chi_Minh', city: 'Ho Chi Minh', country: 'VN', flag: '🇻🇳', region: 'Asia' },
    { id: 'Asia/Jakarta', city: 'Jakarta', country: 'ID', flag: '🇮🇩', region: 'Asia' },
    { id: 'Asia/Kolkata', city: 'Bengaluru / Delhi', country: 'IN', flag: '🇮🇳', region: 'Asia' },
    { id: 'Asia/Dubai', city: 'Dubai', country: 'AE', flag: '🇦🇪', region: 'Middle East' },
    { id: 'Australia/Sydney', city: 'Sydney', country: 'AU', flag: '🇦🇺', region: 'Oceania' },
    { id: 'Pacific/Auckland', city: 'Auckland', country: 'NZ', flag: '🇳🇿', region: 'Oceania' },
    { id: 'Europe/London', city: 'London', country: 'UK', flag: '🇬🇧', region: 'Europe' },
    { id: 'Europe/Berlin', city: 'Frankfurt / Berlin', country: 'DE', flag: '🇩🇪', region: 'Europe' },
    { id: 'Europe/Paris', city: 'Paris', country: 'FR', flag: '🇫🇷', region: 'Europe' },
    { id: 'Europe/Amsterdam', city: 'Amsterdam', country: 'NL', flag: '🇳🇱', region: 'Europe' },
    { id: 'Europe/Zurich', city: 'Zurich', country: 'CH', flag: '🇨🇭', region: 'Europe' },
    { id: 'Europe/Madrid', city: 'Madrid', country: 'ES', flag: '🇪🇸', region: 'Europe' },
    { id: 'Europe/Rome', city: 'Rome', country: 'IT', flag: '🇮🇹', region: 'Europe' },
    { id: 'Europe/Stockholm', city: 'Stockholm', country: 'SE', flag: '🇸🇪', region: 'Europe' },
    { id: 'Europe/Warsaw', city: 'Warsaw', country: 'PL', flag: '🇵🇱', region: 'Europe' },
    { id: 'Europe/Prague', city: 'Prague', country: 'CZ', flag: '🇨🇿', region: 'Europe' },
    { id: 'Europe/Moscow', city: 'Moscow', country: 'RU', flag: '🇷🇺', region: 'Europe' },
    { id: 'Europe/Istanbul', city: 'Istanbul', country: 'TR', flag: '🇹🇷', region: 'Europe' },
    { id: 'America/New_York', city: 'New York', country: 'US', flag: '🇺🇸', region: 'Americas' },
    { id: 'America/Detroit', city: 'Detroit', country: 'US', flag: '🇺🇸', region: 'Americas' },
    { id: 'America/Chicago', city: 'Chicago', country: 'US', flag: '🇺🇸', region: 'Americas' },
    { id: 'America/Denver', city: 'Denver', country: 'US', flag: '🇺🇸', region: 'Americas' },
    { id: 'America/Los_Angeles', city: 'San Francisco / LA', country: 'US', flag: '🇺🇸', region: 'Americas' },
    { id: 'America/Toronto', city: 'Toronto', country: 'CA', flag: '🇨🇦', region: 'Americas' },
    { id: 'America/Vancouver', city: 'Vancouver', country: 'CA', flag: '🇨🇦', region: 'Americas' },
    { id: 'America/Mexico_City', city: 'Mexico City', country: 'MX', flag: '🇲🇽', region: 'Americas' },
    { id: 'America/Sao_Paulo', city: 'São Paulo', country: 'BR', flag: '🇧🇷', region: 'Americas' },
    { id: 'Pacific/Honolulu', city: 'Honolulu', country: 'US', flag: '🇺🇸', region: 'Americas' },
    { id: 'UTC', city: 'UTC', country: 'UTC', flag: '🌐', region: 'Standard' }
  ];

  var CITY_MAP = Object.create(null);
  for (var c = 0; c < CITIES.length; c++) {
    CITY_MAP[CITIES[c].id] = CITIES[c];
  }

  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var initialized = false;
  var originTz = 'Asia/Seoul';
  var targetTzs = ['America/New_York', 'America/Los_Angeles', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Shanghai'];
  var use24Hour = true;
  var originYear = 2026;
  var originMonth = 1; // 1..12
  var originDay = 1;
  var originHour = 9;
  var originMinute = 0;
  var calViewYear = 2026;
  var calViewMonth = 0; // 0..11
  var draggingTz = null;
  var justDragged = false;
  var toastTimer = null;
  var dom = {};

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function getRegionCode() {
    return typeof global.getActiveRegion === 'function' ? global.getActiveRegion() : 'KR';
  }

  function getZonedParts(epochMs, timeZone) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });
    var parts = dtf.formatToParts(new Date(epochMs));
    var out = {};
    for (var i = 0; i < parts.length; i++) {
      out[parts[i].type] = parts[i].value;
    }
    return {
      year: parseInt(out.year, 10),
      month: parseInt(out.month, 10),
      day: parseInt(out.day, 10),
      hour: parseInt(out.hour, 10) % 24,
      minute: parseInt(out.minute, 10),
      second: parseInt(out.second, 10)
    };
  }

  function getTimeZoneOffsetMinutes(epochMs, timeZone) {
    var p = getZonedParts(epochMs, timeZone);
    var asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return Math.round((asUtc - epochMs) / 60000);
  }

  function zonedWallTimeToUtc(year, month, day, hour, minute, timeZone) {
    var guess = Date.UTC(year, month - 1, day, hour, minute, 0);
    var offset1 = getTimeZoneOffsetMinutes(guess, timeZone);
    var utc1 = guess - offset1 * 60000;
    var offset2 = getTimeZoneOffsetMinutes(utc1, timeZone);
    return guess - offset2 * 60000;
  }

  function getTimeZoneAbbr(epochMs, timeZone) {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        timeZoneName: 'short'
      }).formatToParts(new Date(epochMs));
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === 'timeZoneName') return parts[i].value;
      }
    } catch (_) {}
    return '';
  }

  function isDstActive(epochMs, timeZone) {
    var y = getZonedParts(epochMs, timeZone).year;
    var janOffset = getTimeZoneOffsetMinutes(Date.UTC(y, 0, 1, 12, 0), timeZone);
    var julOffset = getTimeZoneOffsetMinutes(Date.UTC(y, 6, 1, 12, 0), timeZone);
    if (janOffset === julOffset) return false;
    var stdOffset = Math.min(janOffset, julOffset);
    return getTimeZoneOffsetMinutes(epochMs, timeZone) > stdOffset;
  }

  function formatUtcOffset(offsetMin) {
    var sign = offsetMin >= 0 ? '+' : '-';
    var abs = Math.abs(offsetMin);
    var h = Math.floor(abs / 60);
    var m = abs % 60;
    return 'UTC' + sign + h + (m ? ':' + pad2(m) : '');
  }

  function formatDiffHours(diffMin) {
    if (diffMin === 0) return '±0h';
    var sign = diffMin > 0 ? '+' : '-';
    var abs = Math.abs(diffMin);
    var h = Math.floor(abs / 60);
    var m = abs % 60;
    if (m === 0) return sign + h + 'h';
    if (m === 30) return sign + h + '.5h';
    return sign + h + 'h ' + m + 'm';
  }

  function formatTimeString(hour, minute) {
    if (use24Hour) {
      return pad2(hour) + ':' + pad2(minute);
    }
    var period = hour >= 12 ? 'PM' : 'AM';
    var h12 = hour % 12 || 12;
    return h12 + ':' + pad2(minute) + ' ' + period;
  }

  function getWorkStatus(hour) {
    if (hour >= 9 && hour < 18) {
      return { cls: 'tz-status-work', label: 'Working hours' };
    }
    if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 21)) {
      return { cls: 'tz-status-edge', label: 'Off-peak' };
    }
    return { cls: 'tz-status-night', label: 'Night' };
  }

  function formatDateDisplay(y, m, d) {
    var dateObj = new Date(y, m - 1, d);
    var formatted = global.HolidayService.formatDateByRegion(dateObj, getRegionCode());
    return formatted + ' (' + WEEKDAYS[dateObj.getDay()] + ')';
  }

  function showToast(msg) {
    var el = document.getElementById('toast-container');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('show');
    }, 1100);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  function saveState() {
    try {
      global.localStorage.setItem(STORAGE_ORIGIN, originTz);
      global.localStorage.setItem(STORAGE_TARGETS, JSON.stringify(targetTzs));
      global.localStorage.setItem(STORAGE_24H, use24Hour ? '1' : '0');
    } catch (_) {}
  }

  function detectDefaultOriginTz() {
    try {
      var detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected && CITY_MAP[detected]) return detected;
    } catch (_) {}
    var region = getRegionCode();
    var fallbackMap = {
      KR: 'Asia/Seoul',
      JP: 'Asia/Tokyo',
      DE: 'Europe/Berlin',
      US: 'America/New_York',
      IN: 'Asia/Kolkata',
      CN: 'Asia/Shanghai'
    };
    return fallbackMap[region] || 'Asia/Seoul';
  }

  function loadState() {
    var detected = detectDefaultOriginTz();
    originTz = detected;

    try {
      var savedOrigin = global.localStorage.getItem(STORAGE_ORIGIN);
      if (savedOrigin && CITY_MAP[savedOrigin]) originTz = savedOrigin;

      var savedTargets = global.localStorage.getItem(STORAGE_TARGETS);
      if (savedTargets) {
        var parsed = JSON.parse(savedTargets);
        if (Array.isArray(parsed) && parsed.length > 0) {
          targetTzs = parsed.filter(function (id) { return !!CITY_MAP[id]; });
        }
      } else {
        var defaults = [
          'America/New_York',
          'America/Los_Angeles',
          'Europe/Berlin',
          'Asia/Kolkata',
          'Asia/Tokyo',
          'Asia/Shanghai',
          'Asia/Seoul'
        ];
        targetTzs = defaults.filter(function (id) { return id !== originTz; }).slice(0, 6);
      }

      var saved24 = global.localStorage.getItem(STORAGE_24H);
      if (saved24 === '0') use24Hour = false;
    } catch (_) {}
  }

  function setOriginToNow() {
    var parts = getZonedParts(Date.now(), originTz);
    originYear = parts.year;
    originMonth = parts.month;
    originDay = parts.day;
    originHour = parts.hour;
    originMinute = parts.minute;
    calViewYear = originYear;
    calViewMonth = originMonth - 1;
  }

  function buildCityOptionsHtml(excludeIds) {
    var excluded = Object.create(null);
    if (excludeIds) {
      for (var i = 0; i < excludeIds.length; i++) excluded[excludeIds[i]] = true;
    }
    var groups = {};
    var order = [];
    for (var j = 0; j < CITIES.length; j++) {
      var c = CITIES[j];
      if (excluded[c.id]) continue;
      if (!groups[c.region]) {
        groups[c.region] = [];
        order.push(c.region);
      }
      groups[c.region].push(c);
    }
    var html = [];
    for (var g = 0; g < order.length; g++) {
      var region = order[g];
      html.push('<optgroup label="' + region + '">');
      var list = groups[region];
      for (var k = 0; k < list.length; k++) {
        var item = list[k];
        html.push('<option value="' + item.id + '">' + item.flag + ' ' + item.city + ' (' + item.country + ')</option>');
      }
      html.push('</optgroup>');
    }
    return html.join('');
  }

  function refreshCityDropdowns() {
    dom.originSelect.innerHTML = buildCityOptionsHtml(null);
    dom.originSelect.value = originTz;

    dom.addCitySelect.innerHTML =
      '<option value="">+ Add City...</option>' +
      buildCityOptionsHtml(targetTzs);
    dom.addCitySelect.value = '';
  }

  function renderOriginCalendar() {
    var todayKey = global.CalendarCore.formatDateKey(new Date());
    var selectedKey = originYear + '-' + pad2(originMonth) + '-' + pad2(originDay);
    var region = getRegionCode();
    var holidayMap = global.CalendarCore.buildYearHolidayLookup(region, calViewYear);

    dom.calMonthLabel.textContent = global.CalendarCore.MONTH_TITLES[calViewMonth] + ' ' + calViewYear;
    dom.calBody.innerHTML = global.CalendarCore.buildMonthTableHtml({
      year: calViewYear,
      monthIndex: calViewMonth,
      holidayMap: holidayMap,
      todayKey: todayKey,
      selectedKey: selectedKey,
      clickable: true,
      showTitle: false,
      variant: 'picker'
    });
  }

  function updateFormatToggleUi() {
    dom.formatToggleBtn.classList.toggle('is-24h', use24Hour);
    dom.formatToggleBtn.setAttribute('aria-checked', use24Hour ? 'true' : 'false');
  }

  function syncOriginInputs() {
    var dateObj = new Date(originYear, originMonth - 1, originDay);
    dom.dateInput.value = global.HolidayService.formatDateByRegion(dateObj, getRegionCode());
    dom.hourInput.value = pad2(originHour);
    dom.minInput.value = pad2(originMinute);
    dom.timeSlider.value = String(originHour * 60 + originMinute);
    updateFormatToggleUi();
  }

  function renderResults() {
    var epochMs = zonedWallTimeToUtc(originYear, originMonth, originDay, originHour, originMinute, originTz);
    var originOffset = getTimeZoneOffsetMinutes(epochMs, originTz);
    var originAbbr = getTimeZoneAbbr(epochMs, originTz);
    var originDst = isDstActive(epochMs, originTz);

    dom.originMeta.innerHTML =
      '<span>' + originAbbr + ' (' + formatUtcOffset(originOffset) + ')</span>' +
      (originDst ? '<span class="tz-dst-badge">DST</span>' : '');

    var originDayStamp = Date.UTC(originYear, originMonth - 1, originDay);
    var cards = [];

    if (targetTzs.length === 0) {
      dom.targetList.innerHTML = '<div class="tz-empty">Add cities from the dropdown above to compare times.</div>';
      return;
    }

    for (var i = 0; i < targetTzs.length; i++) {
      var tzId = targetTzs[i];
      var info = CITY_MAP[tzId];
      if (!info) continue;

      var parts = getZonedParts(epochMs, tzId);
      var targetOffset = getTimeZoneOffsetMinutes(epochMs, tzId);
      var diffMin = targetOffset - originOffset;
      var targetAbbr = getTimeZoneAbbr(epochMs, tzId);
      var targetDst = isDstActive(epochMs, tzId);

      var targetDayStamp = Date.UTC(parts.year, parts.month - 1, parts.day);
      var dayDiff = Math.round((targetDayStamp - originDayStamp) / 86400000);
      var dayBadge = '';
      if (dayDiff > 0) dayBadge = '<span class="tz-day-badge tz-day-plus">+' + dayDiff + ' Day</span>';
      else if (dayDiff < 0) dayBadge = '<span class="tz-day-badge tz-day-minus">' + dayDiff + ' Day</span>';
      else dayBadge = '<span class="tz-day-badge tz-day-same">Same Day</span>';

      var status = getWorkStatus(parts.hour);
      var dateText = formatDateDisplay(parts.year, parts.month, parts.day);
      var timeText = formatTimeString(parts.hour, parts.minute);
      var copyValue = info.city + ': ' + dateText + ' ' + timeText + ' (' + targetAbbr + ')';

      cards.push(
        '<div class="tz-card" draggable="true" data-tz="' + tzId + '" data-copy="' + copyValue.replace(/"/g, '&quot;') + '">' +
          '<div class="tz-card-left">' +
            '<div class="tz-city-line">' +
              '<span class="tz-flag">' + info.flag + '</span>' +
              '<span class="tz-city-name">' + info.city + '</span>' +
              '<span class="tz-offset-meta">' + targetAbbr + ' (' + formatUtcOffset(targetOffset) + ')' +
                (targetDst ? ' · DST' : '') + '</span>' +
              '<span class="tz-diff-pill">' + formatDiffHours(diffMin) + '</span>' +
            '</div>' +
            '<div class="tz-date-line">' +
              '<span class="tz-date-str">' + dateText + '</span>' +
              dayBadge +
            '</div>' +
          '</div>' +
          '<div class="tz-card-right">' +
            '<div class="tz-time-wrap">' +
              '<div class="tz-time-str">' + timeText + '</div>' +
              '<div class="tz-status ' + status.cls + '"><span class="tz-status-dot"></span>' + status.label + '</div>' +
            '</div>' +
            '<div class="tz-card-actions">' +
              '<button type="button" class="tz-icon-btn tz-copy-one" title="Copy"><i class="fa-regular fa-copy"></i></button>' +
              '<button type="button" class="tz-icon-btn tz-swap-btn" title="Set as Origin"><i class="fa-solid fa-right-left"></i></button>' +
              '<button type="button" class="tz-icon-btn tz-remove-btn" title="Remove"><i class="fa-solid fa-xmark"></i></button>' +
            '</div>' +
            '<span class="tz-drag-handle" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></span>' +
          '</div>' +
        '</div>'
      );
    }

    dom.targetList.innerHTML = cards.join('');
    if (typeof global.scheduleFitViewport === 'function') {
      global.scheduleFitViewport();
    }
  }

  function buildCopyAllSummary() {
    var epochMs = zonedWallTimeToUtc(originYear, originMonth, originDay, originHour, originMinute, originTz);
    var lines = [];

    var oInfo = CITY_MAP[originTz];
    var oAbbr = getTimeZoneAbbr(epochMs, originTz);
    lines.push(
      '[Origin] ' + (oInfo ? oInfo.city : originTz) + ': ' +
      formatDateDisplay(originYear, originMonth, originDay) + ' ' +
      formatTimeString(originHour, originMinute) + ' (' + oAbbr + ')'
    );

    for (var i = 0; i < targetTzs.length; i++) {
      var tzId = targetTzs[i];
      var info = CITY_MAP[tzId];
      if (!info) continue;
      var p = getZonedParts(epochMs, tzId);
      var abbr = getTimeZoneAbbr(epochMs, tzId);
      lines.push(
        info.city + ': ' +
        formatDateDisplay(p.year, p.month, p.day) + ' ' +
        formatTimeString(p.hour, p.minute) + ' (' + abbr + ')'
      );
    }
    return lines.join('\n');
  }

  function renderAll() {
    syncOriginInputs();
    renderOriginCalendar();
    renderResults();
  }

  function parseManualDate(raw) {
    var str = String(raw || '').trim();
    if (!str) return null;
    var region = getRegionCode();
    var m, y, mo, d;

    if (/^\d{8}$/.test(str)) {
      y = parseInt(str.slice(0, 4), 10);
      mo = parseInt(str.slice(4, 6), 10);
      d = parseInt(str.slice(6, 8), 10);
    } else if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str))) {
      y = parseInt(m[1], 10); mo = parseInt(m[2], 10); d = parseInt(m[3], 10);
    } else if ((m = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(str))) {
      y = parseInt(m[1], 10); mo = parseInt(m[2], 10); d = parseInt(m[3], 10);
    } else if ((m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(str))) {
      d = parseInt(m[1], 10); mo = parseInt(m[2], 10); y = parseInt(m[3], 10);
    } else if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(str))) {
      y = parseInt(m[3], 10);
      if (region === 'US') { mo = parseInt(m[1], 10); d = parseInt(m[2], 10); }
      else { d = parseInt(m[1], 10); mo = parseInt(m[2], 10); }
    } else {
      return null;
    }

    if (y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    var check = new Date(y, mo - 1, d);
    if (check.getFullYear() !== y || check.getMonth() !== mo - 1 || check.getDate() !== d) return null;
    return { year: y, month: mo, day: d };
  }

  function cacheDom() {
    dom.root = document.getElementById('timezone_calculator');
    dom.originSelect = document.getElementById('tz_origin_city');
    dom.originMeta = document.getElementById('tz_origin_meta');
    dom.dateInput = document.getElementById('tz_origin_date');
    dom.nowBtn = document.getElementById('tz_now_btn');
    dom.calPrev = document.getElementById('tz_cal_prev');
    dom.calNext = document.getElementById('tz_cal_next');
    dom.calMonthLabel = document.getElementById('tz_cal_month_label');
    dom.calBody = document.getElementById('tz_cal_body');
    dom.hourInput = document.getElementById('tz_hour_input');
    dom.minInput = document.getElementById('tz_min_input');
    dom.timeSlider = document.getElementById('tz_time_slider');
    dom.quickTimes = document.getElementById('tz_quick_times');
    dom.addCitySelect = document.getElementById('tz_add_city');
    dom.formatToggleBtn = document.getElementById('tz_format_toggle');
    dom.copyAllBtn = document.getElementById('tz_copy_all');
    dom.targetList = document.getElementById('tz_target_list');
  }

  function bindEvents() {
    dom.originSelect.addEventListener('change', function () {
      originTz = this.value;
      saveState();
      refreshCityDropdowns();
      renderResults();
    });

    dom.nowBtn.addEventListener('click', function () {
      setOriginToNow();
      renderAll();
    });

    dom.dateInput.addEventListener('input', function () {
      var parsed = parseManualDate(this.value);
      if (!parsed) {
        this.classList.add('input-invalid');
        return;
      }
      this.classList.remove('input-invalid');
      originYear = parsed.year;
      originMonth = parsed.month;
      originDay = parsed.day;
      calViewYear = originYear;
      calViewMonth = originMonth - 1;
      renderOriginCalendar();
      renderResults();
    });

    dom.dateInput.addEventListener('blur', function () {
      this.classList.remove('input-invalid');
      syncOriginInputs();
    });

    dom.calPrev.addEventListener('click', function () {
      calViewMonth -= 1;
      if (calViewMonth < 0) { calViewMonth = 11; calViewYear -= 1; }
      renderOriginCalendar();
    });

    dom.calNext.addEventListener('click', function () {
      calViewMonth += 1;
      if (calViewMonth > 11) { calViewMonth = 0; calViewYear += 1; }
      renderOriginCalendar();
    });

    dom.calBody.addEventListener('click', function (e) {
      var cell = e.target.closest('td[data-date]');
      if (!cell) return;
      var parts = cell.getAttribute('data-date').split('-');
      originYear = parseInt(parts[0], 10);
      originMonth = parseInt(parts[1], 10);
      originDay = parseInt(parts[2], 10);
      calViewYear = originYear;
      calViewMonth = originMonth - 1;
      renderAll();
    });

    global.CalendarCore.bindDelegatedTooltip(dom.calBody);

    dom.hourInput.addEventListener('input', function () {
      var v = parseInt(this.value, 10);
      if (isNaN(v)) return;
      originHour = Math.max(0, Math.min(23, v));
      dom.timeSlider.value = String(originHour * 60 + originMinute);
      renderResults();
    });

    dom.minInput.addEventListener('input', function () {
      var v = parseInt(this.value, 10);
      if (isNaN(v)) return;
      originMinute = Math.max(0, Math.min(59, v));
      dom.timeSlider.value = String(originHour * 60 + originMinute);
      renderResults();
    });

    dom.hourInput.addEventListener('blur', syncOriginInputs);
    dom.minInput.addEventListener('blur', syncOriginInputs);

    // 시/분 커스텀 스테퍼 버튼
    dom.root.addEventListener('click', function (e) {
      var stepBtn = e.target.closest('.tz-step-btn');
      if (!stepBtn) return;
      var field = stepBtn.getAttribute('data-field');
      var delta = parseInt(stepBtn.getAttribute('data-step'), 10) || 0;
      if (field === 'hour') {
        originHour = (originHour + delta + 24) % 24;
      } else if (field === 'min') {
        var totalMin = originHour * 60 + originMinute + delta;
        totalMin = ((totalMin % 1440) + 1440) % 1440;
        originHour = Math.floor(totalMin / 60);
        originMinute = totalMin % 60;
      }
      syncOriginInputs();
      renderResults();
    });

    dom.timeSlider.addEventListener('input', function () {
      var total = parseInt(this.value, 10) || 0;
      originHour = Math.floor(total / 60);
      originMinute = total % 60;
      dom.hourInput.value = pad2(originHour);
      dom.minInput.value = pad2(originMinute);
      renderResults();
    });

    dom.quickTimes.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-time]');
      if (!btn) return;
      var val = btn.getAttribute('data-time');
      if (val === 'now') {
        setOriginToNow();
        renderAll();
        return;
      }
      var p = val.split(':');
      originHour = parseInt(p[0], 10);
      originMinute = parseInt(p[1], 10);
      syncOriginInputs();
      renderResults();
    });

    dom.addCitySelect.addEventListener('change', function () {
      var tzId = this.value;
      if (!tzId || !CITY_MAP[tzId]) return;
      if (targetTzs.indexOf(tzId) === -1) {
        targetTzs.push(tzId);
        saveState();
        refreshCityDropdowns();
        renderResults();
      }
      this.value = '';
    });

    dom.formatToggleBtn.addEventListener('click', function () {
      use24Hour = !use24Hour;
      saveState();
      updateFormatToggleUi();
      renderResults();
    });

    dom.copyAllBtn.addEventListener('click', function () {
      var summary = buildCopyAllSummary();
      copyText(summary);
      showToast('All time zones copied');
    });

    function clearDropIndicators() {
      var prev = dom.targetList.querySelectorAll('.tz-drop-before, .tz-drop-after');
      for (var i = 0; i < prev.length; i++) {
        prev[i].classList.remove('tz-drop-before', 'tz-drop-after');
      }
    }

    dom.targetList.addEventListener('dragstart', function (e) {
      var card = e.target.closest('.tz-card');
      if (!card) return;
      draggingTz = card.getAttribute('data-tz');
      card.classList.add('tz-dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggingTz);
      }
    });

    dom.targetList.addEventListener('dragover', function (e) {
      if (!draggingTz) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

      var card = e.target.closest('.tz-card');
      clearDropIndicators();
      if (!card || card.getAttribute('data-tz') === draggingTz) return;

      var rect = card.getBoundingClientRect();
      var isBefore = e.clientY < rect.top + rect.height / 2;
      card.classList.add(isBefore ? 'tz-drop-before' : 'tz-drop-after');
    });

    dom.targetList.addEventListener('dragleave', function (e) {
      if (!dom.targetList.contains(e.relatedTarget)) {
        clearDropIndicators();
      }
    });

    dom.targetList.addEventListener('drop', function (e) {
      if (!draggingTz) return;
      e.preventDefault();

      var card = e.target.closest('.tz-card');
      var dropTz = card ? card.getAttribute('data-tz') : null;
      var insertBefore = card ? card.classList.contains('tz-drop-before') : false;
      clearDropIndicators();

      if (dropTz && dropTz !== draggingTz) {
        var fromIdx = targetTzs.indexOf(draggingTz);
        if (fromIdx !== -1) {
          targetTzs.splice(fromIdx, 1);
          var toIdx = targetTzs.indexOf(dropTz);
          if (toIdx !== -1) {
            targetTzs.splice(insertBefore ? toIdx : toIdx + 1, 0, draggingTz);
          } else {
            targetTzs.push(draggingTz);
          }
          saveState();
          renderResults();
        }
      }

      justDragged = true;
      setTimeout(function () { justDragged = false; }, 120);
      draggingTz = null;
    });

    dom.targetList.addEventListener('dragend', function () {
      clearDropIndicators();
      var draggingEl = dom.targetList.querySelector('.tz-dragging');
      if (draggingEl) draggingEl.classList.remove('tz-dragging');
      draggingTz = null;
    });

    dom.targetList.addEventListener('click', function (e) {
      if (justDragged || e.target.closest('.tz-drag-handle')) return;
      var card = e.target.closest('.tz-card');
      if (!card) return;
      var tzId = card.getAttribute('data-tz');

      if (e.target.closest('.tz-remove-btn')) {
        targetTzs = targetTzs.filter(function (id) { return id !== tzId; });
        saveState();
        refreshCityDropdowns();
        renderResults();
        return;
      }

      if (e.target.closest('.tz-swap-btn')) {
        var epochMs = zonedWallTimeToUtc(originYear, originMonth, originDay, originHour, originMinute, originTz);
        originTz = tzId;

        var newParts = getZonedParts(epochMs, originTz);
        originYear = newParts.year;
        originMonth = newParts.month;
        originDay = newParts.day;
        originHour = newParts.hour;
        originMinute = newParts.minute;
        calViewYear = originYear;
        calViewMonth = originMonth - 1;

        saveState();
        refreshCityDropdowns();
        renderAll();
        showToast('Origin changed to ' + (CITY_MAP[originTz] ? CITY_MAP[originTz].city : originTz));
        return;
      }

      // 카드 또는 복사 버튼 클릭 시 해당 도시 일시 복사
      var text = card.getAttribute('data-copy');
      if (text) {
        copyText(text);
        showToast("'" + text + "' copied");
      }
    });
  }

  global.onTimeZoneRegionChange = function () {
    if (!initialized) return;
    renderAll();
  };

  global.initTimeZoneCalculator = function () {
    if (initialized) {
      renderAll();
      return;
    }
    initialized = true;
    cacheDom();
    loadState();
    setOriginToNow();
    refreshCityDropdowns();
    bindEvents();
    renderAll();
  };
})(window);
