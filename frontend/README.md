# Chess Analyzer WebApp

A React frontend for chess game analysis using Stockfish engine and LLM commentary.

## Features

- **Interactive Chess Board**: Custom HTML/CSS chess board with Unicode pieces for reliable position updates
- **PGN Import**: Import chess games in PGN format via text input
- **Game Navigation**: Navigate through moves with first/previous/next/last controls
- **Move List**: Click any move to jump to that position
- **Engine Analysis**: Integrates with Stockfish for position evaluation
- **LLM Commentary**: Human-readable analysis backed by engine data
- **Chat Interface**: Ask questions about positions and get detailed explanations

## Local Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm package manager

### Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

The app will run locally with the exact same styling and functionality as the v0 preview.

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## API Integration

This frontend is designed to work with your Go backend at `github.com/gur-sin/PwnSensei`.

### Required API Endpoints

The frontend expects these endpoints to be available:

#### POST /api/analyze
Analyzes a chess position using Stockfish.

**Request Body:**
\`\`\`json
{
  "pgn": "1. e4 e5 2. Nf3 Nc6...",
  "moveNumber": 4
}
\`\`\`

**Expected Response:**
\`\`\`json
{
  "position": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  "analysis": {
    "evaluation": 0.2,
    "bestMove": "Bb5",
    "principalVariation": ["Bb5", "a6", "Ba4"],
    "depth": 15,
    "nodes": 1000000,
    "time": 2000,
    "tactical": false
  }
}
\`\`\`

#### POST /api/analyze/commentary
Generates human-readable analysis using LLM.

**Request Body:**
\`\`\`json
{
  "pgn": "1. e4 e5 2. Nf3 Nc6...",
  "moveNumber": 4,
  "analysis": { /* analysis from /api/analyze */ },
  "userPrompt": "Why is this move good?" // optional
}
\`\`\`

**Expected Response:**
\`\`\`json
{
  "commentary": "This position shows a typical Italian Game setup...",
  "analysis": { /* same as analyze endpoint */ }
}
\`\`\`

## Usage

1. Import a PGN game using the text area
2. Navigate through moves using the control buttons or click moves in the move list
3. Click "Analyze Current Position" to get engine analysis
4. Ask questions in the chat interface for detailed explanations
5. The analysis panel shows engine evaluation, best moves, and tactical information

## Dependencies

- Next.js 15+ with App Router
- React 19+
- chess.js for game logic
- Custom HTML/CSS chess board implementation
- shadcn/ui for UI components
- Tailwind CSS v4 for styling

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout with fonts and theme
│   └── page.tsx             # Main chess analyzer page
├── components/
│   ├── chess-board.tsx      # Custom chess board component
│   ├── pgn-import.tsx       # PGN import functionality
│   ├── analysis-panel.tsx   # Engine analysis display
│   ├── llm-chat.tsx         # Chat interface for questions
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── api.ts               # API client functions
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
