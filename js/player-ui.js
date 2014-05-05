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
    
    var firstPizza = new PizzaSlice();
    firstPizza.drawPizza(paper);

}

function PizzaSlice() {
    //size is a multiple of pie (default value)
    this.size = 0.083;
    
    //TODO a and b should be computed from size once PizzaSlice is instansiated
    this.a = 0.259;
    this.b = 0.966;
    
    //c and d are the constants used to calculate a progress frame
    this.c = 0.259;
    this.d = 0.966;
    
    this.color = "#45EEF0";
    
    //default values - TODO: take values from constructor
    this.circle = {
        X: 160,
        Y: 100,
        R: 60 };
        
    this.point = {
        X: this.circle.X - this.circle.R,
        Y: this.circle.Y
    };
    
    this.drawPizza = function(paper) {
        var goto = {
            X: ((this.point.X - this.circle.X) * this.b) - ((this.point.Y - this.circle.Y) * this.a) + this.circle.X,
            Y: ((this.point.X - this.circle.X) * this.a) + ((this.point.Y - this.circle.Y) * this.b) + this.circle.Y
        };
        
        var pathString = "M" + this.circle.X + "," + this.circle.Y + 
        " L" + this.point.X + "," + this.point.Y +
        " A" + this.circle.R + "," + this.circle.R +
        " 0 0,1 " +
        goto.X + "," + goto.Y + " z";
        
        this.drawing = paper.path(pathString);
        this.drawing.attr("fill", this.color);
    };
    
}