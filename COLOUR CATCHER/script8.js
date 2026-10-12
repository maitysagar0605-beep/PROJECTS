let targetColor="";
let score=0;
let time=30;
let timer;
let isPlaying=false;
let colors=['red','orange','blue','green','black','grey','hotpink','purple','white','yellow','lightgreen','maroon','khaki','brown','navy','indigo'];
const grid=document.getElementById("grid");
const targetColorDisplay=document.getElementById("target-color");
const scoreDisplay=document.getElementById("score");
const timeDisplay=document.getElementById("time");

function shuffleArray(colors){
    for(let i=colors.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [colors[i],colors[j]]=[colors[j],colors[i]];
    }
    return colors;
}
function createGrid(){
    grid.innerHTML="";
    colors=shuffleArray(colors);
    console.log(colors);
    targetColor=colors[Math.floor(Math.random()*16)];
    targetColorDisplay.textContent=targetColor;
    colors.forEach((color)=>{
        const box = document.createElement("div");
        box.className="color-box";
        box.style.backgroundColor=color;
        box.addEventListener('click',()=>{handleClick(color);});
        grid.appendChild(box);
    });
}
function handleClick(clickedColor){
    if(!isPlaying) return;
    if(clickedColor===targetColor){
        score++;
        scoreDisplay.textContent=score;
        createGrid();
    }
}

function startGame(){
    score=0;
    time=30;
    scoreDisplay.textContent=score;
    timeDisplay.textContent=time;
    isPlaying=true;
    createGrid();
    clearInterval(timer);
    timer=setInterval(()=>{
        time--;
        timeDisplay.textContent=time;
        if(time===0){
            isPlaying=false;
            clearInterval(timer);
           setTimeout(() => {
                alert("⏳Time's up! Your final score: " + score);
            }, 100);
        }
    },1000);


}
let darkButton=document.getElementById("dark");
let lightButton=document.getElementById("light");
if(lightButton){
    lightButton.addEventListener('click',lightMode);
}
if(darkButton){
    darkButton.addEventListener('click',darkMode);
}
function lightMode(){
    document.body.style.backgroundColor="#f0f0f0";
    let gc=document.querySelector(".game-container");
    if(gc){
        gc.style.backgroundColor="white";
        gc.style.color="black";
    }
    const modeElement=document.getElementById("mode");
    if(modeElement){
        modeElement.style.boxShadow="5px 5px 5px black";
    }
}
function darkMode(){
    document.body.style.backgroundColor="#333333";
    let gc=document.querySelector(".game-container");
    if(gc){
        gc.style.backgroundColor="black";
        gc.style.color="white";
    }
    const modeElement=document.getElementById("mode");
    if(modeElement){
        modeElement.style.boxShadow="5px 5px 5px white";
    }
}
