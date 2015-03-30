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
	.addTrack({
        filename: "mp3/01 - Chandelier.mp3",
        artist: "Sia",
		picture: "pics/house.png",
        title: "Chandalier"
    })
	.addTrack({
        filename: "mp3/02 - Big Girls Cry.mp3",
        artist: "Sia",
		picture: "pics/alba.png",
        title: "Big Girls Cry"
    })
	.addTrack({
        filename: "mp3/03 - Burn the Pages.mp3",
        artist: "Sia",
		picture: "pics/kitty.png",
        title: "Burn the pages"
    })
	.addTrack({
        filename: "mp3/04 - Eye of the Needle.mp3",
        artist: "Sia",
		picture: "pics/paint.png",
        title: "Eye of the Needle"
    })
	.addTrack({
        filename: "mp3/05 - Hostage.mp3",
        artist: "Sia",
		picture: "pics/laser.png",
        title: "Hostage"
    })
	.addTrack({
        filename: "mp3/06 - Straight for the Knife.mp3",
        artist: "Sia",
		picture: "pics/smile.png",
        title: "Straight for the Knife"
    })
	.addTrack({
        filename: "mp3/07 - Fair Game.mp3",
        artist: "Sia",
		picture: "pics/sand.png",
        title: "Fair Game"
    })
	.addTrack({
        filename: "mp3/08 - Elastic Heart.mp3",
        artist: "Sia",
		picture: "pics/beyleys.png",
        title: "Elastic Heart"
    })
	.beReady();
    //after that, clicking on the pizza slice of the track will start playing the file
    
}
