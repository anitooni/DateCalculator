(function (global) {
  'use strict';

  var CACHE_PREFIX = 'dc_holidays_v1_';
  var CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30일 캐시
  var REGION_STORAGE_KEY = 'dc_region';

  var SUPPORTED_REGIONS = {
    KR: { code: 'KR', label: '🇰🇷 Korea (KR)', shortLabel: 'KR', dateFormat: 'YYYY-MM-DD' },
    JP: { code: 'JP', label: '🇯🇵 Japan (JP)', shortLabel: 'JP', dateFormat: 'YYYY/MM/DD' },
    DE: { code: 'DE', label: '🇩🇪 Germany (DE)', shortLabel: 'DE', dateFormat: 'DD.MM.YYYY' },
    US: { code: 'US', label: '🇺🇸 United States (US)', shortLabel: 'US', dateFormat: 'MM/DD/YYYY' },
    IN: { code: 'IN', label: '🇮🇳 India (IN)', shortLabel: 'IN', dateFormat: 'DD/MM/YYYY' },
    CN: { code: 'CN', label: '🇨🇳 China (CN)', shortLabel: 'CN', dateFormat: 'YYYY/MM/DD' }
  };

  var REGION_ORDER = ['KR', 'JP', 'DE', 'US', 'IN', 'CN'];

  var TIMEZONE_TO_REGION = {
    'Asia/Seoul': 'KR',
    'Asia/Tokyo': 'JP',
    'Europe/Berlin': 'DE',
    'Europe/Busingen': 'DE',
    'Asia/Kolkata': 'IN',
    'Asia/Calcutta': 'IN',
    'Asia/Shanghai': 'CN',
    'Asia/Urumqi': 'CN',
    'Asia/Chongqing': 'CN',
    'Asia/Harbin': 'CN',
    'Asia/Kashgar': 'CN',
    'America/New_York': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'America/Los_Angeles': 'US',
    'America/Phoenix': 'US',
    'America/Anchorage': 'US',
    'Pacific/Honolulu': 'US',
    'America/Detroit': 'US'
  };

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function buildHolidayMap(entries) {
    var map = Object.create(null);
    for (var i = 0; i < entries.length; i++) {
      var date = entries[i][0];
      var name = entries[i][1];
      addHolidayEntry(map, date, name);
    }
    return map;
  }

  function addHolidayEntry(map, date, name) {
    if (!date || !name) return;
    if (map[date]) {
      if (map[date].indexOf(name) === -1) {
        map[date] += ' / ' + name;
      }
    } else {
      map[date] = name;
    }
  }

  function mergeHolidayNames(fixedName, variableName) {
    if (fixedName && variableName) {
      if (fixedName === variableName || variableName.indexOf(fixedName) !== -1) return variableName;
      if (fixedName.indexOf(variableName) !== -1) return fixedName;
      return fixedName + ' / ' + variableName;
    }
    return variableName || fixedName || null;
  }

  // 오프라인/API 장애 시에도 즉시 동작하기 위한 내장 폴백 데이터
  var FALLBACK_DATA = {
    KR: {
      fixed: {
        '01-01': '신정', '03-01': '삼일절', '05-05': '어린이날', '06-06': '현충일',
        '08-15': '광복절', '10-03': '개천절', '10-09': '한글날', '12-25': '크리스마스'
      },
      variable: buildHolidayMap([
        ['2024-02-09', '설날 연휴'], ['2024-02-10', '설날'], ['2024-02-11', '설날 연휴'], ['2024-02-12', '설날 대체공휴일'],
        ['2024-04-10', '제22대 국회의원 선거'], ['2024-05-06', '어린이날 대체공휴일'], ['2024-05-15', '부처님 오신 날'],
        ['2024-09-16', '추석 연휴'], ['2024-09-17', '추석'], ['2024-09-18', '추석 연휴'],
        ['2025-01-28', '설날 연휴'], ['2025-01-29', '설날'], ['2025-01-30', '설날 연휴'], ['2025-03-03', '삼일절 대체공휴일'],
        ['2025-05-05', '부처님 오신 날'], ['2025-05-06', '어린이날 대체공휴일'], ['2025-10-05', '추석 연휴'],
        ['2025-10-06', '추석'], ['2025-10-07', '추석 연휴'], ['2025-10-08', '추석 대체공휴일'],
        ['2026-02-16', '설날 연휴'], ['2026-02-17', '설날'], ['2026-02-18', '설날 연휴'], ['2026-03-02', '삼일절 대체공휴일'],
        ['2026-05-24', '부처님 오신 날'], ['2026-05-25', '부처님 오신 날 대체공휴일'], ['2026-06-03', '제9회 전국동시지방선거'],
        ['2026-08-17', '광복절 대체공휴일'], ['2026-09-24', '추석 연휴'], ['2026-09-25', '추석'], ['2026-09-26', '추석 연휴'],
        ['2026-10-05', '개천절 대체공휴일'],
        ['2027-02-06', '설날 연휴'], ['2027-02-07', '설날'], ['2027-02-08', '설날 연휴'], ['2027-02-09', '설날 대체공휴일'],
        ['2027-03-03', '제21대 대통령 선거'], ['2027-05-13', '부처님 오신 날'], ['2027-08-16', '광복절 대체공휴일'],
        ['2027-09-14', '추석 연휴'], ['2027-09-15', '추석'], ['2027-09-16', '추석 연휴'],
        ['2027-10-04', '개천절 대체공휴일'], ['2027-10-11', '한글날 대체공휴일'],
        ['2028-01-26', '설날 연휴'], ['2028-01-27', '설날'], ['2028-01-28', '설날 연휴'], ['2028-04-12', '제23대 국회의원 선거'],
        ['2028-05-02', '부처님 오신 날'], ['2028-10-02', '추석 연휴'], ['2028-10-03', '추석'], ['2028-10-04', '추석 연휴'],
        ['2028-10-05', '추석 대체공휴일'],
        ['2029-02-12', '설날 연휴'], ['2029-02-13', '설날'], ['2029-02-14', '설날 연휴'], ['2029-05-07', '어린이날 대체공휴일'],
        ['2029-05-20', '부처님 오신 날'], ['2029-05-21', '부처님 오신 날 대체공휴일'],
        ['2029-09-21', '추석 연휴'], ['2029-09-22', '추석'], ['2029-09-23', '추석 연휴'], ['2029-09-24', '추석 대체공휴일'],
        ['2030-02-02', '설날 연휴'], ['2030-02-03', '설날'], ['2030-02-04', '설날 연휴'], ['2030-02-05', '설날 대체공휴일'],
        ['2030-05-06', '어린이날 대체공휴일'], ['2030-05-09', '부처님 오신 날'], ['2030-06-05', '제10회 전국동시지방선거'],
        ['2030-09-11', '추석 연휴'], ['2030-09-12', '추석'], ['2030-09-13', '추석 연휴']
      ])
    },
    US: {
      fixed: {
        '01-01': "New Year's Day", '06-19': 'Juneteenth', '07-04': 'Independence Day',
        '11-11': 'Veterans Day', '12-25': 'Christmas Day'
      },
      variable: buildHolidayMap([
        ['2025-01-20', 'Martin Luther King Jr. Day'], ['2025-02-17', "Presidents' Day"], ['2025-05-26', 'Memorial Day'],
        ['2025-09-01', 'Labor Day'], ['2025-10-13', 'Columbus Day'], ['2025-11-27', 'Thanksgiving Day'],
        ['2026-01-19', 'Martin Luther King Jr. Day'], ['2026-02-16', "Presidents' Day"], ['2026-05-25', 'Memorial Day'],
        ['2026-07-03', 'Independence Day (Observed)'], ['2026-09-07', 'Labor Day'], ['2026-10-12', 'Columbus Day'], ['2026-11-26', 'Thanksgiving Day'],
        ['2027-01-18', 'Martin Luther King Jr. Day'], ['2027-02-15', "Presidents' Day"], ['2027-05-31', 'Memorial Day'],
        ['2027-06-18', 'Juneteenth (Observed)'], ['2027-07-05', 'Independence Day (Observed)'], ['2027-09-06', 'Labor Day'],
        ['2027-10-11', 'Columbus Day'], ['2027-11-25', 'Thanksgiving Day'], ['2027-12-24', 'Christmas (Observed)'], ['2027-12-31', "New Year's Day (Observed)"],
        ['2028-01-17', 'Martin Luther King Jr. Day'], ['2028-02-21', "Presidents' Day"], ['2028-05-29', 'Memorial Day'],
        ['2028-09-04', 'Labor Day'], ['2028-10-09', 'Columbus Day'], ['2028-11-10', 'Veterans Day (Observed)'], ['2028-11-23', 'Thanksgiving Day'],
        ['2029-01-15', 'Martin Luther King Jr. Day'], ['2029-02-19', "Presidents' Day"], ['2029-05-28', 'Memorial Day'],
        ['2029-09-03', 'Labor Day'], ['2029-10-08', 'Columbus Day'], ['2029-11-12', 'Veterans Day (Observed)'], ['2029-11-22', 'Thanksgiving Day'],
        ['2030-01-21', 'Martin Luther King Jr. Day'], ['2030-02-18', "Presidents' Day"], ['2030-05-27', 'Memorial Day'],
        ['2030-09-02', 'Labor Day'], ['2030-10-14', 'Columbus Day'], ['2030-11-28', 'Thanksgiving Day']
      ])
    },
    DE: {
      fixed: {
        '01-01': 'Neujahr', '05-01': 'Tag der Arbeit', '10-03': 'Tag der Deutschen Einheit',
        '12-25': '1. Weihnachtstag', '12-26': '2. Weihnachtstag'
      },
      variable: buildHolidayMap([
        ['2025-04-18', 'Karfreitag'], ['2025-04-21', 'Ostermontag'], ['2025-05-29', 'Christi Himmelfahrt'], ['2025-06-09', 'Pfingstmontag'],
        ['2026-04-03', 'Karfreitag'], ['2026-04-06', 'Ostermontag'], ['2026-05-14', 'Christi Himmelfahrt'], ['2026-05-25', 'Pfingstmontag'],
        ['2027-03-26', 'Karfreitag'], ['2027-03-29', 'Ostermontag'], ['2027-05-06', 'Christi Himmelfahrt'], ['2027-05-17', 'Pfingstmontag'],
        ['2028-04-14', 'Karfreitag'], ['2028-04-17', 'Ostermontag'], ['2028-05-25', 'Christi Himmelfahrt'], ['2028-06-05', 'Pfingstmontag'],
        ['2029-03-30', 'Karfreitag'], ['2029-04-02', 'Ostermontag'], ['2029-05-10', 'Christi Himmelfahrt'], ['2029-05-21', 'Pfingstmontag'],
        ['2030-04-19', 'Karfreitag'], ['2030-04-22', 'Ostermontag'], ['2030-05-30', 'Christi Himmelfahrt'], ['2030-06-10', 'Pfingstmontag']
      ])
    },
    JP: {
      fixed: {
        '01-01': '元日', '02-11': '建国記念の日', '02-23': '天皇誕生日', '04-29': '昭和の日',
        '05-03': '憲法記念日', '05-04': 'みどりの日', '05-05': 'こどもの日',
        '09-23': '秋分の日', '11-03': '文化の日', '11-23': '勤労感謝の日'
      },
      variable: buildHolidayMap([
        ['2025-01-13', '成人の日'], ['2025-02-24', '振替休日'], ['2025-03-20', '春分の日'], ['2025-05-06', '振替休日'],
        ['2025-07-21', '海の日'], ['2025-08-11', '山の日'], ['2025-09-15', '敬老の日'], ['2025-10-13', 'スポーツの日'], ['2025-11-24', '振替休日'],
        ['2026-01-12', '成人の日'], ['2026-03-20', '春分の日'], ['2026-05-06', '振替休日'], ['2026-07-20', '海の日'],
        ['2026-08-11', '山の日'], ['2026-09-21', '敬老の日'], ['2026-09-22', '国民の休日'], ['2026-10-12', 'スポーツの日'],
        ['2027-01-11', '成人の日'], ['2027-03-21', '春分の日'], ['2027-03-22', '振替休日'], ['2027-07-19', '海の日'],
        ['2027-08-11', '山の日'], ['2027-09-20', '敬老の日'], ['2027-10-11', 'スポーツの日'],
        ['2028-01-10', '成人の日'], ['2028-03-20', '春分の日'], ['2028-07-17', '海の日'], ['2028-08-11', '山の日'],
        ['2028-09-18', '敬老の日'], ['2028-09-22', '秋分の日'], ['2028-10-09', 'スポーツの日'],
        ['2029-01-08', '成人の日'], ['2029-02-12', '振替休日'], ['2029-03-20', '春分の日'], ['2029-04-30', '振替休日'],
        ['2029-07-16', '海の日'], ['2029-08-11', '山の日'], ['2029-09-17', '敬老の日'], ['2029-09-24', '振替休日'], ['2029-10-08', 'スポーツの日'],
        ['2030-01-14', '成人の日'], ['2030-03-20', '春分の日'], ['2030-05-06', '振替休日'], ['2030-07-15', '海の日'],
        ['2030-08-11', '山の日'], ['2030-08-12', '振替休日'], ['2030-09-16', '敬老の日'], ['2030-10-14', 'スポーツの日'], ['2030-11-04', '振替休日']
      ])
    },
    CN: {
      fixed: {
        '01-01': '元旦', '05-01': '劳动节',
        '10-01': '国庆节', '10-02': '国庆节假期', '10-03': '国庆节假期', '10-04': '国庆节假期',
        '10-05': '国庆节假期', '10-06': '国庆节假期', '10-07': '国庆节假期'
      },
      variable: buildHolidayMap([
        ['2025-01-28', '除夕'], ['2025-01-29', '春节'], ['2025-01-30', '春节假期'], ['2025-01-31', '春节假期'],
        ['2025-02-01', '春节假期'], ['2025-02-02', '春节假期'], ['2025-02-03', '春节假期'], ['2025-04-04', '清明节'],
        ['2025-05-31', '端午节'], ['2025-10-06', '中秋节'],
        ['2026-02-16', '除夕'], ['2026-02-17', '春节'], ['2026-02-18', '春节假期'], ['2026-02-19', '春节假期'],
        ['2026-02-20', '春节假期'], ['2026-02-21', '春节假期'], ['2026-02-22', '春节假期'], ['2026-04-05', '清明节'],
        ['2026-06-19', '端午节'], ['2026-09-25', '中秋节'],
        ['2027-02-05', '除夕'], ['2027-02-06', '春节'], ['2027-02-07', '春节假期'], ['2027-02-08', '春节假期'],
        ['2027-02-09', '春节假期'], ['2027-02-10', '春节假期'], ['2027-02-11', '春节假期'], ['2027-04-05', '清明节'],
        ['2027-06-09', '端午节'], ['2027-09-15', '中秋节'],
        ['2028-01-25', '除夕'], ['2028-01-26', '春节'], ['2028-01-27', '春节假期'], ['2028-01-28', '春节假期'],
        ['2028-01-29', '春节假期'], ['2028-01-30', '春节假期'], ['2028-01-31', '春节假期'], ['2028-04-04', '清明节'],
        ['2028-05-28', '端午节'], ['2028-10-03', '中秋节'],
        ['2029-02-12', '除夕'], ['2029-02-13', '春节'], ['2029-02-14', '春节假期'], ['2029-02-15', '春节假期'],
        ['2029-02-16', '春节假期'], ['2029-02-17', '春节假期'], ['2029-02-18', '春节假期'], ['2029-04-04', '清明节'],
        ['2029-06-16', '端午节'], ['2029-09-22', '中秋节'],
        ['2030-02-02', '除夕'], ['2030-02-03', '春节'], ['2030-02-04', '春节假期'], ['2030-02-05', '春节假期'],
        ['2030-02-06', '春节假期'], ['2030-02-07', '春节假期'], ['2030-02-08', '春节假期'], ['2030-04-05', '清明节'],
        ['2030-06-05', '端午节'], ['2030-09-12', '中秋节']
      ])
    },
    IN: {
      fixed: {
        '01-26': 'Republic Day',
        '08-15': 'Independence Day',
        '10-02': 'Gandhi Jayanti',
        '12-25': 'Christmas Day'
      },
      variable: buildHolidayMap([
        ['2025-02-26', 'Maha Shivaratri'], ['2025-03-14', 'Holi'], ['2025-03-31', 'Id-ul-Fitr'], ['2025-04-10', 'Mahavir Jayanti'],
        ['2025-04-18', 'Good Friday'], ['2025-05-12', 'Buddha Purnima'], ['2025-06-07', 'Id-ul-Zuha (Bakrid)'], ['2025-07-06', 'Muharram'],
        ['2025-08-16', 'Janmashtami'], ['2025-09-05', 'Milad-un-Nabi'], ['2025-10-02', 'Dussehra'], ['2025-10-20', 'Diwali'], ['2025-11-05', 'Guru Nanak Jayanti'],
        ['2026-02-15', 'Maha Shivaratri'], ['2026-03-04', 'Holi'], ['2026-03-21', 'Id-ul-Fitr'], ['2026-03-26', 'Ram Navami'],
        ['2026-03-31', 'Mahavir Jayanti'], ['2026-04-03', 'Good Friday'], ['2026-05-01', 'Buddha Purnima'], ['2026-05-27', 'Id-ul-Zuha (Bakrid)'],
        ['2026-06-26', 'Muharram'], ['2026-08-26', 'Milad-un-Nabi'], ['2026-09-04', 'Janmashtami'], ['2026-10-20', 'Dussehra'],
        ['2026-11-08', 'Diwali'], ['2026-11-24', 'Guru Nanak Jayanti'],
        ['2027-03-06', 'Maha Shivaratri'], ['2027-03-10', 'Id-ul-Fitr'], ['2027-03-22', 'Holi'], ['2027-03-26', 'Good Friday'],
        ['2027-04-15', 'Ram Navami'], ['2027-04-19', 'Mahavir Jayanti'], ['2027-05-17', 'Id-ul-Zuha (Bakrid)'], ['2027-05-20', 'Buddha Purnima'],
        ['2027-06-16', 'Muharram'], ['2027-08-25', 'Janmashtami'], ['2027-10-09', 'Dussehra'], ['2027-10-29', 'Diwali'], ['2027-11-14', 'Guru Nanak Jayanti'],
        ['2028-02-23', 'Maha Shivaratri'], ['2028-02-27', 'Id-ul-Fitr'], ['2028-03-11', 'Holi'], ['2028-04-14', 'Good Friday'],
        ['2028-05-05', 'Id-ul-Zuha (Bakrid)'], ['2028-05-08', 'Buddha Purnima'], ['2028-09-28', 'Dussehra'], ['2028-10-17', 'Diwali'], ['2028-11-02', 'Guru Nanak Jayanti'],
        ['2029-02-11', 'Maha Shivaratri'], ['2029-02-15', 'Id-ul-Fitr'], ['2029-03-01', 'Holi'], ['2029-03-30', 'Good Friday'],
        ['2029-04-24', 'Id-ul-Zuha (Bakrid)'], ['2029-05-27', 'Buddha Purnima'], ['2029-10-17', 'Dussehra'], ['2029-11-05', 'Diwali'], ['2029-11-21', 'Guru Nanak Jayanti'],
        ['2030-02-05', 'Id-ul-Fitr'], ['2030-03-02', 'Maha Shivaratri'], ['2030-03-20', 'Holi'], ['2030-04-19', 'Good Friday'],
        ['2030-05-17', 'Buddha Purnima'], ['2030-10-06', 'Dussehra'], ['2030-10-26', 'Diwali'], ['2030-11-10', 'Guru Nanak Jayanti']
      ])
    }
  };

  // 메모리 캐시: { "KR_2026": { "2026-01-01": "1월 1일", ... } }
  var memoryCache = Object.create(null);
  var pendingFetches = Object.create(null);

  function getCacheKey(country, year) {
    return country + '_' + year;
  }

  function readLocalCache(country, year) {
    try {
      var raw = global.localStorage.getItem(CACHE_PREFIX + getCacheKey(country, year));
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.data || (Date.now() - parsed.ts) > CACHE_TTL_MS) {
        return null;
      }
      return parsed.data;
    } catch (_) {
      return null;
    }
  }

  function writeLocalCache(country, year, data) {
    try {
      global.localStorage.setItem(
        CACHE_PREFIX + getCacheKey(country, year),
        JSON.stringify({ ts: Date.now(), data: data })
      );
    } catch (_) {
      // 스토리지 용량 초과 또는 프라이빗 모드 무시
    }
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok || res.status === 204) {
        throw new Error('HTTP ' + res.status);
      }
      return res.json();
    });
  }

  // 1) 한국: 우주항공청(구 천문연) 월력요항 기반 오픈소스 holidays-kr
  function parseHolidaysKr(json) {
    var map = Object.create(null);
    var dates = Object.keys(json || {});
    for (var i = 0; i < dates.length; i++) {
      var date = dates[i];
      var val = json[date];
      if (Array.isArray(val)) {
        for (var j = 0; j < val.length; j++) {
          addHolidayEntry(map, date, val[j]);
        }
      } else if (typeof val === 'string') {
        addHolidayEntry(map, date, val);
      }
    }
    return map;
  }

  // 2) Nager.Date 오픈소스 API 파서 (KR, JP, DE, US, IN, CN 공용)
  function parseNagerDate(list, country) {
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('Empty Nager.Date response');
    }
    var map = Object.create(null);
    var hasGlobal = list.some(function (item) { return item.global === true; });

    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      // 독일/미국 등은 전국 공통 공휴일(global: true) 위주로 깔끔하게 표시
      if (hasGlobal && (country === 'DE' || country === 'US') && item.global === false) {
        continue;
      }
      var label = (country === 'KR' || country === 'JP' || country === 'CN' || country === 'DE')
        ? (item.localName || item.name)
        : (item.name || item.localName);
      addHolidayEntry(map, item.date, label);
    }
    return map;
  }

  // 3) 일본: holidays-jp 오픈소스 JSON 파서
  function parseHolidaysJp(json) {
    var map = Object.create(null);
    var dates = Object.keys(json || {});
    for (var i = 0; i < dates.length; i++) {
      addHolidayEntry(map, dates[i], json[dates[i]]);
    }
    if (Object.keys(map).length === 0) throw new Error('Empty holidays-jp response');
    return map;
  }

  // 4) 인도: calendar-bharat 오픈소스 JSON 파서
  function parseCalendarBharat(json, year) {
    var map = Object.create(null);
    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    var root = json && (json[year] || json);
    if (!root || typeof root !== 'object') throw new Error('Invalid calendar-bharat format');

    for (var m = 0; m < months.length; m++) {
      var list = root[months[m]];
      if (!Array.isArray(list)) continue;
      for (var i = 0; i < list.length; i++) {
        var entry = list[i];
        if (!entry || !entry.date || !entry.name) continue;
        // 주요 공휴일(gazetted/public/national) 필터링 (type 미지정 시 포함)
        var t = (entry.type || '').toLowerCase();
        if (t && t.indexOf('restricted') !== -1 && t.indexOf('gazetted') === -1 && t.indexOf('public') === -1) {
          continue;
        }
        var dayNum = parseInt(entry.date, 10);
        if (!isNaN(dayNum)) {
          var dateStr = year + '-' + pad2(m + 1) + '-' + pad2(dayNum);
          addHolidayEntry(map, dateStr, entry.name);
        }
      }
    }
    if (Object.keys(map).length === 0) throw new Error('Empty calendar-bharat response');
    return map;
  }

  function fetchFromOpenSource(country, year) {
    var nagerUrl = 'https://date.nager.at/api/v3/PublicHolidays/' + year + '/' + country;

    if (country === 'KR') {
      return fetchJson('https://holidays.hyunbin.page/' + year + '.json')
        .then(parseHolidaysKr)
        .catch(function () {
          return fetchJson(nagerUrl).then(function (data) { return parseNagerDate(data, 'KR'); });
        });
    }

    if (country === 'JP') {
      return fetchJson(nagerUrl)
        .then(function (data) { return parseNagerDate(data, 'JP'); })
        .catch(function () {
          return fetchJson('https://holidays-jp.github.io/api/v1/' + year + '/date.json').then(parseHolidaysJp);
        });
    }

    if (country === 'IN') {
      return fetchJson(nagerUrl)
        .then(function (data) { return parseNagerDate(data, 'IN'); })
        .catch(function () {
          return fetchJson('https://jayantur13.github.io/calendar-bharat/calendar/' + year + '.json')
            .then(function (data) { return parseCalendarBharat(data, year); });
        });
    }

    // DE, US, CN: Nager.Date 오픈소스 API
    return fetchJson(nagerUrl).then(function (data) {
      return parseNagerDate(data, country);
    });
  }

  // 비동기 공휴일 로드 (메모리 -> localStorage -> 오픈소스 API, 중복 요청 방지)
  function ensureYearLoaded(country, year) {
    var key = getCacheKey(country, year);
    if (memoryCache[key]) {
      return Promise.resolve(memoryCache[key]);
    }

    var cached = readLocalCache(country, year);
    if (cached) {
      memoryCache[key] = cached;
      return Promise.resolve(cached);
    }

    if (pendingFetches[key]) {
      return pendingFetches[key];
    }

    pendingFetches[key] = fetchFromOpenSource(country, year)
      .then(function (map) {
        memoryCache[key] = map;
        writeLocalCache(country, year, map);
        delete pendingFetches[key];
        return map;
      })
      .catch(function () {
        delete pendingFetches[key];
        return null;
      });

    return pendingFetches[key];
  }

  function ensureAllCountriesLoaded(year) {
    var tasks = [];
    for (var i = 0; i < REGION_ORDER.length; i++) {
      tasks.push(ensureYearLoaded(REGION_ORDER[i], year));
    }
    return Promise.all(tasks);
  }

  function lookupHolidayName(country, dateOnly) {
    var year = parseInt(dateOnly.slice(0, 4), 10);
    var key = getCacheKey(country, year);

    // 1순위: 메모리 또는 localStorage의 오픈소스 데이터
    var apiMap = memoryCache[key] || readLocalCache(country, year);
    if (apiMap) {
      memoryCache[key] = apiMap;
      return apiMap[dateOnly] || null;
    }

    // 2순위: 오프라인/로딩 중 내장 폴백 데이터
    var fb = FALLBACK_DATA[country];
    if (!fb) return null;
    var mmdd = dateOnly.slice(5, 10);
    return mergeHolidayNames(fb.fixed[mmdd], fb.variable[dateOnly]);
  }

  function matchHoliday(country, dateObj) {
    var dateOnly = dateObj.getFullYear() + '-' + pad2(dateObj.getMonth() + 1) + '-' + pad2(dateObj.getDate());
    var holidayName = lookupHolidayName(country, dateOnly);
    if (holidayName) return holidayName;

    var dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'Weekend';
    return 'Working day';
  }

  function getHolidayEventsForRange(country, startDate, endDate) {
    var events = [];
    var cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    var end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    while (cursor < end) {
      var dateOnly = cursor.getFullYear() + '-' + pad2(cursor.getMonth() + 1) + '-' + pad2(cursor.getDate());
      var title = lookupHolidayName(country, dateOnly);
      if (title) {
        events.push({
          title: title,
          start: dateOnly,
          allDay: true,
          display: 'background',
          className: 'ko_holiday'
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return events;
  }

  // 접속 지역 자동 감지 (타임존 우선 -> 브라우저 언어 -> 기본 KR)
  function detectUserRegion() {
    try {
      var saved = global.localStorage.getItem(REGION_STORAGE_KEY);
      if (saved && SUPPORTED_REGIONS[saved]) {
        return saved;
      }
    } catch (_) {}

    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        if (TIMEZONE_TO_REGION[tz]) return TIMEZONE_TO_REGION[tz];
        if (tz.indexOf('America/Indiana/') === 0 || tz.indexOf('America/Kentucky/') === 0) return 'US';
      }
    } catch (_) {}

    var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'ko-KR'];
    for (var i = 0; i < langs.length; i++) {
      var lang = String(langs[i] || '').toLowerCase();
      if (lang.indexOf('ko') === 0 || lang.indexOf('-kr') !== -1) return 'KR';
      if (lang.indexOf('ja') === 0 || lang.indexOf('-jp') !== -1) return 'JP';
      if (lang.indexOf('de') === 0 || lang.indexOf('-de') !== -1) return 'DE';
      if (lang.indexOf('-in') !== -1 || lang.indexOf('hi') === 0) return 'IN';
      if (lang.indexOf('zh-cn') === 0 || lang.indexOf('-cn') !== -1) return 'CN';
      if (lang.indexOf('-us') !== -1) return 'US';
    }

    return 'KR';
  }

  function saveUserRegion(regionCode) {
    if (!SUPPORTED_REGIONS[regionCode]) return;
    try {
      global.localStorage.setItem(REGION_STORAGE_KEY, regionCode);
    } catch (_) {}
  }

  // 국가별 기본 날짜 양식 (단 한국은 YYYY-MM-DD)
  function formatDateByRegion(date, regionCode) {
    var y = date.getFullYear();
    var m = pad2(date.getMonth() + 1);
    var d = pad2(date.getDate());

    switch (regionCode) {
      case 'KR':
        return y + '-' + m + '-' + d;       // YYYY-MM-DD
      case 'JP':
      case 'CN':
        return y + '/' + m + '/' + d;       // YYYY/MM/DD
      case 'DE':
        return d + '.' + m + '.' + y;       // DD.MM.YYYY
      case 'US':
        return m + '/' + d + '/' + y;       // MM/DD/YYYY
      case 'IN':
        return d + '/' + m + '/' + y;       // DD/MM/YYYY
      default:
        return y + '-' + m + '-' + d;
    }
  }

  function parseDateByRegion(dateString, regionCode) {
    if (!dateString) return new Date();
    var parts;
    switch (regionCode) {
      case 'KR':
        parts = dateString.split('-');
        if (parts.length === 3) return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        break;
      case 'JP':
      case 'CN':
        parts = dateString.split('/');
        if (parts.length === 3) return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        break;
      case 'DE':
        parts = dateString.split('.');
        if (parts.length === 3) return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        break;
      case 'US':
        parts = dateString.split('/');
        if (parts.length === 3) return new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
        break;
      case 'IN':
        parts = dateString.split('/');
        if (parts.length === 3) return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        break;
    }
    return new Date();
  }

  var EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DE_MONTHS = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];
  var EN_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DE_WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  var KO_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
  var JP_WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
  var CN_WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  // 국가별 클립보드 복사 포맷 6종 (1번은 항상 국제표준 ISO 8601, includeYear로 연도 포함 여부 전환)
  function getCopyFormatsByRegion(date, regionCode, includeYear) {
    var y = date.getFullYear();
    var yy = String(y).slice(-2);
    var mNum = date.getMonth() + 1;
    var m = pad2(mNum);
    var dNum = date.getDate();
    var d = pad2(dNum);
    var dow = date.getDay();
    var isoFull = y + '-' + m + '-' + d;
    var isoShort = m + '-' + d;

    if (!includeYear) {
      switch (regionCode) {
        case 'KR':
          return [
            isoShort,
            m + '.' + d,
            mNum + '/' + dNum,
            mNum + '/' + dNum + ' (' + KO_WEEKDAYS[dow] + ')',
            mNum + '월 ' + dNum + '일',
            mNum + '월 ' + dNum + '일 (' + KO_WEEKDAYS[dow] + ')'
          ];
        case 'JP':
          return [
            isoShort,
            mNum + '/' + dNum,
            m + '.' + d,
            mNum + '/' + dNum + ' (' + JP_WEEKDAYS[dow] + ')',
            mNum + '月' + dNum + '日',
            mNum + '月' + dNum + '日 (' + JP_WEEKDAYS[dow] + ')'
          ];
        case 'DE':
          return [
            isoShort,
            d + '.' + m + '.',
            d + '/' + m,
            DE_WEEKDAYS[dow] + ', ' + d + '.' + m + '.',
            dNum + '. ' + DE_MONTHS[mNum - 1],
            DE_WEEKDAYS[dow] + ', ' + dNum + '. ' + DE_MONTHS[mNum - 1]
          ];
        case 'US':
          return [
            isoShort,
            mNum + '/' + dNum,
            m + '.' + d,
            EN_WEEKDAYS[dow] + ', ' + mNum + '/' + dNum,
            EN_MONTHS[mNum - 1] + ' ' + dNum,
            EN_WEEKDAYS[dow] + ', ' + EN_MONTHS[mNum - 1] + ' ' + dNum
          ];
        case 'IN':
          return [
            isoShort,
            d + '/' + m,
            d + '-' + m,
            EN_WEEKDAYS[dow] + ', ' + d + '/' + m,
            dNum + ' ' + EN_MONTHS[mNum - 1],
            EN_WEEKDAYS[dow] + ', ' + dNum + ' ' + EN_MONTHS[mNum - 1]
          ];
        case 'CN':
          return [
            isoShort,
            mNum + '/' + dNum,
            m + '.' + d,
            mNum + '/' + dNum + ' (' + CN_WEEKDAYS[dow] + ')',
            mNum + '月' + dNum + '日',
            mNum + '月' + dNum + '日 (' + CN_WEEKDAYS[dow] + ')'
          ];
        default:
          return [
            isoShort,
            m + '/' + d,
            m + '.' + d,
            EN_WEEKDAYS[dow] + ', ' + mNum + '/' + dNum,
            dNum + ' ' + EN_MONTHS[mNum - 1],
            EN_MONTHS[mNum - 1] + ' ' + dNum
          ];
      }
    }

    switch (regionCode) {
      case 'KR':
        return [
          isoFull,
          y + '.' + m + '.' + d,
          "'" + yy + '.' + mNum + '/' + dNum,
          y + '.' + m + '.' + d + ' (' + KO_WEEKDAYS[dow] + ')',
          y + '년 ' + mNum + '월 ' + dNum + '일',
          "'" + yy + '년 ' + mNum + '월 ' + dNum + '일'
        ];
      case 'JP':
        return [
          isoFull,
          y + '/' + m + '/' + d,
          "'" + yy + '.' + mNum + '/' + dNum,
          y + '/' + m + '/' + d + ' (' + JP_WEEKDAYS[dow] + ')',
          y + '年' + mNum + '月' + dNum + '日',
          yy + '年' + mNum + '月' + dNum + '日 (' + JP_WEEKDAYS[dow] + ')'
        ];
      case 'DE':
        return [
          isoFull,
          d + '.' + m + '.' + y,
          d + '.' + m + '.' + yy,
          DE_WEEKDAYS[dow] + ', ' + d + '.' + m + '.' + yy,
          dNum + '. ' + DE_MONTHS[mNum - 1] + ' ' + y,
          dNum + '. ' + DE_MONTHS[mNum - 1] + " '" + yy
        ];
      case 'US':
        return [
          isoFull,
          m + '/' + d + '/' + y,
          mNum + '/' + dNum + '/' + yy,
          "'" + yy + ' ' + mNum + '/' + dNum,
          EN_MONTHS[mNum - 1] + ' ' + dNum + ', ' + y,
          EN_MONTHS[mNum - 1] + ' ' + dNum + ", '" + yy
        ];
      case 'IN':
        return [
          isoFull,
          d + '/' + m + '/' + y,
          d + '-' + m + '-' + y,
          d + '/' + m + '/' + yy,
          dNum + ' ' + EN_MONTHS[mNum - 1] + ' ' + y,
          dNum + ' ' + EN_MONTHS[mNum - 1] + " '" + yy
        ];
      case 'CN':
        return [
          isoFull,
          y + '/' + m + '/' + d,
          y + '.' + m + '.' + d,
          y + '/' + m + '/' + d + ' (' + CN_WEEKDAYS[dow] + ')',
          y + '年' + mNum + '月' + dNum + '日',
          yy + '年' + mNum + '月' + dNum + '日 (' + CN_WEEKDAYS[dow] + ')'
        ];
      default:
        return [
          isoFull,
          y + '/' + m + '/' + d,
          "'" + yy + '.' + mNum + '/' + dNum,
          y + '.' + m + '.' + d,
          dNum + ' ' + EN_MONTHS[mNum - 1] + ' ' + y,
          dNum + ' ' + EN_MONTHS[mNum - 1] + " '" + yy
        ];
    }
  }

  global.HolidayService = {
    SUPPORTED_REGIONS: SUPPORTED_REGIONS,
    REGION_ORDER: REGION_ORDER,
    detectUserRegion: detectUserRegion,
    saveUserRegion: saveUserRegion,
    formatDateByRegion: formatDateByRegion,
    parseDateByRegion: parseDateByRegion,
    getCopyFormatsByRegion: getCopyFormatsByRegion,
    ensureYearLoaded: ensureYearLoaded,
    ensureAllCountriesLoaded: ensureAllCountriesLoaded,
    match: matchHoliday,
    getHolidayEventsForRange: getHolidayEventsForRange
  };
})(window);
