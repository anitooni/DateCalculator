
var monthName_y1 = ['Jan_y1', 'Feb_y1', 'Mar_y1', 'Apr_y1', 'May_y1', 'Jun_y1', 'Jul_y1', 'Aug_y1', 'Sep_y1', 'Oct_y1', 'Nov_y1', 'Dec_y1'];
var monthName_y2 = ['Jan_y2', 'Feb_y2', 'Mar_y2', 'Apr_y2', 'May_y2', 'Jun_y2', 'Jul_y2', 'Aug_y2', 'Sep_y2', 'Oct_y2', 'Nov_y2', 'Dec_y2'];
var monthName_y3 = ['Jan_y3', 'Feb_y3', 'Mar_y3', 'Apr_y3', 'May_y3', 'Jun_y3', 'Jul_y3', 'Aug_y3', 'Sep_y3', 'Oct_y3', 'Nov_y3', 'Dec_y3'];
var monthName_y4 = ['Jan_y4', 'Feb_y4', 'Mar_y4', 'Apr_y4', 'May_y4', 'Jun_y4', 'Jul_y4', 'Aug_y4', 'Sep_y4', 'Oct_y4', 'Nov_y4', 'Dec_y4'];

var year_01 = initial_date;
var year_02 = moment(initial_date).add(1, 'years').toDate();
var year_03 = moment(initial_date).add(2, 'years').toDate()
var year_04 = moment(initial_date).add(3, 'years').toDate()

function init4Cals(initial_date){
  document.addEventListener('DOMContentLoaded', function() {
    //1st year
    for (var i = 0; i < monthCal.length; i++){
      monthCal[i] = new FullCalendar.Calendar(document.getElementById(monthName_y1[i]), {          
        initialDate: year_01.setMonth(i),        

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
      })        
    }

    for (let i = 0; i < monthCal.length; i++){        
      monthCal[i].render();
    }

    //2nd year
    for (var i = 0; i < monthCal.length; i++){
      monthCal[i] = new FullCalendar.Calendar(document.getElementById(monthName_y2[i]), {        
        initialDate: year_02.setMonth(i),

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
      })        
    }

    for (let i = 0; i < monthCal.length; i++){        
      monthCal[i].render();
    }

    //3rd year
    for (var i = 0; i < monthCal.length; i++){
      monthCal[i] = new FullCalendar.Calendar(document.getElementById(monthName_y3[i]), {          
        initialDate: year_03.setMonth(i),

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
      })        
    }

    for (let i = 0; i < monthCal.length; i++){        
      monthCal[i].render();
    }

    //4th year
    for (var i = 0; i < monthCal.length; i++){
      monthCal[i] = new FullCalendar.Calendar(document.getElementById(monthName_y4[i]), {          
        initialDate: year_04.setMonth(i),

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
      })        
    }

    for (let i = 0; i < monthCal.length; i++){        
      monthCal[i].render();
    } 
  })  
}
document.getElementById("year_1").innerHTML = current_year;
document.getElementById("year_2").innerHTML = current_year+1;
document.getElementById("year_3").innerHTML = current_year+2;
document.getElementById("year_4").innerHTML = current_year+3;
init4Cals(initial_date)