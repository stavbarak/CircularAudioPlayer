function CAP_Player(data){
    //CAP stands for Circular Audio Player
    
    this.circle = {
        X: data.size / 2,
        Y: data.size / 2,
        R: data.size / 2
    };
    
    if (isElement(data.container)){
        this.container = data.container;    
    } else{
        this.container = document.getElementById(data.container);
    }
    
    if (isElement(this.container)) {
        console.log("container is now DOM");
    } else { alert("oh no!"); }
    
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
        console.log(this.files);
        var anglePerTrack = 360 / this.files.length;
        for (var file in this.files) {
            //TODO create audio tag of each file in the container
            var audio = this.container.appendChild(document.createElement("audio"));
            audio.src=(this.files[file]);
            this.tracks.push(new Track({
                audio: audio,
                filename: file,
                paper: this.player.paper,
                circleX: this.circle.X,
                circleY: this.circle.Y,
                circleRaduis: this.circle.R,
                angle: anglePerTrack,
                startingAngle: file * anglePerTrack
            }));
        }
    };

}

function Track(data) {
    this.file = data.filename;
    
    // the DOM element of the audio tag
    this.audio = data.audio;
    
    this.clicking = function() {
      if (data.audio.paused || data.audio.ended) {
          //TODO need to find a way to pause all other tracks in the player when another track is clicked on
          //TODO animate the track when playing
          //NOTE instead of directly playing, this function will send a request to the player to play itself
          data.audio.play(); 
      } else {
          data.audio.pause();
      }
    };
    this.pizza = new PizzaSlice({
        circleX: data.circleX,
        circleY: data.circleY,
        circleRaduis: data.circleRaduis,
        color: getRandomColor(),
        angle: data.angle,
        startingAngle: data.startingAngle,
        //TODO bind onClick funtion to play pause the audio
        onClick: this.clicking
    });
    this.pizza.drawPizza(data.paper);
    
    
}

function PizzaSlice(data) {
    //TODO add data.onClick as a function to be called when the slice is being clicked on.
    this.onClick = data.onClick;
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
        
        //'pickup' the paper from the drawing before removing the drawing
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
        this.drawing.click(this.onClick);
    };

}

/*assitant functions (TODO: consider to move these to a seperate file)*/

function isElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have. (works on IE7)
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}