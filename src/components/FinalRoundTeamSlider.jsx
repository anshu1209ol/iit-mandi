import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Users,
  ArrowRight,
  Play,
  Pause,
  GraduationCap
} from 'lucide-react';
import { Button } from './ui/Button';

export function FinalRoundTeamSlider({ teams = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const total = teams.length;

  useEffect(() => {
    if (!isPlaying || total === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIndex, isPlaying, total]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  if (!teams || teams.length === 0) return null;

  const currentTeam = teams[currentIndex];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 32 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 32 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      className="relative rounded-2xl overflow-hidden p-1 border border-slate-200 bg-white shadow-elevated"
    >
      {/* Light Mouse Hover Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.08), transparent 45%)`,
        }}
      />

      <div className="relative rounded-[14px] bg-white p-5 sm:p-8 overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-700">
              Interactive Finalist Motion Slider
            </span>
            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Team {currentIndex + 1} of {total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs flex items-center gap-1.5 transition-colors"
              title={isPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-primary-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
              <span className="font-mono text-[11px] hidden sm:inline">
                {isPlaying ? 'Auto-Slide On' : 'Paused'}
              </span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                aria-label="Previous Team"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                aria-label="Next Team"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated Slide Content */}
        <div className="relative min-h-[420px] sm:min-h-[360px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentTeam.id || currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {/* Left Column: Team Visual Card */}
              <div className="lg:col-span-5 relative group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img
                    src={currentTeam.image}
                    alt={currentTeam.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                      <Trophy className="w-3.5 h-3.5" />
                      Slot #{String(currentTeam.slotNumber).padStart(2, '0')}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
                      {currentTeam.category}
                    </span>
                  </div>

                  {/* Institution Banner */}
                  {currentTeam.institution && (
                    <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-white/95 backdrop-blur-md text-xs text-slate-800 font-semibold flex items-center gap-2 shadow-xs">
                      <GraduationCap className="w-4 h-4 text-primary-600 shrink-0" />
                      <span className="truncate">{currentTeam.institution}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Information, Members, Tech Stack & Action */}
              <div className="lg:col-span-7 space-y-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary-600 font-bold uppercase tracking-wider">
                      {currentTeam.track || 'High-Altitude Innovation Track'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
                    {currentTeam.name}
                  </h3>

                  <p className="text-sm text-primary-700 font-medium font-sans mt-0.5 leading-relaxed">
                    {currentTeam.tagline}
                  </p>
                </div>

                {/* Summary Abstract */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans line-clamp-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {currentTeam.summary}
                </p>

                {/* Team Members */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-semibold">
                    <Users className="w-3.5 h-3.5 text-primary-600" />
                    <span>Indian Roster Finalists:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentTeam.members.map((member, i) => {
                      const name = typeof member === 'string' ? member : member.full_name;
                      const role = typeof member === 'object' && member.role ? member.role : null;
                      return (
                        <div
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2 shadow-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-slate-900">{name}</span>
                          {role && <span className="text-[10px] text-primary-600 font-mono">({role})</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tech Stack */}
                {currentTeam.techStack && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {currentTeam.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Action Link */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link to={`/team/${currentTeam.slug}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="bg-primary-600 hover:bg-primary-700 text-white shadow-xs text-xs font-semibold px-4 py-2"
                    >
                      Inspect Team Profile #{String(currentTeam.slotNumber).padStart(2, '0')}
                    </Button>
                  </Link>

                  <span className="text-xs font-mono text-slate-500">
                    Jury Demo: 27–29 October 2026
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-slate-100">
          {teams.map((t, idx) => (
            <button
              key={t.id || idx}
              type="button"
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 bg-primary-600 shadow-xs'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Go to team ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
