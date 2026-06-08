# 🌳 Living Seasons Tree



---

# 📖 Inspiration





---

## Visual References




---

# ⚙️ Techniques

## Audio


---

## Time-based

The time-based mechanic controls how the scene changes over time.

Applications include:

* Day-night background colour cycle
* Smooth transitions using `lerpColor()`
* Tree growth controlled by `deltaTime`
* 5-second no-hover auto-blooming
* Connection with user input mechanic: hover interaction resets the auto-bloom timer
* Sun and moon movement based on cycle progress
* Time reset when the scene restarts

---

This mechanic uses `millis()` to track elapsed time. The background, tree growth, passive blooming, and sky objects all follow the same timing system.

The input mechanic detects when the user hovers near the tree. The time mechanic records that interaction time and waits 5 seconds before triggering passive blooming.

This helps the artwork feel like a living cycle rather than a static tree animation.

---

## Perlin noise and randomness

Perlin noise is used to simulate natural movement.

Applications include:

* Wind movement
* Petal drifting
* Leaf swaying

This creates smoother and more organic motion than purely random movement.

---

Random values are used for:

* Branch variation
* Flower placement
* Leaf placement
* Petal rotation
* Growth differences

This ensures every generated tree is unique.

---

## User input

The user input mechanic lets users interact directly with the tree using their mouse.

Applications include:

* Hovering over branches to trigger flowers to bloom near the cursor
* Clicking on a flower to break it apart into falling petals
* Pressing space to regenerate a new randomly shaped tree

This creates a responsive and living artwork where the user actively shapes
the growth and decay of the tree, rather than watching a passive animation.

---

The input mechanic connects with the other mechanics in the project:

* Hover blooming resets the time mechanic's auto-bloom timer
* Fallen petals accumulate on the ground and later react to audio input
* Space key also resets the background day-night cycle

Together these interactions form a continuous cycle of growth, bloom, and decay.

---


# 🎮 Interaction Instructions

## How to Experience the Artwork

1. Open the sketch.
2. Press **SPACE** to begin tree growth.
3. Watch flowers bloom across the tree canopy.
4. Observe petals drifting naturally in the wind.
5. Wait for leaves to gradually change colour.
6. Leaves eventually fall and accumulate on the ground.
7. Listen to the audio and observe visual reactions.

---

# 👥 Mechanic Ownership

| Team Member        | Mechanic                  | Description                                                                                                           |
| -----------        | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Fabiana Fonseca    | Audio                     |                                                                                                                       |
| Jiayi Hou          | Time-Based Events         |                                                                                                                       |
| Chunyu Zhao        | Perlin Noise & Randomness |                                                                                                                       |
| Guanghan Li        | User Input                |                                                                                                                       |

---

# 🤖 AI Acknowledgement


---

# 📚 External References

## The tree 

Source:
https://openprocessing.org

Used as inspiration for generative tree structures and recursive branch generation.

---

## Audio Part

---

## Time-based


---
## Perlin noise and randomness

---

## User input

---

# 📂 Project Structure

```text
project-folder
│
├── index.html
├── sketch.js
│
├── tree/
│   ├── tree.js
│   ├── branch.js
│
├── flowers/
│   ├── flower.js
│   ├── petal.js
│
├── leaves/
│   ├── leaf.js
│
├── audio/
│   ├── soundManager.js
│
├── assets/
│   ├── audio.mp3
│
└── README.md
```

---

# 🎥 Demonstration

## Live Demo

(Add GitHub Pages link here)

## Video Documentation

(Add YouTube or Vimeo link here)

---

