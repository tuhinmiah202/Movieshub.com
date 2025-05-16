import { 
  type Movie, 
  type InsertMovie, 
  type Category, 
  type InsertCategory,
  type User,
  type InsertUser
} from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // Movies
  getMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  getMoviesByCategory(categoryId: number): Promise<Movie[]>;
  getReleasedMovies(isReleased: boolean): Promise<Movie[]>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  createMovieIfNotExists(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<boolean>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  validateUser(username: string, password: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private movies: Map<number, Movie>;
  private categories: Map<number, Category>;
  private users: Map<number, User>;
  private movieCurrentId: number;
  private categoryCurrentId: number;
  private userCurrentId: number;

  constructor() {
    this.movies = new Map();
    this.categories = new Map();
    this.users = new Map();
    this.movieCurrentId = 1;
    this.categoryCurrentId = 1;
    this.userCurrentId = 1;
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true
    }).catch(console.error);
  }

  // Movie methods
  async getMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values())
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMoviesByCategory(categoryId: number): Promise<Movie[]> {
    return Array.from(this.movies.values())
      .filter(movie => movie.categoryId === categoryId)
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }

  async getReleasedMovies(isReleased: boolean): Promise<Movie[]> {
    return Array.from(this.movies.values())
      .filter(movie => movie.isReleased === isReleased)
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.movieCurrentId++;
    const now = new Date();
    const movie: Movie = { 
      ...insertMovie, 
      id,
      createdAt: now
    };
    this.movies.set(id, movie);
    return movie;
  }

  async createMovieIfNotExists(insertMovie: InsertMovie): Promise<Movie> {
    // Check if movie with the TMDB ID already exists
    if (insertMovie.tmdbId) {
      const existingMovie = Array.from(this.movies.values()).find(
        movie => movie.tmdbId === insertMovie.tmdbId
      );
      
      if (existingMovie) {
        return existingMovie;
      }
    }
    
    // Create the movie if it doesn't exist
    return this.createMovie(insertMovie);
  }

  async updateMovie(id: number, updateData: Partial<InsertMovie>): Promise<Movie | undefined> {
    const existingMovie = this.movies.get(id);
    if (!existingMovie) return undefined;

    const updatedMovie: Movie = {
      ...existingMovie,
      ...updateData,
    };
    this.movies.set(id, updatedMovie);
    return updatedMovie;
  }

  async deleteMovie(id: number): Promise<boolean> {
    return this.movies.delete(id);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    // Check if category already exists to avoid duplicates
    const existingCategory = await this.getCategoryByName(insertCategory.name);
    if (existingCategory) {
      return existingCategory;
    }
    
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // User methods
  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const id = this.userCurrentId++;
    const now = new Date();
    
    const user: User = {
      id,
      username: insertUser.username,
      password: hashedPassword,
      isAdmin: insertUser.isAdmin || false,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username === username
    );
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return undefined;
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return undefined;
    }
    
    return user;
  }
}

export const storage = new MemStorage();
