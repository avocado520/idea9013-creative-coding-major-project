
let startingChime;
let rustleSFX;

function preload(){
    startingChime = loadSound("assets/StartingChime.mp3");
    rustleSFX = loadSound("assets/storegraphic-soft-wind-316392.mp3");
}

function audioSFX(){
    //Stop any current audio
    if (startingChime.isPlaying){
        startingChime.stop();
    }
    if (rustleSFX.isPlaying){
        rustleSFX.stop();
    }

    //Restart audio sfx
    startingChime.play();
    rustleSFX.loop();

}
