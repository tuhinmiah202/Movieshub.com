import { Movie, Category } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";
import { format } from "date-fns";

interface UpcomingMovieCardProps {
  movie: Movie;
  category?: Category;
  onDetailsClick: (movie: Movie) => void;
}

export default function UpcomingMovieCard({ 
  movie, 
  category,
  onDetailsClick 
}: UpcomingMovieCardProps) {
  const formattedDate = format(new Date(movie.releaseDate), 'MMMM yyyy');
  
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
      <div className="md:w-1/3">
        <img 
          src={movie.imageUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="md:w-2/3 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
          <Badge variant="default" className="bg-accent text-white">
            Coming Soon
          </Badge>
        </div>
        <div className="mb-2">
          <Badge variant="secondary" className="bg-neutral text-white">
            {formattedDate}
          </Badge>
        </div>
        <p className="text-gray-300 text-sm mb-4">{movie.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {movie.director ? `Director: ${movie.director}` : ''}
          </span>
          <Button 
            variant="outline" 
            className="text-accent hover:text-white hover:bg-accent border-accent rounded-full text-sm"
            onClick={() => onDetailsClick(movie)}
          >
            <BellRing className="mr-1 h-4 w-4" /> 
            Notify Me
          </Button>
        </div>
      </div>
    </div>
  );
}
