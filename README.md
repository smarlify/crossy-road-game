# Crossy Road - Endless Runner Game

An endless runner game inspired by Crossy Road, built with React Three Fiber. Navigate through procedurally generated levels, avoid obstacles, and collect corn to save your progress!

## 🎮 How to Play

- **Objective**: Survive as long as possible by crossing obstacle lanes and collecting corn
- **Controls**: Arrow keys or on-screen buttons to move (↑↓←→)
- **Corn System**: Collect corn to create checkpoints - if hit, you respawn at your last checkpoint
- **Scoring**: Advance through rows to increase your score

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Start development: `npm run dev`
3. Open browser and play!

## 📁 Project Structure

```bash
CrossyRoad/
├── src/
│   ├── components/        # React components
│   │   ├── Game.tsx      # Main game component
│   │   ├── Player.tsx    # Player character
│   │   ├── Map.tsx       # Level generation
│   │   └── UI.tsx        # User interface
│   ├── logic/            # Game logic
│   │   ├── collision.ts  # Collision detection
│   │   ├── mapLogic.ts   # Level generation
│   │   └── playerLogic.ts # Player movement
│   ├── store/            # State management
│   │   ├── gameStore.ts  # Game state
│   │   └── mapStore.ts   # Map state
│   ├── sound/            # Audio system
│   │   └── playBackgroundMusic.ts
│   └── utils/            # Utilities
├── public/audio/         # Audio files
├── index.html           # Main HTML
└── package.json         # Dependencies
```

## 🌐 Live Demo

- **Heroku**: [Play Crossy Road](https://crossy-road-adeb791dac1a.herokuapp.com/)
- **GitHub**: [View Source](https://github.com/davidnekovarcz/three-js-crossy-road)

## 💡 Pro Tips

- Always collect corn when you see it - it's your lifeline!
- Plan your moves - you can only queue one move at a time
- Watch obstacle patterns - they move at different speeds

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
