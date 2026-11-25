(function (global) {
  'use strict';

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var initialized = false;
  var fourYearCalendars = [];

  function renderYearRow(baseYear, offset) {
    var yearNum = baseYear + offset;
    var suffix = '_y' + (offset + 1);
    var yearLabel = document.getElementById('year_' + (offset + 1));
    if (yearLabel) {
      yearLabel.textContent = yearNum;
    }

    for (var m = 0; m < MONTHS.length; m++) {
      var el = document.getElementById(MONTHS[m] + suffix);
      if (!el) continue;

      var cal = new FullCalendar.Calendar(el, {
        initialDate: new Date(yearNum, m, 1),
        headerToolbar: { start: 'title', center: '', end: '' },
        titleFormat: { month: 'long' },
        aspectRatio: 1,
        contentHeight: 'auto',
        nowIndicator: true,
        editable: false,
        selectable: false,
        weekNumbers: true,
        weekText: '',
        showNonCurrentDates: true
      });
      cal.render();
      fourYearCalendars.push(cal);
    }
  }

  // 탭 진입 시 1회만 실행하며, 연도 단위로 프레임을 분할 렌더링해 UI 멈춤 방지
  global.initFourYearCalendar = function (startYear) {
    if (initialized) return;
    initialized = true;

    var baseYear = startYear || new Date().getFullYear();
    var offset = 0;

    function renderNextYear() {
      if (offset >= 4) return;
      renderYearRow(baseYear, offset);
      offset += 1;
      if (offset < 4) {
        global.requestAnimationFrame(renderNextYear);
      }
    }

    renderNextYear();
  };
})(window);
