function buildPlayerUI() {
    //stands for CAP Scope
    var CAPS = {};
    
    CAPS.player1 = new CAP_Player({
        //container can either be a string of the ID of the element, or the DOM element itself
        container: "playerSpot1",
        size: 200,
        playlist: "tomtom"
    });
    
    //example end product code.
    CAPS.player1.addTrack({
        filename: "mp3/JoshWoodward-Ashes-01-LetItIn.mp3",
        artist: "Josh Woodward",
        title: "Let It In"
    });
    CAPS.player1.addTrack({
        filename: "mp3/JoshWoodward-DW-01-IWantToDestroySomethingBeautiful.mp3",
        artist: "Josh Woodward",
        title: "I Want To Destroy Something Beautiful"
    });
    CAPS.player1.addTrack({
        filename: "mp3/JoshWoodward-DW-12-Nincompoop.mp3",
        artist: "Josh Woodward",
        title: "Nincompoop"
    });
    
    //will create the pizza slices in the correct sizes with random colors
    CAPS.player1.beReady();
    //after that, clicking on the pizza slice of the track will start playing the file
}