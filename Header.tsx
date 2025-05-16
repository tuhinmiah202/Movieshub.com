import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Film, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/#movies" },
    { label: "Series", path: "/#series" },
    { label: "Upcoming", path: "/#upcoming" },
    { label: "Admin", path: "/admin" },
  ];
  
  return (
    <header className="bg-secondary shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <Film className="text-accent h-6 w-6" />
              <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-white">
                Movie<span className="text-accent">Hub</span>
              </h1>
            </a>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`text-white hover:text-accent transition-colors font-medium ${
                  location === item.path ? "text-accent" : ""
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search movies, series..."
                className="bg-[#0F172A] text-white rounded-full py-2 px-4 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-secondary border-l border-border p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Film className="text-accent h-5 w-5" />
                        <span className="text-xl font-montserrat font-bold text-white">
                          Movie<span className="text-accent">Hub</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2">
                    <div className="relative mt-2 mb-6">
                      <Input
                        type="text"
                        placeholder="Search movies, series..."
                        className="bg-neutral text-white pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    
                    <nav className="flex flex-col space-y-4">
                      {navItems.map((item) => (
                        <Link key={item.path} href={item.path}>
                          <a className={`text-white hover:text-accent transition-colors font-medium ${
                            location === item.path ? "text-accent" : ""
                          }`}>
                            {item.label}
                          </a>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
