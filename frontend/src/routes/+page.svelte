<script>
	import 'chessground/assets/chessground.cburnett.css';
	import 'chessground/assets/chessground.base.css';
	import 'chessground/assets/chessground.brown.css';

	import { onMount } from 'svelte';
	import { Chessground } from 'chessground';
	import { Chess } from 'chess.js';

	let pgn = '';
	let chess = new Chess();

	let allMoves = [];
	let currentMove = 0;

	/** @type {string[]} */
	let moves = [];

	function loadPgnOnClick() {
		chess.reset();

		const pgnClean = pgn.trim();

		// The regex extracts one full move as an array. [0] -> Move no., [1] -> white's move, [2] -> black's move.
		const moveRegex = /\d+\.\s*([^\s]+)\s+([^\s]+)/g;
		let match;

		while ((match = moveRegex.exec(pgnClean)) !== null) {
			const whiteMove = match[1];
			const blackMove = match[2];

			try {
				chess.move(whiteMove);
				chess.move(blackMove);
			} catch (error) {
				console.error('Invalid move:', error);
				break;
			}
		}

		const finalFen = chess.fen();
		// @ts-ignore
		ground.set({ fen: finalFen });

		allMoves = chess.history();
		currentMove = allMoves.length;
	}

	async function stockfishRequest() {
		const url = 'http://localhost:8080/api/analyze';
		try {
			console.log('Submitting PGN:', pgn);
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({ pgn })
			});
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const json = await response.json();
			moves = json.moves;
		} catch (error) {
			console.error('Error: ', error);
		}
	}

	// @ts-ignore
	let boardElement;

	// @ts-ignore
	let ground;

	onMount(() => {
		// @ts-ignore
		ground = Chessground(boardElement, {
			orientation: 'white',
			fen: 'start',
			movable: {
				free: false
			}
		});
	});
</script>

<div bind:this={boardElement} class="chessground wood h-[400px] w-[400px]"></div>

<div class="text">
	<textarea bind:value={pgn}></textarea>
</div>

<div>
	<button on:click={stockfishRequest}> Click to fetch </button>
</div>

<div>
	<button on:click={loadPgnOnClick}> load pgn </button>
</div>

<h1>Move list</h1>
<ul>
	{#each moves as move, index}
		<li>{index + 1}. {move}</li>
	{/each}
</ul>

<style>
	textarea {
		flex: 1;
		resize: none;
	}
</style>
