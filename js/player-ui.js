function CAP_Player(data){
    //CAP stands for Circular Audio Player
    
    //define global constants
    if(!window.CAP_Globals) {
        window.CAP_Globals = {
            refreshRate: 20,
            pausedOpacity: 0.27,
            hoverOpacity: 0.6,
            playOpacity: 1,
            colors: ["#FF0000", "#0000FF", "#00FF00", "#CC0099", "#FFFF00", "#007A29", "#E65C00", "#00B2B2"],
            colorSelection: "linear" //can be "linear", "reverse", "random" - default is linear
        };
    }
    
    this.loaded = 0;

	this.mouseHoveringOnCenter = false;
    
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
    
    //this is the variable that counts how many tracks still need loading
    this.loaded = 0;
    
    this.readyRequested = false;

    this.addTrack = function(data) {
        var audio = this.container.appendChild(document.createElement("audio"));
        audio.src = data.filename;
        audio.artist = data.artist;
        audio.title = data.title;
		audio.picture = data.picture;
        
        //if audio was not already loaded, increment the loaded variable
        if(audio.readyState < 3)
            this.loaded++;
        
        var removeLoad = function() {
            this.loaded--;
            if(this.loaded === 0 && this.readyRequested) {
               this.beReady();
           }
        };
        //bind a function to execute when the metadata is loaded to decrement the loading variable
        audio.addEventListener('loadedmetadata', removeLoad.bind(this), false);
        
        this.files.push(audio);

		return this;
    };

	this.addTracks = function(data) {
		for(track in data) {
			this.addTrack(data[track]);
		}
		return this;
	}

	this.currentPictureInCircle = null;
	this.inCircleAnimation = null;

	this.clearPictureInCircle = function() {
		if(this.inCircleAnimation !== null) {
			console.log("clearing interval " + this.inCircleAnimation);
			window.clearInterval(this.inCircleAnimation);
			this.inCircleAnimation = null;
		}
		this.trackImageHolder.style.backgroundImage = "";
		this.currentPictureInCircle = null;

	}

	this.setPictureInCircle = function(picture) {
		var imageHolder = this.trackImageHolder;
		//var outgoingPicture = this.currentPictureInCircle;
		var incomingPicture = imageHolder.appendChild(document.createElement("div"));
		incomingPicture.style["opacity"] = 0;
		//incomingPicture.style.borderRadius = "50%";
		//incomingPicture.style.width = "100%";
		//incomingPicture.style.height = "100%";
		incomingPicture.style.backgroundImage="url('" + picture + "')";
		this.currentPictureInCircle = incomingPicture;

		var step = CAP_Globals.refreshRate / 500;
		var opacity = 0;
		this.inCircleAnimation = window.setInterval(function() {
				if((opacity + step) >= 1) {
					imageHolder.style.backgroundImage = "url('" + picture + "')";
					imageHolder.removeChild(incomingPicture);
					//incomingPicture.style["opacity"] = 1;
					//if(isElement(outgoingPicture))					
					//	imageHolder.removeChild(outgoingPicture);
					window.clearInterval(goingInAnimation);
				} else {
					opacity += step;
					incomingPicture.style["opacity"] = opacity;
				}
			}, CAP_Globals.refreshRate);
		var goingInAnimation = this.inCircleAnimation;
	}
    
    this.beReady = function() {
        //check first if no tracks are left unloaded, see 'else' below
        if(this.loaded === 0) {
			var totalTime = 0;
			for (var audio in this.files) {
				totalTime += this.files[audio].duration;
			}

            var anglePerTrack = 360 / this.files.length;
            
            this.container.style.width = this.size + "px";
            this.container.style.height = this.size + "px";
            this.container.style.position = "relative";
            
            this.topCircle = this.container.appendChild(document.createElement("div"));
            this.topCircle.setAttribute("id", "top_circle");
            this.topCircle.setAttribute("class", "over_center");
            this.topCircle.style.lineHeight = this.size * (2/3) + "px";
			this.topCircle.addEventListener("mouseover", function() {
				this.mouseHoveringOnCenter = true;
				this.timer.innerHTML="◼";
			}.bind(this));
			this.topCircle.addEventListener("mouseout", function() {
				this.mouseHoveringOnCenter = false;
				this.timer.innerHTML="";
			}.bind(this));

			this.trackImageHolder = this.topCircle.appendChild(document.createElement("div"));
			this.trackImageHolder.setAttribute("id", "track_image_holder");

			this.timeHolder = this.topCircle.appendChild(document.createElement("div"));
			this.timeHolder.setAttribute("id", "time_holder");
            this.timer = this.timeHolder.appendChild(document.createElement("span"));
            this.timer.setAttribute("id", "timer");
            this.timer.style.fontSize = this.size /6 + "px";
			this.timer.addEventListener("click", function () {
				this.stopAllTracks();
			}.bind(this));
            
            this.timer.innerHTML = "";
            
            var colors = CAP_Globals.colors;
            var color;
            
			var angleSoFar = 0;
            for (var audio in this.files) {
                var song = this.playlist.appendChild(document.createElement("li"));
                song.className = "song";
                var artist = song.appendChild(document.createElement("span"));
                artist.className = "artist";
                artist.innerHTML = this.files[audio].artist;
                song.innerHTML += " - " + this.files[audio].title + " " + readableDuration(this.files[audio].duration);
                switch(CAP_Globals.colorSelection) {
                    case "random":
                        color = Math.floor(Math.random() * colors.length);
                        break;
                    case "reverse":
                        color = colors.length -1;
                        break;
                    case "linear":
                    default:
                        color = 0;
                        break;
                }
                this.tracks.push(new Track({
                    song: song,
                    parentPlayer: this,
                    color: colors[color],
                    audio: this.files[audio],
                    paper: this.player.paper,
					picture: this.files[audio].picture,
                    circleX: this.circle.X,
                    circleY: this.circle.Y,
                    circleRaduis: this.circle.R,
                    angle: 360 * (this.files[audio].duration/totalTime),
                    startingAngle: angleSoFar
                }));
				angleSoFar += 360 * (this.files[audio].duration/totalTime);
                colors.splice(color, 1);
            }
        //if there are still tracks left to be loaded, put a flag up. the flag will be tested every time a new track finishes its loading
        } else {
            this.readyRequested = true;
        }
		return this;
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
	this.picture = data.picture;
	this.inserted = false;
    
    this.mouseIsOver = false;
    
    // the DOM element of the audio tag
    this.audio = data.audio;
    this.glow = null;
    
    this.isPlaying = function() {
        return !this.audio.paused;
    };

	this.isStopped = function() {
        return !this.isPlaying() && this.audio.currentTime === 0;
	};
    
    this.clicking = function() {
        if (this.audio.paused || this.audio.ended) {
            this.parentPlayer.pauseAllTracks();
            this.play(); 
        } else {
            this.pause();
        }
    };

	this.insertTrackAnimation = function() {
		if(this.inserted)
			return;
		this.inserted = true;
		var radiusMultiplier = 1.0;
		var myPizza = this.pizza;
		var myParent = this.parentPlayer;
		var animationId = setInterval(function() {
			//(TotalDistance * RefreshRate) / TotalTime
			var step = (0.1 * CAP_Globals.refreshRate) / 200;
			if((radiusMultiplier - step) <= 0.9) {
				radiusMultiplier = 0.9;
				myPizza.updatePizza({radius: myParent.circle.R * radiusMultiplier});
				clearInterval(animationId);
			}
			radiusMultiplier -= step;
			myPizza.updatePizza({radius: myParent.circle.R * radiusMultiplier});
		}, CAP_Globals.refreshRate);
	};

	this.ejectTrackAnimation = function() {
		if(!this.inserted)
			return;
		this.inserted = false;
		var radiusMultiplier = 0.9;
		var myPizza = this.pizza;
		var myParent = this.parentPlayer;
		var animationId = setInterval(function() {
			//(TotalDistance * RefreshRate) / TotalTime
			var step = (0.1 * CAP_Globals.refreshRate) / 200;
			if((radiusMultiplier + step) >= 1.0) {
				radiusMultiplier = 1.0;
				myPizza.updatePizza({radius: myParent.circle.R * radiusMultiplier});
				clearInterval(animationId);
			}
			radiusMultiplier += step;
			myPizza.updatePizza({radius: myParent.circle.R * radiusMultiplier});
		}, CAP_Globals.refreshRate);
	};
    
    this.play = function() {
		this.parentPlayer.setPictureInCircle(this.picture);
        this.audio.play();
        this.pizza.drawing.toFront();
        this.pizza.drawing.animate({"opacity" : CAP_Globals.playOpacity}, 200, "linear");
        
        this.song.className += " currently_playing";
        
        var myParent = this.parentPlayer;
        var myPizza = this.pizza;
        var myAudio = this.audio;
        var myStartingAngle = this.startingAngle;
        var myTrack = this;
		this.insertTrackAnimation();
        this.animation = setInterval(function() {
            if (myAudio.currentTime == myAudio.duration) {
                myTrack.stop();
            }
			if (!myParent.mouseHoveringOnCenter)
            	myParent.timer.innerHTML = readableDuration(myAudio.currentTime);
            myPizza.updatePizza({
                startingAngle: myStartingAngle + ((myAudio.currentTime / myAudio.duration) * 360)
            });
        }, CAP_Globals.refreshRate);
    };
    
    this.stop = function() {
		if(this.isStopped())
			return;
		this.ejectTrackAnimation();
		this.parentPlayer.clearPictureInCircle();
        this.pizza.drawing.attr("opacity", CAP_Globals.pausedOpacity);
        this.song.className = this.song.className.replace( /(?:^|\s)currently_playing(?!\S)/g , '' );
        clearInterval(this.animation);
        this.audio.pause();
        this.audio.currentTime = 0;
        this.pizza.updatePizza({
            startingAngle: this.startingAngle
        });
        this.parentPlayer.timer.innerHTML = "";
    };
    
    this.pause = function() {
        if (this.isPlaying()) {
			this.ejectTrackAnimation();
            if(this.mouseIsOver) {
                this.pizza.drawing.animate({"opacity" : CAP_Globals.hoverOpacity}, 200, "linear");
            } else {
                this.pizza.drawing.animate({"opacity" : CAP_Globals.pausedOpacity}, 200, "linear");
            }
            this.song.className = this.song.className.replace( /(?:^|\s)currently_playing(?!\S)/g , '' );
            clearInterval(this.animation);
            this.audio.pause();
			if(this.isStopped()) {
				this.parentPlayer.timer.innerHTML = "";
			}
        }
    };
    
    this.hovering = function() {
        this.mouseIsOver = true;
        //this.pizza.drawing.attr("stroke", this.pizza.color);
        //this.pizza.drawing.attr("stroke-width", 2); resize bumps the shape
        if(!this.isPlaying()) {
            this.pizza.drawing.animate({"opacity" : CAP_Globals.hoverOpacity}, 200, "linear");
        }
    };
    
    this.unhover = function() {
        this.mouseIsOver = false;
        this.pizza.drawing.attr("stroke", "none");
        if(!this.isPlaying()) {
            this.pizza.drawing.animate({"opacity" : CAP_Globals.pausedOpacity}, 200, "linear");
        }
    };
    
    this.pizza = new PizzaSlice({
        circleX: data.circleX,
        circleY: data.circleY,
        circleRaduis: data.circleRaduis,
        color: data.color,
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
        if(data.angle !== undefined) {
            this.angle = data.angle;
        }
		if(data.radius !== undefined) {
			this.circle.R = data.radius;
			this.referencePoint = {
				X: this.circle.X - this.circle.R,
				Y: this.circle.Y
			};
		}
		if(data.startingAngle !== undefined) {
	        this.startingAngle = data.startingAngle;
		}
        
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
