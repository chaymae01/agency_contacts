'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [counter, setCounter] = useState({ users: 0, uptime: 0, rating: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    if (userId) {
      router.push('/dashboard');
    }
  }, [userId, router]);

  // Animation des compteurs
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const animateCounter = (start, end, setter) => {
      let current = start;
      const increment = (end - start) / steps;
      const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        setter(Math.floor(current));
      }, stepDuration);
    };

    animateCounter(0, 12500, (val) => setCounter(prev => ({ ...prev, users: val })));
    animateCounter(0, 99.9, (val) => setCounter(prev => ({ ...prev, uptime: val })));
    animateCounter(0, 4.8, (val) => setCounter(prev => ({ ...prev, rating: val })));
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.3})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Startup",
      description: "Setup in under 2 minutes, intuitive interface",
      color: "from-blue-500 to-cyan-500",
      stats: "2min"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Maximum Security",
      description: "AES-256 encryption and two-factor authentication",
      color: "from-green-500 to-emerald-500",
      stats: "100%"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Smart Growth",
      description: "Predictive analytics and automated suggestions",
      color: "from-purple-500 to-pink-500",
      stats: "+47%"
    }
  ];

  const interactiveCards = [
    {
      title: "Drag your files",
      action: "Try dragging this card!",
      color: "bg-gradient-to-br from-blue-400 to-purple-500",
      drag: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      title: "Click me!",
      action: "Click for a surprise",
      color: "bg-gradient-to-br from-green-400 to-cyan-500",
      click: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    },
    {
      title: "Hover here",
      action: "Hover effects activated",
      color: "bg-blue-100/30 backdrop-blur-sm",
      hover: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      )
    }
  ];

  const [cardStates, setCardStates] = useState({
    drag: { x: 0, y: 0, isDragging: false },
    click: { clicked: false },
    hover: { isHovering: false }
  });

  const handleDragStart = (e) => {
    setCardStates(prev => ({ ...prev, drag: { ...prev.drag, isDragging: true } }));
  };

  const handleDrag = (e) => {
    if (cardStates.drag.isDragging) {
      setCardStates(prev => ({
        ...prev,
        drag: {
          ...prev.drag,
          x: e.clientX - 100,
          y: e.clientY - 50
        }
      }));
    }
  };

  const handleDragEnd = () => {
    setCardStates(prev => ({ ...prev, drag: { ...prev.drag, isDragging: false } }));
  };

  const handleClick = () => {
    setCardStates(prev => ({ 
      ...prev, 
      click: { ...prev.click, clicked: !prev.click.clicked } 
    }));
  };

  const handleHover = (isHovering) => {
    setCardStates(prev => ({ 
      ...prev, 
      hover: { ...prev.hover, isHovering } 
    }));
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative"
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Animated Background Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Mouse Tracker Effect */}
      <div 
        className="fixed w-8 h-8 bg-blue-400/20 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: `scale(${cardStates.drag.isDragging ? 2 : 1})`
        }}
      />

      {/* Animated Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-md border-b border-white/20 py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl rotate-0 group-hover:rotate-180 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SecureContacts
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Link 
                href="/sign-in"
                className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                Login
              </Link>
              <Link 
                href="/sign-up"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
              >
               Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive Elements */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer group">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping" />
            <span className="text-sm font-medium text-white/80 group-hover:text-white">
New: Integrated AI available            </span>
          </div>

          {/* Main Heading with Typing Effect */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
              SecureContacts
            </span>
            
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">

 The secure dashboard   to manage agencies and contacts      <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              {" Try it now!"}
            </span>
          </p>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/sign-up"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center">
Start your journey                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <button className="group px-8 py-4 border-2 border-cyan-400/50 rounded-xl font-semibold text-lg hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 hover:scale-105">
              <span className="flex items-center">
See the demo                <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: counter.users, label: 'Users', suffix: '+' },
              { value: counter.uptime, label: 'Uptime', suffix: '%' },
              { value: counter.rating, label: 'Rating', suffix: '/5' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Features
            </span>
            <span className="block text-white">Interactive</span>
          </h2>

          {/* Interactive Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {interactiveCards.map((card, index) => (
              <div
                key={index}
                className={`relative h-48 rounded-2xl p-6 cursor-pointer transition-all duration-500 ${
                  card.drag && cardStates.drag.isDragging ? 'scale-110 rotate-2' : ''
                } ${
                  card.click && cardStates.click.clicked ? 'scale-95 rotate-[-2deg]' : ''
                } ${
                  card.hover && cardStates.hover.isHovering ? 'scale-105' : ''
                } ${card.color}`}
                onMouseDown={card.drag ? handleDragStart : undefined}
                onClick={card.click ? handleClick : undefined}
                onMouseEnter={card.hover ? () => handleHover(true) : undefined}
                onMouseLeave={card.hover ? () => handleHover(false) : undefined}
                style={
                  card.drag ? {
                    transform: `translate(${cardStates.drag.x}px, ${cardStates.drag.y}px) rotate(5deg)`,
                    position: cardStates.drag.isDragging ? 'fixed' : 'relative',
                    zIndex: cardStates.drag.isDragging ? 1000 : 1
                  } : {}
                }
              >
                <div className="text-white mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-white/80">{card.action}</p>
                
                {card.click && cardStates.click.clicked && (
                  <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Features Grid with Hover Effects */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-${feature.color.split('-')[1]}-400/50 transition-all duration-500 cursor-pointer group ${
                  activeFeature === index ? 'scale-105 bg-white/10' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CTA Section */}

    </div>
  );
}