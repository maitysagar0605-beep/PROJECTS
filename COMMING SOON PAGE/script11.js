var countDownDate = new Date("Sept 05, 2027 00:00:00").getTime();
var x=setInterval(function(){
    var today = new Date().getTime();
    var diff = countDownDate-today;

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60 )) / 1000 );


    document.getElementById("days").innerHTML= days;
    document.getElementById("hours").innerHTML= hours;
    document.getElementById("mins").innerHTML= mins;
    document.getElementById("secs").innerHTML= secs;


    if(diff < 0){
      clearInterval(x);

      document.getElementById("days").innerHTML= "00";
      document.getElementById("hours").innerHTML= "00";
      document.getElementById("mins").innerHTML= "00";
      document.getElementById("secs").innerHTML=  "00";
    }
},1000)