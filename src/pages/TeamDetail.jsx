import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { eventDataService } from '../services/eventDataService';
import { EVENT_DETAILS } from '../config/eventData';
import { FINAL_ROUND_TEAMS } from '../config/finalRoundTeams';
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Cpu,
  Sparkles,
  Zap,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function TeamDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      setIsLoading(true);
      try {
        const data = await eventDataService.getTeamBySlug(slug);
        if (isMounted) {
          setTeam(data);
        }
      } catch (err) {
        console.error('Error loading team details:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTeam();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Find adjacent teams for previous/next navigation
  const currentIndex = FINAL_ROUND_TEAMS.findIndex((t) => t.slug === slug);
  const prevTeam = currentIndex > 0 ? FINAL_ROUND_TEAMS[currentIndex - 1] : null;
  const nextTeam = currentIndex < FINAL_ROUND_TEAMS.length - 1 ? FINAL_ROUND_TEAMS[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center py-20">
        <Container size="narrow">
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
            <div className="text-sm font-mono text-slate-600">
              Retrieving verified Indian finalist team profile...
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-20">
        <Container size="narrow">
          <Card variant="default" className="p-8 sm:p-12 text-center border border-slate-200 bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mx-auto mb-4 border border-rose-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <Heading as="h1" size="lg" className="text-slate-900">
              Team Record Not Found
            </Heading>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              We couldn't locate the specified team record. Please explore the official 20 Indian Finalist Teams directory.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                onClick={() => navigate('/#teams')}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold"
              >
                Back to 20 Finalist Teams
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-100 selection:text-primary-700 py-10 sm:py-16">
      <Container size="narrow">
        {/* Navigation Breadcrumb & Sibling Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/#teams"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-primary-600 transition-colors bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to 20 Finalist Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            {prevTeam && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/team/${prevTeam.slug}`)}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                className="text-xs font-mono bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Prev #{String(prevTeam.slotNumber).padStart(2, '0')}
              </Button>
            )}
            {nextTeam && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/team/${nextTeam.slug}`)}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                className="text-xs font-mono bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Next #{String(nextTeam.slotNumber).padStart(2, '0')}
              </Button>
            )}
          </div>
        </div>

        {/* Team Profile Master Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-elevated">
          {/* Hero Banner with Team Image Backdrop */}
          <div className="relative min-h-[260px] sm:min-h-[320px] flex flex-col justify-end p-6 sm:p-10 border-b border-slate-200 overflow-hidden">
            {team.image && (
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              </div>
            )}

            <div className="space-y-2.5 relative z-10 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500 text-white flex items-center gap-1.5 shadow-sm">
                  <Trophy className="w-3.5 h-3.5" />
                  Slot #{String(team.slotNumber).padStart(2, '0')}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/90 text-slate-800">
                  {team.category || 'Engineering Finalist'}
                </span>
                {team.track && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono text-white bg-primary-600/90 border border-primary-400">
                    {team.track}
                  </span>
                )}
              </div>

              <Heading as="h1" size="display" className="text-white text-3xl sm:text-5xl font-bold tracking-tight">
                {team.name}
              </Heading>

              {team.institution && (
                <div className="flex items-center gap-2 text-sm text-slate-200 font-semibold drop-shadow-xs">
                  <GraduationCap className="w-4 h-4 text-blue-300" />
                  <span>{team.institution}</span>
                </div>
              )}

              {team.tagline && (
                <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed max-w-2xl drop-shadow-xs">
                  {team.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8 bg-white">
            {/* Project Summary */}
            {team.summary && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <span>Project Abstract & Core Innovation</span>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed font-sans shadow-xs">
                  {team.summary}
                </div>
              </div>
            )}

            {/* Performance Benchmark Metrics */}
            {team.metrics && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Engineering Performance Benchmarks</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(team.metrics).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-base font-mono font-bold text-primary-600 mt-1">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Tags */}
            {team.techStack && team.techStack.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <Cpu className="w-4 h-4 text-primary-600" />
                  <span>Architecture & Technology Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Confirmed Team Members Roster */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                <Users className="w-4 h-4 text-primary-600" />
                <span>Confirmed Team Roster ({team.members.length} Members)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {team.members.map((member, idx) => {
                  const name = typeof member === 'string' ? member : member.full_name;
                  const role = typeof member === 'object' && member.role ? member.role : 'Finalist Contributor';
                  const spec = typeof member === 'object' && member.specialisation ? member.specialisation : null;

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3.5 hover:border-primary-400 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full bg-primary-100 border border-primary-200 text-primary-700 font-bold font-mono text-base flex items-center justify-center shrink-0">
                        {name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-bold text-slate-900 truncate">
                          {name}
                        </div>
                        <div className="text-xs font-mono text-primary-600 font-semibold">
                          {role}
                        </div>
                        {spec && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {spec}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified IIT Mandi Hackathon 2026 Finalist Team. Official jury defense scheduled for 27–29 October 2026.</span>
              </div>
            </div>

            {/* Event Evaluation Parameters */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Final Demonstration Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary-600" />
                    <span>Evaluation Period</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {EVENT_DETAILS.dates.display}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary-600" />
                    <span>Evaluation Window</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    09:00 – 17:00 IST
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Demonstration Stage</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Kamand Campus, HP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
