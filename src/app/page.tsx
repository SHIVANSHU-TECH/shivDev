"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Menu, X, Moon, Sun, ChevronDown, Github, Linkedin, Twitter, Mail, 
  Code, Briefcase, User, FileText, SendHorizonal, ArrowRight, ExternalLink, 
  Star, Download, Monitor, Database, Terminal
} from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, Stars, OrbitControls, PerspectiveCamera, 
  useGLTF, Text3D, MeshDistortMaterial, Text,useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import "./global.css";
import { div, video } from 'framer-motion/client';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Particles from "../components/particles";


// 3D Text Component
const AnimatedText3D = ({ text }: { text: string }) => {
  const ref = useRef<THREE.Object3D>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = Math.sin(t) * 0.1;
    }
  });
  
  
  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        ref={ref}
        font="/fonts/inter-bold.woff"
        fontSize={0.75}
        color="#4f46e5"
        position={[0, 0, 0]}
        maxWidth={10}
        textAlign="center"
      >
        {text}
        <meshStandardMaterial 
          color="#4f46e5"
          emissive="#2563eb"
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.2}
        />
      </Text>
    </Float>
  );
};

const SkillsOrb = ({ skill, position }: { skill: string; position: [number, number, number] }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.005;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position} ref={mesh}>
        <icosahedronGeometry args={[0.5, 1]} />
        <MeshDistortMaterial
          color="#4f46e5"
          emissive="#2563eb"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
        <Text
          position={[0, 0, 0.8]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {skill}
        </Text>
      </mesh>
    </Float>
  );
};

const SkillsCanvas = () => {
  const skills = ['React', 'Node', 'TS', 'Next', 'AWS', 'Mongo', 'Docker'];
  const positions = skills.map((_, i) => [
    Math.sin((i / skills.length) * Math.PI * 2) * 3,
    Math.cos((i / skills.length) * Math.PI * 2) * 3,
    0
  ]);

  return (
    <Canvas className="absolute inset-0 h-full w-full"
    gl={{
      antialias: true,
      powerPreference: "high-performance",
    }}
    onCreated={({ gl }) => {
      gl.setSize(window.innerWidth, window.innerHeight);
    }}>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {skills.map((skill, i) => (
        <SkillsOrb key={skill} skill={skill} position={positions[i] as [number, number, number]} />
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </Canvas>
  );
};

// 3D Environment
const Environment = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

// 3D Sphere Component
const AnimatedSphere = ({ 
  position, 
  color = "#4f46e5", 
  emissive = "#2563eb" 
}: {
  position: THREE.Vector3 | [number, number, number];
  color?: string;
  emissive?: string;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
        distort={0.4}
        speed={4}
      />
    </mesh>
  );
};

// HeroCanvas Component
const HeroCanvas = () => {
  return (
    <Canvas className="absolute inset-4 "
    gl={{
      antialias: true,
      powerPreference: "high-performance",
    }}
    onCreated={({ gl }) => {
      gl.setSize(window.innerWidth, window.innerHeight);
    }}>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <Environment />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <AnimatedSphere position={[0, 0, 0]} />
      <AnimatedText3D text="Shivanshu.dev" />
    </Canvas>
  );
};

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { // Add MouseEvent type
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleLinkHoverEvents = () => {
      document.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("mouseenter", () => setLinkHovered(true));
        el.addEventListener("mouseleave", () => setLinkHovered(false));
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    handleLinkHoverEvents();
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  
  const cursorVariants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      height: 32,
      width: 32,
    },
    link: {
      x: position.x - 32,
      y: position.y - 32,
      height: 64,
      width: 64,
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      borderColor: "rgba(79, 70, 229, 0.5)",
    },
    clicked: {
      x: position.x - 16,
      y: position.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(79, 70, 229, 0.5)",
    }
  };
  
  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-600 pointer-events-none z-50 hidden md:block"
      variants={cursorVariants}
      animate={clicked ? "clicked" : linkHovered ? "link" : "default"}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
};

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check system preferences for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Home', href: '#home', icon: <User size={16} /> },
    { name: 'About', href: '#about', icon: <User size={16} /> },
    { name: 'Projects', href: '#projects', icon: <Code size={16} /> },
    { name: 'Experience', href: '#experience', icon: <Briefcase size={16} /> },
    { name: 'Contact', href: '#contact', icon: <Mail size={16} /> },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
                Shivanshu<span className="text-blue-600 dark:text-blue-500">.dev</span>
              </span>
            </a>
          </motion.div>
          
          <motion.div 
            className="hidden md:block"
            initial="hidden"
            animate="visible"
            variants={navVariants}
          >
            <div className="flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.3, delay: index * 0.1 }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: darkMode ? "rgba(79, 70, 229, 0.2)" : "rgba(79, 70, 229, 0.1)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1"
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: darkMode ? 180 : 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-transform"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="hidden md:flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white font-medium shadow-lg hover:bg-indigo-700 transition-colors"
            >
              <span>Let's Talk</span>
              <SendHorizonal size={16} className="ml-2" />
            </motion.a>
            
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ x: 5, backgroundColor: darkMode ? "rgba(79, 70, 229, 0.2)" : "rgba(79, 70, 229, 0.1)" }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </motion.a>
              ))}
              <motion.a
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 mt-4 px-3 py-2 rounded-full bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-colors"
              >
                <span>Let's Talk</span>
                <SendHorizonal size={16} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Scroll Progress Indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-50 origin-left"
      style={{ scaleX }}
    />
  );
};

// Hero Section
const HeroSection = () => {
  const controls = useRef<HTMLDivElement>(null);
  
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-16">
      {/* 3D Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30 dark:opacity-60">
          <HeroCanvas />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full mb-4"
              >
                Full-Stack Developer & Entrepreneur
              </motion.span>
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="block text-gray-900 dark:text-white"
                >
                  Hi, I'm
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                  className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-transparent bg-clip-text font-black"
                >
                  Shivanshu Shukla
                </motion.span>
              </h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl max-w-xl">
                  I craft digital experiences that blend creativity with technical excellence. Building innovative solutions that transform ideas into reality.
                </p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.1 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#contact"
                    className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium shadow-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Get in Touch</span>
                    <SendHorizonal size={18} />
                  </motion.a>
                  
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#projects"
                    className="px-6 py-3 rounded-full bg-white text-indigo-600 font-medium shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700/80 transition-colors flex items-center space-x-2"
                  >
                    <span>View Projects</span>
                    <ArrowRight size={18} />
                  </motion.a>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.7 }}
                  className="mt-8 flex items-center space-x-4"
                >
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Connect with me:</span>
                  
                  {[
                    { icon: <Github size={18} />, href: '#', label: 'GitHub' },
                    { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
                    { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
                    { icon: <Mail size={18} />, href: '#', label: 'Email' }
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      whileHover={{ y: -3, backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                      href={social.href}
                      className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-full"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-full opacity-70 blur-3xl"></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 rounded-3xl p-1 shadow-2xl"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 backdrop-blur-sm">
                    <img
                      src="/images/shivansh.jpeg"
                      alt="Shivanshu Shukla"
                      className="w-full h-auto rounded-2xl shadow-lg"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
        <motion.a
          href="#about"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <span className="text-sm font-medium mb-1">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
    
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white inline-block relative">
            About Me
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 via-blue-500 to-purple-600 rounded-lg transform rotate-6 opacity-70 blur-sm"></div>
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 rounded-lg transform -rotate-2 opacity-70 blur-sm"></div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative z-10"
              >
                <img 
                  src="/images/shivanshu.jpeg" 
                  alt="About Shivanshu" 
                  className="relative z-10 rounded-lg shadow-2xl w-full"
                />
              </motion.div>
              
              <motion.div 
                className="absolute -right-6 -bottom-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl z-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">B.Tech in Computer Science</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-bold">GPA 4.0</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8 lg:col-span-7"
          >
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Digital Craftsman & Problem Solver
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300">
                I'm Shivanshu Shukla, a passionate full-stack developer and startup founder. I completed my B.Tech in Computer Science from GGSIPU with a perfect GPA of 4.0, fueled by a love for creating impactful digital experiences.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300">
                My journey in technology started with a fascination for how digital solutions could transform businesses and lives. Through my internships at Salesforce, Mittiland, GDSC, and Vital-Vistara, I've gained valuable experience across the development stack, from crafting intuitive front-end interfaces to building robust back-end systems.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300">
                Currently, I'm building <span className="font-bold text-indigo-600 dark:text-indigo-400">College X Connect</span> — a comprehensive platform revolutionizing how students access resources, connect with internships, and prepare for their careers. My goal is to create technology that genuinely makes a difference.
              </p>
            </div>
            
            {/* Skills & Experience Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical Skills Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20">
                <SkillsCanvas />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Code size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 
                    'Tailwind CSS', 'GraphQL', 'Firebase', 'AWS', 'Docker'
                  ].map((skill) => (
                    <motion.span 
                      key={skill}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.2)" }}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

              {/* Experience Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Briefcase size={20} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Experience
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">Salesforce</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300">Frontend Developer Intern</span>
                    <span className="ml-auto text-gray-500 dark:text-gray-400">2023</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">GDSC</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300">Full Stack Developer</span>
                    <span className="ml-auto text-gray-500 dark:text-gray-400">2022</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">Mittiland</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300">Developer Intern</span>
                    <span className="ml-auto text-gray-500 dark:text-gray-400">2022</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">Vital-Vistara</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300">Backend Developer</span>
                    <span className="ml-auto text-gray-500 dark:text-gray-400">2021</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/files/resume.pdf"
                className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium shadow-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <span>Download Resume</span>
                <Download size={18} />
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="px-6 py-3 rounded-full bg-white text-indigo-600 font-medium shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700/80 transition-colors flex items-center space-x-2"
              >
                <span>Let's Connect</span>
                <SendHorizonal size={18} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const ProjectCard3D = ({ project }: { project: any }) => {
  return (
    <Canvas className="absolute inset-0 w-full h-full
    " gl={{
      antialias: true,
      powerPreference: "high-performance",
    }}
    onCreated={({ gl }) => {
      gl.setSize(window.innerWidth, window.innerHeight);
    }}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <boxGeometry args={[3, 2, 0.2]} />
          <meshStandardMaterial 
            color="#4f46e5"
            metalness={0.5}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
          <Text
            position={[0, 0, 0.15]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {project.title}
          </Text>
        </mesh>
      </Float>
    </Canvas>
  );
};


// Projects Section
const ProjectsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'ui', name: 'UI/UX Design' }
  ];
  
  const projects = [
    {
      id: 1,
      title: 'Crypto currency Price',
      description: 'A comprehensive platform connecting students with resources, internships and career opportunities.',
      category: 'web',
      video: '/video/crypto.mp4', // Changed to video with extension
      hasVideo: true, // Flag to indicate this is a video
      tags: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: 'https://virtual-currency.netlify.app/',
      featured: true
    },
    {
      id: 2,
      title: 'notes making',
      description: 'Intuitive project management application with real-time collaboration features.',
      category: 'web',
      video: '/video/notes.mp4', // Changed to video with extension
      hasVideo: true, // Flag to indicate this is a video
      tags: ['React', 'Firebase', 'Tailwind CSS'],
      link: 'https://shivanshu-tech.github.io/notes-making-app/'
    },
    {
      id: 3,
      title: 'english dictionary',
      description: 'Fitness tracking mobile application with personalized workout plans and progress analytics.',
      category: 'mobile',
      video: '/video/EngDic.mp4', // Changed to video with extension
      hasVideo: true, // Flag to indicate this is a video
      tags: ['Html', 'Css', 'JS'],
      link: 'https://shivanshu-tech.github.io/dictionary-App/'
    },
    {
      id: 4,
      title: 'Gym Website ',
      description: 'Modern e-commerce interface design focusing on sustainable product shopping experience.',
      category: 'ui',
      video: '/video/gym.mp4',
      hasVideo: true,
      tags: ['Figma', 'UI/UX', 'Prototype'],
      link: 'https://flexigym.netlify.app/'
    },
    {
      id: 5,
      title: 'Password Generator',
      description: 'Interactive weather visualization dashboard with forecast data and historical comparisons.',
      category: 'web',
      image: '/video/PasswordGen.mp4',
      hasVideo: true,
      tags: ['JavaScript', 'D3.js', 'API Integration'],
      link: '#'
    },
    {
      id: 6,
      title: 'MediConnect App',
      description: 'Healthcare mobile application connecting patients with doctors for virtual consultations.',
      category: 'mobile',
      image: '/images/projects/mediconnect.jpg',
      hasVideo: false,
      tags: ['Flutter', 'Firebase', 'WebRTC'],
      link: '#'
    }
  ];
  
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);
  
  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
          
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className={`bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl relative h-64 
          `}
        >
          <div className="absolute inset-0 opacity-30">
            <ProjectCard3D project={projects} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white inline-block relative">
            My Projects
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore my portfolio of projects spanning web applications, mobile apps, and UI/UX designs.
          </p>
        </motion.div>
        
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 p-2 rounded-xl">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
        
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl ${
                  project.featured ? 'md:col-span-2' : ''
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
                    {project.hasVideo ? (
                      <video
                        src={project.video}
                        title={project.title}
                        className="w-full h-full object-cover transform transition-transform hover:scale-110 duration-500"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform transition-transform hover:scale-110 duration-500"
                      />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
                    
                    <motion.a
                      whileHover={{ x: 5 }}
                      href={project.link}
                      className="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                      <span>View Project</span>
                      <ExternalLink size={16} className="ml-1" />
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-12 text-center">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/SHIVANSHU-TECH"
            className="inline-flex items-center px-6 py-3 rounded-full bg-white text-indigo-600 font-medium shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700/80 transition-colors"
          >
            <Github size={18} className="mr-2" />
            <span>View More on GitHub</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

// Experience Section
const ExperienceSection = () => {
  const experiences = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'Salesforce',
      period: 'May 2023 - Aug 2023',
      location: 'San Francisco, CA (Remote)',
      description: 'Developed and maintained responsive UI components using React and Lightning Design System. Implemented state management solutions with Redux and collaborated with back-end teams to integrate APIs.',
      skills: ['React', 'Redux', 'SLDS', 'Jest', 'Apex'],
      icon: <Monitor />
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Google Developer Student Club (GDSC)',
      period: 'Aug 2022 - Apr 2023',
      location: 'Delhi, India',
      description: 'Led a team of 5 developers to build web applications for student community. Organized workshops on modern web technologies and mentored junior developers.',
      skills: ['Next.js', 'Firebase', 'Tailwind CSS', 'MongoDB'],
      icon: <Code />
    },
    {
      id: 3,
      title: 'Developer Intern',
      company: 'Mittiland',
      period: 'Jan 2022 - May 2022',
      location: 'Bangalore, India (Remote)',
      description: 'Built RESTful APIs using Node.js and Express. Integrated payment gateways and implemented authentication systems. Optimized database queries for improved performance.',
      skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
      icon: <Database />
    },
    {
      id: 4,
      title: 'Backend Developer',
      company: 'Vital-Vistara',
      period: 'Jun 2021 - Dec 2021',
      location: 'Mumbai, India (Remote)',
      description: 'Implemented server-side logic and designed database schemas. Developed microservices architecture for scalable applications. Deployed applications using Docker and AWS.',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'AWS'],
      icon: <Terminal />
    }
  ];

  const TimelineNode3D = ({ active }: { active: boolean }) => {
    const mesh = useRef<THREE.Mesh>(null);
    
    useFrame(() => {
      if (mesh.current) {
        mesh.current.rotation.y += 0.01;
      }
    });
  
    return (
      <mesh ref={mesh}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial 
          color={active ? "#4f46e5" : "#6b7280"}
          emissive={active ? "#2563eb" : "#4b5563"}
          emissiveIntensity={active ? 0.8 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    );
  };


  const Particles = ({ count = 200 }:{ count ?: number }) => {
    const particles = useRef<THREE.Points>(null);
    
    useFrame(() => {
      if (particles.current) {
        particles.current.rotation.x += 0.0005;
        particles.current.rotation.y += 0.001;
      }
    });
  
    const positions = useMemo(() => {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }
      return positions;
    }, [count]);

    return (
      <points ref={particles}>
        <bufferGeometry attach="geometry">
          <primitive
          attach="attributes-position"
          object={new THREE.BufferAttribute(positions, 3)}
        />

        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#4f46e5"
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>
    );
  };
  
  
  
  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white inline-block relative">
            Work Experience
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            My professional journey through various roles and companies in the tech industry.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10">
            <Canvas className="w-full h-full"
            gl={{
              antialias: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.setSize(window.innerWidth, window.innerHeight);
            }}>
              <PerspectiveCamera makeDefault position={[0, 0, 3]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <TimelineNode3D active={true} />
            </Canvas>
          </div>
          
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } md:items-center`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg z-10">
                  <Canvas className="w-full h-full" gl={{
                      antialias: true,
                      powerPreference: "high-performance",
                    }}
                    onCreated={({ gl }) => {
                      gl.setSize(window.innerWidth, window.innerHeight);
                    }}>
                    <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <TimelineNode3D active={index === 0} />
                  </Canvas>
                </div>
                
                <div className={`pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} md:w-1/2`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl"
                  >
                    <div className="flex flex-col md:items-end">
                      <span className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full mb-2">
                        {exp.period}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                      <div className="text-indigo-600 dark:text-indigo-400 font-medium">{exp.company}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">{exp.location}</div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{exp.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
                
                <div className={`hidden md:block md:w-1/2`}></div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/files/resume.pdf"
            className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-medium shadow-xl hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} className="mr-2" />
            <span>Download Full Resume</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

// Contact Form Component
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Thanks for your message! I\'ll get back to you soon.'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <section id="contact" className="py-20">

            <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <Particles count={500} />
                <EffectComposer>
                  <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
                </EffectComposer>
              </Canvas>
            </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white inline-block relative">
            Get In Touch
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Have a project in mind or just want to say hello? I'd love to hear from you!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5"
          >
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl h-full">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Discuss Your Project
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                I'm always open to new opportunities, collaborations, and interesting projects. Fill out the form or reach out directly through any of the channels below.
              </p>
              
              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Mail size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Email</h4>
                    <a href="mailto:hello@shivanshu.dev" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      hello@shivanshu.dev
                    </a>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Linkedin size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">LinkedIn</h4>
                    <a href="https://linkedin.com/in/shivanshu-dev" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      linkedin.com/in/shivanshu-dev
                    </a>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Github size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">GitHub</h4>
                    <a href="https://github.com/shivanshushukla" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      github.com/shivanshushukla
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                    placeholder="Subject of your message"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                    placeholder="Your message"
                  />
                </div>
                
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-lg ${
                      status.type === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {status.message}
                  </motion.div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Send Message
                      <SendHorizonal size={18} className="ml-2" />
                    </span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
// Continue from previous code...

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: <Github size={20} />, href: 'https://github.com/shivanshushukla', label: 'GitHub' },
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com/in/shivanshu-dev', label: 'LinkedIn' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com/shivanshu_dev', label: 'Twitter' },
    { icon: <Mail size={20} />, href: 'mailto:hello@shivanshu.dev', label: 'Email' }
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-800/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-5">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
              Shivanshu<span className="text-blue-600 dark:text-blue-500">.dev</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Building digital experiences that combine innovation with purpose. Let's create something amazing together.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 5 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              © {currentYear} Shivanshu Shukla. All rights reserved.
            </p>
            
            <motion.a
              whileHover={{ y: -3 }}
              href="#home"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
            >
              Back to Top
              <ChevronDown size={16} className="ml-1 transform rotate-180" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function Home() {
  return (
    <div className="dark:bg-gray-900">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}