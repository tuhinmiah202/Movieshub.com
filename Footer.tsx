import { Link } from "wouter";
import { Film, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-secondary py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Film className="text-accent h-6 w-6" />
              <h2 className="text-xl font-montserrat font-bold text-white">
                Movie<span className="text-accent">Hub</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your ultimate destination for movies and series recommendations. 
              Discover, explore, and watch the best content available.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-accent transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/#movies">
                  <a className="text-gray-400 hover:text-accent transition-colors">Movies</a>
                </Link>
              </li>
              <li>
                <Link href="/#series">
                  <a className="text-gray-400 hover:text-accent transition-colors">Series</a>
                </Link>
              </li>
              <li>
                <Link href="/#upcoming">
                  <a className="text-gray-400 hover:text-accent transition-colors">Upcoming</a>
                </Link>
              </li>
              <li>
                <Link href="/#categories">
                  <a className="text-gray-400 hover:text-accent transition-colors">Categories</a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a className="text-gray-400 hover:text-accent transition-colors">Admin</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get updates on new releases and special features.
            </p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-neutral border border-gray-600 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-accent flex-grow rounded-r-none"
              />
              <Button className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-r-md rounded-l-none">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} MovieHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
