import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Film, 
  ArrowRight, 
  SortDesc, 
  LayoutGrid, 
  List 
} from "lucide-react";
import { Movie, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/MovieCard";
import UpcomingMovieCard from "@/components/UpcomingMovieCard";
import MovieModal from "@/components/MovieModal";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch all movies
  const { data: movies = [] } = useQuery<Movie[]>({
    queryKey: ['/api/movies'],
  });
  
  // Fetch all categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch upcoming movies (isReleased = false)
  const { data: upcomingMovies = [] } = useQuery<Movie[]>({
    queryKey: ['/api/movies/status/false'],
  });
  
  // Filter released movies
  const releasedMovies = movies.filter(movie => movie.isReleased);
  
  // Get movies based on selected category
  const filteredMovies = selectedCategory !== null
    ? releasedMovies.filter(movie => movie.categoryId === selectedCategory)
    : releasedMovies;
    
  // Top 4 movies for featured section
  const featuredMovies = releasedMovies
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 4);
  
  // Show movie details
  const handleShowDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  
  // Get category by ID
  const getCategoryById = (categoryId: number) => {
    return categories.find(category => category.id === categoryId);
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/70"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4">
              Discover Amazing Movies & Series
            </h2>
            <p className="text-lg text-gray-200 mb-8">
              Explore our vast collection of handpicked movies and series. Find your next favorite entertainment!
            </p>
            <div className="flex space-x-4">
              <Link href="#movies">
                <a className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-block">
                  Browse Movies
                </a>
              </Link>
              <Link href="#categories">
                <a className="bg-transparent border-2 border-white hover:border-accent text-white hover:text-accent font-medium px-6 py-3 rounded-lg transition-colors inline-block">
                  Categories
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Filters */}
      <section id="categories" className="py-8 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-2xl font-montserrat font-bold text-white">Categories</h2>
            <div className="flex space-x-3">
              <Button variant="secondary" className="text-sm bg-neutral hover:bg-neutral/80 text-white">
                <SortDesc className="mr-2 h-4 w-4" /> Newest
              </Button>
              <Button variant="secondary" className="text-sm bg-neutral hover:bg-neutral/80 text-white">
                <LayoutGrid className="mr-2 h-4 w-4" /> Grid
              </Button>
              <Button variant="secondary" className="text-sm bg-neutral hover:bg-neutral/80 text-white">
                <List className="mr-2 h-4 w-4" /> List
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              onClick={() => setSelectedCategory(null)}
              className={`category-btn px-4 py-2 rounded-full text-sm font-medium 
                ${selectedCategory === null ? 'bg-accent text-white' : 'bg-neutral hover:bg-accent text-white'}`}
            >
              All
            </Button>
            
            {categories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn px-4 py-2 rounded-full text-sm font-medium 
                  ${selectedCategory === category.id ? 'bg-accent text-white' : 'bg-neutral hover:bg-accent text-white'}`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Movies */}
      <section id="featured" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-montserrat font-bold text-white mb-8">Featured Movies</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                category={getCategoryById(movie.categoryId)}
                isFeatured={true}
                onDetailsClick={handleShowDetails}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Movies */}
      <section id="movies" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-montserrat font-bold text-white">Latest Movies</h2>
            <Link href="#all-movies">
              <a className="text-accent hover:underline flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                category={getCategoryById(movie.categoryId)}
                onDetailsClick={handleShowDetails}
              />
            ))}
            
            {filteredMovies.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <Film className="h-16 w-16 mx-auto text-neutral mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No movies found</h3>
                <p className="text-gray-400">
                  {selectedCategory 
                    ? "No movies found in this category. Try a different category."
                    : "No movies have been added yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Upcoming Section */}
      <section id="upcoming" className="py-12 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-montserrat font-bold text-white mb-8">Upcoming Releases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingMovies.map(movie => (
              <UpcomingMovieCard 
                key={movie.id} 
                movie={movie}
                category={getCategoryById(movie.categoryId)}
                onDetailsClick={handleShowDetails}
              />
            ))}
            
            {upcomingMovies.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <Film className="h-16 w-16 mx-auto text-secondary mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No upcoming movies</h3>
                <p className="text-gray-400">
                  There are no upcoming movies scheduled at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Movie Details Modal */}
      <MovieModal 
        movie={selectedMovie} 
        category={selectedMovie ? getCategoryById(selectedMovie.categoryId) : undefined}
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
}
