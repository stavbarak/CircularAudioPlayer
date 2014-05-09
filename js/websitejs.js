function buildPlayerUI() {
    //stands for CAP Scope
    var CAPS = {};
    
    CAPS.audio = document.getElementById("audio");
    
    CAPS.audio.controls = false;
    // CAPS.audio.play();
    
    CAPS.player1 = new CAP_Player({
        container: "playerSpot1",
        size: 240
    });
    
    
    //example end product code.
    CAPS.player1.addTrack("mp3/JoshWoodward-Ashes-01-LetItIn.mp3");
    CAPS.player1.addTrack("mp3/JoshWoodward-DW-01-IWantToDestroySomethingBeautiful.mp3");
    CAPS.player1.addTrack("mp3/JoshWoodward-DW-12-Nincompoop.mp3");
    
    //will create the pizza slices in the correct sizes with random colors
    CAPS.player1.beReady();
    //after that, clicking on the pizza slice of the track will start playing the file
    
    // CAPS.pizza1 = CAPS.player1.makePizza({
    //     angle: 120,
    //     startingAngle: 0,
    //     color: "#EE249F"
    // });
    
    CAPS.progress = document.getElementById("here");
    // var k = 0.25;
    // setInterval(function(){
    //     CAPS.pizza1.updatePizza({
    //         angle: 120,
    //         startingAngle: (CAPS.audio.currentTime / CAPS.audio.duration) * 360,
    //         color: "#EE249F"
    //     });
    //     k+=0.25;
    // },5);
}