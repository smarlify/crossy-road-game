# Crossy Road - 2.5D Runner Game

An endless runner game inspired by Crossy Road, built with React Three Fiber. Navigate through procedurally generated levels, avoid obstacles, and collect corn to save your progress!

## 🎮 How to Play

### Objective
- **Survive as long as possible** by crossing obstacle lanes and avoiding moving objects
- **Collect corn (🌽)** to create checkpoints and save your progress
- **Score points** by advancing through rows - your score is based on how far you've traveled

### Controls
- **Arrow Keys** or **On-screen buttons** to move:
  - `↑` (Up Arrow) - Move forward
  - `↓` (Down Arrow) - Move backward  
  - `←` (Left Arrow) - Move left
  - `→` (Right Arrow) - Move right

### Game Mechanics

#### 🌽 Corn Collection System
- **Corn appears in forest areas** - look for the golden corn scattered throughout the level
- **Each corn you collect**:
  - Creates a checkpoint at your current position
  - Plays a satisfying collection sound
  - Shows up in your corn counter (top-right corner)
  - **Saves your progress** - if you get hit, you'll respawn at your last corn checkpoint!

#### 🚧 Obstacle System
- **Getting hit by obstacles** (wooden logs or colored balls):
  - If you have corn: You lose 1 corn and respawn at your last checkpoint
  - If you have no corn: Game Over! You'll need to restart from the beginning
- **Visual feedback**: Your character shakes when hit, and you'll hear horn sounds

#### 🎯 Scoring
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

## 📚 Learning Resources


Original CodePen: [https://codepen.io/HunorMarton/pen/xbxRbVQ](https://codepen.io/HunorMarton/pen/xbxRbVQ)
->Forked CodePen: [https://codepen.io/davidnekovarcz/pen/YPXbOer](https://codepen.io/davidnekovarcz/pen/YPXbOer)

Learn how to code this step by step on YouTube:
- https://www.youtube.com/watch?v=ccYrSACDNsw
- https://javascriptgametutorials.com/

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open your browser and start playing!

## 💡 Pro Tips

- **Always collect corn** when you see it - it's your lifeline!
- **Plan your moves** - you can only queue one move at a time
- **Watch obstacle patterns** - wooden logs and colored balls move at different speeds
- **Use the respawn system** strategically - corn checkpoints are your safety net

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
