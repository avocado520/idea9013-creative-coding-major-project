// timeMechanic.js
// Controls time-based background changes using the sketch's internal running time.

class TimeMechanic {
  constructor() {
    // Store the start time so the colour transition can be based on elapsed time.
    this.startTime = millis()
    this.dayNightDuration = 30000;

    // Key colours for the simulated day cycle.
    this.morningColor = color(150, 205, 255); 
    this.dayColor = color(185, 225, 255);     
    this.sunsetColor = color(255, 155, 105);  
    this.duskColor = color(115, 80, 155);     
    this.nightColor = color(20, 24, 45);  
  }

getBackgroundColor() {
  let elapsedTime = millis() - this.startTime;

  // Use modulo so the cycle repeats instead of stopping at night.
  let cycleTime = elapsedTime % this.dayNightDuration;
  let progress = cycleTime / this.dayNightDuration;

  if (progress < 0.20) {
    let stageProgress = map(progress, 0, 0.20, 0, 1);
    return lerpColor(this.morningColor, this.dayColor, stageProgress);
  } else if (progress < 0.38) {
    let stageProgress = map(progress, 0.20, 0.38, 0, 1);
    return lerpColor(this.dayColor, this.sunsetColor, stageProgress);
  } else if (progress < 0.62) {
    let stageProgress = map(progress, 0.38, 0.62, 0, 1);
    return lerpColor(this.sunsetColor, this.duskColor, stageProgress);
  } else if (progress < 0.82) {
    let stageProgress = map(progress, 0.62, 0.82, 0, 1);
    return lerpColor(this.duskColor, this.nightColor, stageProgress);
  } else {
    let stageProgress = map(progress, 0.82, 1, 0, 1);
    return lerpColor(this.nightColor, this.morningColor, stageProgress);
  }
}
  reset() {
    // Restart the cycle when the scene is regenerated.
    this.startTime = millis();
  }
}