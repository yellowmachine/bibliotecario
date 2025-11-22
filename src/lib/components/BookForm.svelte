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
<form onsubmit={onSave} class="max-w-2xl mx-auto space-y-6">
	<div class="flex flex-col gap-6">

		<div class="flex flex-col">
			<label for="title" class="text-sm font-medium text-gray-700 mb-1">
				Título
			</label>
			<input
				id="title"
				type="text"
				placeholder="Título"
				bind:value={localBook.title}
				class="input"
			/>
		</div>

		<div class="flex flex-col">
			<label for="authors" class="text-sm font-medium text-gray-700 mb-1">
				Autores
			</label>
			<input
				id="authors"
				type="text"
				placeholder="Autores"
				bind:value={localBook.authors}
				class="input"
			/>
		</div>

		<div class="flex flex-col">
			<label for="publisher" class="text-sm font-medium text-gray-700 mb-1">
				Editora
			</label>
			<input
				id="publisher"
				type="text"
				placeholder="Editora"
				bind:value={localBook.publisher}
				class="input"
			/>
		</div>

		<div class="flex flex-col">
			<label for="isbn" class="text-sm font-medium text-gray-700 mb-1">
				ISBN
			</label>
			<input
				id="isbn"
				type="text"
				bind:value={localBook.isbn}
				class="input"
			/>
		</div>

		<div class="flex flex-col">
			<label for="bookUrl" class="text-sm font-medium text-gray-700 mb-1">
				Book Url
			</label>
			<input
				id="bookUrl"
				type="text"
				bind:value={localBook.bookUrl}
				class="input"
			/>
		</div>

		<div class="flex flex-col">
			<label for="coverImageUrl" class="text-sm font-medium text-gray-700 mb-1">
				Cover Image Url
			</label>
			<input
				id="coverImageUrl"
				type="text"
				bind:value={localBook.coverImageUrl}
				class="input"
			/>
		</div>

		<div class="flex flex-col">
			<label for="description" class="text-sm font-medium text-gray-700 mb-1">
				Descripción
			</label>
			<textarea
				id="description"
				rows="4"
				bind:value={localBook.description}
				class="textarea"
			></textarea>
		</div>

		<div class="flex flex-col">
			<label for="numberOfPages" class="text-sm font-medium text-gray-700 mb-1">
				Número de páginas
			</label>
			<input
				id="numberOfPages"
				type="number"
				bind:value={localBook.numberOfPages}
				class="input"
			/>
		</div>

		<div class="flex flex-col">
			<label for="location" class="text-sm font-medium text-gray-700 mb-1">
				Localizador
			</label>
			<input
				id="location"
				type="text"
				bind:value={localBook.location}
				class="input"
			/>
		</div>
	</div>

	<!-- Botón -->
	<button
		type="submit"
		class="btn w-full md:w-auto px-8 py-3"
	>
		{props.mode === "insert" ? "Crear" : "Actualizar"}
	</button>
</form>

<BookCard mode={"preview"}  book={localBook} />