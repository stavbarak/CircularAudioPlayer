function buildPlayerUI() {
    //stands for CAP Scope
    var CAPS = {};
    
    CAPS.audio = document.getElementById("audio");
    
    CAPS.audio.controls = false;
    CAPS.audio.play();
    
    CAPS.player1 = new CAP_Player({
        container: "playerSpot1",
        size: 240
    });
    
    CAPS.pizza1 = CAPS.player1.makePizza({
        angle: 120,
        startingAngle: 0,
        color: "#EE249F"
    });
    
    CAPS.progress = document.getElementById("here");
    var k = 0.25;
    setInterval(function(){
        CAPS.progress.innerHTML = (audio.currentTime / audio.duration) * 360;
        CAPS.pizza1.updatePizza({
            angle: 120,
            startingAngle: (audio.currentTime / audio.duration) * 360,
            color: "#EE249F"
        });
        k+=0.25;
    },5);
}