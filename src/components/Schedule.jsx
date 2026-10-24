import React, { useState, useEffect } from 'react';
import { Container } from './ui/Container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Heading, Text } from './ui/Typography';
import { EVENT_DETAILS } from '../config/eventData';
import { eventDataService } from '../services/eventDataService';
import { Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export function Schedule() {
  const [activeDay, setActiveDay] = useState('day-1');
  const [days, setDays] = useState(EVENT_DETAILS.days);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSchedule() {
      try {
        const data = await eventDataService.getScheduleItems();
        if (isMounted && data && data.length > 0) {
          setDays(data);
        }
      } catch (e) {
        console.warn('Could not load schedule items:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSchedule();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="schedule" className="py-16 sm:py-24 border-t border-slate-200 bg-slate-50">
      <Container size="wide">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-600" />
              Three-Day Schedule
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">Asia/Kolkata (IST)</span>
          </div>
          <Heading as="h2" size="xl" className="text-slate-900 text-2xl sm:text-4xl font-bold tracking-tight">
            Confirmed Three-Day Operating Schedule
          </Heading>
          <Text variant="body" className="mt-2 text-slate-600">
            The hackathon runs from <strong>Tuesday, 27 October 2026</strong> through <strong>Thursday, 29 October 2026</strong>. In-person access, mentorship, and evaluated milestones operate strictly within <strong>9:00 AM to 5:00 PM IST</strong> each day.
          </Text>
        </div>

        {/* 3 Day Tabs */}
        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="mb-6 p-1 bg-slate-100 border border-slate-200 rounded-xl">
            {days.map((day) => (
              <TabsTrigger key={`day-${day.dayNumber}`} value={`day-${day.dayNumber}`} icon={<Calendar className="w-3.5 h-3.5" />}>
                <span className="font-semibold">{day.dayLabel}</span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">({day.dayOfWeek})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day) => (
            <TabsContent key={`day-${day.dayNumber}`} value={`day-${day.dayNumber}`}>
              <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
                {/* Day Overview Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200">
                        {day.dayLabel}
                      </span>
                      <span className="text-xs font-mono text-primary-700 font-bold">{day.timings}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                      {day.date}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {day.phase} · {day.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <span>Operating Hours: 09:00 – 17:00 IST</span>
                  </div>
                </div>

                {/* Timeline Components */}
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Confirmed Operating Milestones
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Start of Day */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative overflow-hidden">
                      <div className="w-1.5 h-full bg-emerald-500 absolute left-0 top-0" />
                      <div className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>09:00 AM IST</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 font-display">
                        Operating Window Opens
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Campus workstations open, remote milestone check-in active, and daily technical briefing.
                      </p>
                    </div>

                    {/* Midday */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative overflow-hidden">
                      <div className="w-1.5 h-full bg-primary-500 absolute left-0 top-0" />
                      <div className="text-xs font-mono text-primary-700 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>01:00 PM IST</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 font-display">
                        Midday Mentor Checkpoint
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Optional architectural guidance and synchronization with faculty and industry mentors.
                      </p>
                    </div>

                    {/* End of Day */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative overflow-hidden">
                      <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0" />
                      <div className="text-xs font-mono text-amber-700 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>05:00 PM IST</span>
                      </div>
                      <div className="text-base font-bold text-slate-900 font-display">
                        Milestone Sync & Adjournment
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Code commits logged, progress synchronized for evaluation, and scheduled daily closure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Schedule adheres strictly to IIT Mandi campus laboratory regulations. No overnight laboratory access.</span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  );
}
