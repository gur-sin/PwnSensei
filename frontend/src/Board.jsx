import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import Chessground from "@react-chess/chessground";
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';

const Board = () => {
	const boardRef = useRef(null);
	const [chess] = useState(new Chess());
	const [uciMoves, setUciMoves] = useState([]);
	const [sanMoves, setSanMoves] = useState([]);
	const [selectedMoveIndex, setSelectedMoveIndex] = useState(-1);

	const getChessgroundPieces = () => {
		const board = chess.board();
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
		chess.SQUARES?.forEach(square => {
			const moves = chess.moves({ square, verbose: true });
			if (moves.length) {
				dests[square] = moves.map(m => m.to);
			}
		});
		return dests;
	};

	const onUserMove = (from, to) => {
		const move = chess.move({ from, to, promotion: 'q' });
		if (move) {
			const history = chess.history();
			setUciMoves(prev => [...prev, from + to]);
			setSanMoves(prev => [...prev, move.san]);
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

	const config = useMemo(() => {
		const historyVerbose = chess.history({ verbose: true });
		const last = historyVerbose[historyVerbose.length - 1];
		const lastMove = last ? [last.from, last.to] : undefined;

		let checkSquare;
		if (chess.inCheck()) {
			const kingSquare = chess.board().flat().find(p => p?.type === 'k' && p.color === chess.turn());
			checkSquare = kingSquare?.square;
		}

		return {
			fen: chess.fen(),
			pieces: getChessgroundPieces(),
			movable: {
				color: chess.turn() === 'w' ? 'white' : 'black',
				free: false,
				dests: computeDests(),
				events: { after: onUserMove }
			},
			lastMove,
			check: checkSquare
		};
	}, [uciMoves]);

	return (
		<div className="flex gap-4">
			<div ref={boardRef} className="chessground wood h-[400px] w-[400px]">
				<Chessground ref={boardRef} {...config} />
			</div>
			<div className="overflow-auto max-h-[400px]">
				<table className="text-sm">
					<thead>
						<tr><th>#</th><th>White</th><th>Black</th></tr>
					</thead>
					<tbody>
						{pairedMoves.map(row => (
							<tr key={row.number}>
								<td>{row.number}</td>
								<td className={selectedMoveIndex === row.white.index ? 'font-bold' : ''}>
									{row.white.move}
								</td>
								<td className={row.black && selectedMoveIndex === row.black.index ? 'font-bold' : ''}>
									{row.black?.move}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Board;
