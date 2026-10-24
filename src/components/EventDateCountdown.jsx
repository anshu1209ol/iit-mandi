import React, { useState, useEffect } from 'react';
import { Container } from './ui/Container';
import { Heading, Text } from './ui/Typography';
import { EVENT_DETAILS } from '../config/eventData';
import { eventDataService } from '../services/eventDataService';
import { Calendar, Clock, Globe2 } from 'lucide-react';

export function EventDateCountdown() {
  const [eventData, setEventData] = useState(EVENT_DETAILS);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const details = await eventDataService.getEventDetails();
        if (isMounted && details) {
          setEventData(details);
        }
      } catch (e) {}
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date(eventData.dates.startIso).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventData]);

  return (
    <section id="countdown" className="py-14 sm:py-20 border-t border-slate-200 bg-white relative">
      <Container size="wide">
        <div className="bg-slate-50/80 p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 border-b border-slate-200/80 gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary-600" />
                  Confirmed Dates
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-600 bg-white border border-slate-200 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-primary-600" />
                  {EVENT_DETAILS.timezone}
                </span>
              </div>
              <Heading as="h2" size="lg" className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight">
                Event Schedule & Live Countdown
              </Heading>
              <Text variant="subtle" className="text-slate-600">
                Opening ceremony begins promptly at {EVENT_DETAILS.dates.startTime} on {EVENT_DETAILS.dates.display}.
              </Text>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-700">
              <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs">
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="font-semibold">{EVENT_DETAILS.dates.display}</span>
              </div>
              <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-xs">
                <Clock className="w-4 h-4 text-cyan-600" />
                <span className="font-semibold">Daily {EVENT_DETAILS.dates.startTime} – {EVENT_DETAILS.dates.endTime}</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Time Remaining to Opening Check-In (09:00 AM IST)</span>
              </div>
              <span className="text-slate-400 font-mono hidden sm:inline">UTC+05:30</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 text-center shadow-xs hover:border-slate-300 transition-colors">
                <div className="text-4xl sm:text-6xl font-bold font-mono text-slate-900 tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-mono uppercase tracking-wider mt-2 font-semibold">
                  Days
                </div>
              </div>

              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 text-center shadow-xs hover:border-slate-300 transition-colors">
                <div className="text-4xl sm:text-6xl font-bold font-mono text-slate-900 tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-mono uppercase tracking-wider mt-2 font-semibold">
                  Hours
                </div>
              </div>

              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 text-center shadow-xs hover:border-slate-300 transition-colors">
                <div className="text-4xl sm:text-6xl font-bold font-mono text-slate-900 tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-mono uppercase tracking-wider mt-2 font-semibold">
                  Minutes
                </div>
              </div>

              <div className="bg-blue-50/70 p-5 sm:p-7 rounded-2xl border border-blue-200 text-center shadow-xs">
                <div className="text-4xl sm:text-6xl font-bold font-mono text-primary-600 tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs text-primary-700 font-mono uppercase tracking-wider mt-2 font-bold">
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
