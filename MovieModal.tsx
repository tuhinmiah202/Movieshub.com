import { useState, useEffect, useRef } from "react";
import { Star, X, Play, Plus } from "lucide-react";
import { Movie, Category } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MovieModalProps {
  movie: Movie | null;
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieModal({ movie, category, isOpen, onClose }: MovieModalProps) {
  if (!movie) return null;
  
  const formattedDate = format(new Date(movie.releaseDate), 'MMMM dd, yyyy');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-secondary w-full max-w-4xl p-0 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5">
            <img 
              src={movie.imageUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="md:w-3/5 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <div className="flex items-center">
                {movie.rating && (
                  <>
                    <Star className="h-5 w-5 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="text-white font-medium">{movie.rating}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <Badge variant="secondary" className="bg-neutral text-white">
                  {category.name}
                </Badge>
              )}
            </div>
            
            <div className="mb-4">
              <span className="text-sm text-gray-400">Release Date: </span>
              <span className="text-white">{formattedDate}</span>
            </div>
            
            <p className="text-gray-300 mb-6">
              {movie.description}
            </p>
            
            {movie.director && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2">Cast & Crew</h3>
                <p className="text-gray-300">
                  <span className="text-gray-400">Director:</span> {movie.director}
                </p>
              </div>
            )}
            
            <div className="flex space-x-4">
              <Button className="bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors flex items-center">
                <Play className="mr-2 h-4 w-4" /> Watch Trailer
              </Button>
              <Button variant="outline" className="border-white hover:border-accent text-white hover:text-accent rounded-lg transition-colors flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
