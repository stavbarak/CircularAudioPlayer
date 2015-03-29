function buildPlayerUI() {
    //stands for CAP Scope
    //var CAPS = {};
    
    //example end product code.
    CAPS.player1 = new CAP_Player({
        //container can either be a string of the ID of the element, or the DOM element itself
        container: "playerSpot1",
        size: 180,
        playlist: "tomtom"
    })
	.addTrack({
        filename: "mp3/01 - Chandelier.mp3",
        artist: "Sia",
        title: "Chandalier"
    })
	.addTrack({
        filename: "mp3/02 - Big Girls Cry.mp3",
        artist: "Sia",
        title: "Big Girls Cry"
    })
	.addTrack({
        filename: "mp3/03 - Burn the Pages.mp3",
        artist: "Sia",
        title: "Burn the pages"
    })
	.addTrack({
        filename: "mp3/04 - Eye of the Needle.mp3",
        artist: "Sia",
        title: "Eye of the Needle"
    })
	.beReady();
    //after that, clicking on the pizza slice of the track will start playing the file
    
}
