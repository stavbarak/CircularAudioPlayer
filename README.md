# CircularAudioPlayer

## A HTML5 audio player widget that displays tracks around a circle.

### Usage:

Link raphael-min.js, player-ui.js and the stylesheet at your html header.

In your html bpdy, prepare a div tag for the player, and one for the playlist (optional).

To show the audio player, execute the following (you can see a full example in js/website.js):
```
  player1 = new CAP_Player({
        //container can either be a string of the ID of the element, or the DOM element itself
        container: "playerSpot1",
        size: 280,
        playlist: "tomtom"
    });
	player1.addTracks([
		{
          filename: "mp3/critical dad.mp3",
          artist: "Critical Dad",
          picture: "pics/house.png",
          title: "Critical Dad"
		}
   ]);
    //your player will not show up until you execure .beready(). afterwhich you can no longer add new tracks.
    player1.beReady();
```    
Notice that these commands can be chained together.

You can see a live demo at http://memescloud.com/mediaplayer
