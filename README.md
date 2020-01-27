# KanjiCount

##MVPS
1. Conveyor
- Has sushi conveyor
- Sushis spawn, move down the conveyor and leave conveyor

2. Sushi
- Players can grab and drag sushi
- Players can feed the sushi to eater
- Sushi has kanji/character label


3. Game
- Correct sushi number is given either via audio or by display
- If correct sushi is picked, the eater is pleased
- Incorrect and eater is displeased
- If enough incorrect, game will end
- Game speeds up if correct answers are given
- Up to a certain num in a row and game is over

Bonus MVP
- Lesson page to teach characters with stroke video, audio of word and mnemonic
- Add mandarin and cantonese

##Wireframe

https://imgur.com/4fC7gBH

##Architecture and Tech

- JS for game logic
- Canvas for rendering
- Sprite.js - handle class for sprites
- Entity.js - handle class for game objects
- Resources.js - handles image loading and sounds etc (util)
- Game.js - main game file


#Timeline
- Day 1/2 - Learn sprite animation, setup sprite.js, main.js, resources.js skeletons
- Day 3 - Add game elements like grabbing and dropping sushis, player reactions
- Day 4 - Add game logic so player can win, add difficulty modifiers
