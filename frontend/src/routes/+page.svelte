<script>
	let pgn = '';

	async function handleSubmit() {
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
			console.log(json);
		} catch (error) {
			console.error('Error: ', error);
		}
	}
</script>

<div class="text">
	<textarea bind:value={pgn}></textarea>
</div>

<div>
	<button on:click={handleSubmit}> Click to fetch </button>
</div>

<style>
	textarea {
		flex: 1;
		resize: none;
	}
</style>
