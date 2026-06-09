
let startingChime;
let rustleSFX;

let sfxButton;
let isAudioPaused = true;

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
    
    //Reset pause for button functionality
    isAudioPaused = false;
    sfxButton.html('Pause Background Audio');
}

//Button to control background rustle only, chime always plays
function SFXToggle(){
    sfxButton = createButton('Play Background Audio');

    //Top left corner
    sfxButton.position(10, 10);

    sfxButton.mousePressed(toggleAudio);

    //Button Appearance
    sfxButton.style('background-color', '#0000006a');
    sfxButton.style('color', 'white');              
    sfxButton.style('font-size', '12px');           
    sfxButton.style('font-family', 'sans-serif');
    sfxButton.style('border-radius', '10px');
    sfxButton.style('border', '2px solid #ffffff');

}

/* -- AI ASSISTANCE -- 
  Used Copilot within VSC to refine/debug playback button toggle
  - FF
  */

function toggleAudio() {
    //No Audio - Button reads "Play" and on click resumes rustle sfx only
    if (!isAudioPaused && rustleSFX.isPlaying) {
        console.log("Pausing audio!");
        rustleSFX.pause();
        isAudioPaused = true;
        sfxButton.html('Play Background Audio');

    //Yes Audio - Button reads "Pause" and on click stops rustle sfx only
    } else if (isAudioPaused) { 
        console.log("Resuming audio!");
        rustleSFX.loop();
        isAudioPaused = false;
        sfxButton.html('Pause Background Audio');
    }
}
