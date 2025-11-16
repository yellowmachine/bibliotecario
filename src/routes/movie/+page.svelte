<script lang="ts">
  import type { NewMovie } from '$lib/db/movies';
  import { queryMovies } from '$lib/remote/movie.remote';
	import MovieCard from '$lib/components/MovieCard.svelte';
  
  let movies: NewMovie[] = [];
  let searchQuery: string;

  const query = async () => {
    movies = await queryMovies(searchQuery);
  };

  function onEnter(fn: (...args: any) => void) {
		return function (event: KeyboardEvent) {
			if (event.key === 'Enter') {
        fn()
      } 
		};
	}

  function cleanQuery(){
    searchQuery = "";
    movies = [];
  }

</script>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h1>Buscar películas</h1>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="form-group">
        <label for="search">Buscar</label>
        <input type="text" class="form-control" id="search" placeholder="Buscar..." bind:value={searchQuery} onkeydown={onEnter(query)}
        />
        <button type="button" class="btn btn-primary" onclick={query}>Buscar</button>
      </div>
    </div>
  </div>

  <hr />

  <div class="row">
    <div class="col-md-12">
      <div class="card-columns">
        {#each movies as movie(movie.id)}
          <MovieCard {cleanQuery} mode="insert" movie={movie} />
        {/each}
      </div>
    </div>
  </div>
</div>