<script lang="ts">
	// Chessground base CSS imports
	import 'chessground/assets/chessground.cburnett.css';
	import 'chessground/assets/chessground.base.css';
	import 'chessground/assets/chessground.brown.css';

	import { onMount } from 'svelte';
	import { Chessground } from 'chessground';
	import { Chess, SQUARES } from 'chess.js'; // SQUARES should be imported here for modern chess.js

	// --- Chess.js State Variables ---
	let pgn = '';
	let chess = new Chess();
	let allMoves: string[] = [];
	let currentMove = 0;
	let selectedMoveIndex = -1;
	let uciMoves: string[] = [];
	let sanMoves: string[] = [];
	let pairedMoves: Array<{
		number: number;
		white: { move: string; index: number };
		black: { move: string; index: number } | null;
	}> = [];

	// --- Reactive Svelte Logic ---

	// This reactive block updates pairedMoves whenever sanMoves changes
	$: if (sanMoves.length > 0) {
		pairedMoves = [];
		for (let i = 0; i < sanMoves.length; i += 2) {
			const whiteMove = { move: sanMoves[i], index: i };
			const blackMove = sanMoves[i + 1] ? { move: sanMoves[i + 1], index: i + 1 } : null;
			pairedMoves = [
				...pairedMoves,
				{
					number: Math.floor(i / 2) + 1,
					white: whiteMove,
					black: blackMove
				}
			];
		}
	}

	// --- Chessground Helper Functions ---

	function computeDests(chessInstance: Chess) {
		if (!chessInstance || typeof chessInstance.moves !== 'function') {
			console.error('Invalid chess object passed to computeDests:', chessInstance);
			return {};
		}
		const dests: { [key: string]: string[] } = {};
		for (const square of SQUARES) {
			const moves = chessInstance.moves({ square, verbose: true });
			if (moves.length) {
				const targetSquares = moves.map((m) => m.to);
				dests[square] = targetSquares;
			}
		}
		// console.log('Computed dests:', JSON.stringify(dests)); // Keep this for debugging if needed
		return dests;
	}

	// This function handles user moves on the Chessground board
	function onUserMove(from: string, to: string) {
		// Attempt to make the move (always promote to queen for simplicity for now)
		const move = chess.move({ from, to, promotion: 'q' });
		if (move) {
			allMoves = chess.history();
			currentMove = allMoves.length;
			sanMoves = chess.history().map((m) => m.san);
			updateGround();
		}
	}

	// Function to update the Chessground instance based on chess.js state
	function updateGround() {
		if (!ground) {
			console.warn('Ground not initialized yet, skipping update.');
			return;
		}

		const turnColor = chess.turn() === 'w' ? 'white' : 'black';
		console.log(`Updating ground with FEN: ${chess.fen()}, Turn: ${turnColor}`);

		let lastMoveArray: [string, string] | undefined = undefined;
		const historyVerbose = chess.history({ verbose: true });
		if (historyVerbose.length > 0) {
			const last = historyVerbose[historyVerbose.length - 1];
			if (last && typeof last.from === 'string' && typeof last.to === 'string') {
				lastMoveArray = [last.from, last.to];
			}
		}

		let checkSquare: string | undefined = undefined;
		if (chess.inCheck()) {
			const kingSquare = chess.kingAt(chess.turn());
			if (kingSquare) {
				checkSquare = kingSquare;
			}
		}

		ground.set({
			fen: chess.fen(),
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

	// --- PGN and Navigation Functions ---

	function loadPgnOnClick() {
		chess.reset();
		const tempMoves: string[] = [];
		const moveRegex = /(\d+\.\s*([^\s]+)\s+([^\s]+)\s*)|(\d+\.\s*([^\s]+)\s*)/g;
		let currentPgn = pgn.trim();
		let match;

		while ((match = moveRegex.exec(currentPgn)) !== null) {
			const whiteMoveSan = match[2] || match[5];
			const blackMoveSan = match[3];
			if (whiteMoveSan) {
				tempMoves.push(whiteMoveSan);
			}
			if (blackMoveSan) {
				tempMoves.push(blackMoveSan);
			}
		}

		for (const moveSan of tempMoves) {
			const move = chess.move(moveSan);
			if (!move) {
				console.error('Invalid PGN move encountered:', moveSan, 'at FEN:', chess.fen());
				break;
			}
		}

		allMoves = chess.history();
		currentMove = allMoves.length;
		sanMoves = chess.history().map((m) => m.san);
		updateGround();
	}

	function nextMove() {
		if (currentMove < allMoves.length) {
			const move = chess.move(allMoves[currentMove]);
			if (move) {
				currentMove++;
				updateGround();
			} else {
				console.error('Failed to make next move:', allMoves[currentMove]);
			}
		}
	}

	function prevMove() {
		if (currentMove > 0) {
			currentMove--;
			chess.undo();
			updateGround();
		}
	}

	function jumpToMove(index: number) {
		chess.reset();
		for (let i = 0; i <= index; i++) {
			const move = chess.move(allMoves[i]);
			if (!move) {
				console.error('Error jumping to move, illegal move found:', allMoves[i]);
				break;
			}
		}
		currentMove = index + 1;
		selectedMoveIndex = index;
		updateGround();
	}

	// --- Backend Integration ---

	async function handleSubmit() {
		const url = 'http://localhost:8080/api/analyze'; // Ensure your backend is running on this port
		try {
			console.log('Submitting PGN:', pgn);
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pgn })
			});
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const json = await response.json();
			uciMoves = json.moves;

			chess.reset();
			sanMoves = [];
			allMoves = [];
			currentMove = 0;

			for (const uci of uciMoves) {
				const move = chess.move({
					from: uci.slice(0, 2),
					to: uci.slice(2, 4),
					promotion: uci.length === 5 ? uci.slice(4, 5) : undefined
				});
				if (!move) {
					console.error('Illegal move from backend:', uci, 'at FEN:', chess.fen());
					break;
				}
				sanMoves.push(move.san);
				allMoves.push(move.san);
			}
			currentMove = allMoves.length;
			updateGround();
		} catch (error) {
			console.error('Error: ', error);
		}
	}

	// --- Chessground Initialization on Mount ---

	let boardElement: HTMLDivElement; // Binds to the HTML element where Chessground will render
	let ground: Chessground; // The Chessground instance

	onMount(() => {
		if (!boardElement) {
			console.error('boardElement is null or undefined! Chessboard cannot be initialized.');
			return;
		}

		// Initialize Chessground
		ground = Chessground(boardElement, {
			orientation: 'white',
			fen: chess.fen(),
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

		// Perform an initial update to ensure all highlights are set
		updateGround();
	});
</script>

<div bind:this={boardElement} class="chessground wood h-[400px] w-[400px]"></div>

<div class="mt-4">
	<button on:click={prevMove} disabled={currentMove === 0}>⏮️ Prev</button>
	<button on:click={nextMove} disabled={currentMove === allMoves.length}>⏭️ Next</button>
</div>

<div class="text">
	<textarea bind:value={pgn} placeholder="Enter PGN here..."></textarea>
</div>

<div>
	<button on:click={handleSubmit}> Click to fetch </button>
</div>

<div>
	<button on:click={loadPgnOnClick}> load pgn </button>
</div>

<h1>Move list</h1>
<ul>
	{#each pairedMoves as pair}
		<li>
			{pair.number}.
			<button on:click={() => jumpToMove(pair.white.index)}>{pair.white.move}</button>
			{#if pair.black}
				<button on:click={() => jumpToMove(pair.black.index)}>{pair.black.move}</button>
			{/if}
		</li>
	{/each}
</ul>

<style>
	/* Add any global styles or component-specific styles here */
	textarea {
		flex: 1;
		resize: none;
		width: 100%; /* Adjust as needed */
		min-height: 100px;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-top: 10px;
	}
	li {
		cursor: pointer;
	}
</style>
