function CAP_Player(data){
    //CAP stands for Circular Audio Player

    //TODO should be collected from the constructer data
    this.circle = {
        X: 160,
        Y: 100,
        R: 90
    };
    
    //TODO should be collected from the constructer data
    this.paper = Raphael(0, 0, 320, 200);
    this.player = this.paper.circle(this.circle.X , this.circle.Y, this.circle.R);
    
    //TODO this should be a method that gets its data from the website js and returns the PizzaSlice object
    this.pizzaMaker = {
        circleX: this.circle.X,
        circleY: this.circle.Y,
        circleRaduis: this.circle.R,
        angle: 120,
        startingAngle: 0,
        color: "#EE249F"
    };
    this.firstPizza = new PizzaSlice(this.pizzaMaker);
    this.firstPizza.drawPizza(this.paper);
    
    // var k = 0.25;
    // var animationTest = setInterval(function() {
    //     this.firstPizza.updatePizza(this.paper, {angle: 120, startingAngle: 0 + k});
    //     if (k >= 360) {
    //         clearInterval(animationTest);
    //     }
    //     k+=0.25;
    // }, 50);

}

function PizzaSlice(data) {
    this.angle = data.angle;
    this.startingAngle = data.startingAngle;
    
    //a and b are computed from data.angle once PizzaSlice is instansiated
    this.a = Math.sin((Math.PI / 180) * this.angle);
    this.b = Math.cos((Math.PI / 180) * this.angle);
    
    //c and d are the constants used to calculate a progress frame
    //TODO They should be calculated from data.seconds - which are the total
    //time in seconds it should take to complete a circle (are these still necessary??)
    this.c = 0.259;
    this.d = 0.966;
    
    //e and f are calculated once from startingAngle
    this.e = Math.sin((Math.PI / 180) * this.startingAngle);
    this.f = Math.cos((Math.PI / 180) * this.startingAngle);
    
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
        this.angle = data.angle;
        this.startingAngle = data.startingAngle;
        
        this.a = Math.sin((Math.PI / 180) * this.angle);
        this.b = Math.cos((Math.PI / 180) * this.angle);
        
        this.e = Math.sin((Math.PI / 180) * this.startingAngle);
        this.f = Math.cos((Math.PI / 180) * this.startingAngle);
        
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
        if (this.angle > 180) {
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