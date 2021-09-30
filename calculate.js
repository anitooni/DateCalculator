var now = new Date();
var current_year = now.getFullYear();
var initial_date = new Date(current_year, 0, 1);
var selected = now;

var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthCal = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var holiday_ko = [
  ['2020-10-09' , '한글날'], ['2020-10-03' , '개천절'], ['2021-09-21' , '추석'], ['2020-06-06' , '현충일'], ['2020-10-01' , '추석'], ['2020-09-30' , '추석 연휴'], ['2020-10-02' , '추석 연휴'],
  ['2020-12-25' , '크리스마스'], ['2020-01-01' , '신정'], ['2020-08-15' , '광복절'], ['2020-05-05' , '어린이날'], ['2021-02-12' , '설날'], ['2021-02-11' , '설날 연휴'], ['2021-02-13' , '설날 연휴'],
  ['2021-05-19' , '석가탄신일'], ['2020-03-01' , '삼일절'], ['2020-01-24' , '설날 연휴'], ['2020-01-25' , '설날'], ['2020-01-26' , '설날 연휴'], ['2020-01-27' , '설날 대체공휴일'],
  ['2022-01-31' , '설날 연휴'], ['2022-02-01' , '설날'], ['2022-02-02' , '설날 연휴'], ['2022-06-01' , '제8회 전국동시지방선거'], ['2023-01-21' , '설날 연휴'], ['2023-01-22' , '설날'],
  ['2023-01-23' , '설날 연휴'], ['2023-01-24' , '설날 대체공휴일'], ['2023-09-28' , '추석 연휴'], ['2023-09-29' , '추석'], ['2023-09-30' , '추석 연휴'], ['2024-02-09' , '설날 연휴'],
  ['2024-02-10' , '설날'], ['2024-02-11' , '설날 연휴'], ['2024-02-12' , '설날 대체공휴일'], ['2024-04-10' , '제22대 국회의원 선거'], ['2024-05-06' , '어린이날 대체공휴일'],
  ['2024-09-16' , '추석 연휴'], ['2024-09-17' , '추석'], ['2024-09-18' , '추석 연휴'], ['2025-01-29' , '설날'], ['2025-01-28' , '설날 연휴'], ['2025-01-30' , '설날 연휴'],
  ['2025-05-06' , '어린이날 대체공휴일'], ['2025-10-05' , '추석 연휴'], ['2020-04-30' , '석가탄신일'], ['2021-09-20' , '추석 연휴'], ['2021-09-22' , '추석 연휴'], ['2022-05-08' , '석가탄신일'],
  ['2023-05-27' , '석가탄신일'], ['2024-05-15' , '석가탄신일'], ['2025-05-05' , '석가탄신일'], ['2025-10-06' , '추석'], ['2025-10-07' , '추석 연휴'], ['2025-10-08' , '추석 대체공휴일'],
  ['2022-03-09' , '제20대 대통령 선거'], ['2020-04-15' , '제21대 국회의원 선거'], ['2026-02-16' , '설날'], ['2026-02-15' , '설날 연휴'], ['2026-02-17' , '설날 연휴'],
  ['2026-02-18' , '설날 대체공휴일'], ['2026-09-24' , '추석 연휴'], ['2026-09-25' , '추석'], ['2026-09-26' , '추석 연휴'], ['2027-02-05' , '설날'], ['2027-02-04' , '설날 연휴'],
  ['2027-02-06' , '설날 연휴'], ['2026-05-24' , '석가탄신일'], ['2027-05-13' , '석가탄신일'], ['2027-09-15' , '추석'], ['2027-09-14' , '추석 연휴'], ['2027-09-16' , '추석 연휴'],
  ['2028-01-25' , '설날'], ['2028-01-24' , '설날 연휴'], ['2028-01-26' , '설날 연휴'], ['2028-05-02' , '석가탄신일'], ['2028-10-03' , '추석'], ['2028-10-02' , '추석 연휴'],
  ['2028-10-04' , '추석 연휴'], ['2028-10-05' , '추석 대체공휴일'], ['2029-02-12' , '설날'], ['2029-02-11' , '설날 연휴'], ['2029-02-13' , '설날 연휴'], ['2029-02-14' , '설날 대체공휴일'],
  ['2029-05-20' , '석가탄신일'], ['2029-09-22' , '추석'], ['2029-09-23' , '추석 연휴'], ['2029-09-21' , '추석 연휴'], ['2029-09-24' , '추석 대체공휴일'], ['2030-02-02' , '설날'],
  ['2030-02-03' , '설날 연휴'], ['2030-02-01' , '설날 연휴'], ['2030-02-04' , '설날 대체공휴일'], ['2030-05-09' , '석가탄신일'], ['2030-09-12' , '추석'], ['2030-09-13' , '추석 연휴'],
  ['2030-09-11' , '추석 연휴'], ['2031-01-22' , '설날'], ['2031-01-21' , '설날 연휴'], ['2031-01-23' , '설날 연휴'], ['2028-04-12' , '제23대 국회의원 선거'], ['2032-04-14' , '제24대 국회의원 선거'],
  ['2026-06-03' , '제9회 전국동시지방선거'], ['2030-06-05' , '제10회 전국동시지방선거'], ['2027-03-03' , '제21대 대통령 선거'], ['2020-08-17' , '광복절 임시공휴일'], ['2021-08-16' , '광복절 대체공휴일'],
  ['2021-10-04' , '개천절 대체공휴일'], ['2021-10-11' , '한글날 대체공휴일'], ['2022-10-10' , '한글날 대체공휴일'], ['2026-03-02' , '삼일절 대체공휴일'], ['2025-03-03' , '삼일절 대체공휴일'],
  ['2026-08-17' , '광복절 대체공휴일'], ['2026-10-05' , '개천절 대체공휴일'], ['2027-08-16' , '광복절 대체공휴일'], ['2027-10-04' , '개천절 대체공휴일'], ['2027-10-11' , '한글날 대체공휴일'],
  ['2029-05-07' , '어린이날 대체공휴일'], ['2022-09-10' , '추석'], ['2022-09-09' , '추석 연휴'], ['2022-09-11' , '추석 연휴'], ['2022-09-12' , '추석 대체공휴일'], ['2030-05-06' , '어린이날 대체공휴일'],
  ['2031-03-03' , '삼일절 대체공휴일'], ['2032-02-10' , '설날'], ['2032-02-09' , '설날 휴일'], ['2032-02-11' , '설날 휴일'], ['2031-10-01' , '추석'], ['2031-10-02' , '추석 연휴'], ['2031-09-30' , '추석 연휴']
]

//계산된 날짜가 한국의 공휴일과 맞는지 확인해서 return 해 주는 함수
function holidayMatching(date){
  var result = "Working day";    
  var MonthDay = date.substr(5, 5);     
  for (var i = 0 ; i < holiday_ko.length ; i++){
    if(date == holiday_ko[i][0]){
      result = holiday_ko[i][1];
    }
    else{
      if(MonthDay == "01-01"){ result = "신정" }
      if(MonthDay == "03-01"){ result = "삼일절" }
      if(MonthDay == "05-05"){ result = "어린이날" }
      if(MonthDay == "06-06"){ result = "현충일" }
      if(MonthDay == "08-15"){ result = "광복절" }
      if(MonthDay == "10-03"){ result = "개천절" }
      if(MonthDay == "10-09"){ result = "한글날" }
      if(MonthDay == "12-25"){ result = "크리스마스" }        
    }
  }
  return result;
}

//최초 실행 시, FullCalendar로부터 오늘 날짜 기준의 1년치 달력을 불러오는 함수
function initialzeCalendar(initial_date){
  document.addEventListener('DOMContentLoaded', function() { 
    for (var i = 0; i < monthCal.length; i++){
      monthCal[i] = new FullCalendar.Calendar(document.getElementById(monthName[i]), {          
        initialDate: initial_date.setMonth(i),

        headerToolbar:{
          start: 'title',
          center: '',
          end: ''
        },

        titleFormat:{month:"long"},
        aspectRatio: 1,
        contentHeight: "auto",
        nowIndicator: true,
        editable: false,
        selectable: false,
        weekNumbers: false,
        showNonCurrentDates: true,
        
        googleCalendarApiKey: 'AIzaSyCTyUto2el2DJ1oJ0hjk72AlPPA8xgDivw',
        eventSources: [
          {
            googleCalendarId: 'qduatr3seur835pk4aolok2900@group.calendar.google.com',
            overlap: false,
            display: 'background',
            className: 'ko_holiday',              
          }
        ],
        eventDidMount: function(info) {
          var tooltip = new Tooltip(info.el, {
            title: info.event.title,
            placement: 'top',
            trigger: 'hover',
            container: 'body'
          });
         },

        //날짜 선택 시, 시작날짜/종료날짜 모두 수정
        dateClick: function(info) {
          document.getElementById("selected_date").innerHTML = changeDateFormat(info.date);
          selected = info.date;
          calculateDate();
        },
      })        
    }

    for (let i = 0; i < monthCal.length; i++){        
      monthCal[i].render();
      var eventList = monthCal[i].getEventSources();        
   }     

   calculateDate();
  })
}

//년도 변경 시, 달력 전체 재생성
function generateCalendar(initial_date){
    for (var i = 0; i < monthCal.length; i++){
      monthCal[i] = new FullCalendar.Calendar(document.getElementById(monthName[i]), {
        initialDate: initial_date.setMonth(i),

        headerToolbar:{
          start: 'title',
          center: '',
          end: ''
        },

        titleFormat:{month:"long"},
        aspectRatio: 1,
        contentHeight: "auto",
        nowIndicator: true,
        editable: false,
        selectable: false,
        weekNumbers: false,
        showNonCurrentDates: true,
        
        googleCalendarApiKey: 'AIzaSyCTyUto2el2DJ1oJ0hjk72AlPPA8xgDivw',
        eventSources: [
          {
            googleCalendarId: 'qduatr3seur835pk4aolok2900@group.calendar.google.com',
            overlap: false,
            display: 'background',
            className: 'ko_holiday',              
          }
        ],
        eventDidMount: function(info) {
          var tooltip = new Tooltip(info.el, {
            title: info.event.title,
            placement: 'top',
            trigger: 'hover',
            container: 'body'
          });
         },

        //날짜 선택 시, 시작날짜/종료날짜 모두 수정
        dateClick: function(info) {
          document.getElementById("selected_date").innerHTML = changeDateFormat(info.date);
          selected = info.date;
          calculateDate();      
        }
      })        
    }

    for (let i = 0; i < monthCal.length; i++){
      monthCal[i].render(); 
   }

   calculateDate();
}

//생성된 달력 모두 삭제 (안 하면, 메모리에 쌓임)
function destroyCalendar(){
  for (let i = 0; i < monthCal.length; i++){        
      monthCal[i].destroy();
   }
}

//완료 날짜 계산해서 업데이트 하는 함수
function calculateDate(){
  var y_offset = document.getElementById("yearCont").value * 1;
  var w_offset = document.getElementById("weekCont").value * 7;
  var d_offset = document.getElementById("dayCont").value * 1;

  console.log(w_offset);

  var updatedDate = new Date(selected);
  updatedDate.setYear(selected.getFullYear() + y_offset);    
  updatedDate.setDate(selected.getDate() + (w_offset + d_offset));    

  document.getElementById("calculated_date").innerHTML = changeDateFormat(updatedDate);
  
  //날짜 계산할 때, 복사 버튼의 텍스트도 모두 업데이트함
  btn1_1 = copyDateFormat(selected, "DMmm");    
  document.getElementById("f1-1").innerHTML = btn1_1;

  btn1_2 = copyDateFormat(selected, "DMmmYY");    
  document.getElementById("f1-2").innerHTML = btn1_2;

  btn1_3 = copyDateFormat(selected, "MD");    
  document.getElementById("f1-3").innerHTML = btn1_3;

  btn1_4 = copyDateFormat(selected, "YYMD");
  document.getElementById("f1-4").innerHTML = btn1_4;

  btn1_5 = copyDateFormat(selected, "YYYYMMDD");
  document.getElementById("f1-5").innerHTML = btn1_5;

  btn2_1 = copyDateFormat(updatedDate, "DMmm");
  document.getElementById("f2-1").innerHTML = btn2_1;

  btn2_2 = copyDateFormat(updatedDate, "DMmmYY");
  document.getElementById("f2-2").innerHTML = btn2_2;

  btn2_3 = copyDateFormat(updatedDate, "MD");
  document.getElementById("f2-3").innerHTML = btn2_3;

  btn2_4 = copyDateFormat(updatedDate, "YYMD");
  document.getElementById("f2-4").innerHTML = btn2_4;

  btn2_5 = copyDateFormat(updatedDate, "YYYYMMDD");
  document.getElementById("f2-5").innerHTML = btn2_5;

  //공휴일 여부 파악하여 화면에 표시
  var holidayName = holidayMatching(btn2_5);
  document.getElementById("holiday").innerHTML = holidayName;
  if(holidayName != "Working day"){
    document.getElementById("holiday").style.color = "rgb(196, 52, 52)";
    document.getElementById("calculated_date").style.color = "rgb(196, 52, 52)";
  }
  else{
    document.getElementById("holiday").style.color = "rgb(70, 70, 70)";
    document.getElementById("calculated_date").style.color = "rgb(41, 41, 187)";
  }
}

document.getElementById("selected_year").innerHTML = current_year;
document.getElementById("selected_date").innerHTML = changeDateFormat(now);
document.getElementById("calculated_date").innerHTML = changeDateFormat(now);
document.getElementById("showToday").innerHTML = showToday(now);

//이전 년도 버튼을 눌렀을 때 실행하는 함수
var btnPrev = document.getElementById('prev');
btnPrev.addEventListener('click', function(){
  //년도를 1년 전으로 보낸 뒤,
  current_year -= 1;
  //'selected_year' 텍스트를 1년 전으로 업데이트
  document.getElementById("selected_year").innerHTML = current_year;
  //초기화 하는 날짜를, 1년 전으로 보낸 년도의 1월 1일로 설정
  initial_date = new Date(current_year, 0, 1)
  //1년 전으로 보낸 년도의 1월 1일의 달력으로 갱신
  generateCalendar(initial_date);
})

//다음 년도 버튼을 눌렀을 때 실행하는 함수
var btnNext = document.getElementById('next');
btnNext.addEventListener('click', function(){
  //년도를 1년 후로 보낸 뒤,
  current_year += 1;
  //'selected_year' 텍스트를 1년 후로 업데이트
  document.getElementById("selected_year").innerHTML = current_year;
  //초기화 하는 날짜를, 1년 후로 보낸 년도의 1월 1일로 설정
  initial_date = new Date(current_year, 0, 1);
  //1년 후로 보낸 년도의 1월 1일의 달력으로 갱신
  generateCalendar(initial_date);
})

//시작 날짜 복사 버튼 누를 시, 클립보드로 카피하는 이벤트 함수
var sCopy1 = document.getElementById('f1-1');
sCopy1.addEventListener('click', function(){
  CopyToClipboard('f1-1');
})
var sCopy2 = document.getElementById('f1-2');
sCopy2.addEventListener('click', function(){
  CopyToClipboard('f1-2');
})
var sCopy3 = document.getElementById('f1-3');
sCopy3.addEventListener('click', function(){
  CopyToClipboard('f1-3');
})
var sCopy4 = document.getElementById('f1-4');
sCopy4.addEventListener('click', function(){
  CopyToClipboard('f1-4');
})
var sCopy5 = document.getElementById('f1-5');
sCopy5.addEventListener('click', function(){
  CopyToClipboard('f1-5');
})

//종료 날짜 복사 버튼 누를 시, 클립보드로 카피하는 이벤트 함수
var cCopy1 = document.getElementById('f2-1');
cCopy1.addEventListener('click', function(){
  CopyToClipboard('f2-1');
})
var cCopy2 = document.getElementById('f2-2');
cCopy2.addEventListener('click', function(){
  CopyToClipboard('f2-2');
})
var cCopy3 = document.getElementById('f2-3');
cCopy3.addEventListener('click', function(){
  CopyToClipboard('f2-3');
})
var cCopy4 = document.getElementById('f2-4');
cCopy4.addEventListener('click', function(){
  CopyToClipboard('f2-4');
})
var cCopy5 = document.getElementById('f2-5');
cCopy5.addEventListener('click', function(){
  CopyToClipboard('f2-5');
})  

//오늘 날짜 누를 시, 해당 년도로 이동
var goToday = document.getElementById('showToday');
goToday.addEventListener('click', function(){
  var nYear = now.getFullYear();    
  if(nYear == current_year){}
  else{
    initial_date = new Date(nYear, 0, 1)
    current_year = nYear;
    document.getElementById("selected_year").innerHTML = current_year;
    generateCalendar(initial_date);
  }
})

//날짜 포맷 변경하여 'selected_date' 또는 'calculated_date'에 표시하기 위해 리턴: YYYY-MM-DD (weekday)
function changeDateFormat(date){
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

  var dateString = year + '-' + month  + '-' + day + " (" + weekday[date.getDay()] +")";

  return dateString;
}

//오늘 날짜 계산해서 YYYY-MM-DD 포맷으로 리턴
function showToday(date){
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

  var dateString = "Today: " + year + '-' + month  + '-' + day;

  return dateString;
}

//Copy 버튼 눌렀을 시, 클립보드로 복사하는 함수: 가상의 textarea를 생성한 후, textarea에 변경 포맷의 날짜를 넣은 뒤, 전체 복사
function CopyToClipboard(id){
  var txt = document.getElementById(id).innerText;
  console.log(txt);
  const t = document.createElement("textarea");
  document.body.appendChild(t);
  t.value = txt;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
}

//Copy 버튼에 표시되는 날짜 포맷으로 변환하여 리턴하는 함수
function copyDateFormat(date, type){
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var dateString = '';

  if(type == "DMmm"){
    dateString = day + " " + monthName[month];
    if(month == 4){}
    else{
      dateString = dateString + ".";
    }
  }

  if(type == "DMmmYY"){
    dateString = day + " " + monthName[month];

    if(month == 4){}
    else{
      dateString += ".";
    }
    dateString += " " + year.toString().substr(-2);
  }

  if(type == "MD"){
    dateString = (month + 1) + "/" + day;      
  }

  if(type == "YYMD"){
    dateString = "'" + year.toString().substr(-2) + "." + (month + 1) + "/" + day;      
  }

  if(type == "YYYYMMDD"){
    month = ('0' + (month + 1)).slice(-2);
    day = ('0' + day).slice(-2);
    dateString = year + '-' + month  + '-' + day;      
  }

  dateString = dateString.replace(/(\r\n|\n|\r)/gm, "");
  return dateString;
}

initialzeCalendar(initial_date);