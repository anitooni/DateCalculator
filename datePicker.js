var now = new Date();
var sDate = new Date(now);
var eDate = new Date(now);

document.getElementById('start_datepicker').value = moment(now).format('YYYY-MM-DD');
document.getElementById('end_datepicker').value = moment(now).format('YYYY-MM-DD');
document.getElementById('result-all').innerHTML = "= 0 year(s), 0 month(s), 0 day(s)";
document.getElementById('result-month').innerHTML = "= 0 month(s), 0 day(s)";
document.getElementById('result-week').innerHTML = "= 0 week(s), 0 day(s)";
document.getElementById('result-day').innerHTML = "= 0 day(s)";

var start_picker = new Pikaday({
  field: document.getElementById('start_datepicker'),
  format: 'YYYY-MM-DD',
  position: 'bottom left',
  showWeekNumber : true,
  bound: false,  
  toString(date, format) {
      // you should do formatting based on the passed format,
      // but we will just return 'D/M/YYYY' for simplicity
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
  },
  parse(dateString, format) {
    // dateString is the result of `toString` method
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  },
  onSelect(){    
    sDate = moment(this.toString()).format();
    console.log(sDate);
    document.getElementById('start_datepicker').value = moment(sDate).format('YYYY-MM-DD');
    calculateGap(sDate, eDate);
  },  
});

var end_picker = new Pikaday({
  field: document.getElementById('end_datepicker'),
  format: 'YYYY-MM-DD',
  position: 'bottom left',
  showWeekNumber : true,
  bound: false,  
  toString(date, format) {
      // you should do formatting based on the passed format,
      // but we will just return 'D/M/YYYY' for simplicity
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
  },
  parse(dateString, format) {
    // dateString is the result of `toString` method
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  },
  onSelect(){
    eDate = moment(this.toString()).format();
    console.log(eDate);
    document.getElementById('end_datepicker').value = moment(eDate).format('YYYY-MM-DD');
    calculateGap(sDate, eDate);
  },  
});

start_picker.show();

function calculateGap(sDate, eDate){
  var gap= moment.preciseDiff(eDate, sDate);
  document.getElementById('result-all').innerHTML = gap;  

  var gapDetail= moment.preciseDiff(eDate, sDate, true);
  var remain_gDay = Math.abs(  gapDetail['days'] );

  var gMonth = Math.abs(  moment(eDate).diff(moment(sDate), 'months')  );
  var gWeek = Math.abs(  moment(eDate).diff(moment(sDate), 'weeks')  );
  var gDay = Math.abs(  moment(eDate).diff(moment(sDate), 'days')  );

  document.getElementById('result-all').innerHTML = "= " + gapDetail['years'] + " year(s), " + gapDetail['months'] + " month(s), " + remain_gDay + " day(s)";
  document.getElementById('result-month').innerHTML = "= " + gMonth + " month(s), " + remain_gDay + " day(s)";
  document.getElementById('result-week').innerHTML = "= " + gWeek + " week(s), " + Math.floor(remain_gDay%7) + " day(s)";
  document.getElementById('result-day').innerHTML = "= " + gDay + " day(s)"
}