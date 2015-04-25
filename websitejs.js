function buildPlayerUI() {
    //stands for CAP Scope
    //var CAPS = {};
    
    //example end product code.
    CAPS.player1 = new CAP_Player({
        //container can either be a string of the ID of the element, or the DOM element itself
        container: "playerSpot1",
        size: 280,
        playlist: "tomtom"
    })
	.addTracks([
		{
			filename: "mp3/critical dad.mp3",
    	    artist: "Critical Dad",
			picture: "pics/house.png",
	        title: "Critical Dad"
		},
		{
			filename: "mp3/mannet.mp3",
   		    artist: "Mannet",
			picture: "pics/alba.png",
        	title: "Mannet"
		},
		{
			filename: "mp3/nologic.mp3",
    	    artist: "No Logic",
			picture: "pics/kitty.png",
	        title: "No Logic"
		}
    ]).beReady();

    //after that, clicking on the pizza slice of the track will start playing the file
    
}
