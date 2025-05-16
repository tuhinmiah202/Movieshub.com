import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, insertCategorySchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";

// Extend Express session
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
  }
}

// Auth middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(401).json({ message: "Unauthorized - Admin access required" });
  }
  next();
};

// Implement movie fetching
import axios from 'axios';

// Hard-coded movie data to avoid file system issues
const movieData = {
  "results": [
    {
      "id": 1,
      "title": "Inception",
      "overview": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      "director": "Christopher Nolan"
    },
    {
      "id": 2,
      "title": "The Dark Knight",
      "overview": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      "director": "Christopher Nolan"
    },
    {
      "id": 3,
      "title": "Pulp Fiction",
      "overview": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      "director": "Quentin Tarantino"
    },
    {
      "id": 4,
      "title": "The Shawshank Redemption",
      "overview": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      "director": "Frank Darabont"
    },
    {
      "id": 5,
      "title": "The Godfather",
      "overview": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      "director": "Francis Ford Coppola"
    },
    {
      "id": 6,
      "title": "Fight Club",
      "overview": "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
      "director": "David Fincher"
    },
    {
      "id": 7,
      "title": "The Matrix",
      "overview": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      "director": "Lana and Lilly Wachowski"
    },
    {
      "id": 8,
      "title": "Goodfellas",
      "overview": "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
      "director": "Martin Scorsese"
    },
    {
      "id": 9,
      "title": "Interstellar",
      "overview": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      "director": "Christopher Nolan"
    },
    {
      "id": 10,
      "title": "The Silence of the Lambs",
      "overview": "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
      "director": "Jonathan Demme"
    },
    {
      "id": 11,
      "title": "Blade Runner 2049",
      "overview": "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
      "director": "Denis Villeneuve"
    },
    {
      "id": 12,
      "title": "The Avengers",
      "overview": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
      "director": "Joss Whedon"
    },
    {
      "id": 13,
      "title": "Parasite",
      "overview": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      "director": "Bong Joon-ho"
    },
    {
      "id": 14,
      "title": "Joker",
      "overview": "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
      "director": "Todd Phillips"
    },
    {
      "id": 15,
      "title": "Avatar",
      "overview": "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
      "director": "James Cameron"
    },
    {
      "id": 16,
      "title": "Titanic",
      "overview": "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
      "director": "James Cameron"
    },
    {
      "id": 17,
      "title": "Mad Max: Fury Road",
      "overview": "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
      "director": "George Miller"
    },
    {
      "id": 18,
      "title": "The Incredibles",
      "overview": "A family of undercover superheroes, while trying to live the quiet suburban life, are forced into action to save the world.",
      "director": "Brad Bird"
    },
    {
      "id": 19,
      "title": "Spirited Away",
      "overview": "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
      "director": "Hayao Miyazaki"
    },
    {
      "id": 20,
      "title": "The Lion King",
      "overview": "Lion cub and future king Simba searches for his identity. His eagerness to please others and penchant for testing his boundaries sometimes gets him into trouble.",
      "director": "Roger Allers, Rob Minkoff"
    },
    {
      "id": 21,
      "title": "The Social Network",
      "overview": "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea, and by the co-founder who was later squeezed out of the business.",
      "director": "David Fincher"
    },
    {
      "id": 22,
      "title": "Whiplash",
      "overview": "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
      "director": "Damien Chazelle"
    },
    {
      "id": 23,
      "title": "Get Out",
      "overview": "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
      "director": "Jordan Peele"
    },
    {
      "id": 24,
      "title": "The Grand Budapest Hotel",
      "overview": "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
      "director": "Wes Anderson"
    },
    {
      "id": 25,
      "title": "Forrest Gump",
      "overview": "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
      "director": "Robert Zemeckis"
    },
    {
      "id": 26,
      "title": "The Lord of the Rings: The Fellowship of the Ring",
      "overview": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
      "director": "Peter Jackson"
    },
    {
      "id": 27,
      "title": "Dune",
      "overview": "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
      "director": "Denis Villeneuve"
    },
    {
      "id": 28,
      "title": "No Time to Die",
      "overview": "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.",
      "director": "Cary Joji Fukunaga"
    },
    {
      "id": 29,
      "title": "The Green Mile",
      "overview": "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
      "director": "Frank Darabont"
    },
    {
      "id": 30,
      "title": "Eternal Sunshine of the Spotless Mind",
      "overview": "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.",
      "director": "Michel Gondry"
    }
  ]
};

// Use high-quality official movie poster images
const POSTER_URLS = [
  "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", // Blade Runner 2049
  "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // The Dark Knight
  "https://image.tmdb.org/t/p/w500/mSJgxrTaTgDSOoggIPcj3ZoZswT.jpg", // Inception
  "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", // The Shawshank Redemption
  "https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg", // The Godfather
  "https://image.tmdb.org/t/p/w500/vd9H19f3V0LL9psqSeGhjjng2MD.jpg", // Pulp Fiction
  "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", // Fight Club
  "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", // Parasite
  "https://image.tmdb.org/t/p/w500/wnUAcUrMRTifG8cHqtby8fAVKpd.jpg", // Joker
  "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg", // Interstellar
  "https://image.tmdb.org/t/p/w500/oirRvAthLqXeEpwpEDNhiQBU0g6.jpg", // Avengers: Endgame
  "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", // The Matrix
  "https://image.tmdb.org/t/p/w500/i0yw1mFbB7sNGHCs7EXZPzFkdA1.jpg"  // Dune
];

async function fetchMovies() {
  try {
    console.log('Loading movies from local data...');
    
    // Add default categories
    const defaultCategories = [
      "Action", "Adventure", "Animation", "Comedy", "Crime", 
      "Documentary", "Drama", "Family", "Fantasy", "History", 
      "Horror", "Music", "Mystery", "Romance", "Science Fiction", 
      "Thriller", "War", "Western"
    ];
    
    for (const categoryName of defaultCategories) {
      await storage.createCategory({ name: categoryName });
    }
    
    // Use local movie data
    const moviesData = movieData.results || [];
    
    const categories = await storage.getCategories();
    
    let movieCount = 0;
    for (const movieData of moviesData) {
      // Assign a random category
      const randomCategoryIndex = Math.floor(Math.random() * categories.length);
      const category = categories[randomCategoryIndex];
      
      // Randomly assign as released or upcoming
      const isReleased = Math.random() > 0.2; // 80% chance of being released
      
      // Get release date (either past or future based on isReleased)
      const currentDate = new Date();
      let releaseDate;
      
      if (isReleased) {
        // Released movie (past date)
        const pastDays = Math.floor(Math.random() * 365 * 2); // Up to 2 years in the past
        releaseDate = new Date(currentDate);
        releaseDate.setDate(releaseDate.getDate() - pastDays);
      } else {
        // Upcoming movie (future date)
        const futureDays = Math.floor(Math.random() * 365); // Up to 1 year in the future
        releaseDate = new Date(currentDate);
        releaseDate.setDate(releaseDate.getDate() + futureDays);
      }
      
      // Match movie title with appropriate poster when possible
      let posterUrl = "";
      if (movieData.title === "Blade Runner 2049") posterUrl = POSTER_URLS[0];
      else if (movieData.title === "The Dark Knight") posterUrl = POSTER_URLS[1];
      else if (movieData.title === "Inception") posterUrl = POSTER_URLS[2];
      else if (movieData.title === "The Shawshank Redemption") posterUrl = POSTER_URLS[3];
      else if (movieData.title === "The Godfather") posterUrl = POSTER_URLS[4]; 
      else if (movieData.title === "Pulp Fiction") posterUrl = POSTER_URLS[5];
      else if (movieData.title === "Fight Club") posterUrl = POSTER_URLS[6];
      else if (movieData.title === "Parasite") posterUrl = POSTER_URLS[7];
      else if (movieData.title === "Joker") posterUrl = POSTER_URLS[8];
      else if (movieData.title === "Interstellar") posterUrl = POSTER_URLS[9];
      else if (movieData.title === "The Avengers") posterUrl = POSTER_URLS[10];
      else if (movieData.title === "The Matrix") posterUrl = POSTER_URLS[11];
      else if (movieData.title === "Dune") posterUrl = POSTER_URLS[12];
      else {
        // For other movies, assign a random poster from collection
        const posterIndex = Math.floor(Math.random() * POSTER_URLS.length);
        posterUrl = POSTER_URLS[posterIndex];
      }
      
      // Create the movie
      await storage.createMovieIfNotExists({
        title: movieData.title,
        description: movieData.overview,
        imageUrl: posterUrl,
        releaseDate: releaseDate,
        isReleased: isReleased,
        categoryId: category.id,
        tmdbId: movieData.id,
        rating: (Math.random() * 3 + 2).toFixed(1), // Random rating between 2.0 and 5.0
        director: movieData.director || 'Various'
      });
      
      movieCount++;
    }
    
    console.log(`Successfully added ${movieCount} movies`);
  } catch (error) {
    console.error('Error loading movies:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  app.use(session({
    secret: 'movie-hub-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  }));

  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.validateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user session
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      
      res.json({ 
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json({
      id: req.session.userId,
      isAdmin: req.session.isAdmin || false
    });
  });

  // Admin-only route to create a new user
  app.post("/api/auth/register", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(validatedData.data);
      
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        isAdmin: newUser.isAdmin
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Get all movies
  app.get("/api/movies", async (_req: Request, res: Response) => {
    try {
      const movies = await storage.getMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  // Get single movie by ID
  app.get("/api/movies/:id", async (req: Request, res: Response) => {
    try {
      const idParam = z.coerce.number().safeParse(req.params.id);
      if (!idParam.success) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const movie = await storage.getMovie(idParam.data);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  // Get movies by category
  app.get("/api/movies/category/:categoryId", async (req: Request, res: Response) => {
    try {
      const categoryIdParam = z.coerce.number().safeParse(req.params.categoryId);
      if (!categoryIdParam.success) {
        return res.status(400).json({ message: "Invalid category ID format" });
      }

      const movies = await storage.getMoviesByCategory(categoryIdParam.data);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies by category" });
    }
  });

  // Get movies by release status
  app.get("/api/movies/status/:isReleased", async (req: Request, res: Response) => {
    try {
      const isReleasedParam = z.coerce.boolean().safeParse(req.params.isReleased);
      if (!isReleasedParam.success) {
        return res.status(400).json({ message: "Invalid isReleased parameter" });
      }

      const movies = await storage.getReleasedMovies(isReleasedParam.data);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies by release status" });
    }
  });

  // Create a new movie (admin only)
  app.post("/api/movies", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertMovieSchema.safeParse(req.body);

      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      // Check if category exists
      const category = await storage.getCategory(validatedData.data.categoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const newMovie = await storage.createMovie(validatedData.data);
      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ message: "Failed to create movie" });
    }
  });

  // Update a movie (admin only)
  app.patch("/api/movies/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const idParam = z.coerce.number().safeParse(req.params.id);
      if (!idParam.success) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const movie = await storage.getMovie(idParam.data);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      // Update only the fields that are provided
      const partialSchema = insertMovieSchema.partial();
      const validatedData = partialSchema.safeParse(req.body);

      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      // If categoryId is provided, check if it exists
      if (validatedData.data.categoryId) {
        const category = await storage.getCategory(validatedData.data.categoryId);
        if (!category) {
          return res.status(400).json({ message: "Invalid category ID" });
        }
      }

      const updatedMovie = await storage.updateMovie(idParam.data, validatedData.data);
      res.json(updatedMovie);
    } catch (error) {
      res.status(500).json({ message: "Failed to update movie" });
    }
  });

  // Delete a movie (admin only)
  app.delete("/api/movies/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const idParam = z.coerce.number().safeParse(req.params.id);
      if (!idParam.success) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const movie = await storage.getMovie(idParam.data);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      const deleted = await storage.deleteMovie(idParam.data);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete movie" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete movie" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create a new category (admin only)
  app.post("/api/categories", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.safeParse(req.body);

      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      // Check if category already exists
      const existingCategory = await storage.getCategoryByName(validatedData.data.name);
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }

      const newCategory = await storage.createCategory(validatedData.data);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Special route to manually fetch movies (admin only)
  app.post("/api/fetch-movies", isAdmin, async (_req: Request, res: Response) => {
    try {
      await fetchMovies();
      res.json({ message: "Movies fetched successfully" });
    } catch (error) {
      console.error("Movie fetching error:", error);
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  const httpServer = createServer(app);
  
  // Automatically fetch movies when the server starts
  setTimeout(async () => {
    try {
      await fetchMovies();
    } catch (error) {
      console.error("Initial movie data setup error:", error);
    }
  }, 2000);
  
  return httpServer;
}
