(function (global) {
  'use strict';

  var MONTH_IDS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTH_TITLES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  var DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatDateKey(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function getISOWeek(date) {
    var tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  }

  function buildYearHolidayLookup(region, year) {
    var map = Object.create(null);
    var events = global.HolidayService.getHolidayEventsForRange(
      region,
      new Date(year, 0, 1),
      new Date(year + 1, 0, 1)
    );
    for (var i = 0; i < events.length; i++) {
      map[events[i].start] = events[i].title;
    }
    return map;
  }

  function buildMonthTableHtml(opts) {
    var year = opts.year;
    var monthIndex = opts.monthIndex;
    var holidayMap = opts.holidayMap || {};
    var todayKey = opts.todayKey || '';
    var selectedKey = opts.selectedKey || '';
    var clickable = !!opts.clickable;
    var showTitle = opts.showTitle !== false;
    var variantClass = opts.variant ? 'ncal-' + opts.variant : 'ncal-year';

    var firstDay = new Date(year, monthIndex, 1);
    var startOffset = firstDay.getDay();
    var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    var prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

    var html = [];
    html.push('<div class="ncal ' + variantClass + '">');
    if (showTitle) {
      html.push('<div class="ncal-title">' + MONTH_TITLES[monthIndex] + '</div>');
    }
    html.push('<table class="ncal-table"><thead><tr><th class="ncal-wk-col"></th>');
    for (var h = 0; h < 7; h++) {
      var hCls = h === 0 ? 'ncal-sun' : (h === 6 ? 'ncal-sat' : '');
      html.push('<th class="' + hCls + '">' + DAY_HEADERS[h] + '</th>');
    }
    html.push('</tr></thead><tbody>');

    // 모든 월의 높이를 동일하게 유지하기 위해 6주(42칸) 고정
    var totalCells = 42;
    for (var cell = 0; cell < totalCells; cell++) {
      var col = cell % 7;
      var dayNum = cell - startOffset + 1;
      var cellDate;
      var isOther = false;

      if (dayNum <= 0) {
        cellDate = new Date(year, monthIndex - 1, prevMonthLastDay + dayNum);
        isOther = true;
      } else if (dayNum > daysInMonth) {
        cellDate = new Date(year, monthIndex + 1, dayNum - daysInMonth);
        isOther = true;
      } else {
        cellDate = new Date(year, monthIndex, dayNum);
      }

      if (col === 0) {
        html.push('<tr><td class="ncal-wk">' + getISOWeek(cellDate) + '</td>');
      }

      var dateKey = formatDateKey(cellDate);
      var holidayName = !isOther ? holidayMap[dateKey] : null;
      var classes = ['ncal-day'];

      if (clickable) classes.push('ncal-clickable');
      if (isOther) classes.push('ncal-other');
      if (col === 0) classes.push('ncal-sun');
      else if (col === 6) classes.push('ncal-sat');
      if (!isOther && dateKey === todayKey) classes.push('ncal-today');
      if (selectedKey && dateKey === selectedKey) classes.push('ncal-selected');
      if (holidayName) classes.push('ncal-holiday');

      var attrs = '';
      if (clickable) attrs += ' data-date="' + dateKey + '"';
      if (holidayName) attrs += ' data-holiday="' + escapeHtml(holidayName) + '"';

      html.push('<td class="' + classes.join(' ') + '"' + attrs + '>' + cellDate.getDate() + '</td>');

      if (col === 6) {
        html.push('</tr>');
      }
    }

    html.push('</tbody></table></div>');
    return html.join('');
  }

  function showTooltip(targetEl, text) {
    var tip = document.getElementById('holiday-tooltip');
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
    var tip = document.getElementById('holiday-tooltip');
    if (tip) tip.classList.remove('visible');
  }

  function bindDelegatedTooltip(containerEl) {
    if (!containerEl) return;
    containerEl.addEventListener('mouseover', function (e) {
      var cell = e.target.closest('td[data-holiday]');
      if (!cell) return;
      showTooltip(cell, cell.getAttribute('data-holiday'));
    });
    containerEl.addEventListener('mouseout', function (e) {
      if (e.target.closest('td[data-holiday]')) {
        hideTooltip();
      }
    });
  }

  global.CalendarCore = {
    MONTH_IDS: MONTH_IDS,
    MONTH_TITLES: MONTH_TITLES,
    DAY_HEADERS: DAY_HEADERS,
    pad2: pad2,
    formatDateKey: formatDateKey,
    getISOWeek: getISOWeek,
    buildYearHolidayLookup: buildYearHolidayLookup,
    buildMonthTableHtml: buildMonthTableHtml,
    hideTooltip: hideTooltip,
    bindDelegatedTooltip: bindDelegatedTooltip
  };
})(window);
