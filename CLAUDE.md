# Crossy Road - Detailed Documentation

## 🎮 Detailed Game Mechanics

### Corn Collection System
- **Corn appears in forest areas** - look for the golden corn scattered throughout the level
- **Each corn you collect**:
  - Creates a checkpoint at your current position
  - Plays a satisfying collection sound
  - Shows up in your corn counter (top-right corner)
  - **Saves your progress** - if you get hit, you'll respawn at your last corn checkpoint!

### Obstacle System
- **Getting hit by obstacles** (wooden logs or colored balls):
  - If you have corn: You lose 1 corn and respawn at your last checkpoint
  - If you have no corn: Game Over! You'll need to restart from the beginning
- **Visual feedback**: Your character shakes when hit, and you'll hear horn sounds

### Scoring System
- Your score increases as you advance through rows
- The further you go, the higher your score
- Try to beat your personal best!

## 🛠️ Technical Details

This is an interactive tech demo using React Three Fiber with:
- **Orthographic camera** that follows the player
- **3D objects** with realistic lighting and shadows
- **Procedural level generation** - each playthrough is unique
- **Smooth animations** and responsive controls
- **Sound effects** for immersion

## 📁 Complete Project Structure

```bash
CrossyRoad/
├── src/
│   ├── components/           # React components
│   │   ├── Ball.tsx         # Ball obstacle component
│   │   ├── BallLane.tsx     # Ball lane component
│   │   ├── Corn.tsx         # Corn collectible component
│   │   ├── Game.tsx         # Main game component
│   │   ├── Grass.tsx        # Grass terrain component
│   │   ├── GridLines.tsx    # Grid lines component
│   │   ├── Log.tsx          # Log obstacle component
│   │   ├── LogLane.tsx      # Log lane component
│   │   ├── Map.tsx          # Level generation component
│   │   ├── Player.tsx       # Player character component
│   │   ├── Road.tsx         # Road terrain component
│   │   ├── Scene.tsx        # Three.js scene component
│   │   ├── SceneHelpers.tsx # Scene helper functions
│   │   ├── Tree.tsx         # Tree component
│   │   └── UI.tsx           # User interface component
│   ├── logic/               # Game logic
│   │   ├── collision.ts     # Collision detection system
│   │   ├── collisionEffects.ts # Collision visual effects
│   │   ├── collisionUtils.ts # Collision utility functions
│   │   ├── mapLogic.ts      # Level generation logic
│   │   └── playerLogic.ts   # Player movement logic
│   ├── store/               # State management (Zustand)
│   │   ├── gameStore.ts     # Game state management
│   │   └── mapStore.ts      # Map state management
│   ├── sound/               # Audio system
│   │   ├── playBackgroundMusic.ts # Background music
│   │   ├── playCornSound.ts # Corn collection sound
│   │   ├── playGameOverSound.ts # Game over sound
│   │   └── playHorn.ts      # Horn sound effects
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Main type definitions
│   ├── utils/               # Utility functions
│   │   ├── constants.ts     # Game constants
│   │   └── fpsThrottle.ts   # FPS throttling utility
│   ├── animation/           # Animation hooks
│   │   ├── usePlayerAnimation.ts # Player animation
│   │   └── useVehicleAnimation.ts # Vehicle animation
│   └── main.tsx             # Application entry point
├── public/audio/            # Audio files
│   └── bg-music.mp3        # Background music
├── !old/                   # Original implementation backup
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── server.js               # Express server for Heroku
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node.js TypeScript config
├── vite.config.js          # Vite configuration
└── .eslintrc.js            # ESLint configuration
```

## 📚 Learning Resources

Original CodePen: [https://codepen.io/HunorMarton/pen/xbxRbVQ](https://codepen.io/HunorMarton/pen/xbxRbVQ)
Forked CodePen: [https://codepen.io/davidnekovarcz/pen/YPXbOer](https://codepen.io/davidnekovarcz/pen/YPXbOer)

Learn how to code this step by step on YouTube:
- https://www.youtube.com/watch?v=ccYrSACDNsw
- https://javascriptgametutorials.com/

## 🎯 Development Notes

- **TypeScript**: Fully converted from JavaScript with proper type definitions
- **State Management**: Uses Zustand for efficient state management
- **Audio System**: Three.js Audio with background music and sound effects
- **Performance**: Optimized rendering with FPS throttling
- **Architecture**: Clean separation of concerns with modular components

## 🔧 Technical Stack

- **React Three Fiber**: 3D graphics and WebGL rendering
- **TypeScript**: Type-safe development
- **Zustand**: Lightweight state management
- **Vite**: Fast development and building
- **Three.js**: 3D graphics library
- **Express.js**: Server for Heroku deployment
