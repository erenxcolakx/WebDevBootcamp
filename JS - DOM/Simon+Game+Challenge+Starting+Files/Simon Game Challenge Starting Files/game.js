var buttonColours =["red","blue","green","yellow"];
var gamePattern=[];
var userClickedPattern=[];
var level = 0;
var gameStarted = false;
function nextSequence(){
    var randomNumber = Math.floor(Math.random()*4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    level +=1;
    $("#level-title").text("Level "+level);
    playFadeAnimation(randomChosenColour);
    playSound(randomChosenColour);
}
document.addEventListener("keydown",function(event){
    if (event.key === "a" & gameStarted === false) {
        console.log("girdi");
        nextSequence();
        gameStarted = true;
    }
});
function playFadeAnimation(color) {
    $("#"+color).fadeOut(100).fadeIn(100);
}
function playSound(color) {
    switch (color) {
        case "red":
            var red = new Audio("./sounds/red.mp3");
            red.play();
            break;
        case "yellow":
            var yellow = new Audio("./sounds/yellow.mp3");
            yellow.play();
            break;
        case "green":
            var green = new Audio("./sounds/green.mp3");
            green.play();
            break;
        case "blue":
            var blue = new Audio("./sounds/blue.mp3");
            blue.play();
            break;
        default:
            break;
    }
}
function animatePress(pressedBtn) {
    $("#"+pressedBtn).addClass("pressed");
    setTimeout(function(){
        $("#"+pressedBtn).removeClass("pressed");
    },100);
}
$(".btn").on("click",function(){
    var buttonClicked = this.id;
    userClickedPattern.push(buttonClicked);
    animatePress(buttonClicked);
    checkAnswer(level);
})

function checkAnswer(currentLevel) {
    for (let index = 0; index < userClickedPattern.length; index++) {
        if (userClickedPattern[index] === gamePattern[index]) {
            console.log("success");
            if (index + 1 === currentLevel) {
                setTimeout(function(){
                    nextSequence();
                    userClickedPattern = [];
                },1000);
            }
        }
        else{
            var wrong= new Audio("./sounds/wrong.mp3");
            wrong.play();
            $("body").addClass("game-over");
            $("#level-title").text("Game Over, Press Any Key to Restart");
            setTimeout(function(){
                $("body").removeClass("game-over");
            },200);
            console.log("fail");
            var gameFinished = true; // I create that variable to prevent pushing button with keyboard after restarting
            document.addEventListener("keydown",function(){
                if(gameFinished){
                    startOver();
                    nextSequence();
                    gameFinished=false;
                }
            });
        }
    }
}
function startOver() { // Assign default variables to restart game
    level=0;
    gamePattern=[];
    userClickedPattern=[];
    gameStarted = true;
}