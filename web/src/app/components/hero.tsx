"use client";

import React, { useState, useEffect, useRef, useMemo, memo, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { createNoise3D } from 'simplex-noise';
import { Zap, WifiOff, ShieldCheck, Users } from 'lucide-react';

type ConnectionState = 'idle' | 'connecting' | 'incorrect' | 'connected';
type Stage = 'pinEntry' | 'features';
type Feature = {
  Icon: React.ElementType;
  title: string;
  text: string;
  align: 'left' | 'right';
};

const StreamingIndicator = memo(() => {
    const indicatorRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(indicatorRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
            gsap.to(arrowRef.current, { x: 6, repeat: -1, yoyo: true, duration: 0.7, ease: 'sine.inOut' });
        }, indicatorRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={indicatorRef} className="absolute top-6 right-6 z-20">
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-lg p-2.5 pl-5 rounded-full border border-gray-200/90 shadow-lg">
                <p className="text-sm font-bold tracking-wider text-blue-600 uppercase">STREAMING</p>
                <div className="flex items-center gap-1 text-slate-500">   <span className="w-3 h-3 bg-green-300 rounded-full"></span> </div>
            </div>
        </div>
    );
});
StreamingIndicator.displayName = "StreamingIndicator";

const FeaturesDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const features: Feature[] = useMemo(() => [
    { Icon: WifiOff, title: "Purely Offline. No Cloud.", text: "Direct P2P via Bluetooth. Your data never touches the internet.", align: 'right' },
    { Icon: Zap, title: "GPU-Accelerated. Zero Lag.", text: "Hardware encoding delivers a buttery-smooth, real-time stream.", align: 'left' },
    { Icon: Users, title: "Built for Groups.", text: "Perfect for classrooms, labs, and team demos without network hassle.", align: 'right' },
    { Icon: ShieldCheck, title: "Secure by Design.", text: "End-to-end AES encryption. Your stream is for your eyes only.", align: 'left' },
  ], []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.laptops-container', { opacity: 0, scale: 0.8 }, { duration: 1, opacity: 1, scale: 1, ease: 'back.out(1.4)' })
        .fromTo('.stream-path', { strokeDashoffset: 205 }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, "-=0.5")
        .to('.client-screen-content', { opacity: 1, duration: 0.5 }, "-=0.8")
        .fromTo('.feature-pod', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }, "-=0.5");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const FeaturePod = memo(({ Icon, title, text, align }: Feature) => (
    <div className={`feature-pod w-full md:w-5/12 flex gap-4 ${align === 'left' ? 'text-left' : 'text-right md:flex-row-reverse'}`}>
        <div className="mt-1 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white border border-gray-200/80 shadow-md rounded-full"> <Icon className="w-6 h-6 text-blue-600" /> </div>
        <div> <h3 className="text-xl font-bold text-slate-800">{title}</h3> <p className="mt-1 text-slate-500">{text}</p> </div>
    </div>
  ));
  FeaturePod.displayName = "FeaturePod";

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center gap-16 px-4">
        <div className="laptops-container relative w-full max-w-lg h-48 flex justify-center items-center">
             <div className="laptop-mockup absolute left-0"> <div className="screen flex items-center justify-center"> <svg fill="#475569" width="80px" height="80px" viewBox="0 0 32.00 32.00" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"></path></g></svg> </div> </div>
            <div className="laptop-mockup absolute right-0"> <div className="screen flex items-center justify-center"> <div className="client-screen-content opacity-0 w-full h-full flex items-center justify-center"> <svg fill="#475569" width="80px" height="80px" viewBox="0 0 32.00 32.00" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"></path></g></svg> </div> </div> </div>
            <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 200 100">
                <path className="stream-path" d="M 60 50 Q 100 20 140 50" fill="none" stroke="url(#stream-gradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="205" strokeDashoffset="205" />
                <defs> <linearGradient id="stream-gradient" gradientTransform="rotate(90)"> <stop offset="0%" stopColor="#3b82f6" /> <stop offset="100%" stopColor="#f97316" /> </linearGradient> </defs>
            </svg>
        </div>
        <div className="w-full max-w-6xl flex flex-wrap justify-center items-start gap-x-12 gap-y-10"> {features.map(f => <FeaturePod key={f.title} {...f} />)} </div>
    </div>
  );
};
const FeaturesDisplayLazy = lazy(() => Promise.resolve({ default: FeaturesDisplay }));

const Hero = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stage1Ref = useRef<HTMLDivElement>(null);
    const waveAnimation = useRef({ intensity: 0 });

    const [pin, setPin] = useState('');
    const [userInput, setUserInput] = useState('');
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [currentStage, setCurrentStage] = useState<Stage>('pinEntry');

    useEffect(() => { setPin(Math.floor(1000 + Math.random() * 9000).toString()); }, []);
    useEffect(() => { if (userInput.length === 4 && pin) setConnectionState(userInput === pin ? 'connecting' : 'incorrect'); }, [userInput, pin]);
    
    useEffect(() => {
        if (currentStage !== 'pinEntry' || connectionState !== 'idle') return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            if (e.key >= '0' && e.key <= '9') setUserInput(p => (p.length < 4 ? p + e.key : p));
            if (e.key === 'Backspace') setUserInput(p => p.slice(0, -1));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStage, connectionState]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const noise3D = createNoise3D();
        let w = 0, h = 0, time = 0;
        const waves = [
            { amp: 25, freq: 0.0015, color: "rgba(59, 130, 246, 0.25)", offset: 0, speed: 0.005 },
            { amp: 30, freq: 0.0012, color: "rgba(249, 115, 22, 0.25)", offset: Math.PI, speed: -0.004 },
        ];
        const resizeCanvas = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            time += 0.01;
            const currentIntensity = waveAnimation.current.intensity;
            waves.forEach(wave => {
                ctx.beginPath(); ctx.strokeStyle = wave.color; ctx.lineWidth = 1.5;
                for (let x = 0; x < w; x++) {
                    const noiseVal = noise3D(x * wave.freq, wave.offset, time * wave.speed);
                    const y = h * 0.55 + noiseVal * wave.amp;
                    const connectionEffect = Math.sin((x / w) * Math.PI) * (h / 4);
                    const finalY = y * (1 - currentIntensity) + (h / 2 - connectionEffect) * currentIntensity;
                    ctx.lineTo(x, finalY);
                }
                ctx.stroke();
            });
        };
        gsap.ticker.add(draw);
        return () => { gsap.ticker.remove(draw); window.removeEventListener('resize', resizeCanvas); };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (currentStage === 'pinEntry' && stage1Ref.current) {
                gsap.from(stage1Ref.current, { 
                    autoAlpha: 0, 
                    y: 50, 
                    duration: 1.5, 
                    ease: 'power3.out' 
                });
                
                if (connectionState === 'connecting') {
                    const tl = gsap.timeline({ onComplete: () => { setConnectionState('connected'); setCurrentStage('features'); }});
                    tl.to(waveAnimation.current, { intensity: 1, duration: 2, ease: 'elastic.out(1, 0.4)' })
                      .to(stage1Ref.current, { autoAlpha: 0, y: -80, duration: 1.2, ease: 'power3.in' }, 0.5);
                }

                if (connectionState === 'incorrect') {
                    gsap.timeline({ onComplete: () => { setUserInput(''); setConnectionState('idle'); }})
                        .to('.client-device-inputs', { x: '+=8', duration: 0.08, repeat: 5, yoyo: true, ease: 'power2.inOut' });
                }
            }
        }, componentRef);
        return () => ctx.revert();
    }, [currentStage, connectionState]);

    return (
        <section ref={componentRef} className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-gray-50 text-slate-800 py-20 md:py-32">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
            {currentStage === 'features' && <StreamingIndicator />}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {currentStage === 'pinEntry' ? (
                    <div ref={stage1Ref} className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900"> Screen Sharing, Unplugged. Darpan for Screens. </h1>
                        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl"> An ultra-light, peer-to-peer screen sharing tool for the real world. Instant, offline, and incredibly efficient. </p>
                        <div className="mt-16 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <div className="pin-entry-device">
                                <p className="font-semibold text-slate-500 text-sm mb-3">HOST PIN</p>
                                <div className="flex gap-2">
                                    {(pin || "----").split('').map((d, i) => <span key={i} className="pin-digit">{d}</span>)}
                                </div>
                            </div>
                            <div className="pin-entry-device">
                                <p className="font-semibold text-slate-500 text-sm mb-3">ENTER PIN</p>
                                <div className="client-device-inputs flex gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`pin-input-box ${connectionState === 'incorrect' ? 'incorrect' : ''}`}>
                                            <span className="text-5xl font-mono text-orange-600">{userInput[i] || ''}</span>
                                            {userInput.length === i && connectionState === 'idle' && <div className="blinking-caret" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Suspense fallback={<div className="text-slate-500">Loading Interface...</div>}>
                        <FeaturesDisplayLazy />
                    </Suspense>
                )}
            </div>

            <style jsx>{`
                /* Styles are unchanged, but I've added the laptop mockup style from the previous fix for completeness */
                .laptop-mockup { width: 150px; height: 100px; background-color: #e2e8f0; border: 8px solid #1e293b; border-bottom-width: 15px; border-radius: 12px 12px 0 0; position: relative; }
                .laptop-mockup::after { content: ''; position: absolute; bottom: -15px; left: -8px; right: -8px; height: 15px; background: #334155; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                .pin-entry-device { display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 24px; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1); padding: 1.5rem 2rem; }
                .pin-digit { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 3rem; color: #1e3a8a; background-color: rgba(226, 232, 240, 0.5); width: 3.5rem; height: 5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; }
                .pin-input-box { position: relative; width: 3.5rem; height: 5rem; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; border: 2px solid #cbd5e1; background-color: rgba(255, 255, 255, 0.3); transition: all 0.2s; }
                .pin-input-box.incorrect { animation: shake-horizontal 0.4s; background-color: rgba(239, 68, 68, 0.1); border-color: #f87171; }
                .blinking-caret { width: 3px; height: 3rem; background-color: #f97316; animation: blink 1s step-end infinite; }
                @keyframes blink { 50% { opacity: 0; } }
                @keyframes shake-horizontal { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
                .screen { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #f8fafc; border-radius: 4px; overflow: hidden; }
            `}</style>
        </section>
    );
};

export default Hero;