// timeMechanic.js
// Controls time-based changes using the sketch's internal running time.
// Controls time-based behaviours such as background colour, tree growth, and automatic blooming after user inactivity.

class TimeMechanic {
  constructor() {
    // Use millis() as the timing source so the cycle is based on real elapsed time.
    this.startTime = millis();

    // Length of one full day-night loop.
    this.dayNightDuration = 30000;

    // Used to detect when the user has stopped interacting with the tree.
    this.lastHoverTime = millis();

    // After 5 seconds of inactivity, the tree can bloom automatically.
    this.autoBloomDelay = 5000;

    // Colours for each stage of the simulated day.
    this.morningColor = color(150, 205, 255);
    this.dayColor = color(185, 225, 255);
    this.sunsetColor = color(255, 155, 105);

    // Night colours are kept visible so the tree and flowers do not disappear.
    this.duskColor = color(130, 95, 165);
    this.nightColor = color(60, 70, 115);
  }

  getBackgroundColor() {
    let elapsedTime = millis() - this.startTime;

    // Loop the cycle continuously instead of stopping after one day-night pass.
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

  getCycleProgress() {
  let elapsedTime = millis() - this.startTime;
  let cycleTime = elapsedTime % this.dayNightDuration;

  // Return a 0–1 value for the current position in the day-night cycle.
  return cycleTime / this.dayNightDuration;
}

  isSunVisible() {
  let progress = this.getCycleProgress();

  // Sun appears during the morning/day part of the cycle.
  return progress < 0.52;
}

isMoonVisible() {
  let progress = this.getCycleProgress();

  // Moon appears during the evening/night part of the cycle.
  return progress > 0.48;
}

getSunProgress() {
  let progress = this.getCycleProgress();

  // Convert the sun's visible period into a 0–1 rising path value.
  return constrain(map(progress, 0, 0.52, 0, 1), 0, 1);
}

getMoonProgress() {
  let progress = this.getCycleProgress();

  // Convert the moon's visible period into a 0–1 rising path value.
  return constrain(map(progress, 0.48, 1, 0, 1), 0, 1);
}

  getTreeGrowthStep() {
    // deltaTime keeps growth speed more stable across different frame rates.
    return constrain(deltaTime * 0.001, 0, 0.02);
  }

  recordUserHover() {
    // Reset inactivity timing when the input system detects user interaction.
    this.lastHoverTime = millis();
  }

  shouldAutoBloom() {
    // True means the user has been inactive long enough to trigger passive blooming.
    return millis() - this.lastHoverTime > this.autoBloomDelay;
  }

  reset() {
    // Restart the timing system when a new tree is generated.
    this.startTime = millis();
    this.lastHoverTime = millis();
  }
}