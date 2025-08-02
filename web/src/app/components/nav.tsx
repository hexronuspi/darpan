"use client"; 

import React, { useRef, ElementType } from 'react';
import { gsap } from 'gsap';
import { Github, Download, Rocket } from 'lucide-react';

interface BallData {
  id: string;
  href: string;
  label: string;
  icon: ElementType; 
}

interface FloatingBallProps {
  href: string;
  label: string;
  IconComponent: ElementType;
}

const BALL_DATA: BallData[] = [
  {
    id: 'github',
    href: 'https://github.com/hexronuspi/darpan', 
    label: 'GitHub',
    icon: Github,
  },
  {
    id: 'download',
    href: '/download', 
    label: 'Download',
    icon: Download,
  },
  {
    id: 'release',
    href: '/releases', 
    label: 'Releases',
    icon: Rocket,
  },
];

const FloatingBall: React.FC<FloatingBallProps> = ({ href, label, IconComponent }) => {
  const ballRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    gsap.to(ballRef.current, {
      y: -4, 
      x: Math.random() * 4 - 2,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(ballRef.current, {
        rotation: Math.random() * 10 - 5, 
        duration: 0.1,
        repeat: 3,
        yoyo: true, 
        ease: 'power1.inOut'
    })
  };

  const handleMouseLeave = () => {
    gsap.to(ballRef.current, {
      y: 0,
      x: 0,
      rotation: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)', 
    });
  };

  return (
    <a
      ref={ballRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          background: `radial-gradient(circle at 30% 30%, 
            hsl(0, 0%, 100%) 0%,   /* Bright white highlight */
            hsl(0, 0%, 98%) 40%, 
            hsla(220, 80%, 85%, 0.1) 70%, /* Subtle Blue hint */
            hsla(30, 80%, 80%, 0.1) 85%,  /* Subtle Orange hint */
            hsla(145, 70%, 80%, 0.1) 95%, /* Subtle Green hint */
            hsl(0, 0%, 85%) 100%   /* Darker edge for curvature */
          )`,
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <IconComponent className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
      </div>

      <div
        className="
          absolute top-full left-1/2 -translate-x-1/2 mt-2
          whitespace-nowrap bg-black text-white text-xs font-semibold
          px-2 py-1 rounded-md
          opacity-0 group-hover:opacity-100
          scale-90 group-hover:scale-100
          transition-all duration-200 ease-in-out
          pointer-events-none" 
      >
        {label}
      </div>
    </a>
  );
};


const Nav = () => {
  return (
    <nav className="fixed top-5 left-5 z-50">
      <div className="flex items-center space-x-3">
        {BALL_DATA.map((ball) => (
          <FloatingBall
            key={ball.id}
            href={ball.href}
            label={ball.label}
            IconComponent={ball.icon}
          />
        ))}
      </div>
    </nav>
  );
};

export default Nav;