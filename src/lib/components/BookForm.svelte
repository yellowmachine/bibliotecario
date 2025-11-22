<script lang="ts">
	import type { NewBook, Book } from "$lib/db/books";
    import type { ZodType } from "zod";
	import BookCard from "./BookCard.svelte";


	type Props =
		| {
				mode: "insert";
				book: NewBook;
                schema: ZodType<NewBook>;
                save: (book: NewBook) => Promise<void>;
		  }
		| {
				mode: "update";
				book: Book;
                schema: ZodType<Partial<Book>>;
				save: (book: Book) => Promise<void>;
		  };

	let props: Props = $props();

	// Crea localBook con el tipo correcto basado en props.mode (TS infiere bien aquí)
	let localBook = $state({ ...props.book } as typeof props.book);

	let initialBook: NewBook | Book = {...props.book} // $state(props.book);  // Corrige: unión, no solo NewBook
	let error: string = $state('');
	let success: string = $state('');

	function clear() {
		error = '';
		success = '';
		localBook = { ...initialBook };  // Usa localBook, no props.book
	}

	async function onSave() {
		try {
			if (props.mode === "insert") {
				// localBook se narrowea a NewBook gracias al if (TS lo sabe por props.mode)
				await props.schema.parseAsync(localBook);
				await props.save(localBook);
				success = 'Libro creado';
			} else {
				// localBook se narrowea a Book (id: number obligatorio)
				await props.schema.parseAsync(localBook);
				await props.save(localBook as Book);
				success = 'Libro actualizado';
			}
		} catch (err) {
			console.log(err);
			error = `Error guardando libro: ${JSON.stringify(err)}`;
		}
	}
</script>

{#if error}
	<div class="alert alert-error">{error}</div>
{/if}
{#if success}
	<div class="alert alert-success">
		{success}
        <div>
		{#if props.mode === 'insert'}
			<!-- <a href="/book/{props.book.id}">Ver libro</a> -->
			<button class="btn btn-primary" onclick={clear}>Agregar otro libro</button>
		{/if}
        </div>
	</div>
{/if}
<form onsubmit={onSave}>
    <div>
	    <input type="text" placeholder="Título" bind:value={localBook.title} />
    </div>
    <div>
        <input type="text" placeholder="Autores" bind:value={localBook.authors} />
    </div>
    <div>
        <input type="text" placeholder="Editora" bind:value={localBook.publisher} />
    </div>
    <div>
        <input type="text" placeholder="ISBN" bind:value={localBook.isbn} />
    </div>
    <div>
        <input type="text" placeholder="Book Url" bind:value={localBook.bookUrl} />
    </div>
    <div>
        <input type="text" placeholder="Cover Image Url" bind:value={localBook.coverImageUrl} />
    </div>
    <div>
        <input type="text" placeholder="Localizador" bind:value={localBook.location} />
    </div>
    <button type="submit" class="btn">
		{props.mode === "insert" ? "Crear" : "Actualizar"}
	</button>
</form>

<BookCard mode={"preview"}  book={localBook} />