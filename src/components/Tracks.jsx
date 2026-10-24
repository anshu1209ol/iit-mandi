import React from 'react';
import { Container } from './ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { EVENT_DETAILS } from '../config/eventData';
import { Layers, Mountain, Cpu, Activity, ArrowUpRight } from 'lucide-react';

export function Tracks({ onSelectTrack }) {
  const trackIcons = {
    'track-1': Mountain,
    'track-2': Layers,
    'track-3': Cpu,
    'track-4': Activity,
  };

  return (
    <section id="tracks" className="py-20 sm:py-28 border-t border-surface-border">
      <Container size="wide">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" size="sm">Technical Themes</Badge>
              <span className="text-xs font-mono text-slate-400">4 Core Tracks</span>
            </div>
            <Heading as="h2" size="xl">
              Challenge Tracks
            </Heading>
            <Text variant="body" className="max-w-2xl mt-2">
              Formulated around Himalayan environmental dynamics, decentralized power, edge systems, and high-altitude health logistics.
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EVENT_DETAILS.tracks.map((track) => {
            const Icon = trackIcons[track.id] || Layers;
            return (
              <Card key={track.id} variant="default" interactive className="flex flex-col justify-between bg-white border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="default" size="sm">
                        {track.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-slate-900 font-bold">
                      {track.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 mt-2 text-sm leading-relaxed">
                      {track.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="pt-2 text-xs font-mono text-slate-600 space-y-1">
                      <div className="text-slate-800 font-semibold uppercase tracking-wider">Evaluation Focus:</div>
                      <div>• Applied hardware / algorithmic feasibility</div>
                      <div>• Relevance to high-altitude and rugged terrain</div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-mono">
                    27–29 October 2026
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-600 hover:text-primary-700 font-semibold p-0 hover:bg-transparent"
                    onClick={() => onSelectTrack(track.id)}
                    rightIcon={<ArrowUpRight className="w-4 h-4" />}
                  >
                    Select Track & Register
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
