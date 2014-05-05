function buildPlayerUI(){
    //rotation constants a = sin(pi/12) b = cos(pi/12)
    var a = 0.259, b = 0.966;
    
    var ccX = 160, ccY = 100, r = 60;
    
    var firstpX = ccX - r;
    var firstpY = ccY;
    var firstp = firstpX + "," + firstpY;
    var paper = Raphael(0, 0, 320, 200);
    var circle = paper.circle(ccX,ccY,r);
    var x = ((firstpX - ccX) * b) - ((firstpY -ccY) * a) + ccX,
        y = ((firstpX -ccX) * a) + ((firstpY-ccY) * b) +ccY;
    var goto = x + "," + y;
    var pizzaSlice = paper.path("M160,100 L" + firstp + " A60,60 0 0,1 " + goto + " z");
    pizzaSlice.attr("fill", "#43E4E4");
    
    firstpX = x;
    firstpY = y;
    firstp = firstpX + "," + firstpY;
    x = ((firstpX - ccX) * b) - ((firstpY -ccY) * a) + ccX;
    y = ((firstpX -ccX) * a) + ((firstpY-ccY) * b) +ccY;
    goto = x + "," + y;
    pizzaSlice2 = paper.path("M160,100 L" + firstp + " A60,60 0 0,1 " + goto + " z");
    pizzaSlice2.attr("fill", "#FFCC22");
}