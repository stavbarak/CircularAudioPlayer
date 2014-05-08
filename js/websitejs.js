function buildPlayerUI() {
    //stands for CAP Scope
    var CAPS = {};
    
    CAPS.player1 = new CAP_Player({
        container: "playerSpot1",
        size: 240
    });
    
    CAPS.pizza1 = CAPS.player1.makePizza({
        angle: 120,
        startingAngle: 0,
        color: "#EE249F"
    });
    
    var k = 0.25;
    setInterval(function(){
        CAPS.pizza1.updatePizza({
            angle: 120,
            startingAngle: k,
            color: "#EE249F"
        });
        k+=0.25;
    },5);
}