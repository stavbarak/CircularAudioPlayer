function buildPlayerUI(){
    //TODO put all variables in CAP scope (stands for Circular Audio Player)
    var CAP = {};
    
    //rotation constants a = sin(pi/12) b = cos(pi/12)
    var a = 0.259, b = 0.966;
    
    var cc = {
        X: 160,
        Y: 100
    };
    
    var ccX = cc.X, ccY = cc.Y, r = 60;
    var paper = Raphael(0, 0, 320, 200);
    var circle = paper.circle(ccX,ccY,r);
    var pizzaMaker = {
        circleX: 160,
        circleY: 100,
        circleRaduis: 60,
        angle: 120,
        startingAngle: 0,
        color: "#EE249F"
    };
    var firstPizza = new PizzaSlice(pizzaMaker);
    firstPizza.drawPizza(paper);
    
    var k = 1;
    var animationTest = setInterval(function() {
        firstPizza.updatePizza(paper, {angle: 120, startingAngle: 0 +k});
        if (k == 360) {
            clearInterval(animationTest);
        }
        k++;
    }, 50);

}

function PizzaSlice(data) {
    //size is a multiple of pie (default value)
    this.size = 0.083;
    
    //a and b are computed from data.angle once PizzaSlice is instansiated
    this.a = Math.sin((Math.PI / 180) * data.angle);
    this.b = Math.cos((Math.PI / 180) * data.angle);
    
    //c and d are the constants used to calculate a progress frame
    //They should be calculated from data.seconds - which are the total
    //time in seconds it should take to complete a circle
    this.c = 0.259;
    this.d = 0.966;
    
    //e and f are calculated once from startingAngle
    this.e = Math.sin((Math.PI / 180) * data.startingAngle);
    this.f = Math.cos((Math.PI / 180) * data.startingAngle);
    
    this.color = data.color;
    
    //default values - TODO: take values from constructor
    this.circle = {
        X: data.circleX,
        Y: data.circleY,
        R: data.circleRaduis };
    
    //this is a constans, not a default value    
    this.referencePoint = {
        X: this.circle.X - this.circle.R,
        Y: this.circle.Y
    };
        
    this.point = {
        X: ((this.referencePoint.X - this.circle.X) * this.f) - ((this.referencePoint.Y - this.circle.Y) * this.e) + this.circle.X,
        Y: ((this.referencePoint.X - this.circle.X) * this.e) + ((this.referencePoint.Y - this.circle.Y) * this.f) + this.circle.Y
    };
    
    this.updatePizza = function(paper, data) {
        this.a = Math.sin((Math.PI / 180) * data.angle);
        this.b = Math.cos((Math.PI / 180) * data.angle);
        
        this.e = Math.sin((Math.PI / 180) * data.startingAngle);
        this.f = Math.cos((Math.PI / 180) * data.startingAngle);
        
        this.point = {
            X: ((this.referencePoint.X - this.circle.X) * this.f) - ((this.referencePoint.Y - this.circle.Y) * this.e) + this.circle.X,
            Y: ((this.referencePoint.X - this.circle.X) * this.e) + ((this.referencePoint.Y - this.circle.Y) * this.f) + this.circle.Y
        };
        this.drawing.remove();
        this.drawPizza(paper);
    };
    
    this.drawPizza = function(paper) {
        var goto = {
            X: ((this.point.X - this.circle.X) * this.b) - ((this.point.Y - this.circle.Y) * this.a) + this.circle.X,
            Y: ((this.point.X - this.circle.X) * this.a) + ((this.point.Y - this.circle.Y) * this.b) + this.circle.Y
        };
        var direction;
        if (data.angle > 180) {
            direction = "1,1";
        } else {
            direction = "0,1";
        }
        
        var pathString = "M" + this.circle.X + "," + this.circle.Y + 
        " L" + this.point.X + "," + this.point.Y +
        " A" + this.circle.R + "," + this.circle.R +
        " 0 " + direction + " " +
        goto.X + "," + goto.Y + " z";
        
        this.drawing = paper.path(pathString);
        this.drawing.attr("fill", this.color);
    };
    
}