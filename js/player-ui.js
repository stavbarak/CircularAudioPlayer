function CAP_Player(data){
    //CAP stands for Circular Audio Player
    
    this.circle = {
        X: data.size / 2,
        Y: data.size / 2,
        R: data.size / 2
    };
    
    this.container = data.container;
    
    //TODO should be collected from the constructer data. Paper should be created outside and passed in data.paper
    this.paper = Raphael(this.container, data.size, data.size);
    
    this.player = this.paper.circle(this.circle.X , this.circle.Y, this.circle.R);
    
    this.tracks = [];
    this.files = [];
    
    this.makePizza = function(data) {
        data.circleX = this.circle.X;
        data.circleY = this.circle.Y;
        data.circleRaduis = this.circle.R;
        var aPizza = new PizzaSlice(data);
        aPizza.drawPizza(this.player.paper);
        return aPizza;
    };
    
    this.addTrack = function(filename) {
        this.files.push(filename);
    };
    
    this.beReady = function() {
        var anglePerTrack = 360 / this.files.length;
        var j = 0;
        for (var file in this.files) {
            //create audio tag of each file
            this.tracks.push(new Track({
                //instead of filename, link the DOM element of the audio tag
                filename: file,
                paper: this.player.paper,
                circleX: this.circle.X,
                circleY: this.circle.Y,
                circleRaduis: this.circle.R,
                angle: anglePerTrack,
                startingAngle: j * anglePerTrack
            }));
            j++;
        }
    };

}

function Track(data) {
    this.file = data.filename;
    this.pizza = new PizzaSlice({
        circleX: data.circleX,
        circleY: data.circleY,
        circleRaduis: data.circleRaduis,
        color: getRandomColor(),
        angle: data.angle,
        startingAngle: data.startingAngle
    });
    this.pizza.drawPizza(data.paper);
    
}

function PizzaSlice(data) {
    this.angle = data.angle;
    this.startingAngle = data.startingAngle;
    this.color = data.color;
    
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
    
    this.circle = {
        X: data.circleX,
        Y: data.circleY,
        R: data.circleRaduis };
    
    //this is a constan, not a default value    
    this.referencePoint = {
        X: this.circle.X - this.circle.R,
        Y: this.circle.Y
    };
        
    this.point = {
        X: ((this.referencePoint.X - this.circle.X) * this.f) - ((this.referencePoint.Y - this.circle.Y) * this.e) + this.circle.X,
        Y: ((this.referencePoint.X - this.circle.X) * this.e) + ((this.referencePoint.Y - this.circle.Y) * this.f) + this.circle.Y
    };
    
    this.updatePizza = function(data) {
        //TODO remove "this" where it is not needed, change to function scope
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
        var paper = this.drawing.paper;
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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}