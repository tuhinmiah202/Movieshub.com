import { Movie, Category } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface MovieCardProps {
  movie: Movie;
  category?: Category;
  isFeatured?: boolean;
  onDetailsClick: (movie: Movie) => void;
}

export default function MovieCard({ 
  movie, 
  category, 
  isFeatured = false,
  onDetailsClick 
}: MovieCardProps) {
  const releaseYear = new Date(movie.releaseDate).getFullYear();
  
  return (
    <div className="movie-card bg-card rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className="w-full h-72 object-cover" 
        />
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
            Featured
          </div>
        )}
        {category && (
          <div className="absolute top-2 right-2 bg-neutral/80 text-white text-xs px-2 py-1 rounded">
            {category.name}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white line-clamp-1">{movie.title}</h3>
          <Badge variant="secondary" className="bg-neutral text-white">
            {releaseYear}
          </Badge>
        </div>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{movie.description}</p>
        <div className="flex justify-between items-center">
          {movie.rating ? (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
              <span className="text-white">{movie.rating}</span>
            </div>
          ) : (
            <div></div>
          )}
          <Button 
            variant="outline" 
            className="text-accent hover:text-white hover:bg-accent border-accent rounded-full text-sm px-3 py-1 h-auto"
            onClick={() => onDetailsClick(movie)}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
