import axios from 'axios';
import { InsertMovie } from '@shared/schema';
import { storage } from './storage';

// These are free public APIs that don't require authentication
const MOVIE_API_URL = 'https://api.themoviedb.org/3';
const PUBLIC_API_KEY = '2a5e70fe84e8c4b6d39b5a5d62997e92'; // This is a public sample key
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface MovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface GenreResult {
  id: number;
  name: string;
}

const categoryMapping: Record<number, number> = {};

export async function fetchPopularMovies(page = 1): Promise<void> {
  try {
    // Make sure genre categories are synced
    await syncGenresWithCategories();

    const response = await axios.get(`${MOVIE_API_URL}/movie/popular`, {
      params: {
        api_key: PUBLIC_API_KEY,
        page
      }
    });

    const movies: MovieResult[] = response.data.results;

    for (const movie of movies) {
      // Check if we already have this movie
      const categoryId = await getCategoryIdForGenre(movie.genre_ids[0]);
      
      // Format the movie data according to our schema
      const movieData: InsertMovie = {
        title: movie.title,
        description: movie.overview,
        imageUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image+Available',
        releaseDate: new Date(movie.release_date),
        isReleased: new Date(movie.release_date) <= new Date(),
        categoryId,
        rating: movie.vote_average.toString(),
        director: 'Unknown', // API doesn't include director in this endpoint
        tmdbId: movie.id
      };

      // Try to store the movie, handling potential database constraint errors
      try {
        await storage.createMovieIfNotExists(movieData);
      } catch (error) {
        console.error(`Error adding movie ${movie.title}:`, error);
      }
    }

    console.log(`Fetched and processed ${movies.length} popular movies from page ${page}`);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
  }
}

export async function fetchUpcomingMovies(page = 1): Promise<void> {
  try {
    // Make sure genre categories are synced
    await syncGenresWithCategories();

    const response = await axios.get(`${MOVIE_API_URL}/movie/upcoming`, {
      params: {
        api_key: PUBLIC_API_KEY,
        page
      }
    });

    const movies: MovieResult[] = response.data.results;

    for (const movie of movies) {
      // Check if we already have this movie by TMDB ID
      const categoryId = await getCategoryIdForGenre(movie.genre_ids[0]);
      
      // Format the movie data according to our schema
      const movieData: InsertMovie = {
        title: movie.title,
        description: movie.overview,
        imageUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image+Available',
        releaseDate: new Date(movie.release_date),
        isReleased: false, // Mark as upcoming
        categoryId,
        rating: movie.vote_average.toString(),
        director: 'Unknown', // API doesn't include director in this endpoint
        tmdbId: movie.id
      };

      // Try to store the movie, handling potential database constraint errors
      try {
        await storage.createMovieIfNotExists(movieData);
      } catch (error) {
        console.error(`Error adding movie ${movie.title}:`, error);
      }
    }

    console.log(`Fetched and processed ${movies.length} upcoming movies from page ${page}`);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
  }
}

async function syncGenresWithCategories(): Promise<void> {
  try {
    // Get all genres from the API
    const response = await axios.get(`${MOVIE_API_URL}/genre/movie/list`, {
      params: {
        api_key: PUBLIC_API_KEY
      }
    });

    const genres: GenreResult[] = response.data.genres;

    // For each genre, ensure we have a matching category
    for (const genre of genres) {
      // Look for an existing category with the same name
      let category = await storage.getCategoryByName(genre.name);
      
      // If it doesn't exist, create it
      if (!category) {
        category = await storage.createCategory({ name: genre.name });
        console.log(`Created new category: ${genre.name}`);
      }
      
      // Map the genre ID to our category ID for later use
      categoryMapping[genre.id] = category.id;
    }

    console.log('Genres synced with categories successfully');
  } catch (error) {
    console.error('Error syncing genres with categories:', error);
  }
}

async function getCategoryIdForGenre(genreId: number): Promise<number> {
  // If we have a mapping for this genre, use it
  if (categoryMapping[genreId]) {
    return categoryMapping[genreId];
  }
  
  // If no mapping exists, use the first available category as a fallback
  const categories = await storage.getCategories();
  if (categories.length > 0) {
    return categories[0].id;
  }
  
  // If no categories exist at all, create one and use it
  const defaultCategory = await storage.createCategory({ name: 'Other' });
  return defaultCategory.id;
}

// Function to seed the database with movies when the server starts
export async function seedMovies(): Promise<void> {
  console.log('Starting movie database seeding...');
  
  // Fetch 2 pages of popular movies (40 movies total)
  await fetchPopularMovies(1);
  await fetchPopularMovies(2);
  
  // Fetch 1 page of upcoming movies (20 movies)
  await fetchUpcomingMovies(1);
  
  console.log('Movie database seeding completed!');
}