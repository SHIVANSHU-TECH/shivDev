  "use client";
import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/work-experience", label: "Experience" },
  { href: "/client-work", label: "Client Work" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Set active link based on current path
    setActiveLink(window.location.pathname);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Close mobile menu when a link is clicked
  const handleLinkClick = (href: SetStateAction<string>) => {
    setActiveLink(href);
    setMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg" 
        : "py-4 bg-white dark:bg-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/">
          <div className="group flex items-center">
            <span className={`text-2xl font-bold transition-all duration-300 ${
              scrolled ? "text-blue-600 dark:text-blue-400" : "text-blue-700 dark:text-blue-300"
            } group-hover:text-blue-500`}>
              S<span className="text-gray-800 dark:text-gray-200">hivanshu</span>
            </span>
            <div className="ml-1 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 group-hover:animate-pulse"></div>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => handleLinkClick(link.href)}
            >
              <div className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeLink === link.href 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}>
                {link.label}
                {activeLink === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </div>
            </Link>
          ))}
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={16} className="text-yellow-500" />
            ) : (
              <Moon size={16} className="text-gray-700" />
            )}
          </button>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <nav className="flex flex-col px-6 pb-4 pt-2 bg-white dark:bg-gray-900 space-y-1">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => handleLinkClick(link.href)} 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeLink === link.href 
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}