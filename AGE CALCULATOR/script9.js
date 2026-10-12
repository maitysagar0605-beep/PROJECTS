let userInput=document.getElementById("date");
userInput.max= new Date().toISOString().split("T")[0];

let calBtn=document.getElementById("calculate");
calBtn.addEventListener("click",calculateAge);


function calculateAge(){
    let birthDate=new Date(userInput.value);

    let d1=birthDate.getDate();
    let m1=birthDate.getMonth()+1;
    let y1=birthDate.getFullYear();

    let today=new Date();

    let d2=today.getDate();
    let m2=today.getMonth()+1;
    let y2=today.getFullYear();

    let d3,m3,y3;

    y3=y2-y1;

    if(m2>=m1){
        m3=m2-m1;
    } else {
        y3--;
        m3=m2-m1+12;
    }

    if(d2>=d1){
        d3=d2-d1;
    }else{
        let daysInPrevMonth=new Date(y2,m2-1,0).getDate();
        d3=d2-d1+daysInPrevMonth;
        m3--;
    }  
    if(m3<0){
            m3+=12; 
            y3--;
    } 

    let result=document.getElementById("result");
    result.innerHTML=`Your Age is: <span>${y3}</span> Years, <span>${m3}</span> Months, <span>${d3}</span> Days`;
} 