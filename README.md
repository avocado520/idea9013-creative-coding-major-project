# Interactive Blooming Tree Installation

## Part 1: Project Direction
For our final project, we plan to create an original piece that explores growth and decay through a responsive digital tree. Inspired by the generative tree structure of the [OpenProcessing Tree Project](https://openprocessing.org/@u382178/1942905) and the falling flower visuals of [Pinterest Falling Flowers Reference](https://uk.pinterest.com/pin/337347828359231168/), we aim to create a visually contrasting and colorful environment where a tree slowly grows across the screen, emulating the style as seen below:
![Visual Style Inspiration](assets/StyleInspo.png)

After the tree fully forms, scattered flowers will begin to bloom and fall gently, encouraging user interaction. When users hover their mouse over branches, additional flowers in that will area blossom. Once fully bloomed, mouse clicks will trigger the flowers to gradually wither and shed their petals. Once landing on the ground, the movement of these petals will then become reactive to the relative audio levels inputted, bouncing rhymically and reminiscent of sound waves.

Through these layered interactions, the project visualizes the fragile cycle between life, beauty, and impermanence.
### Inspiration 1: OpenProcessing Generative Tree Reference
![Tree Inspiration](assets/tree-reference.png)
### Inspiration 2: Falling Flower Motion Reference
![Flower Inspiration](assets/falling-flower-reference.jpg)

## Part 2: Mechanics

### Team Members and Roles

| Team Member | Mechanic |
|---|---|
| Guanghan Li | User Input |
| Jiayi Hou | Time-based |
| Fabiana Fonseca | Audio |
| Chunyu Zhao | Perlin Noise and Randomness |

### User Input Mechanic

The user input mechanic allows users to directly interact with the tree using their mouse. When the user moves their cursor over the tree branches, flowers will grow at the hover position. This creates the feeling that the user is helping the tree bloom through interaction. Users can also click on any flower to make it break apart into falling petals. These petals will fall naturally to the ground and remain on the canvas instead of disappearing immediately.

This mechanic is designed to make the artwork feel alive and responsive. Instead of watching a passive animation, users can influence the growth and transformation of the tree through simple actions. The interaction also connects with the other mechanics in the project. Over time, more petals collect on the ground, and later the audio mechanic can cause these petals to react and move again. Together, these interactions help create a continuous cycle of growth, decay, and movement within the artwork.

### Time-based Mechanic

The time-based mechanic controls the pacing and progression of the interactive tree experience through timers and event-driven animation. At the beginning of the project, the tree gradually grows onto the screen rather than appearing instantly, creating the feeling of a living digital organism emerging in real time. Once the tree is fully formed, a new flower automatically appears at a random position on the branches every five seconds, encouraging interaction even when the user does not actively engage.

Each flower also develops through timed animation instead of appearing instantly, growing from a small bud into a full bloom. This mechanic helps establish the natural rhythm of the artwork and supports the overall concept of growth, bloom, and decay. By introducing continuous timed changes, the tree feels alive and constantly evolving, even before direct user interaction begins.

![Time-based mechanic diagram](assets/Time-Based.png)

### Audio Mechanic

Once the tree has hit the point of its natural growth cycle where it begins to initially bloom flowers (or in which the user hovers over branches), petals will begin to appear on the ground preemptively. In similar techniques utilized by DJs or audio-visualizers, these petals will bounce in a wave-like formation responsive to the audio input of the user (i.e. confetti bouncing on a speaker playing bass-heavy music). This introduces movement back into the fallen petals, representative of new life. This mechanic also demonstrates a more seemingly passive form of interaction that reflects the natural growth of this piece. 

### Perlin Noise and Randomness Mechanic

I am responsible for implementing Perlin noise and random effects. My work includes designing animations for flowers blooming and dynamic effects for falling petals, in which the falling petals will rotate while their colors transition naturally through a random gradient effect based on Perlin noise. I will also utilize random motion algorithms to develop subtle swaying movements for the tree, creating a more lifelike and realistic visual effect. These systems give the installation a dynamic, responsive, and ever-evolving quality, rather than a mechanical repetition.

## Part 3: Putting It Together

All four mechanics work together on the same canvas to create a single interactive tree environment. Time-based events slowly grow flowers over time, while randomness controls the flower positions and colours to make the tree feel organic. User input allows people to grow and remove flowers through hovering and clicking. The audio mechanic then reacts to sound by lifting fallen petals back into motion. Each mechanic affects the others, creating a continuous cycle between growth, interaction, falling petals, and sound-driven movement. The project is visually connected through the tree, the flower colour palette, and the natural motion of petals across the canvas.
