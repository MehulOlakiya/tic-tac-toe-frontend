# Tic-Tac-Toe Game Frontend

A real-time multiplayer Tic-Tac-Toe game frontend built with React and Socket.IO.

## Features

- Real-time game updates using Socket.IO
- Create and join game sessions
- Visual game board with move highlighting
- Connection status indicators
- Responsive design for all devices

## Tech Stack

- **React**: UI library
- **Socket.IO Client**: Real-time communication
- **Vite**: Build tool and development server
- **CSS**: Styling

## Prerequisites

- Node.js (v14 or higher)
- Backend server running (see tic-tac-toe-backend repository)

## Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/MehulOlakiya/tic-tac-toe-frontend.git
   cd tic-tac-toe-frontend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the root directory (use `.env.example` as a template):
   \`\`\`
   BACKEND_URL=http://localhost:3001
   \`\`\`

4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

5. Open your browser and navigate to `http://localhost:3000`

## Communication with Backend

The frontend communicates with the backend through:

1. **RESTful API** - For non-real-time operations like:

   - Retrieving game data

2. **Socket.IO** - For real-time operations like:
   - Creating and joining games
   - Making moves
   - Receiving game updates
   - Connection status

## Game Flow

1. Enter your username (optional)
2. Create a new game or join an existing one
3. Share the game ID with a friend to play together
4. Take turns making moves
5. See the result when the game ends
6. Play again with the same opponent

Remember to set the appropriate environment variables in your deployment environment.

## License

MIT
