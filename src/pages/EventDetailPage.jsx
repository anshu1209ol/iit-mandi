import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Navigation } from '../components/ui/Navigation';
import { Footer } from '../components/ui/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Heading, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EVENT_DETAILS } from '../config/eventData';
import { eventDataService } from '../services/eventDataService';
import { isSupabaseConfigured } from '../config/supabaseClient';
import { getEventStatus } from '../lib/eventStatus';
import { RegistrationModal } from '../components/RegistrationModal';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Shield,
  HelpCircle,
  Mail,
  ChevronDown,
  Info,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowLeft,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function EventDetailPage() {
  const [eventDetails, setEventDetails] = useState(EVENT_DETAILS);
  const [days, setDays] = useState(EVENT_DETAILS.days);
  const [rounds, setRounds] = useState(EVENT_DETAILS.rounds);
  const [activeDay, setActiveDay] = useState('day-1');
  const [openFaq, setOpenFaq] = useState(0);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Time simulation state for testing before, during, after
  const [simulatedTimeMs, setSimulatedTimeMs] = useState(null);
  const [eventStatus, setEventStatus] = useState(getEventStatus());

  useEffect(() => {
    window.scrollTo(0, 0);

    let isMounted = true;
    async function loadData() {
      try {
        const [ev, sc, rds] = await Promise.all([
          eventDataService.getEventDetails(),
          eventDataService.getScheduleItems(),
          eventDataService.getCompetitionRounds(),
        ]);
        if (isMounted) {
          if (ev) setEventDetails(ev);
          if (sc && sc.length > 0) setDays(sc);
          if (rds && rds.length > 0) setRounds(rds);
        }
      } catch (err) {
        console.warn('Could not fetch event data from service:', err);
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      setEventStatus(getEventStatus(simulatedTimeMs || Date.now()));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [simulatedTimeMs]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-primary-500/20 selection:text-primary-700">
      {/* Navigation */}
      <Navigation onOpenRegister={() => setIsRegisterOpen(true)} />

      <main className="flex-1 pt-28 pb-20">
        <Container size="wide" className="space-y-16">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-primary-600 transition-colors bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs w-fit font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Homepage Overview</span>
            </Link>

            {/* Timezone Indicator */}
            <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
              {isSupabaseConfigured && (
                <Badge variant="emerald" size="sm" icon={<Database className="w-3 h-3" />}>
                  Supabase Live
                </Badge>
              )}
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-primary-600" />
                <span>Official Timezone: {eventDetails.timezone} (UTC+05:30)</span>
              </div>
            </div>
          </div>

          {/* 1. Event Overview & Live Calculated Status */}
          <div className="bg-white p-8 sm:p-12 rounded-card border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="emerald" size="sm">Official Event Specifications</Badge>
                  <Badge
                    variant={eventStatus.state === 'LIVE' ? 'emerald' : eventStatus.state === 'UPCOMING' ? 'cyan' : 'default'}
                    size="sm"
                    className="font-mono"
                  >
                    Status: {eventStatus.label}
                  </Badge>
                </div>

                <Heading as="h1" size="display" className="text-slate-900 font-bold">
                  {eventDetails.name}
                </Heading>

                <Text variant="lead" className="text-slate-600">
                  {eventDetails.subheading}. A premier national hackathon hosted at IIT Mandi Kamand Campus exploring geospatial hazard mitigation, sustainable mountain infrastructure, and offline-first edge compute.
                </Text>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {eventStatus.description}
                </p>
              </div>

              {/* Status & Live Countdown Box */}
              <div className="w-full lg:w-80 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 shrink-0">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold">Event Clock</span>
                  <span className="text-emerald-700 font-semibold">{eventDetails.timezone}</span>
                </div>

                {eventStatus.state === 'UPCOMING' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-center font-mono">
                      <div className="bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <div className="text-lg font-bold text-slate-900">{String(eventStatus.countdown.days).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Days</div>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <div className="text-lg font-bold text-slate-900">{String(eventStatus.countdown.hours).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Hours</div>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <div className="text-lg font-bold text-slate-900">{String(eventStatus.countdown.minutes).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Mins</div>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <div className="text-lg font-bold text-primary-600">{String(eventStatus.countdown.seconds).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-500 uppercase font-semibold">Secs</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 text-center font-mono">
                      Counting down to 27 October 2026 (09:00 AM IST)
                    </p>
                  </div>
                ) : eventStatus.state === 'LIVE' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs space-y-1 text-emerald-900">
                    <div className="font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                      <span>Hackathon Active</span>
                    </div>
                    <div>Daily Operating Hours: 9:00 AM – 5:00 PM IST</div>
                  </div>
                ) : (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-900">Event Concluded</div>
                    <div>Completed on 29 October 2026 at 5:00 PM IST.</div>
                  </div>
                )}

                {/* Status Simulator for Testing */}
                <div className="pt-3 border-t border-slate-200 text-[11px]">
                  <div className="font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Timezone Test Simulator:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSimulatedTimeMs(null)}
                      className={`p-1.5 rounded border text-left truncate font-medium transition-colors ${
                        simulatedTimeMs === null ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      • Live Clock
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedTimeMs(new Date('2026-10-26T12:00:00+05:30').getTime())}
                      className={`p-1.5 rounded border text-left truncate font-medium transition-colors ${
                        simulatedTimeMs === new Date('2026-10-26T12:00:00+05:30').getTime() ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      • Before (26 Oct)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedTimeMs(new Date('2026-10-28T11:00:00+05:30').getTime())}
                      className={`p-1.5 rounded border text-left truncate font-medium transition-colors ${
                        simulatedTimeMs === new Date('2026-10-28T11:00:00+05:30').getTime() ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      • Active (28 Oct)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedTimeMs(new Date('2026-10-30T10:00:00+05:30').getTime())}
                      className={`p-1.5 rounded border text-left truncate font-medium transition-colors ${
                        simulatedTimeMs === new Date('2026-10-30T10:00:00+05:30').getTime() ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      • After (30 Oct)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Confirmed Event Dates & Daily Operating Hours */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <Heading as="h2" size="lg" className="text-slate-900 font-bold">
                Confirmed Event Dates & Daily Operating Window
              </Heading>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {days.map((day) => (
                <Card key={day.dayNumber} variant="default" className="p-6 space-y-3 bg-white border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan" size="sm">{day.dayLabel}</Badge>
                    <span className="text-xs font-mono text-primary-700 font-semibold">{day.timings}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {day.date}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 font-medium">
                    {day.phase}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {day.summary}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* 3. Three-Day Schedule Tabs with Timeline Components */}
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                <Heading as="h2" size="lg" className="text-slate-900 font-bold">
                  Three-Day Operating Timelines
                </Heading>
              </div>
              <Badge variant="outline" size="sm">Daily Hours: 9:00 AM – 5:00 PM IST</Badge>
            </div>

            <Tabs value={activeDay} onValueChange={setActiveDay}>
              <TabsList className="mb-6 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {days.map((day) => (
                  <TabsTrigger key={`detail-day-${day.dayNumber}`} value={`day-${day.dayNumber}`} icon={<Calendar className="w-3.5 h-3.5" />}>
                    <span>{day.dayLabel}</span>
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">({day.dayOfWeek})</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map((day) => (
                <TabsContent key={`detail-day-${day.dayNumber}`} value={`day-${day.dayNumber}`}>
                  <div className="bg-white rounded-card p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 font-display">
                          {day.date}
                        </h3>
                        <p className="text-xs text-primary-700 font-mono mt-0.5 font-medium">
                          Daily Window: {day.timings} (Asia/Kolkata)
                        </p>
                      </div>
                      <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
                        {day.phase}
                      </span>
                    </div>

                    {/* Timeline Component */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>09:00 AM IST</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">Daily Check-In & Window Opens</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Opening of campus workstation desks and activation of remote milestone synchronization.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs font-mono text-primary-700 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary-600" />
                          <span>01:00 PM IST</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">Midday Mentorship Sync</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Architecture reviews and technical feedback from faculty and mentors.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs font-mono text-amber-700 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>05:00 PM IST</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">Daily Operating Window Closes</div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Daily checkpoint code synchronization and campus facility wrap-up.
                        </p>
                      </div>
                    </div>

                    {/* Polished Agenda Publication Notice */}
                    <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-3 text-xs text-slate-700">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-950">Detailed Session Agenda Notice: </span>
                        <span>
                          The minute-by-minute session schedule, stage presentations, and room allocations will be announced here once finalized by the organizing committee.
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* 4. Competition-Round Overview */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-600" />
              <Heading as="h2" size="lg" className="text-slate-900 font-bold">
                Three-Tier Competition Progression
              </Heading>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rounds.map((round) => (
                <Card key={round.roundNumber} variant="default" className="p-6 flex flex-col justify-between bg-white border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={round.roundNumber === 1 ? 'emerald' : round.roundNumber === 2 ? 'cyan' : 'amber'} size="sm">
                        {round.shortName}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500">Phase {round.roundNumber}</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-slate-900">
                      {round.metric}
                    </div>
                    <h3 className="text-base font-bold text-slate-800 font-display">
                      {round.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {round.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 text-xs font-mono font-semibold text-primary-700 mt-4">
                    Deliverable: {round.deliverable}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 5. Participation & Rules (Only Supplied Guidelines) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Verified Participation Guidelines
                </h3>
              </div>
              <div className="space-y-3">
                {eventDetails.guidelines.map((rule, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-slate-900 font-mono flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">0{idx + 1}.</span>
                      <span>{rule.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rule.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Frequently Asked Questions
                </h3>
              </div>
              <div className="space-y-2.5">
                {eventDetails.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="bg-white rounded-card border border-slate-200 shadow-xs overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180 text-primary-600')} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. Venue & Verified Contact Details */}
          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary-700">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span>Kamand Campus, Mandi, HP - 175005</span>
              </div>
              <div className="text-lg font-bold text-slate-900 font-display">
                {eventDetails.location.venue}
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                Hybrid coordination center for workstation setups, mentor consultations, and final evaluations.
              </p>
            </div>

            <div className="shrink-0 space-y-2 text-xs font-mono">
              <div className="text-slate-500 font-medium">Official Inquiries:</div>
              <a
                href={`mailto:${eventDetails.contact.email}`}
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1.5 hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>{eventDetails.contact.email}</span>
              </a>
              <div className="text-slate-500">
                Hours: {eventDetails.contact.operatingHours}
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}
