import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container } from './ui/Container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Heading, Text } from './ui/Typography';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { OrganizerImportModal } from './OrganizerImportModal';
import { FinalRoundTeamSlider } from './FinalRoundTeamSlider';
import { EVENT_DETAILS } from '../config/eventData';
import { teamDirectoryService } from '../services/teamDirectoryService';
import { eventDataService } from '../services/eventDataService';
import {
  Users,
  Shield,
  Trophy,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  ArrowRight,
  Clock,
  CheckCircle,
  LayoutGrid,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

export function SelectedTeams() {
  const round1 = EVENT_DETAILS.rounds[0];
  const [activeTab, setActiveTab] = useState('final-round');

  // Round 2 State
  const [round2Teams, setRound2Teams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoadingRound2, setIsLoadingRound2] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Final Round State
  const [finalRoundTeams, setFinalRoundTeams] = useState([]);
  const [finalSearchQuery, setFinalSearchQuery] = useState('');
  const [isLoadingFinalRound, setIsLoadingFinalRound] = useState(true);

  // Fetch Round 2 & Final Round teams on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingRound2(true);
      setIsLoadingFinalRound(true);
      try {
        const [r2, r3] = await Promise.all([
          eventDataService.getRound2Teams(),
          eventDataService.getFinalRoundTeams(),
        ]);
        if (isMounted) {
          if (r2) setRound2Teams(r2);
          if (r3) setFinalRoundTeams(r3);
        }
      } catch (err) {
        console.error('Failed to load competition directory data:', err);
      } finally {
        if (isMounted) {
          setIsLoadingRound2(false);
          setIsLoadingFinalRound(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered & Paginated Round 2 Teams (Names only)
  const filteredRound2Teams = useMemo(() => {
    if (!searchQuery.trim()) return round2Teams;
    const q = searchQuery.toLowerCase().trim();
    return round2Teams.filter((name) => name.toLowerCase().includes(q));
  }, [round2Teams, searchQuery]);

  // Filtered Final Round Teams (Searchable by team name, member name, track, or slot)
  const filteredFinalRoundTeams = useMemo(() => {
    if (!finalSearchQuery.trim()) return finalRoundTeams;
    const q = finalSearchQuery.toLowerCase().trim();
    return finalRoundTeams.filter((t) => {
      const matchName = t.name && t.name.toLowerCase().includes(q);
      const matchTrack = t.track && t.track.toLowerCase().includes(q);
      const matchCategory = t.category && t.category.toLowerCase().includes(q);
      const matchSlot =
        String(t.slotNumber).includes(q) ||
        `slot #${String(t.slotNumber).padStart(2, '0')}`.toLowerCase().includes(q);
      const matchMembers = (t.members || []).some((m) => {
        const memberName = typeof m === 'string' ? m : (m.full_name || '');
        return memberName.toLowerCase().includes(q);
      });
      return matchName || matchTrack || matchCategory || matchSlot || matchMembers;
    });
  }, [finalRoundTeams, finalSearchQuery]);

  const totalPages = Math.ceil(filteredRound2Teams.length / pageSize) || 1;

  const paginatedRound2Teams = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRound2Teams.slice(start, start + pageSize);
  }, [filteredRound2Teams, currentPage, pageSize]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleImportSuccess = (updatedTeams) => {
    setRound2Teams(updatedTeams);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <section id="teams" className="relative py-16 sm:py-24 border-t border-slate-200 bg-slate-50 overflow-hidden">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200 flex items-center gap-1.5 shadow-xs">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Featured 20 Indian Finalist Teams
              </span>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">Official Competition Roster</span>
            </div>
            <Heading as="h2" size="xl" className="text-slate-900 text-2xl sm:text-4xl font-bold tracking-tight">
              Selected Teams Directory & Finalist Showcase
            </Heading>
            <Text variant="body" className="max-w-2xl mt-2 text-slate-600">
              Explore the top 20 finalist teams from premier Indian engineering institutes, with live motion carousel, complete team profiles, and research abstracts.
            </Text>
          </div>
        </div>

        {/* Directory Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 p-1.5 bg-slate-100 border border-slate-200 rounded-xl">
            <TabsTrigger value="final-round" icon={<Trophy className="w-3.5 h-3.5 text-amber-500" />}>
              <span className="font-semibold text-slate-800">Final Round</span>
              <span className="text-xs font-mono text-amber-600 font-bold">(20 Finalists)</span>
            </TabsTrigger>
            <TabsTrigger value="round-2" icon={<Shield className="w-3.5 h-3.5 text-primary-600" />}>
              <span className="text-slate-700">Round 2: Shortlist</span>
              <span className="text-xs font-mono text-primary-600 font-semibold">({round2Teams.length} Teams)</span>
            </TabsTrigger>
            <TabsTrigger value="round-1" icon={<Users className="w-3.5 h-3.5 text-slate-500" />}>
              <span className="text-slate-700">Round 1: Screening</span>
              <span className="text-xs font-mono text-slate-500 font-semibold">(500+ Count)</span>
            </TabsTrigger>
          </TabsList>

          {/* ============================================================== */}
          {/* FINAL ROUND: 20 INDIAN FINALIST TEAMS (SLIDER + RESPONSIVE GRID) */}
          {/* ============================================================== */}
          <TabsContent value="final-round">
            <div className="space-y-8">
              {/* Interactive Motion Slider Showcase */}
              {!isLoadingFinalRound && finalRoundTeams.length > 0 && (
                <div className="space-y-3">
                  <FinalRoundTeamSlider teams={finalRoundTeams} />
                </div>
              )}

              {/* Grid Control & Search Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary-600">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 font-display">
                      All 20 Finalist Team Cards & Profiles
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hover to inspect team members, institutions, and innovation abstracts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative min-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={finalSearchQuery}
                      onChange={(e) => setFinalSearchQuery(e.target.value)}
                      placeholder="Search Indian teams, members, or track..."
                      className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                    />
                    {finalSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setFinalSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 20-Team Responsive Card Grid with Rich Hover Effects */}
              {isLoadingFinalRound ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 bg-slate-200/60 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : filteredFinalRoundTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredFinalRoundTeams.map((team, idx) => (
                    <motion.div
                      key={team.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (idx % 4) * 0.04 }}
                      className="group"
                    >
                      <Card
                        variant="default"
                        className="h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-primary-400 hover-glow-card transition-all duration-200 shadow-xs hover:shadow-md"
                      >
                        <div>
                          {/* Image Thumbnail with Overlay */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                            <img
                              src={team.image}
                              alt={team.name}
                              loading="lazy"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                            {/* Slot Badge */}
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                                <Trophy className="w-3 h-3 text-amber-200" />
                                #{String(team.slotNumber).padStart(2, '0')}
                              </span>
                            </div>

                            {/* Category Pill */}
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/95 text-slate-800 shadow-xs">
                                {team.category || 'Tech'}
                              </span>
                            </div>

                            {/* Institution */}
                            {team.institution && (
                              <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1 text-[11px] text-white font-medium truncate drop-shadow-sm">
                                <GraduationCap className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                                <span className="truncate">{team.institution}</span>
                              </div>
                            )}
                          </div>

                          {/* Card Header & Content */}
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base font-bold text-slate-900 font-display group-hover:text-primary-600 transition-colors line-clamp-1">
                              {team.name}
                            </CardTitle>

                            <p className="text-xs text-primary-700 font-medium font-sans line-clamp-2 mt-1 leading-relaxed">
                              {team.tagline || team.notes}
                            </p>

                            {/* Team Member Chips */}
                            <div className="pt-2.5 space-y-1.5">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1 font-semibold">
                                <Users className="w-3 h-3 text-primary-600" />
                                <span>Members:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {team.members.map((m, i) => {
                                  const name = typeof m === 'string' ? m : m.full_name;
                                  return (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[11px] font-mono font-medium text-slate-700"
                                    >
                                      {name}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </CardHeader>
                        </div>

                        {/* Card Footer CTA */}
                        <CardContent className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50">
                          <Link to={`/team/${team.slug}`} className="w-full block">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full text-xs justify-between bg-white hover:bg-primary-600 hover:text-white border-slate-200 text-slate-800 transition-all font-semibold"
                              rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                            >
                              <span>Explore Team Profile</span>
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title={`No finalist teams matching "${finalSearchQuery}"`}
                  description="Check your search spelling. You can search by team name (e.g. Garuda, Paradox), member name (e.g. Aarav, Ansul), or track."
                  action={
                    <Button variant="secondary" size="sm" onClick={() => setFinalSearchQuery('')}>
                      Clear Search Filter
                    </Button>
                  }
                />
              )}
            </div>
          </TabsContent>

          {/* ============================================================== */}
          {/* ROUND 2: 100 SELECTED TEAMS (SEARCHABLE, PAGINATED)             */}
          {/* ============================================================== */}
          <TabsContent value="round-2">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
                      Round 2 Selected Teams ({round2Teams.length} Teams)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-50 text-primary-700 border border-blue-200">
                      Team Names Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Displaying official shortlisted team names advancing to the prototype development sprint.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative min-w-[240px] sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search team names..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-primary-500"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label="Clear search query"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsImportModalOpen(true)}
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                    className="text-xs whitespace-nowrap bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Import Roster (CSV)
                  </Button>
                </div>
              </div>

              {isLoadingRound2 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 py-6">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 animate-pulse rounded-md" />
                  ))}
                </div>
              ) : paginatedRound2Teams.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                    {paginatedRound2Teams.map((teamName, idx) => {
                      const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                      const isParadox = teamName.toLowerCase() === 'paradox';
                      return (
                        <div
                          key={`${teamName}-${idx}`}
                          className={`p-3 rounded-xl border text-xs font-mono transition-colors flex items-center justify-between gap-2 ${
                            isParadox
                              ? 'bg-blue-50/80 border-blue-300 text-primary-800 font-semibold shadow-xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              #{String(globalIndex).padStart(3, '0')}
                            </span>
                            <span className="font-medium truncate" title={teamName}>
                              {teamName}
                            </span>
                          </div>
                          {isParadox && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary-600 text-white">
                              Finalist
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
                    <div>
                      Showing {(currentPage - 1) * pageSize + 1}–
                      {Math.min(currentPage * pageSize, filteredRound2Teams.length)} of{' '}
                      {filteredRound2Teams.length} {searchQuery ? 'matching teams' : 'selected teams'}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                        className="text-xs px-2.5 py-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        Previous
                      </Button>

                      <span className="px-2 text-slate-700 font-semibold">
                        Page {currentPage} of {totalPages}
                      </span>

                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                        className="text-xs px-2.5 py-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title={`No teams found matching "${searchQuery}"`}
                  description="Verify team name spelling or clear the search query to view all 100 selected teams."
                  action={
                    <Button variant="secondary" size="sm" onClick={handleClearSearch}>
                      Clear Search Filter
                    </Button>
                  }
                />
              )}
            </div>
          </TabsContent>

          {/* ============================================================== */}
          {/* ROUND 1: 500+ COUNT ONLY                                       */}
          {/* ============================================================== */}
          <TabsContent value="round-1">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="space-y-3 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-50 text-primary-700 border border-blue-200 font-semibold">
                      Round 1 Intake
                    </span>
                    <span className="text-xs font-mono text-slate-500">Count-Only Display</span>
                  </div>
                  <div className="text-5xl sm:text-7xl font-bold font-mono text-primary-600 tracking-tight">
                    {round1.metric}
                  </div>
                  <div className="text-base font-bold text-slate-900 font-display">
                    Applicant Teams Nationwide
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under competition governance, Round 1 is published exclusively as a verified total count ({round1.metric}).
                  </p>
                </div>

                <div className="lg:col-span-2 space-y-5">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Round 1 Evaluation Protocol & Governance
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Abstract Verification</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Peer screening of architecture, algorithmic feasibility, and Himalayan ecosystem relevance.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600" />
                        <span>Shortlist Threshold</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Top 100 teams qualify to advance to Round 2 development sprint and intermediate code syncs.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                      <span>Round 1 Status: Screening Submissions Complete</span>
                    </div>
                    <span className="text-primary-700 font-bold">500+ Count Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Organizer CSV Import Modal */}
        <OrganizerImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
        />
      </Container>
    </section>
  );
}
