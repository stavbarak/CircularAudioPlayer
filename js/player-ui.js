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
    
    this.paper = Raphael(this.container, data.size, data.size);
    
    this.player = this.paper.circle(this.circle.X , this.circle.Y, this.circle.R).attr("stroke", "none");

    this.tracks = [];
    this.files = [];
    
    this.addTrack = function(filename) {
        this.files.push(filename);
    };
    
    this.beReady = function() {
        console.log(this.files);
        var anglePerTrack = 360 / this.files.length;
        this.topCircle = this.container.appendChild(document.createElement("div"));
        this.topCircle.setAttribute("id", "tembel");
        this.topCircle.setAttribute("class", "over_center");
        this.timer = this.topCircle.appendChild(document.createElement("span"));
        this.timer.setAttribute("id", "timer");
        for (var file in this.files) {
            var audio = this.container.appendChild(document.createElement("audio"));
            audio.src=(this.files[file]);
            this.tracks.push(new Track({
                parentPlayer: this,
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
    
    this.pauseAllTracks = function () {
        for(var track in this.tracks) {
            this.tracks[track].pause();
        }
    };

}

function Track(data) {
    this.file = data.filename;
    this.parentPlayer = data.parentPlayer;
    this.startingAngle = data.startingAngle;
    
    // the DOM element of the audio tag
    this.audio = data.audio;
    
    this.clicking = function() {
        if (this.audio.paused || this.audio.ended) {
            this.parentPlayer.pauseAllTracks();
            this.play(); 
        } else {
            this.pause();
        }
    };
    
    this.pizza = new PizzaSlice({
        circleX: data.circleX,
        circleY: data.circleY,
        circleRaduis: data.circleRaduis,
        color: getRandomColor(),
        angle: data.angle,
        startingAngle: data.startingAngle,
        onClick: this.clicking.bind(this)
    });
    
    this.pizza.drawPizza(data.paper);
    
    this.play = function() {
        this.audio.play();
        this.pizza.drawAgain();
        var myParent = this.parentPlayer;
        var myPizza = this.pizza;
        var myAudio = this.audio;
        var myStartingAngle = this.startingAngle;
        this.animation = setInterval(function() {
            myParent.timer.innerHTML = readableDuration(myAudio.currentTime);
            myPizza.updatePizza({
            startingAngle: myStartingAngle + ((myAudio.currentTime / myAudio.duration) * 360),
        });
        }, 20);
    };
    
    this.pause = function() {
        clearInterval(this.animation);
        this.audio.pause();
    };

}

function PizzaSlice(data) {
    this.onClick = data.onClick;
    this.angle = data.angle;
    this.startingAngle = data.startingAngle;
    this.color = data.color;
    
    //a and b are computed from data.angle once PizzaSlice is instansiated
    this.a = Math.sin((Math.PI / 180) * this.angle);
    this.b = Math.cos((Math.PI / 180) * this.angle);
    
    //e and f are calculated once from startingAngle
    this.e = Math.sin((Math.PI / 180) * this.startingAngle);
    this.f = Math.cos((Math.PI / 180) * this.startingAngle);
    
    this.circle = {
        X: data.circleX,
        Y: data.circleY,
        R: data.circleRaduis };
    
    //this is a constant, not a default value    
    this.referencePoint = {
        X: this.circle.X - this.circle.R,
        Y: this.circle.Y
    };
        
    this.point = {
        X: ((this.referencePoint.X - this.circle.X) * this.f) - ((this.referencePoint.Y - this.circle.Y) * this.e) + this.circle.X,
        Y: ((this.referencePoint.X - this.circle.X) * this.e) + ((this.referencePoint.Y - this.circle.Y) * this.f) + this.circle.Y
    };
    
    this.updatePizza = function(data) {
        if(data.angle) {
            this.angle = data.angle;
        }
        this.startingAngle = data.startingAngle;
        
        this.a = Math.sin((Math.PI / 180) * this.angle);
        this.b = Math.cos((Math.PI / 180) * this.angle);
        
        this.e = Math.sin((Math.PI / 180) * this.startingAngle);
        this.f = Math.cos((Math.PI / 180) * this.startingAngle);
        
        this.point = {
            X: ((this.referencePoint.X - this.circle.X) * this.f) - ((this.referencePoint.Y - this.circle.Y) * this.e) + this.circle.X,
            Y: ((this.referencePoint.X - this.circle.X) * this.e) + ((this.referencePoint.Y - this.circle.Y) * this.f) + this.circle.Y
        };
        
        this.drawPizza(this.drawing.paper);
    };
    
    this.drawAgain = function() {
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
        
        if(!!this.drawing && this.drawing.paper) {
            this.drawing.attr("path", pathString);
        } else {
            this.drawing = paper.path(pathString);
            this.drawing.attr("fill", this.color);
            this.drawing.attr("stroke", "none");
            this.drawing.attr("cursor", "pointer");
            this.drawing.click(this.onClick);
        }
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

function readableDuration(seconds) {
    var sec = Math.floor( seconds );    
    var min = Math.floor( sec / 60 );
    min = min >= 10 ? min : '0' + min;    
    sec = Math.floor( sec % 60 );
    sec = sec >= 10 ? sec : '0' + sec;    
    return min + ':' + sec;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}