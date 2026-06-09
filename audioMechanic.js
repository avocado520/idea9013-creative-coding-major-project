
let numBins = 64;
let smoothing = 0.9;

/* -- AI ASSISTANCE -- 
Used Copilot within VSC to help smoothly connect rectangle height movement
to the corresponding class instances of fallingPetals and fallingLeaves
- FF
*/

// Petal FFT Height Array
let audioRects = [];

// Leaf FFT Height Array
let audioOutlineRects = []; 

function micAudio(){

    let spectrum = fft.analyze();
    let size = width / spectrum.length ;

    // clear and repopulate audio rectangle arrays for this frame
    audioRects.length = 0;
    audioOutlineRects.length = 0;

    noFill();
    noStroke();

    //rectangle code sourced from tutorials Wk 12
    
    // --- PETAL FFT HEIGHT ---

    // right half
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, width/2, width);
        let y = map(spectrum[i], 0, 255, height-15, height/2);
        rect(x, y, size, height - y);
        audioRects.push({x: x, cx: x + size * 0.5, y: y});
    }

    // left half
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, width/2, 0);
        let y = map(spectrum[i], 0, 255, height-15, height/2);
        rect(x, y, size, height - y);
        audioRects.push({x: x, cx: x + size * 0.5, y: y});
    }

    // --- LEAF FFT HEIGHT ---

    // right half
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, width, width/2);
        let y = map(spectrum[i], 0, 255, height-20, 5*height/8);
        rect(x, y, size, height - y);
        audioOutlineRects.push({x: x, cx: x + size * 0.5, y: y});
    }

    // left half
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width/2);
        let y = map(spectrum[i], 0, 255, height-20, 5*height/8);
        rect(x, y, size, height - y);
        audioOutlineRects.push({x: x, cx: x + size * 0.5, y: y});
    }
}