<script lang="ts">
  import type { Movie } from '$lib/types/tmdb';
  import { queryMovies } from '$lib/remote/movie.remote';
	import MovieCard from '$lib/components/MovieCard.svelte';
  
  let movies: Movie[] | null = null;
  let searchQuery: string;

  const query = async () => {
    movies = await queryMovies(searchQuery);
  };

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
        <input type="text" class="form-control" id="search" placeholder="Buscar..." bind:value={searchQuery} />
        <button type="button" class="btn btn-primary" onclick={query}>Buscar</button>
      </div>
    </div>
  </div>

  <hr />

  {#if movies}
    <div class="row">
      <div class="col-md-12">
        <div class="card-columns">
          {#each movies as movie}
            <MovieCard movie={movie} />
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>