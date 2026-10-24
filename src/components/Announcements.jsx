import React, { useState, useEffect } from 'react';
import { Container } from './ui/Container';
import { Heading, Text } from './ui/Typography';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { CardSkeleton } from './ui/Skeleton';
import { AnnouncementDetailModal } from './AnnouncementDetailModal';
import { eventDataService } from '../services/eventDataService';
import {
  Bell,
  Info,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const data = await eventDataService.getAnnouncements();
        if (isMounted) {
          const sorted = [...(data || [])].sort((a, b) => {
            const timeA = new Date(a.published_at || a.created_at).getTime();
            const timeB = new Date(b.published_at || b.created_at).getTime();
            return timeB - timeA;
          });
          setAnnouncements(sorted);
        }
      } catch (err) {
        console.warn('Could not load announcements from database:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenDetail = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailOpen(true);
  };

  return (
    <section id="announcements" className="py-16 sm:py-24 border-t border-slate-200 bg-white">
      <Container size="wide">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-primary-600" />
                Official Desk
              </span>
              <span className="text-xs font-mono text-slate-500">Chronological Bulletins</span>
            </div>
            <Heading as="h2" size="xl" className="text-slate-900 text-2xl sm:text-4xl font-bold tracking-tight">
              Official Announcements & Advisories
            </Heading>
            <Text variant="body" className="mt-2 max-w-2xl text-slate-600">
              Technical room allocations, milestone guidelines, and evaluation advisories published directly by the hackathon organizing committee.
            </Text>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {announcements.map((item) => {
              const formattedDate = new Date(item.published_at || item.created_at).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Kolkata',
              });

              return (
                <div
                  key={item.id}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-primary-400 hover:bg-white transition-all shadow-xs hover:shadow-md space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${
                        item.priority === 'urgent'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {item.priority === 'urgent' ? 'Urgent Advisory' : 'Official Notice'}
                      </span>
                      <span>{formattedDate} IST</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-display leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {item.source_url ? (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-mono transition-colors font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Source Link</span>
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">
                        Published by {item.author || 'Organizers'}
                      </span>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDetail(item)}
                      className="text-xs font-mono font-bold text-primary-600 hover:text-primary-700 p-0 hover:bg-transparent"
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Read Full Bulletin
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="No Announcements Published Yet"
            description="The official organizing desk will publish technical advisories, room allocations, and checkpoint briefings here prior to and throughout the 27–29 October 2026 event days."
            action={
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <Info className="w-3.5 h-3.5 text-primary-600" />
                <span>Confirmed Daily Operating Window: 9:00 AM – 5:00 PM IST</span>
              </div>
            }
          />
        )}
      </Container>

      {/* Announcement Detail Modal */}
      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedAnnouncement(null);
        }}
      />
    </section>
  );
}
