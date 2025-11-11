# PwnSensei

PwnSensei is a developer-focused chess analysis platform that combines Stockfish evaluations with LLM-based commentary. It parses PGN files, evaluates moves using Stockfish, and generates human-readable explanations using Gemini or other language models.

---

## Features

- Parse and analyze PGN chess games  
- Move-by-move Stockfish evaluation  
- Generate natural language commentary using Gemini  
- REST API built with Go (Gin)  
- React + Chessground frontend  
- MongoDB integration for storing analysis data

---

## Backend Setup

### 1. Clone the repository:

```bash
git clone https://github.com/gur-sin/PwnSensei.git
cd PwnSensei
```

### 2. Add your environment variables in backend/.env:

```
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Place your Stockfish binary in:

```
backend/engines/stockfish
```

### 4. Build and run the backend:

```bash
cd backend
go mod tidy
go run main.go
```

### 5. The backend runs on:

```
http://localhost:8080
```

---

## Frontend Setup

### 1. Install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

### 2. The frontend runs on:

```
http://localhost:5173
```

---

## API Endpoints

### 1.  Analyze PGN
Runs Stockfish analysis on a given PGN.

#### Endpoint

```
POST /api/analyze
```

#### Example Request Body

```
{"pgn": "[Event \"Example\"]\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6"}
```

#### Example Response

```
{
    "evaluations": [
        {
            "move": "e4",
            "best_reply": "e5",
            "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            "score_cp": 23
        }
    ]
}
```

### 2. Generate Commentary
Use Gemini to produce human-readable commentary for the analyzed game.

#### Endpoint

```
POST /api/generate
```

#### Example Request Body

```
{
    "pgn": "[Event \"Example\"]\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6",
    "prompt": "Explain this game like a chess coach."
}
```

#### Example Response

```
{
    "evaluations": [...],
    "commentary": "White opens with the King's Pawn, and Black mirrors the move..."
}
```

---

## Features

- Go 1.21+
- Node.js 18+
- MongoDB
- Stockfish engine binary
- Gemini API key

---

## License

MIT License

---
