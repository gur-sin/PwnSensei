<script>
	import 'chessground/assets/chessground.cburnett.css';
	import 'chessground/assets/chessground.base.css';
	import 'chessground/assets/chessground.brown.css';

	import { onMount } from 'svelte';
	import { Chessground } from 'chessground';
	import { Chess, SQUARES } from 'chess.js';

	let pgn = '';
	let chess = new Chess();
	let allMoves = [];
	let currentMove = 0;
	let selectedMoveIndex = -1;
	let uciMoves = [];
	let sanMoves = [];
	let pairedMoves = [];

	$: if (sanMoves.length > 0) {
		pairedMoves = [];
		for (let i = 0; i < sanMoves.length; i += 2) {
			const whiteMove = { move: sanMoves[i], index: i };
			const blackMove = sanMoves[i + 1] ? { move: sanMoves[i + 1], index: i + 1 } : null;
			pairedMoves.push({
				number: i / 2 + 1,
				white: whiteMove,
				black: blackMove
			});
		}
	}

	// NEW/RE-INTRODUCED: Helper function to convert chess.js board to chessground pieces format
	function getChessgroundPieces(chessInstance) {
		const pieces = {};
		const board = chessInstance.board(); // Get the current board from chess.js
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				const piece = board[r][c];
				if (piece) {
					const square = `${String.fromCharCode(97 + c)}${8 - r}`; // Convert column/row to square
					pieces[square] = {
						role: piece.type, // 'p', 'n', 'b', 'r', 'q', 'k'
						color: piece.color === 'w' ? 'white' : 'black'
					};
				}
			}
		}
		return pieces;
	}

	function computeDests(chessInstance) {
		if (!chessInstance || typeof chessInstance.moves !== 'function') {
			console.error('Invalid chess object passed to computeDests:', chessInstance);
			return {};
		}
		const dests = {};
		for (const square of SQUARES) {
			if (typeof square !== 'string') {
				console.warn('Non-string square encountered in SQUARES:', square);
				continue;
			}
			const moves = chessInstance.moves({ square, verbose: true });
			if (moves.length) {
				const targetSquares = moves.map((m) => m.to).filter((s) => typeof s === 'string');
				if (targetSquares.length > 0) {
					dests[square] = targetSquares;
				}
			}
		}
		console.log('Computed dests:', JSON.stringify(dests));
		return dests;
	}

	function onUserMove(from, to) {
		const move = chess.move({ from, to, promotion: 'q' });
		if (move) {
			allMoves = chess.history();
			currentMove = allMoves.length;
		}
		updateGround();
	}

	function updateGround() {
		if (!ground) {
			console.warn('Ground not initialized yet, skipping update.');
			return;
		}

		const turnColor = chess.turn() === 'w' ? 'white' : 'black';
		console.log(`Updating ground with FEN: ${chess.fen()}, Turn: ${turnColor}`);

		let lastMoveArray = undefined;
		const historyVerbose = chess.history({ verbose: true });
		if (historyVerbose.length > 0) {
			const last = historyVerbose[historyVerbose.length - 1];
			if (last && typeof last.from === 'string' && typeof last.to === 'string') {
				lastMoveArray = [last.from, last.to];
			}
		}

		let checkSquare = undefined;
		if (chess.inCheck()) {
			const kingSquare = chess.kingAt(chess.turn());
			if (kingSquare) {
				checkSquare = kingSquare;
			}
		}

		ground.set({
			fen: chess.fen(),
			// NEW: Explicitly provide the pieces here as well
			pieces: getChessgroundPieces(chess),
			movable: {
				color: turnColor,
				free: false,
				dests: computeDests(chess),
				events: {
					after: onUserMove
				}
			},
			lastMove: lastMoveArray,
			check: checkSquare
		});
		console.log('Ground updated successfully.');
	}

	// ... (loadPgnOnClick, nextMove, prevMove, jumpToMove, handleSubmit - remain unchanged) ...

	let boardElement;
	let ground;

	onMount(() => {
		if (!boardElement) {
			console.error('boardElement is null or undefined!');
			return;
		}

		ground = Chessground(boardElement, {
			orientation: 'white',
			fen: chess.fen(),
			// NEW: Explicitly provide the pieces on initial setup
			pieces: getChessgroundPieces(chess),
			movable: {
				color: chess.turn() === 'w' ? 'white' : 'black',
				free: false,
				dests: computeDests(chess),
				events: {
					after: onUserMove
				}
			},
			lastMove: undefined,
			check: undefined
		});
		updateGround();
	});
</script>

<div bind:this={boardElement} class="chessground wood h-[400px] w-[400px]"></div>
