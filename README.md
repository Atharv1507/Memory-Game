# Memory Card Game

A real-time multiplayer memory card game built with React and WebSockets. Players compete to match pairs of cards in a shared deck, with live synchronization across connected clients.

## Features

### 🎮 Core Gameplay
- **Memory Matching**: Classic card matching game with numbers 1-10
- **Multiplayer Support**: 2 players can join the same room
- **Real-time Synchronization**: Moves are instantly synchronized between players
- **Turn-based Play**: Players alternate turns when no match is found

### 🔄 Real-time Features
- **Live Updates**: Card flips and matches are broadcast to all players in real-time
- **Room Management**: Players can join rooms by ID
- **Game State Sync**: Deck shuffling and game start are synchronized
- **Connection Handling**: Automatic cleanup when players disconnect

### 🎯 Game Mechanics
- **Card Flipping Animation**: Smooth reveal/hide animations
- **Match Detection**: Automatic pair matching with visual feedback
- **Turn Management**: Automatic player switching on misses
- **Game Pause**: Pauses when waiting for second player to join

## Tech Stack

### Frontend
- **React 19**: Modern React with hooks for state management
- **Vite**: Fast build tool with Hot Module Replacement (HMR)
- **ESLint**: Code linting and formatting
- **CSS Modules**: Component-scoped styling

### Backend
- **Node.js**: JavaScript runtime for the server
- **WebSocket (ws library)**: Real-time bidirectional communication
- **Express-like WebSocket Server**: Custom WebSocket server implementation

### Development Tools
- **Vite Dev Server**: Fast development with HMR
- **ESLint**: Code quality and consistency
- **npm**: Package management
- **Railway** : Deployment of front-end and back-end

## Project Structure

```
Game/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Card.jsx       # Individual card component
│   │   └── Roomjoin.jsx   # Room joining interface
│   ├── assets/            # Images and media
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── server.js              # WebSocket server
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Game
```

2. Install dependencies:
```bash
npm install
```

3. Start the WebSocket server:
```bash
node server.js
```

4. In a new terminal, start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## How to Play

1. **Join a Room**: Enter a room ID to join or create a room
2. **Wait for Players**: Game starts automatically when 2 players join
3. **Take Turns**: Click cards to flip them and find matching pairs
4. **Score Points**: Each match earns a point for the current player
5. **Win the Game**: Player with the most matches wins!

## WebSocket Protocol

The game uses a simple WebSocket protocol for communication:

### Client → Server Messages
- `JOIN`: Join a room with specified roomId
- `MOVE`: Send a card flip action with cardIndex and cardValue

### Server → Client Messages
- `JOIN_SUCCESS`: Room joined successfully with deck and playerId
- `START_GAME`: Game can begin (room is full)
- `REMOTE_MOVE`: Opponent's move with card details
- `PAUSE_GAME`: Game paused (waiting for players)
- `ERROR`: Error messages (e.g., room full)

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality
- ESLint configuration includes React hooks and refresh plugins
- TypeScript types available for React components
- Modern JavaScript (ES modules)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Test multiplayer functionality
6. Submit a pull request

## License
This project is licensed under the MIT License.
