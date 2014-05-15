function CAP_Player(data){
    //CAP stands for Circular Audio Player
    
    //define global constants
    if(!window.CAP_Globals) {
        window.CAP_Globals = {
            refreshRate: 20,
            pausedOpacity: 0.27,
            hoverOpacity: 0.6,
            playOpacity: 1,
            speed: 2 // or is var somewhere else ?
        };
    }
    
    this.loaded = 0;
    
    this.circle = {
        X: data.size / 2,
        Y: data.size / 2,
        R: data.size / 2
    };
    
    this.size = data.size;
    
    if (isElement(data.playlist)) {
        this.playlist = data.playlist.appendChild(document.createElement("ul"));
    } else {
        this.playlist = document.getElementById("tomtom").appendChild(document.createElement("ul"));
    }
    this.playlist.className = "playlist";
    
    if (isElement(data.container)) {
        this.container = data.container;    
    } else {
        this.container = document.getElementById(data.container);
    }
    
    this.paper = Raphael(this.container, data.size, data.size);
    
    this.player = this.paper.circle(this.circle.X , this.circle.Y, this.circle.R).attr("stroke", "none");

    //track objects
    this.tracks = [];
    //audio DOM elements
    this.files = [];
    //playlist DOM elements
    this.songs = [];
    
    this.loaded = 0;
    
    this.readyRequested = false;
    
    this.addTrack = function(data) {
        var audio = this.container.appendChild(document.createElement("audio"));
        audio.src = data.filename;
        audio.artist = data.artist;
        audio.title = data.title;
        
        if(audio.readyState < 3)
            this.loaded++;
        
        var removeLoad = function() {
            this.loaded--;
            if(this.loaded === 0 && this.readyRequested) {
               this.beReady();
           }
        };
        audio.addEventListener('canplay', removeLoad.bind(this), false);
        
        this.files.push(audio);
    };
    
    this.beReady = function() {
        if(this.loaded === 0) {
            var anglePerTrack = 360 / this.files.length;
            
            this.container.style.width = this.size + "px";
            this.container.style.height = this.size + "px";
            this.container.style.position = "relative";
            
            this.topCircle = this.container.appendChild(document.createElement("div"));
            this.topCircle.setAttribute("id", "top_circle");
            this.topCircle.setAttribute("class", "over_center");
            this.topCircle.style.lineHeight = this.size * (2/3) + "px";
    
            this.timer = this.topCircle.appendChild(document.createElement("span"));
            this.timer.setAttribute("id", "timer");
            this.timer.style.fontSize = this.size /6 + "px";
            
            this.timer.innerHTML = "00:00";
            
            for (var audio in this.files) {
                var song = this.playlist.appendChild(document.createElement("li"));
                song.className = "song";
                var artist = song.appendChild(document.createElement("span"));
                artist.className = "artist";
                artist.innerHTML = this.files[audio].artist;
                song.innerHTML += " - " + this.files[audio].title + " " + readableDuration(this.files[audio].duration);
                this.tracks.push(new Track({
                    song: song,
                    parentPlayer: this,
                    audio: this.files[audio],
                    paper: this.player.paper,
                    circleX: this.circle.X,
                    circleY: this.circle.Y,
                    circleRaduis: this.circle.R,
                    angle: anglePerTrack,
                    startingAngle: audio * anglePerTrack
                }));
            }
        } else {
            this.readyRequested = true;
        }
    };
    
    this.pauseAllTracks = function () {
        for(var track in this.tracks) {
            this.tracks[track].pause();
        }
    };
    
    this.stopAllTracks = function () {
        for (var track in this.tracks) {
            this.tracks[track].stop();
        }
    };
}

function Track(data) {
    
    this.parentPlayer = data.parentPlayer;
    this.startingAngle = data.startingAngle;
    this.song = data.song;
    
    this.mouseIsOver = false;
    
    // the DOM element of the audio tag
    this.audio = data.audio;
    this.glow = null;
    
    this.playing = function() {
        return !this.audio.paused;
    };
    
    this.clicking = function() {
        if (this.audio.paused || this.audio.ended) {
            this.parentPlayer.pauseAllTracks();
            this.play(); 
        } else {
            this.pause();
        }
    };
    
    this.play = function() {
        this.audio.play();
        this.pizza.drawing.toFront();
        this.pizza.drawing.animate({"opacity" : CAP_Globals.playOpacity}, 200, "linear");
        
        this.song.className += " currently_playing";
        
        var myParent = this.parentPlayer;
        var myPizza = this.pizza;
        var myAudio = this.audio;
        var myStartingAngle = this.startingAngle;
        var myTrack = this;
        this.animation = setInterval(function() {
            if (myAudio.currentTime == myAudio.duration) {
                myTrack.stop();
            }
            myParent.timer.innerHTML = readableDuration(myAudio.currentTime);
            myPizza.updatePizza({
                startingAngle: myStartingAngle + ((myAudio.currentTime / myAudio.duration) * 360),
            });
        }, CAP_Globals.refreshRate);
    };
    
    this.stop = function() {
        this.pizza.drawing.attr("opacity", CAP_Globals.pausedOpacity);
        this.song.className = this.song.className.replace( /(?:^|\s)currently_playing(?!\S)/g , '' );
        clearInterval(this.animation);
        this.audio.pause();
        this.audio.currentTime = 0;
        this.pizza.updatePizza({
            startingAngle: this.startingAngle
        });
        this.parentPlayer.timer.innerHTML = "00:00";
    };
    
    this.pause = function() {
        if (this.playing()) {
            if(this.mouseIsOver) {
                this.pizza.drawing.animate({"opacity" : CAP_Globals.hoverOpacity}, 200, "linear");
            } else {
                this.pizza.drawing.animate({"opacity" : CAP_Globals.pausedOpacity}, 200, "linear");
            }
            this.song.className = this.song.className.replace( /(?:^|\s)currently_playing(?!\S)/g , '' );
            clearInterval(this.animation);
            this.audio.pause();
        }
    };
    
    this.hovering = function() {
        this.mouseIsOver = true;
        //this.pizza.drawing.attr("stroke", this.pizza.color);
        //this.pizza.drawing.attr("stroke-width", 2); resize bumps the shape
        if(!this.playing()) {
            this.pizza.drawing.animate({"opacity" : CAP_Globals.hoverOpacity}, 200, "linear");
        }
    };
    
    this.unhover = function() {
        this.mouseIsOver = false;
        this.pizza.drawing.attr("stroke", "none");
        if(!this.playing()) {
            this.pizza.drawing.animate({"opacity" : CAP_Globals.pausedOpacity}, 200, "linear");
        }
    };
    
    this.pizza = new PizzaSlice({
        circleX: data.circleX,
        circleY: data.circleY,
        circleRaduis: data.circleRaduis,
        color: getRandomColor(),
        angle: data.angle,
        startingAngle: data.startingAngle,
        onClick: this.clicking.bind(this),
        onDblClick: this.stop.bind(this),
        hoveron: this.hovering.bind(this),
        hoveroff: this.unhover.bind(this)
    });
    
    this.song.onclick = this.clicking.bind(this);
    
    this.pizza.drawPizza(data.paper);
    
    this.song.onmouseover = this.hovering.bind(this);
    this.song.onmouseout = this.unhover.bind(this);

}

function PizzaSlice(data) {
    this.onClick = data.onClick;
    this.onDblClick = data.onDblClick;
    this.angle = data.angle;
    this.startingAngle = data.startingAngle;
    this.color = data.color;
    this.hoveron = data.hoveron;
    this.hoveroff = data.hoveroff;
    
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
            this.drawing.attr("opacity", 0.2);
            this.drawing.attr("stroke", "none");
            this.drawing.attr("cursor", "pointer");
            this.drawing.click(this.onClick);
            this.drawing.dblclick(this.onDblClick);
            this.drawing.hover(this.hoveron, this.hoveroff);
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
    var letters = '0123456789ACACFCAF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}