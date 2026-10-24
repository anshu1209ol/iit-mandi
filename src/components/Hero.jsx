import React, { useState } from 'react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { Heading, Text } from './ui/Typography';
import { EVENT_DETAILS } from '../config/eventData';
import { CAMPUS_MEDIA } from '../config/campusMedia';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Camera,
  ExternalLink,
  Sparkles,
  Trophy,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero({ onOpenRegister }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroImage = CAMPUS_MEDIA.hero;

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 16;
    const y = (clientY / window.innerHeight - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  return (
    <section
      id="overview"
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] flex items-center pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-slate-50"
    >
      {/* Light Photo Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <motion.img
          animate={{ x: mouseOffset.x * -0.4, y: mouseOffset.y * -0.4 }}
          transition={{ type: 'spring', damping: 50, stiffness: 100 }}
          src={heroImage.src}
          alt={heroImage.alt}
          loading="eager"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center transform scale-105 transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-15' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-slate-50/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-transparent to-slate-50/90" />
      </div>

      {/* Soft Aurora Light Orbs */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-sky-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 academic-grid opacity-60 pointer-events-none" />

      {/* Floating Graphic Nodes */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:flex absolute top-32 left-10 p-2.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-md items-center gap-2.5 text-xs font-mono text-slate-700 pointer-events-none z-10"
      >
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary-600">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-slate-900">Edge SLAM Robotics</div>
          <div className="text-[10px] text-primary-600">Kamand Field Proving</div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [6, -6, 6],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden lg:flex absolute bottom-24 right-10 p-2.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-md items-center gap-2.5 text-xs font-mono text-slate-700 pointer-events-none z-10"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Trophy className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <div className="font-semibold text-slate-900">20 Finalist Teams</div>
          <div className="text-[10px] text-slate-500">Indian Roster Announced</div>
        </div>
      </motion.div>

      <Container size="wide" className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Metadata pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              National Academic Hackathon 2026
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-600 bg-white border border-slate-200 flex items-center gap-1.5 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-primary-600" />
              {EVENT_DETAILS.dates.timingDisplay}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-4"
          >
            <Heading as="h1" size="display" className="leading-[1.1] sm:leading-[1.15] text-slate-900">
              Engineering Solutions for <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-cyan-600 to-emerald-600">
                Resilient Mountain Ecosystems
              </span>
            </Heading>
            <Text variant="lead" className="max-w-2xl mx-auto text-slate-600">
              Hosted at the scenic Kamand Campus in Himachal Pradesh. Uniting student researchers and developers to innovate for high-altitude geospatial intelligence, clean microgrids, and edge autonomy.
            </Text>
          </motion.div>

          {/* Event Quick Facts */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-slate-700 font-mono pt-2"
          >
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span>{EVENT_DETAILS.dates.display}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>Daily {EVENT_DETAILS.dates.startTime} – {EVENT_DETAILS.dates.endTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Kamand Campus, Mandi (HP)</span>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenRegister}
              leftIcon={<Sparkles className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 shadow-md"
            >
              Register Team
            </Button>

            <a href="#teams">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Trophy className="w-4 h-4 text-amber-500" />}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-5 py-3 shadow-xs"
              >
                Explore 20 Indian Finalists
              </Button>
            </a>
          </motion.div>

          {/* Genuine Verified Photo Attribution Pill */}
          <div className="pt-4 flex items-center justify-center">
            <a
              href={heroImage.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 transition-colors bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs"
              title="View original photograph and license on Wikimedia Commons"
            >
              <Camera className="w-3.5 h-3.5 text-primary-600" />
              <span>Campus Panorama: {heroImage.title} by {heroImage.author}</span>
              <span className="text-slate-400">·</span>
              <span className="text-primary-600 font-mono">{heroImage.license}</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
