 "use client";
import { useState, useEffect } from "react";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  ArrowUp, 
  Heart
} from "lucide-react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Show elements on scroll
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Social links with hover effects
  const socialLinks = [
    { icon: <Github size={20} />, href: "https://github.com/shivanshu-tech", color: "hover:text-gray-900 dark:hover:text-white" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com/in/shivanshu", color: "hover:text-blue-600" },
    { icon: <Twitter size={20} />, href: "#", color: "hover:text-blue-400" },
    { icon: <Instagram size={20} />, href: "#", color: "hover:text-pink-600" },
    { icon: <Mail size={20} />, href: "mailto:hello@shivanshu.dev", color: "hover:text-red-500" }
  ];
  
  // Footer links
  const footerLinks = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Resume", href: "/resume" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" }
  ];
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 z-40 ${
          showScrollTop ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
      
      {/* Wavy divider */}
      <div className="relative w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-blue-600 dark:fill-blue-700">
          <path d="M0,64L60,58.7C120,53,240,43,360,42.7C480,43,600,53,720,64C840,75,960,85,1080,80C1200,75,1320,53,1380,42.7L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Main footer */}
      <footer className="bg-blue-600 dark:bg-blue-800 text-white pt-12 pb-6 relative">
        <div className={`max-w-7xl mx-auto px-6 opacity-0 transform translate-y-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : ""
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* About section */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-1">S</span>hivanshu
              </h3>
              <p className="text-blue-100 dark:text-blue-200 mb-4 text-sm">
                Creating impactful digital experiences through innovative web development and solving complex problems with clean, efficient code.
              </p>
              <div className="flex space-x-3 mt-6">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-blue-700 dark:bg-blue-900 text-blue-100 rounded-full transition-all duration-300 transform hover:-translate-y-1 ${link.color}`}
                    aria-label={`Link to ${link.href}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-blue-100 dark:text-blue-200 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="inline-block w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
              <p className="text-blue-100 dark:text-blue-200 text-sm mb-4">
                Subscribe to my newsletter for the latest updates on projects, blogs, and tech insights.
              </p>
              <form className="flex mt-4">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800 text-sm" 
                />
                <button 
                  type="submit" 
                  className="bg-gray-900 dark:bg-gray-800 px-4 py-2 rounded-r-md hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-blue-500 dark:border-blue-600 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="flex items-center mb-4 md:mb-0">
              © 2025 Shivanshu Shukla. Made with <Heart size={14} className="mx-1 text-red-400 animate-pulse" /> in India
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-blue-100 hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="/terms" className="text-blue-100 hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="/sitemap" className="text-blue-100 hover:text-white transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}