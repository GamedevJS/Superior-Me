# Superior Me Game

This game was created for the GameDevs.js Jam 2024

it was build using the phaser CLI tool using a react based template

**[This Template is also available here](https://github.com/phaserjs/template-react)**

**[How to use the CLI](https://phaser.io/tutorials/create-game-app)**
## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

Download and copy the audio files from the Audio Assets Section to their respective folder.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |
| `npm run build` | Create a production build in the `dist` folder |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default. Please see the Vite documentation if you wish to change this, or add SSL support.

Once the server is running you can edit any of the files in the `src` folder. Vite will automatically recompile your code and then reload the browser.

## Project basic structure

We have provided a default project structure to get you started. This is as follows:

- `index.html` - A basic HTML page to contain the game.
- `src` - Contains the React client source code.
- `src/main.tsx` - The main **React** entry point. This bootstraps the React application.
- `src/vite-env.d.ts` - Global TypeScript declarations, provide types information.
- `src/App.tsx` - The main React component.
- `src/game/PhaserGame.tsx` - The React component that initializes the Phaser Game and serve like a bridge between React and Phaser.
- `src/game/EventBus.ts` - A simple event bus to communicate between React and Phaser.
- `src/game` - Contains the game source code.
- `src/game/main.tsx` - The main **game** entry point. This contains the game configuration and start the game.
- `src/game/scenes/` - The Phaser Scenes are in this folder.
- `public/style.css` - Some simple CSS rules to help with page layout.
- `public/assets` - Contains the static assets used by the game.

## Game - Core files

We have provided a default project structure to get you started. This is as follows:

- `index.html` - A basic HTML page to contain the game.
- `scenes/MainMenu.ts` - Contains the main menu scene that allows to customize the player visuals.
- `scenes/PunchTest.ts` - Contains the scene that serves as tutorial /initial power assesment
-  `scenes/Game.ts` - All core gameplay logic happens here.
- `scenes/GameOver.ts` - The player stats screen after being defeated is displayed on this screen. displays the power and health stats for the player.
-  `scenes/BaseScene.ts` - This is the base scene class that contains shared logic that all other scenes inherits as create a predefined button.
-  `scenes/ControlsScene.ts` - The sub menu tab that display the game controls and shortcuts
-  `scenes/Credits.ts` - The sub menu tab that display the game credits
-  `scenes/Leaderboard.ts` - The sub menu tab that display leaderboard (currently under development)
-  `sprites/Superior.ts` - This is the main NPC that is created every time during game play with different attributes as power, health or name.
-  `services/UserDataStorage.ts` - a service to read, updated and create the player prefferences into the browser local storage. 
## Gameplay Components
The following files currently are on the scenes folder, but eventually will be moved to a specific components folder.

-  `scenes/AnimatedSprite.ts` - Encapsulates the logic of multiple sprites that serves as a basic animation.
-  `scenes/CooldownPower.ts` - Allows to create a circular cooldown visual that can be rehused with a given texture.
-  `scenes/PowerbarHUD.ts` - creates a simple texture that serves as a background for the powerIndicator
-  `scenes/PowerIndicator.ts` - creates a progress bar that gets grower and lower to indicate the amount of current power according a certain duration specified.

## HUD Components
The following files currently are on the scenes folder, but eventually will be moved to a specific components folder.

-  `HUD/ActionTimer.ts` - Defines a visual timer that displays a text and the timer left on screen.
-  `HUD/HealthBar.ts` - creates a visual health bar with parameters as color and text to be displayed inside of it.
-  `HUD/PowerGlasses.ts` - display glasses as POV to display the enemy npc power and health.

## Assets
The assets are organized in the following folders inside the public folder:

- Audio - you can download the audio and put them here since I do not have the rights to redistribute them.
- Character - the main NPC assets to be customized
- Config - contains a settings.json file with the player colors to be get randomically and some names.
- fonts
- Particles - the particles images to be used as effects
- UI  

## Audio Assets
The following audio sources were used in this project with the given names, those are either marked as completely free or under public domain, though I think I don't have rights to include them as part of my source files, so I share the site where you can download them and copy it to those paths:

- [assets/audio/battleThemeA.mp3](https://opengameart.org/content/battle-theme-a)
- [assets/audio/battleThemeB.mp3](https://opengameart.org/content/battle-theme-b-for-rpg)
- [assets/audio/SuperHero.ogg](https://opengameart.org/content/adventure-theme)


[Those are the source for the punching VFX](https://danielsoundsgood.itch.io/free-deadly-kombat-sound-effects)

        'assets/Audio/body_hit_small_11.wav'
        'assets/Audio/body_hit_small_23.wav'
        'assets/Audio/face_hit_small_23.wav'
        'assets/Audio/fire_punch_02.wav'

## Fonts
- [Steel City Comic](https://www.1001fonts.com/steel-city-comic-font.html)
- Unicephalon (font and license attached)



## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy your game, you will need to upload *all* of the contents of the `dist` folder to a public facing web server.


