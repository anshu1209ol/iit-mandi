import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container } from './Container';
import { Button } from './Button';
import { Menu, X, Mountain, Calendar, Sparkles, Trophy, ChevronRight } from 'lucide-react';
import { EVENT_DETAILS } from '../../config/eventData';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation({ onOpenRegister }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection & active section indicator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      if (location.pathname === '/' || location.pathname === '') {
        const sections = ['overview', 'countdown', 'rounds', 'teams', 'schedule', 'announcements'];
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Overview', href: '/#overview', sectionId: 'overview' },
    { name: 'Countdown', href: '/#countdown', sectionId: 'countdown' },
    { name: 'Rounds', href: '/#rounds', sectionId: 'rounds' },
    { name: '20 Teams', href: '/#teams', sectionId: 'teams', isHighlight: true },
    { name: 'Schedule', href: '/#schedule', sectionId: 'schedule' },
    { name: 'Announcements', href: '/#announcements', sectionId: 'announcements' },
    { name: 'Details', href: '/details', sectionId: 'details' },
  ];

  const handleNavClick = (e, link) => {
    if (link.href.startsWith('/#')) {
      const targetId = link.href.replace('/#', '');
      if (location.pathname === '/' || location.pathname === '') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          const yOffset = -75;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          setActiveSection(targetId);
          window.history.pushState(null, '', `/#${targetId}`);
        }
      } else {
        navigate(`/#${targetId}`);
      }
    }
    setMobileMenuOpen(false);
  };

  const isCurrentActive = (link) => {
    if (link.href === '/details') {
      return location.pathname === '/details';
    }
    return (location.pathname === '/' || location.pathname === '') && activeSection === link.sectionId;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-2.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3 sm:py-3.5'
      }`}
    >
      <Container size="wide">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Institute Branding - Guaranteed no awkward wrapping */}
          <Link
            to="/#overview"
            onClick={(e) => handleNavClick(e, { href: '/#overview', sectionId: 'overview' })}
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl px-1 py-0.5"
            aria-label="IIT Mandi Hackathon 2026 Home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-xs shrink-0">
              <Mountain className="w-5 h-5 stroke-[2.2]" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
            </div>

            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-display font-bold text-slate-900 tracking-tight text-base sm:text-lg whitespace-nowrap">
                  IIT Mandi
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-primary-100 text-primary-700 whitespace-nowrap">
                  2026
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans tracking-tight whitespace-nowrap hidden xl:block">
                Kamand Valley · 27–29 Oct
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu (hidden on mobile/tablet, flex on lg and up) */}
          <nav
            className="hidden lg:flex items-center gap-0.5 p-1 bg-slate-100/90 rounded-full border border-slate-200/80 shrink-0"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const active = isCurrentActive(link);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 whitespace-nowrap flex items-center gap-1 shrink-0 ${
                    active
                      ? 'text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicatorLight"
                      className="absolute inset-0 bg-primary-600 rounded-full shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  {link.isHighlight && (
                    <Trophy className={`w-3 h-3 ${active ? 'text-amber-300' : 'text-amber-500'}`} />
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs on the Right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/#teams"
              onClick={(e) => handleNavClick(e, { href: '/#teams', sectionId: 'teams' })}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>20 Finalists</span>
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenRegister}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap shrink-0"
            >
              Register Team
            </Button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 lg:hidden shrink-0"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-b border-slate-200 bg-white/98 px-5 pt-3 pb-6 shadow-xl"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isCurrentActive(link);
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {link.isHighlight && <Trophy className="w-4 h-4 text-amber-500" />}
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-200 mt-2 space-y-2">
                <Button
                  variant="primary"
                  className="w-full justify-center py-2 text-sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Register Team for 2026
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
