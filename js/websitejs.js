function buildPlayerUI() {
    //stands for CAP Scope
    var CAPS = {};
    
    CAPS.player1 = new CAP_Player({
        X: 160,
        Y: 100,
        R: 90
    });
    
    CAPS.pizzaMaker = {
        angle: 120,
        startingAngle: 0,
        color: "#EE249F"
    };
    
    CAPS.player1.makePizza(CAPS.pizzaMaker);
}