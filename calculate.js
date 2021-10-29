var now = new Date();
var current_year = now.getFullYear();
var initial_date = new Date(current_year, 0, 1);
var startDate = new Date(now);
var endDate = new Date(now);

var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthCal = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

$(document).ready(function(){
  $('nav a').on('click',function(){
    $(this).addClass('on');
    $(this).siblings().removeClass('on');
  });
});

function screenOnOff(id){
  if(id == "menu1"){        
    document.getElementById('end_date_calculator').style.display = 'block';
    document.getElementById('cal_4y').style.display = 'none';
    document.getElementById('gap_calculate').style.display = 'none';
  }
  else if(id == "menu2"){
    document.getElementById('end_date_calculator').style.display = 'none';
    document.getElementById('cal_4y').style.display = 'block';
    document.getElementById('gap_calculate').style.display = 'none';
  }
  else if(id == "menu3"){
    document.getElementById('end_date_calculator').style.display = 'none';
    document.getElementById('cal_4y').style.display = 'none';
    document.getElementById('gap_calculate').style.display = 'flex';
  }  
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
        weekNumbers: true,
        weekText: "",
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
          blink_text();
          document.getElementById("selected_date").innerHTML = changeDateFormat(info.date);
          startDate = info.date;
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

function blink_text() {
  $('#selected_date').fadeOut(300);
  $('#selected_date').fadeIn(300);
}

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
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
        weekNumbers: true,
        weekText: "",
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
          blink_text();
          document.getElementById("selected_date").innerHTML = changeDateFormat(info.date);
          startDate = info.date;          
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

  endDate = new Date(startDate);
  endDate.setYear(startDate.getFullYear() + y_offset);    
  endDate.setDate(startDate.getDate() + (w_offset + d_offset));    

  document.getElementById("calculated_date").innerHTML = changeDateFormat(endDate);
  
  //날짜 계산할 때, 복사 버튼의 텍스트도 모두 업데이트함
  btn1_1 = copyDateFormat(startDate, "DMmm");    
  document.getElementById("f1-1").innerHTML = btn1_1;

  btn1_2 = copyDateFormat(startDate, "DMmmYY");    
  document.getElementById("f1-2").innerHTML = btn1_2;

  btn1_3 = copyDateFormat(startDate, "MD");    
  document.getElementById("f1-3").innerHTML = btn1_3;

  btn1_4 = copyDateFormat(startDate, "YYMD");
  document.getElementById("f1-4").innerHTML = btn1_4;

  btn1_5 = copyDateFormat(startDate, "YYYYMMDD");
  document.getElementById("f1-5").innerHTML = btn1_5;

  btn2_1 = copyDateFormat(endDate, "DMmm");
  document.getElementById("f2-1").innerHTML = btn2_1;

  btn2_2 = copyDateFormat(endDate, "DMmmYY");
  document.getElementById("f2-2").innerHTML = btn2_2;

  btn2_3 = copyDateFormat(endDate, "MD");
  document.getElementById("f2-3").innerHTML = btn2_3;

  btn2_4 = copyDateFormat(endDate, "YYMD");
  document.getElementById("f2-4").innerHTML = btn2_4;

  btn2_5 = copyDateFormat(endDate, "YYYYMMDD");
  document.getElementById("f2-5").innerHTML = btn2_5;

  //공휴일 여부 파악하여 화면에 표시
  var dateformat = changeDateFormat(endDate);
  var holidayName = holidayMatching_ko(dateformat);
  document.getElementById("holiday").innerHTML = holidayName;
  if(holidayName != "Working day"){
    document.getElementById("holiday").style.color = "#f03e3e";
    document.getElementById("calculated_date").style.color = "#f03e3e";
  }
  else{
    document.getElementById("holiday").style.color = "#4263eb";
    document.getElementById("calculated_date").style.color = "#4263eb";
  }

  //중국 공휴일 여부 파악하여 화면에 표시
  holidayName = holidayMatching_cn(dateformat);
  document.getElementById("CN_result").innerHTML = holidayName;
  if(holidayName != "Working day"){ document.getElementById("CN_holiday").style.color = "#f03e3e"; }
  else{ document.getElementById("CN_holiday").style.color = "#343a40"; }

  //독일 공휴일 여부 파악하여 화면에 표시
  holidayName = holidayMatching_ge(dateformat);
  document.getElementById("GE_result").innerHTML = holidayName;
  if(holidayName != "Working day"){ document.getElementById("GE_holiday").style.color = "#f03e3e"; }
  else{ document.getElementById("GE_holiday").style.color = "#343a40"; }

  //일본 공휴일 여부 파악하여 화면에 표시
  holidayName = holidayMatching_jp(dateformat);
  document.getElementById("JP_result").innerHTML = holidayName;
  if(holidayName != "Working day"){ document.getElementById("JP_holiday").style.color = "#f03e3e"; }
  else{ document.getElementById("JP_holiday").style.color = "#343a40"; }

  //영국 공휴일 여부 파악하여 화면에 표시
  holidayName = holidayMatching_uk(dateformat);
  document.getElementById("UK_result").innerHTML = holidayName;
  if(holidayName != "Working day"){ document.getElementById("UK_holiday").style.color = "#f03e3e"; }
  else{ document.getElementById("UK_holiday").style.color = "#343a40"; }
  
  //미국 공휴일 여부 파악하여 화면에 표시
  holidayName = holidayMatching_us(dateformat);
  document.getElementById("US_result").innerHTML = holidayName;
  if(holidayName != "Working day"){ document.getElementById("US_holiday").style.color = "#f03e3e"; }
  else{ document.getElementById("US_holiday").style.color = "#343a40"; }
}

document.getElementById("selected_year").innerHTML = current_year;
document.getElementById("selected_date").innerHTML = changeDateFormat(now);
document.getElementById("calculated_date").innerHTML = changeDateFormat(now);
document.getElementById("showToday").innerHTML = showToday(now);
document.getElementById('gap_calculate').style.display = 'none';
document.getElementById('cal_4y').style.display = 'none';

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

//End Date 누를 시, Start Date로 변경
var end_date_to_start_date = document.getElementById('calculated_div');
end_date_to_start_date.addEventListener('click', function(){
  blink_text();
  var end_date = document.getElementById("calculated_date").innerHTML
  document.getElementById("selected_date").innerHTML = end_date
  document.getElementById("yearCont").value = 0;
  document.getElementById("weekCont").value = 0;
  document.getElementById("dayCont").value = 0;
  startDate = new Date(end_date)
  console.log(startDate)
  var eYear = end_date.substr(0,4)
  if(eYear == current_year){}
  else{
    initial_date = new Date(eYear, 0, 1)
    current_year = eYear;
    document.getElementById("selected_year").innerHTML = current_year;
    generateCalendar(initial_date);
  }  
  calculateDate();
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

//copy 버튼 눌렀을 때 토스트 팝업 띄우는 함수
$(".txt").click(function(){
  var selection = $(this).text();
  toastr.options = {
      closeButton: false,
      progressBar: false,
      showMethod: 'fadeIn',
      closeMethod: 'fadeOut',
      positionClass: "toast-bottom-center",
      timeOut: 500
  };
  output = "'" + selection + "'" + "   is copied"
  toastr.success(output);
});

$("#calculated_div").click(function(){
  toastr.options = {
      closeButton: false,
      progressBar: false,
      showMethod: 'fadeIn',
      closeMethod: 'fadeOut',
      positionClass: "toast-bottom-full-width",
      timeOut: 2000
  };
  output = "END DATE is moved to START DATE."
  toastr.success(output);
});

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