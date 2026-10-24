import React, { useState, useEffect } from 'react';
import { Container } from './ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Heading, Text } from './ui/Typography';
import { EVENT_DETAILS } from '../config/eventData';
import { eventDataService } from '../services/eventDataService';
import { Layers, Users, Award, CheckCircle2 } from 'lucide-react';

export function RoundsOverview() {
  const roundIcons = [Layers, Users, Award];
  const [rounds, setRounds] = useState(EVENT_DETAILS.rounds);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadRounds() {
      try {
        const data = await eventDataService.getCompetitionRounds();
        if (isMounted && data && data.length > 0) {
          setRounds(data);
        }
      } catch (e) {
        console.warn('Could not load competition rounds:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadRounds();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="rounds" className="py-16 sm:py-24 border-t border-slate-200 bg-white">
      <Container size="wide">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200">
              Competition Structure
            </span>
            <span className="text-xs font-mono text-slate-500">Progression Model</span>
          </div>
          <Heading as="h2" size="xl" className="text-slate-900 text-2xl sm:text-4xl font-bold tracking-tight">
            Three-Round Competition Overview
          </Heading>
          <Text variant="body" className="mt-2 text-slate-600">
            The hackathon follows a structured three-tier technical evaluation pipeline, filtering from broad national screening to intensive prototyping and final jury defense.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {rounds.map((round, idx) => {
            const Icon = roundIcons[idx] || Layers;
            return (
              <Card key={round.roundNumber} variant="default" className="flex flex-col justify-between relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-primary-400 transition-all">
                <div>
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {round.shortName}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                        {round.metric}
                      </div>
                      <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        {round.metricLabel}
                      </div>
                    </div>

                    <CardTitle className="text-base font-bold text-slate-900 mt-3 font-display">
                      {round.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed">
                      {round.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 pt-0 pb-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-800 font-mono">Deliverable:</div>
                      <div className="text-slate-600">{round.deliverable}</div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Phase {round.roundNumber}</span>
                  <span className="text-primary-700 font-bold">{round.status}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Operating Window Note */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All round evaluations and checkpoint reviews occur strictly between <strong>{EVENT_DETAILS.dates.timingDisplay}</strong>.</span>
          </div>
          <span className="font-mono text-slate-500 font-semibold">Event Dates: {EVENT_DETAILS.dates.display}</span>
        </div>
      </Container>
    </section>
  );
}
