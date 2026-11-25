(function (global) {
  'use strict';

  function buildHolidayMap(entries) {
    var map = Object.create(null);
    for (var i = 0; i < entries.length; i++) {
      var date = entries[i][0];
      var name = entries[i][1];
      if (map[date]) {
        if (map[date].indexOf(name) === -1) {
          map[date] += ' / ' + name;
        }
      } else {
        map[date] = name;
      }
    }
    return map;
  }

  function mergeHolidayNames(fixedName, variableName) {
    if (fixedName && variableName) {
      if (fixedName === variableName || variableName.indexOf(fixedName) !== -1) {
        return variableName;
      }
      if (fixedName.indexOf(variableName) !== -1) {
        return fixedName;
      }
      return fixedName + ' / ' + variableName;
    }
    return variableName || fixedName || null;
  }

  var HOLIDAY_DATA = {
    ko: {
      fixed: {
        '01-01': '신정',
        '03-01': '삼일절',
        '05-05': '어린이날',
        '06-06': '현충일',
        '08-15': '광복절',
        '10-03': '개천절',
        '10-09': '한글날',
        '12-25': '크리스마스'
      },
      variable: buildHolidayMap([
        ['2020-01-24', '설날 연휴'], ['2020-01-25', '설날'], ['2020-01-26', '설날 연휴'], ['2020-01-27', '설날 대체공휴일'],
        ['2020-04-15', '제21대 국회의원 선거'], ['2020-04-30', '석가탄신일'], ['2020-08-17', '광복절 임시공휴일'],
        ['2020-09-30', '추석 연휴'], ['2020-10-01', '추석'], ['2020-10-02', '추석 연휴'],
        ['2021-02-11', '설날 연휴'], ['2021-02-12', '설날'], ['2021-02-13', '설날 연휴'], ['2021-05-19', '석가탄신일'],
        ['2021-08-16', '광복절 대체공휴일'], ['2021-09-20', '추석 연휴'], ['2021-09-21', '추석'], ['2021-09-22', '추석 연휴'],
        ['2021-10-04', '개천절 대체공휴일'], ['2021-10-11', '한글날 대체공휴일'],
        ['2022-01-31', '설날 연휴'], ['2022-02-01', '설날'], ['2022-02-02', '설날 연휴'], ['2022-03-09', '제20대 대통령 선거'],
        ['2022-05-08', '석가탄신일'], ['2022-06-01', '제8회 전국동시지방선거'], ['2022-09-09', '추석 연휴'], ['2022-09-10', '추석'],
        ['2022-09-11', '추석 연휴'], ['2022-09-12', '추석 대체공휴일'], ['2022-10-10', '한글날 대체공휴일'],
        ['2023-01-21', '설날 연휴'], ['2023-01-22', '설날'], ['2023-01-23', '설날 연휴'], ['2023-01-24', '설날 대체공휴일'],
        ['2023-05-27', '석가탄신일'], ['2023-09-28', '추석 연휴'], ['2023-09-29', '추석'], ['2023-09-30', '추석 연휴'],
        ['2024-02-09', '설날 연휴'], ['2024-02-10', '설날'], ['2024-02-11', '설날 연휴'], ['2024-02-12', '설날 대체공휴일'],
        ['2024-04-10', '제22대 국회의원 선거'], ['2024-05-06', '어린이날 대체공휴일'], ['2024-05-15', '석가탄신일'],
        ['2024-09-16', '추석 연휴'], ['2024-09-17', '추석'], ['2024-09-18', '추석 연휴'],
        ['2025-01-28', '설날 연휴'], ['2025-01-29', '설날'], ['2025-01-30', '설날 연휴'], ['2025-03-03', '삼일절 대체공휴일'],
        ['2025-05-05', '석가탄신일'], ['2025-05-06', '어린이날 대체공휴일'], ['2025-10-05', '추석 연휴'],
        ['2025-10-06', '추석'], ['2025-10-07', '추석 연휴'], ['2025-10-08', '추석 대체공휴일'],
        ['2026-02-15', '설날 연휴'], ['2026-02-16', '설날'], ['2026-02-17', '설날 연휴'], ['2026-02-18', '설날 대체공휴일'],
        ['2026-03-02', '삼일절 대체공휴일'], ['2026-05-24', '석가탄신일'], ['2026-06-03', '제9회 전국동시지방선거'],
        ['2026-08-17', '광복절 대체공휴일'], ['2026-09-24', '추석 연휴'], ['2026-09-25', '추석'], ['2026-09-26', '추석 연휴'],
        ['2026-10-05', '개천절 대체공휴일'],
        ['2027-02-04', '설날 연휴'], ['2027-02-05', '설날'], ['2027-02-06', '설날 연휴'], ['2027-03-03', '제21대 대통령 선거'],
        ['2027-05-13', '석가탄신일'], ['2027-08-16', '광복절 대체공휴일'], ['2027-09-14', '추석 연휴'], ['2027-09-15', '추석'],
        ['2027-09-16', '추석 연휴'], ['2027-10-04', '개천절 대체공휴일'], ['2027-10-11', '한글날 대체공휴일'],
        ['2028-01-24', '설날 연휴'], ['2028-01-25', '설날'], ['2028-01-26', '설날 연휴'], ['2028-04-12', '제23대 국회의원 선거'],
        ['2028-05-02', '석가탄신일'], ['2028-10-02', '추석 연휴'], ['2028-10-03', '추석'], ['2028-10-04', '추석 연휴'],
        ['2028-10-05', '추석 대체공휴일'],
        ['2029-02-11', '설날 연휴'], ['2029-02-12', '설날'], ['2029-02-13', '설날 연휴'], ['2029-02-14', '설날 대체공휴일'],
        ['2029-05-07', '어린이날 대체공휴일'], ['2029-05-20', '석가탄신일'], ['2029-09-21', '추석 연휴'], ['2029-09-22', '추석'],
        ['2029-09-23', '추석 연휴'], ['2029-09-24', '추석 대체공휴일'],
        ['2030-02-01', '설날 연휴'], ['2030-02-02', '설날'], ['2030-02-03', '설날 연휴'], ['2030-02-04', '설날 대체공휴일'],
        ['2030-05-06', '어린이날 대체공휴일'], ['2030-05-09', '석가탄신일'], ['2030-06-05', '제10회 전국동시지방선거'],
        ['2030-09-11', '추석 연휴'], ['2030-09-12', '추석'], ['2030-09-13', '추석 연휴'],
        ['2031-01-21', '설날 연휴'], ['2031-01-22', '설날'], ['2031-01-23', '설날 연휴'], ['2031-03-03', '삼일절 대체공휴일'],
        ['2031-09-30', '추석 연휴'], ['2031-10-01', '추석'], ['2031-10-02', '추석 연휴'],
        ['2032-02-09', '설날 연휴'], ['2032-02-10', '설날'], ['2032-02-11', '설날 연휴'], ['2032-04-14', '제24대 국회의원 선거']
      ])
    },

    us: {
      fixed: {
        '01-01': "New Year's Day",
        '06-19': 'Juneteenth',
        '07-04': 'Independence Day',
        '11-11': 'Veterans Day',
        '12-25': 'Christmas'
      },
      variable: buildHolidayMap([
        ['2021-01-18', 'Martin Luther King Jr. Day'], ['2021-01-20', 'Inauguration Day (DC, MD, VA)'], ['2021-02-15', "Presidents' Day"], ['2021-05-31', 'Memorial Day'],
        ['2021-06-18', 'Day off for Juneteenth'], ['2021-07-05', 'Independence Day observed'], ['2021-09-06', 'Labor Day'], ['2021-10-11', 'Columbus Day'],
        ['2021-11-25', 'Thanksgiving Day'], ['2021-12-24', 'Day off for Christmas'], ['2021-12-31', "Day off for New Year's Day"],
        ['2022-01-17', 'Martin Luther King Jr. Day'], ['2022-02-21', "Presidents' Day"], ['2022-05-30', 'Memorial Day'], ['2022-06-20', 'Day off for Juneteenth'],
        ['2022-09-05', 'Labor Day'], ['2022-10-10', 'Columbus Day'], ['2022-11-24', 'Thanksgiving Day'], ['2022-12-26', 'Day off for Christmas'],
        ['2023-01-02', "Day off for New Year's Day"], ['2023-01-16', 'Martin Luther King Jr. Day'], ['2023-02-20', "Presidents' Day"], ['2023-05-29', 'Memorial Day'],
        ['2023-09-04', 'Labor Day'], ['2023-10-09', 'Columbus Day'], ['2023-11-10', 'Day off for Veterans Day'], ['2023-11-23', 'Thanksgiving Day'],
        ['2024-01-15', 'Martin Luther King Jr. Day'], ['2024-02-19', "Presidents' Day"], ['2024-05-27', 'Memorial Day'], ['2024-09-02', 'Labor Day'],
        ['2024-10-14', 'Columbus Day'], ['2024-11-28', 'Thanksgiving Day'],
        ['2025-01-20', 'Martin Luther King Jr. Day'], ['2025-01-20', 'Inauguration Day (DC, MD, VA)'], ['2025-02-17', "Presidents' Day"], ['2025-05-26', 'Memorial Day'],
        ['2025-09-01', 'Labor Day'], ['2025-10-13', 'Columbus Day'], ['2025-11-27', 'Thanksgiving Day'],
        ['2026-01-19', 'Martin Luther King Jr. Day'], ['2026-02-16', "Presidents' Day"], ['2026-05-25', 'Memorial Day'], ['2026-07-03', 'Independence Day observed'],
        ['2026-09-07', 'Labor Day'], ['2026-10-12', 'Columbus Day'], ['2026-11-26', 'Thanksgiving Day'],
        ['2027-01-18', 'Martin Luther King Jr. Day'], ['2027-02-15', "Presidents' Day"], ['2027-05-31', 'Memorial Day'], ['2027-06-18', 'Day off for Juneteenth'],
        ['2027-07-05', 'Independence Day observed'], ['2027-09-06', 'Labor Day'], ['2027-10-11', 'Columbus Day'], ['2027-11-25', 'Thanksgiving Day'],
        ['2027-12-24', 'Day off for Christmas'], ['2027-12-31', "Day off for New Year's Day"],
        ['2028-01-17', 'Martin Luther King Jr. Day'], ['2028-02-21', "Presidents' Day"], ['2028-05-29', 'Memorial Day'], ['2028-09-04', 'Labor Day'],
        ['2028-10-09', 'Columbus Day'], ['2028-11-10', 'Day off for Veterans Day'], ['2028-11-23', 'Thanksgiving Day'],
        ['2029-01-15', 'Martin Luther King Jr. Day'], ['2029-01-20', 'Inauguration Day (DC, MD, VA)'], ['2029-02-19', "Presidents' Day"], ['2029-05-28', 'Memorial Day'],
        ['2029-09-03', 'Labor Day'], ['2029-10-08', 'Columbus Day'], ['2029-11-12', 'Day off for Veterans Day'], ['2029-11-22', 'Thanksgiving Day'],
        ['2030-01-21', 'Martin Luther King Jr. Day'], ['2030-02-18', "Presidents' Day"], ['2030-05-27', 'Memorial Day'], ['2030-09-02', 'Labor Day'],
        ['2030-10-14', 'Columbus Day'], ['2030-11-28', 'Thanksgiving Day']
      ])
    },

    cn: {
      fixed: {
        '01-01': "New Year's Day",
        '03-08': "International Women's Day",
        '05-01': 'Labour Day',
        '05-04': 'Youth Day',
        '10-01': 'National Day',
        '10-02': 'National Day Golden Week',
        '10-03': 'National Day Golden Week',
        '10-04': 'National Day Golden Week',
        '10-05': 'National Day Golden Week',
        '10-06': 'National Day Golden Week',
        '10-07': 'National Day Golden Week'
      },
      variable: buildHolidayMap([
        ['2021-01-02', "New Year's Holiday"], ['2021-01-03', "New Year's Holiday"], ['2021-02-11', 'Spring Fest Eve'], ['2021-02-12', 'Chinese New Year'],
        ['2021-02-13', 'Spring Fest Golden Week'], ['2021-02-14', 'Spring Fest Golden Week'], ['2021-02-15', 'Spring Fest Golden Week'],
        ['2021-02-16', 'Spring Fest Golden Week'], ['2021-02-17', 'Spring Fest Golden Week'], ['2021-04-03', 'Qing Ming Jie holiday'],
        ['2021-04-04', 'Qing Ming Jie holiday'], ['2021-04-05', 'Qing Ming Jie'], ['2021-05-02', 'Labour Day Holiday'],
        ['2021-05-03', 'Labour Day Holiday'], ['2021-05-05', 'Labour Day Holiday'], ['2021-06-12', 'Dragon Boat Fest holiday'],
        ['2021-06-13', 'Dragon Boat Fest holiday'], ['2021-06-14', 'Dragon Boat Fest'], ['2021-09-19', 'Mid-Autumn Fest holiday'],
        ['2021-09-20', 'Mid-Autumn Fest holiday'], ['2021-09-21', 'Mid-Autumn Fest'],
        ['2022-01-31', 'Spring Fest Eve'], ['2022-02-01', 'Chinese New Year'], ['2022-02-02', 'Spring Fest Golden Week'],
        ['2022-02-03', 'Spring Fest Golden Week'], ['2022-02-04', 'Spring Fest Golden Week'], ['2022-02-05', 'Spring Fest Golden Week'],
        ['2022-02-06', 'Spring Fest Golden Week'], ['2022-04-05', 'Qing Ming Jie'], ['2022-06-03', 'Dragon Boat Fest'], ['2022-09-10', 'Mid-Autumn Fest'],
        ['2023-01-21', 'Spring Fest Eve'], ['2023-01-22', 'Chinese New Year'], ['2023-01-23', 'Spring Fest Golden Week'],
        ['2023-01-24', 'Spring Fest Golden Week'], ['2023-01-25', 'Spring Fest Golden Week'], ['2023-01-26', 'Spring Fest Golden Week'],
        ['2023-01-27', 'Spring Fest Golden Week'], ['2023-04-05', 'Qing Ming Jie'], ['2023-06-22', 'Dragon Boat Fest'], ['2023-09-29', 'Mid-Autumn Fest'],
        ['2024-02-09', 'Spring Fest Eve'], ['2024-02-10', 'Chinese New Year'], ['2024-02-11', 'Spring Fest Golden Week'],
        ['2024-02-12', 'Spring Fest Golden Week'], ['2024-02-13', 'Spring Fest Golden Week'], ['2024-02-14', 'Spring Fest Golden Week'],
        ['2024-02-15', 'Spring Fest Golden Week'], ['2024-04-04', 'Qing Ming Jie'], ['2024-06-10', 'Dragon Boat Fest'], ['2024-09-17', 'Mid-Autumn Fest'],
        ['2025-01-28', 'Spring Fest Eve'], ['2025-01-29', 'Chinese New Year'], ['2025-01-30', 'Spring Fest Golden Week'],
        ['2025-01-31', 'Spring Fest Golden Week'], ['2025-02-01', 'Spring Fest Golden Week'], ['2025-02-02', 'Spring Fest Golden Week'],
        ['2025-02-03', 'Spring Fest Golden Week'], ['2025-04-05', 'Qing Ming Jie'], ['2025-05-31', 'Dragon Boat Fest'],
        ['2026-02-16', 'Spring Fest Eve'], ['2026-02-17', 'Chinese New Year'], ['2026-02-18', 'Spring Fest Golden Week'],
        ['2026-02-19', 'Spring Fest Golden Week'], ['2026-02-20', 'Spring Fest Golden Week'], ['2026-02-21', 'Spring Fest Golden Week'],
        ['2026-02-22', 'Spring Fest Golden Week'], ['2026-04-05', 'Qing Ming Jie'], ['2026-06-19', 'Dragon Boat Fest'], ['2026-09-25', 'Mid-Autumn Fest'],
        ['2027-02-05', 'Spring Fest Eve'], ['2027-02-06', 'Chinese New Year'], ['2027-02-07', 'Spring Fest Golden Week'],
        ['2027-02-08', 'Spring Fest Golden Week'], ['2027-02-09', 'Spring Fest Golden Week'], ['2027-02-10', 'Spring Fest Golden Week'],
        ['2027-02-11', 'Spring Fest Golden Week'], ['2027-04-05', 'Qing Ming Jie'], ['2027-06-09', 'Dragon Boat Fest'], ['2027-09-15', 'Mid-Autumn Fest'],
        ['2028-01-25', 'Spring Fest Eve'], ['2028-01-26', 'Chinese New Year'], ['2028-01-27', 'Spring Fest Golden Week'],
        ['2028-01-28', 'Spring Fest Golden Week'], ['2028-01-29', 'Spring Fest Golden Week'], ['2028-01-30', 'Spring Fest Golden Week'],
        ['2028-01-31', 'Spring Fest Golden Week'], ['2028-04-04', 'Qing Ming Jie'], ['2028-05-28', 'Dragon Boat Fest'],
        ['2029-02-12', 'Spring Fest Eve'], ['2029-02-13', 'Chinese New Year'], ['2029-02-14', 'Spring Fest Golden Week'],
        ['2029-02-15', 'Spring Fest Golden Week'], ['2029-02-16', 'Spring Fest Golden Week'], ['2029-02-17', 'Spring Fest Golden Week'],
        ['2029-02-18', 'Spring Fest Golden Week'], ['2029-04-05', 'Qing Ming Jie'], ['2029-06-16', 'Dragon Boat Fest'], ['2029-09-22', 'Mid-Autumn Fest'],
        ['2030-02-02', 'Spring Fest Eve'], ['2030-02-03', 'Chinese New Year'], ['2030-02-04', 'Spring Fest Golden Week'],
        ['2030-02-05', 'Spring Fest Golden Week'], ['2030-02-06', 'Spring Fest Golden Week'], ['2030-02-07', 'Spring Fest Golden Week'],
        ['2030-02-08', 'Spring Fest Golden Week'], ['2030-04-05', 'Qing Ming Jie'], ['2030-06-05', 'Dragon Boat Fest'], ['2030-09-12', 'Mid-Autumn Fest']
      ])
    },

    uk: {
      fixed: {
        '01-01': "New Year's Day",
        '12-25': 'Christmas',
        '12-26': 'Boxing Day'
      },
      variable: buildHolidayMap([
        ['2021-04-02', 'Good Friday'], ['2021-05-03', 'Early May Bank Holiday'], ['2021-05-31', 'Spring Bank Holiday'],
        ['2021-12-27', 'Substitute Bank Holiday for Christmas'], ['2021-12-28', 'Substitute Bank Holiday for Boxing Day'],
        ['2022-01-03', "New Year's Day observed"], ['2022-04-15', 'Good Friday'], ['2022-05-02', 'Early May Bank Holiday'],
        ['2022-06-02', 'Spring Bank Holiday'], ['2022-06-03', "Queen's Platinum Jubilee"], ['2022-12-27', 'Substitute Bank Holiday for Christmas'],
        ['2023-01-02', "New Year's Day observed"], ['2023-04-07', 'Good Friday'], ['2023-05-01', 'Early May Bank Holiday'], ['2023-05-29', 'Spring Bank Holiday'],
        ['2024-03-29', 'Good Friday'], ['2024-05-06', 'Early May Bank Holiday'], ['2024-05-27', 'Spring Bank Holiday'],
        ['2025-04-18', 'Good Friday'], ['2025-05-05', 'Early May Bank Holiday'], ['2025-05-26', 'Spring Bank Holiday'],
        ['2026-04-03', 'Good Friday'], ['2026-05-04', 'Early May Bank Holiday'], ['2026-05-25', 'Spring Bank Holiday'], ['2026-12-28', 'Substitute Bank Holiday for Boxing Day'],
        ['2027-03-26', 'Good Friday'], ['2027-05-03', 'Early May Bank Holiday'], ['2027-05-31', 'Spring Bank Holiday'],
        ['2027-12-27', 'Substitute Bank Holiday for Christmas'], ['2027-12-28', 'Substitute Bank Holiday for Boxing Day'],
        ['2028-01-03', "New Year's Day observed"], ['2028-04-14', 'Good Friday'], ['2028-05-01', 'Early May Bank Holiday'], ['2028-05-29', 'Spring Bank Holiday'],
        ['2029-03-30', 'Good Friday'], ['2029-05-07', 'Early May Bank Holiday'], ['2029-05-28', 'Spring Bank Holiday'],
        ['2030-04-19', 'Good Friday'], ['2030-05-06', 'Early May Bank Holiday'], ['2030-05-27', 'Spring Bank Holiday']
      ])
    },

    ge: {
      fixed: {
        '01-01': "New Year's Day",
        '05-01': 'May Day',
        '10-03': 'Day of German Unity',
        '12-25': 'Christmas',
        '12-26': 'Boxing Day'
      },
      variable: buildHolidayMap([
        ['2021-04-02', 'Good Friday'], ['2021-04-05', 'Easter Monday'], ['2021-05-13', 'Ascension Day'], ['2021-05-24', 'Whit Monday'],
        ['2022-04-15', 'Good Friday'], ['2022-04-18', 'Easter Monday'], ['2022-05-26', 'Ascension Day'], ['2022-06-06', 'Whit Monday'],
        ['2023-04-07', 'Good Friday'], ['2023-04-10', 'Easter Monday'], ['2023-05-18', 'Ascension Day'], ['2023-05-29', 'Whit Monday'],
        ['2024-03-29', 'Good Friday'], ['2024-04-01', 'Easter Monday'], ['2024-05-09', 'Ascension Day'], ['2024-05-20', 'Whit Monday'],
        ['2025-04-18', 'Good Friday'], ['2025-04-21', 'Easter Monday'], ['2025-05-29', 'Ascension Day'], ['2025-06-09', 'Whit Monday'],
        ['2026-04-03', 'Good Friday'], ['2026-04-06', 'Easter Monday'], ['2026-05-14', 'Ascension Day'], ['2026-05-25', 'Whit Monday'],
        ['2027-03-26', 'Good Friday'], ['2027-03-29', 'Easter Monday'], ['2027-05-06', 'Ascension Day'], ['2027-05-17', 'Whit Monday'],
        ['2028-04-14', 'Good Friday'], ['2028-04-17', 'Easter Monday'], ['2028-05-25', 'Ascension Day'], ['2028-06-05', 'Whit Monday'],
        ['2029-03-30', 'Good Friday'], ['2029-04-02', 'Easter Monday'], ['2029-05-10', 'Ascension Day'], ['2029-05-21', 'Whit Monday'],
        ['2030-04-19', 'Good Friday'], ['2030-04-22', 'Easter Monday'], ['2030-05-30', 'Ascension Day'], ['2030-06-10', 'Whit Monday']
      ])
    },

    jp: {
      fixed: {
        '01-01': "New Year's Day",
        '02-11': 'National Foundation Day',
        '02-23': "Emperor's Birthday",
        '04-29': 'Shōwa Day',
        '05-03': 'Constitution Memorial Day',
        '05-04': 'Greenery Day',
        '05-05': "Children's Day",
        '09-23': 'Autumn Equinox',
        '11-03': 'Culture Day',
        '11-23': 'Labor Thanksgiving Day'
      },
      variable: buildHolidayMap([
        ['2021-01-11', 'Coming of Age Day'], ['2021-03-20', 'Spring Equinox'], ['2021-07-22', 'Sea Day'], ['2021-07-23', 'Sports Day'],
        ['2021-08-08', 'Mountain Day'], ['2021-08-09', 'Day off for Mountain Day'], ['2021-09-20', 'Respect for the Aged Day'],
        ['2022-01-10', 'Coming of Age Day'], ['2022-03-21', 'Spring Equinox'], ['2022-07-18', 'Sea Day'], ['2022-08-11', 'Mountain Day'],
        ['2022-09-19', 'Respect for the Aged Day'], ['2022-10-10', 'Sports Day'],
        ['2023-01-02', "New Year's Day observed"], ['2023-01-09', 'Coming of Age Day'], ['2023-03-21', 'Spring Equinox'], ['2023-07-17', 'Sea Day'],
        ['2023-08-11', 'Mountain Day'], ['2023-09-18', 'Respect for the Aged Day'], ['2023-10-09', 'Sports Day'],
        ['2024-01-08', 'Coming of Age Day'], ['2024-02-12', 'National Foundation Day observed'], ['2024-03-20', 'Spring Equinox'],
        ['2024-05-06', "Children's Day observed"], ['2024-07-15', 'Sea Day'], ['2024-08-11', 'Mountain Day'], ['2024-08-12', 'Day off for Mountain Day'],
        ['2024-09-16', 'Respect for the Aged Day'], ['2024-09-22', 'Autumn Equinox'], ['2024-10-14', 'Sports Day'], ['2024-11-04', 'Culture Day observed'],
        ['2025-01-13', 'Coming of Age Day'], ['2025-02-24', "Emperor's Birthday observed"], ['2025-03-20', 'Spring Equinox'],
        ['2025-05-06', 'Greenery Day observed'], ['2025-07-21', 'Sea Day'], ['2025-08-11', 'Mountain Day'], ['2025-09-15', 'Respect for the Aged Day'],
        ['2025-10-13', 'Sports Day'], ['2025-11-24', 'Labor Thanksgiving Day observed'],
        ['2026-01-12', 'Coming of Age Day'], ['2026-03-20', 'Spring Equinox'], ['2026-05-06', 'Constitution Memorial Day observed'],
        ['2026-07-20', 'Sea Day'], ['2026-08-11', 'Mountain Day'], ['2026-09-21', 'Respect for the Aged Day'], ['2026-09-22', 'Bridge Public holiday'],
        ['2026-10-12', 'Sports Day'],
        ['2027-01-11', 'Coming of Age Day'], ['2027-03-21', 'Spring Equinox'], ['2027-03-22', 'Spring Equinox observed'], ['2027-07-19', 'Sea Day'],
        ['2027-08-11', 'Mountain Day'], ['2027-09-20', 'Respect for the Aged Day'], ['2027-10-11', 'Sports Day'],
        ['2028-01-10', 'Coming of Age Day'], ['2028-03-20', 'Spring Equinox'], ['2028-07-17', 'Sea Day'], ['2028-08-11', 'Mountain Day'],
        ['2028-09-18', 'Respect for the Aged Day'], ['2028-09-22', 'Autumn Equinox'], ['2028-10-09', 'Sports Day'],
        ['2029-01-08', 'Coming of Age Day'], ['2029-02-12', 'National Foundation Day observed'], ['2029-03-20', 'Spring Equinox'],
        ['2029-04-30', 'Shōwa Day observed'], ['2029-07-16', 'Sea Day'], ['2029-08-11', 'Mountain Day'], ['2029-09-17', 'Respect for the Aged Day'],
        ['2029-09-24', 'Autumn Equinox observed'], ['2029-10-08', 'Sports Day'],
        ['2030-01-14', 'Coming of Age Day'], ['2030-03-20', 'Spring Equinox'], ['2030-05-06', "Children's Day observed"], ['2030-07-15', 'Sea Day'],
        ['2030-08-11', 'Mountain Day'], ['2030-08-12', 'Day off for Mountain Day'], ['2030-09-16', 'Respect for the Aged Day'],
        ['2030-10-14', 'Sports Day'], ['2030-11-04', 'Culture Day observed']
      ])
    }
  };

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function matchHoliday(country, dateStr) {
    var countryData = HOLIDAY_DATA[country];
    if (!countryData) return 'Working day';

    var dateOnly = dateStr.slice(0, 10);
    var monthDay = dateStr.slice(5, 10);
    var weekday = dateStr.slice(12, 15);

    var holidayName = mergeHolidayNames(countryData.fixed[monthDay], countryData.variable[dateOnly]);
    if (holidayName) return holidayName;
    if (weekday === 'Sat' || weekday === 'Sun') return 'Weekend';
    return 'Working day';
  }

  // FullCalendar용 한국 공휴일 배경 이벤트 생성 (외부 API 호출 없이 로컬 즉시 반환)
  function getKoreanHolidayEvents(startDate, endDate) {
    var events = [];
    var ko = HOLIDAY_DATA.ko;
    var cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    var end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    while (cursor < end) {
      var yyyy = cursor.getFullYear();
      var mmdd = pad2(cursor.getMonth() + 1) + '-' + pad2(cursor.getDate());
      var dateOnly = yyyy + '-' + mmdd;
      var title = mergeHolidayNames(ko.fixed[mmdd], ko.variable[dateOnly]);

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

  global.HolidayService = {
    match: matchHoliday,
    getKoreanHolidayEvents: getKoreanHolidayEvents
  };
})(window);
