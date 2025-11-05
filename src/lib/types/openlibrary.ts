/**
 * Tipos de datos para la API de OpenLibrary
 * Basado en la documentación oficial: https://openlibrary.org/dev/docs/api/books
 */

// src/lib/types/openlibrary-api.ts
/** Representa la edición que devuelve la API
 *  https://openlibrary.org/dev/docs/api/books (jscmd=data)
 */
export interface OpenLibraryEdition {
    /** Ejemplo: "/books/OL7353617M" */
    key?: string;
  
    /** Título del libro */
    title?: string;
    subtitle?: string;
  
    /** Autores (array de objetos) */
    authors?: Array<{
      key?: string;
      name?: string;
    }>;
  
    /** Editoriales */
    publishers?: Array<{
      name?: string;
    }>;
  
    /** Fecha de publicación (texto libre) */
    publish_date?: string;
  
    /** Número de páginas */
    number_of_pages?: number;
  
    /** Temas / subjects */
    subjects?: Array<{
      name?: string;
    }>;
  
    /** Idiomas */
    languages?: Array<{
      key?: string;
      name?: string;
    }>;
  
    /** Descripción (puede ser string o {value:string}) */
    description?: string | { value?: string };
  
    /** Portada (objeto con URLs de distintos tamaños) */
    cover?: {
      small?: string;
      medium?: string;
      large?: string;
    };

    works?: OpenLibraryWorkRef[];
  
    /** Otros campos que puedan aparecer (no los usamos directamente) */
    [extra: string]: unknown;
  }
  
  /**
   * La respuesta completa de la API cuando pedimos un ISBN concreto.
   * Cada clave es `ISBN:<isbn>` y el valor es una `OpenLibraryEdition`.
   */
export type OpenLibraryISBNResponse = Record<string, OpenLibraryEdition>;

export interface OpenLibraryWorkRef {
	key: string; // Ejemplo: "/works/OL45804W"
}

export type OpenLibraryDescription =
	| string
	| { type?: string; value: string };

export interface OpenLibraryWork {
	key: string;
	title: string;
	description?: OpenLibraryDescription;
}

// Tipo principal para un libro de OpenLibrary
export interface OpenLibraryBook {
    // Identificadores básicos
    key: string; // Ej: "/books/OL7353617M"
    title: string;
    subtitle?: string;
    isbn_10?: string[];
    isbn_13?: string[];
    
    // Información de autores
    authors?: OpenLibraryAuthor[];
    
    // Información de publicación
    publishers?: string[];
    publish_date?: string;
    publish_places?: string[];
    
    // Detalles físicos
    number_of_pages?: number;
    pagination?: string;
    physical_format?: string; // "Paperback", "Hardcover", etc.
    physical_dimensions?: string;
    weight?: string;
    
    // Clasificaciones y categorías
    subjects?: string[];
    subject_places?: string[];
    subject_people?: string[];
    subject_times?: string[];
    genres?: string[];
    dewey_decimal_class?: string[];
    lc_classifications?: string[];
    
    // Descripciones y contenido
    description?: string | OpenLibraryDescription;
    notes?: string | OpenLibraryNote;
    table_of_contents?: OpenLibraryTableOfContents[];
    first_sentence?: string | OpenLibraryFirstSentence;
    
    // Información editorial
    edition_name?: string;
    copyright_date?: string;
    by_statement?: string;
    
    // Identificadores externos
    goodreads?: string[];
    librarything?: string[];
    oclc_number?: string[];
    lccn?: string[];
    
    // Idiomas
    languages?: OpenLibraryLanguage[];
    
    // Relaciones con otras obras
    works?: OpenLibraryWork[];
    source_records?: string[];
    
    // Metadatos del sistema
    type: OpenLibraryType;
    revision?: number;
    latest_revision?: number;
    created?: OpenLibraryTimestamp;
    last_modified?: OpenLibraryTimestamp;
    
    // URLs y enlaces
    url?: string;
    cover?: {
        small?: string;
        medium?: string;
        large?: string;
    };
    
    // Información adicional
    contributions?: string[];
    contributors?: OpenLibraryContributor[];
    translation_of?: string;
    translated_from?: OpenLibraryLanguage[];
    
    // Información de series
    series?: string[];
    volume?: string;
    volume_number?: number;
    
    // Información comercial
    price?: string;
    currency?: string;
    
    // Calificaciones y popularidad (cuando esté disponible)
    rating?: number;
    rating_count?: number;
  }
  
  // Tipos auxiliares para estructuras anidadas
  export interface OpenLibraryAuthor {
    key: string; // Ej: "/authors/OL23919A"
    name?: string;
    personal_name?: string;
    entity_type?: string;
    birth_date?: string;
    death_date?: string;
    bio?: string | OpenLibraryBio;
    photographs?: number[];
    alternate_names?: string[];
    fuller_name?: string;
    title?: string;
    location?: string;
    wikipedia?: string;
    website?: string;
  }
  
  export interface OpenLibraryLanguage {
    key: string; // Ej: "/languages/eng"
    name?: string;
    code?: string;
  }
  
  export interface OpenLibraryContributor {
    name: string;
    role: string;
  }
  
  export interface OpenLibraryNote {
    type: "/type/text";
    value: string;
  }
  
  export interface OpenLibraryBio {
    type: "/type/text";
    value: string;
  }
  
  export interface OpenLibraryFirstSentence {
    type: "/type/text";
    value: string;
  }
  
  export interface OpenLibraryTableOfContents {
    level?: number;
    label?: string;
    title: string;
    pagenum?: string;
    type?: "/type/toc_item";
  }
  
  export interface OpenLibraryType {
    key: string; // Ej: "/type/edition"
  }
  
  export interface OpenLibraryTimestamp {
    type: "/type/datetime";
    value: string; // ISO 8601 datetime
  }
  
  // Respuesta de la API de búsqueda de OpenLibrary
  export interface OpenLibrarySearchResponse {
    numFound: number;
    start: number;
    numFoundExact?: boolean;
    docs: OpenLibrarySearchResult[];
    q?: string;
    offset?: number;
  }
  
  export interface OpenLibrarySearchResult {
    key: string; // Ej: "/works/OL45804W"
    type: "work";
    seed?: string[];
    title: string;
    title_suggest?: string;
    title_sort?: string;
    subtitle?: string;
    
    // Autores
    author_key?: string[];
    author_name?: string[];
    author_alternative_name?: string[];
    
    // Información de publicación
    first_publish_year?: number;
    publish_date?: string[];
    publish_year?: number[];
    publish_place?: string[];
    publisher?: string[];
    
    // Identificadores
    isbn?: string[];
    oclc?: string[];
    lccn?: string[];
    
    // Clasificaciones
    subject?: string[];
    place?: string[];
    person?: string[];
    time?: string[];
    
    // Formato y páginas
    number_of_pages_median?: number;
    edition_count?: number;
    edition_key?: string[];
    
    // Idiomas
    language?: string[];
    
    // IDs de portadas
    cover_i?: number;
    cover_edition_key?: string;
    
    // Información adicional
    has_fulltext?: boolean;
    public_scan_b?: boolean;
    
    // Puntuaciones de relevancia
    _version_?: number;
    
    // Ratings (cuando estén disponibles)
    ratings_average?: number;
    ratings_count?: number;
    readinglog_count?: number;
    want_to_read_count?: number;
    currently_reading_count?: number;
    already_read_count?: number;
  }
  
  // Utilidades para URLs de imágenes
  export interface OpenLibraryCoverUrls {
    small: string;   // S (pequeña)
    medium: string;  // M (mediana)
    large: string;   // L (grande)
  }
  
  // Funciones helper para generar URLs
  export const OpenLibraryHelpers = {
    /**
     * Genera URLs de portada basado en el ISBN
     */
    getCoverUrlsByISBN: (isbn: string): OpenLibraryCoverUrls => ({
      small: `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`,
      medium: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
      large: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
    }),
  
    /**
     * Genera URLs de portada basado en el ID de OpenLibrary
     */
    getCoverUrlsById: (coverId: number): OpenLibraryCoverUrls => ({
      small: `https://covers.openlibrary.org/b/id/${coverId}-S.jpg`,
      medium: `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`,
      large: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    }),
  
    /**
     * Genera URL del autor
     */
    getAuthorUrl: (authorKey: string): string => 
      `https://openlibrary.org${authorKey}`,
  
    /**
     * Genera URL del libro
     */
    getBookUrl: (bookKey: string): string => 
      `https://openlibrary.org${bookKey}`,
  
    /**
     * Extrae el primer ISBN-13 o ISBN-10 disponible
     */
    getFirstISBN: (book: OpenLibraryBook): string | null => {
      return book.isbn_13?.[0] || book.isbn_10?.[0] || null;
    },
  
    /**
     * Extrae la descripción como string
     */
    getDescription: (book: OpenLibraryBook): string | null => {
      if (!book.description) return null;
      
      if (typeof book.description === 'string') {
        return book.description;
      }
      
      return book.description.value || null;
    },
  
    /**
     * Formatea la lista de autores como string
     */
    getAuthorsString: (book: OpenLibraryBook): string => {
      if (!book.authors || book.authors.length === 0) {
        return 'Autor desconocido';
      }
  
      return book.authors
        .map(author => author.name || author.personal_name || 'Autor desconocido')
        .join(', ');
    },
  
    /**
     * Obtiene el año de publicación
     */
    getPublishYear: (book: OpenLibraryBook): number | null => {
      if (!book.publish_date) return null;
      
      const dateMatch = book.publish_date.match(/\d{4}/);
      return dateMatch ? parseInt(dateMatch[0]) : null;
    }
  };
  
  
  
  // Tipo para el estado del componente de escáner
  export interface ScannerState {
    isScanning: boolean;
    manualMode: boolean;
    isbn: string;
    error: string | null;
    book: OpenLibraryBook | null;
    loading: boolean;
  }
  
  export function getDescriptionText(description?: OpenLibraryDescription): string | null {
    if (!description) return null;
    if (typeof description === 'string') return description;
    return description.value ?? null;
  }