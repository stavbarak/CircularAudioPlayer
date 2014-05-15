function buildPlayerUI() {
    //stands for CAP Scope
    var CAPS = {};
    
    CAPS.player1 = new CAP_Player({
        //container can either be a string of the ID of the element, or the DOM element itself
        container: "playerSpot1",
        size: 75,
        playlist: "tomtom"
    });
    
    //example end product code.
    CAPS.player1.addTrack({
        filename: "mp3/Chorus1.mp3",
        artist: "Josh Woodward",
        title: "Let It In"
    });
    CAPS.player1.addTrack({
        filename: "mp3/Chorus2.mp3",
        artist: "Josh Woodward",
        title: "I Want To Destroy Something Beautiful"
    });
    CAPS.player1.addTrack({
        filename: "mp3/Chorus3.mp3",
        artist: "Josh Woodward",
        title: "Nincompoop"
    });
    
    //will create the pizza slices in the correct sizes with random colors
    CAPS.player1.beReady();
    //after that, clicking on the pizza slice of the track will start playing the file
    
}