import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import Chessground from '@react-chess/chessground';

import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.cburnett.css';
import 'chessground/assets/chessground.brown.css';

const samplePGN = `
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6
5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O
9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. Nc3 Qc7
13. Be3 Bb7 14. Rc1 Rfe8 15. cxb5 axb5 16. Nxb5
`;

function MoveList({ pairedMoves = [], selectedMoveIndex, onSelect }) {
	return (
		<table className="text-sm">
			<thead>
				<tr><th>#</th><th>White</th><th>Black</th></tr>
			</thead>
			<tbody>
				{pairedMoves.map(row => (
					<tr key={row.number}>
						<td>{row.number}</td>
						<td
							className={selectedMoveIndex === row.white.index ? 'font-bold' : ''}
							onClick={() => {
								console.log("Clicked white move", row.white.move, row.white.index);
								onSelect(row.white.index);
							}}
						>
							{row.white.move}
						</td>
						<td
							className={row.black && selectedMoveIndex === row.black.index ? 'font-bold' : ''}
							onClick={() => {
								if (row.black) {
									console.log("Clicked black move", row.black.move, row.black.index);
									onSelect(row.black.index);
								}
							}}
						>
							{row.black?.move || ''}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

const Board = () => {
	const [game, setGame] = useState(() => {
		const g = new Chess();
		g.loadPgn(samplePGN);
		return g;
	});

	const apiRef = useRef(null);

	const [fen, setFen] = useState(() => new Chess().fen());
	const fullMoveHistory = useRef([]);
	const [uciMoves, setUciMoves] = useState([]);
	const [sanMoves, setSanMoves] = useState([]);
	const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1);


	const replayToMoveIndex = (index) => {
		const replayed = new Chess();

		for (let i = 0; i <= index && i < fullMoveHistory.current.length; i++) {
			replayed.move(fullMoveHistory.current[i]);
		}

		setGame(replayed);
		setFen(replayed.fen());
		setSelectedMoveIndex(index);
	};

	const getChessgroundPieces = () => {
		const board = game.board();
		const pieces = {};
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				const piece = board[r][c];
				if (piece) {
					const square = `${String.fromCharCode(97 + c)}${8 - r}`;
					pieces[square] = {
						role: piece.type,
						color: piece.color === 'w' ? 'white' : 'black'
					};
				}
			}
		}
		return pieces;
	};

	const computeDests = () => {
		const dests = {};
		game.SQUARES?.forEach(square => {
			const moves = game.moves({ square, verbose: true });
			if (moves.length) {
				dests[square] = moves.map(m => m.to);
			}
		});
		return dests;
	};

	const onUserMove = (from, to) => {
		const move = game.move({ from, to, promotion: 'q' });
		if (move) {
			setUciMoves(prev => [...prev, from + to]);
			setSanMoves(prev => [...prev, move.san]);
			setFen(game.fen());
			console.log("Move made:", move.san);
			sendMoveToBackend(from, to);
		}
	};

	const sendMoveToBackend = async (from, to) => {
		try {
			await fetch('http://localhost:8080/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ from, to })
			});
		} catch (err) {
			console.error('Failed to send move to backend:', err);
		}
	};

	const pairedMoves = useMemo(() => {
		const pairs = [];
		for (let i = 0; i < sanMoves.length; i += 2) {
			const whiteMove = { move: sanMoves[i], index: i };
			const blackMove = sanMoves[i + 1] ? { move: sanMoves[i + 1], index: i + 1 } : null;
			pairs.push({ number: i / 2 + 1, white: whiteMove, black: blackMove });
		}
		return pairs;
	}, [sanMoves]);

	const cgConfig = useMemo(() => {
        const historyVerbose = game.history({ verbose: true });
        const last = historyVerbose[historyVerbose.length - 1];
        const lastMove = last ? [last.from, last.to] : undefined;

        let checkSquare;
        if (game.inCheck()) {
            const board = game.board();
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = board[r][c];
                    if (piece?.type === 'k' && piece.color === game.turn()) {
                        checkSquare = `${String.fromCharCode(97 + c)}${8 - r}`;
                    }
                }
            }
        }

        return {
            fen: game.fen(),
            pieces: getChessgroundPieces(),
            movable: {
                color: game.turn() === 'w' ? 'white' : 'black',
                free: false,
                dests: computeDests(),
                events: { after: onUserMove }
            },
            lastMove,
            check: checkSquare
        };
    }, [game, fen, uciMoves]);
			
	useEffect(() => {
		const g = new Chess();
		g.loadPgn(samplePGN);
		const verbose = g.history({ verbose: true });

		fullMoveHistory.current = verbose;

		setGame(g);
		setFen(g.fen());
		setSanMoves(verbose.map(m => m.san));
		setUciMoves(verbose.map(m => m.from + m.to));
		setSelectedMoveIndex(verbose.length - 1);
	}, []);

	console.log("MoveList will receive", game.history().length, "moves");
	console.log("Rendering Chessground with FEN:", game.fen());
	return (
		<div className="flex gap-4">
            <div className="chessground brown h-[400px] w-[400px]">
                <Chessground
					key={fen}
                    {...cgConfig}
                    width={400}
                    height={400}
                    animationDuration={300}
                    coordinates={true}
                    disableContextMenu={true}
                    onCreate={(api) => {
                        apiRef.current = api;
                    }}
                />
            </div>
			<div className="overflow-auto max-h-[400px]">
				{console.log("Rendering MoveList with", game.history().length, "moves") || null}
				<MoveList
					pairedMoves={pairedMoves}
					selectedMoveIndex={selectedMoveIndex}
					onSelect={replayToMoveIndex}
				/>
			</div>
		</div>
	);	
};

export default Board;
