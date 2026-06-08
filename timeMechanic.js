// timeMechanic.js
// Manages the time-driven behaviour of the scene, including the day-night cycle,
// sky object timing, tree growth speed, and inactivity-based auto blooming.

class TimeMechanic {
  constructor() {
    // Store the start time once so all time-based effects share the same timeline.
    this.startTime = millis();

    // A shorter loop is used so the full day-night cycle can be seen during interaction.
    this.dayNightDuration = 30000;

    // Track the last hover time to decide when the tree should bloom without user input.
    this.lastHoverTime = millis();
    this.autoBloomDelay = 5000;

    // These colours define the mood of each stage in the simulated day.
    this.morningColor = color(150, 205, 255);
    this.dayColor = color(185, 225, 255);
    this.sunsetColor = color(255, 155, 105);

    // The night colours are brightened so the tree and flowers remain readable.
    this.duskColor = color(130, 95, 165);
    this.nightColor = color(60, 70, 115);
  }

  getBackgroundColor() {
    let progress = this.getCycleProgress();

    // Split the loop into visual stages so the sky changes gradually
    // instead of jumping between fixed colours.
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

    // Modulo keeps the cycle repeating instead of stopping after one full loop.
    return cycleTime / this.dayNightDuration;
  }

  isSunVisible() {
    let progress = this.getCycleProgress();

    // The sun belongs to the first half of the cycle: morning to late afternoon.
    return progress < 0.52;
  }

  isMoonVisible() {
    let progress = this.getCycleProgress();

    // The moon belongs to the second half of the cycle: evening to night.
    return progress > 0.48;
  }

  getSunProgress() {
    let progress = this.getCycleProgress();

    // Convert the sun's visible time range into a reusable 0–1 movement value.
    return constrain(map(progress, 0, 0.52, 0, 1), 0, 1);
  }

  getMoonProgress() {
    let progress = this.getCycleProgress();

    // Convert the moon's visible time range into a reusable 0–1 movement value.
    return constrain(map(progress, 0.48, 1, 0, 1), 0, 1);
  }

  getTreeGrowthStep() {
    // Using deltaTime makes growth depend on elapsed time rather than frame count.
    return constrain(deltaTime * 0.001, 0, 0.02);
  }

  recordUserHover() {
    // Input calls this when the user hovers near the tree, delaying passive blooming.
    this.lastHoverTime = millis();
  }

  shouldAutoBloom() {
    // Auto-bloom only happens after a period of no hover interaction.
    return millis() - this.lastHoverTime > this.autoBloomDelay;
  }

  reset() {
    // Restart both the sky cycle and inactivity timer when the scene is regenerated.
    this.startTime = millis();
    this.lastHoverTime = millis();
  }
}