import React from 'react';
import { Modal } from './ui/Modal';
import { Heading, Text } from './ui/Typography';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Clock, ExternalLink, User, AlertTriangle } from 'lucide-react';

export function AnnouncementDetailModal({ announcement, isOpen, onClose }) {
  if (!announcement) return null;

  const formattedDate = new Date(announcement.published_at || announcement.created_at).toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Hackathon Bulletin"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Priority & Date header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <Badge
            variant={announcement.priority === 'urgent' ? 'amber' : 'emerald'}
            size="sm"
            icon={announcement.priority === 'urgent' ? <AlertTriangle className="w-3 h-3" /> : undefined}
          >
            {announcement.priority === 'urgent' ? 'Urgent Official Advisory' : 'General Notice'}
          </Badge>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-semibold">
            <Clock className="w-3.5 h-3.5 text-primary-600" />
            <span>{formattedDate} IST</span>
          </div>
        </div>

        {/* Headline */}
        <div>
          <Heading as="h2" size="lg" className="text-slate-900 font-bold">
            {announcement.title}
          </Heading>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-2 font-semibold">
            <User className="w-3.5 h-3.5 text-primary-600" />
            <span>Issued by: {announcement.author || 'Organizing Committee'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm leading-relaxed space-y-3 whitespace-pre-line font-sans shadow-xs">
          {announcement.content}
        </div>

        {/* Source Link (When available) */}
        {announcement.source_url && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                <ExternalLink className="w-3.5 h-3.5 text-primary-600" />
                <span>Verified Source Reference</span>
              </div>
              <p className="text-slate-500 text-[11px] truncate max-w-md">
                {announcement.source_url}
              </p>
            </div>
            <a
              href={announcement.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-mono font-bold underline shrink-0"
            >
              <span>Open Source Document</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Footer info & close button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono">
          <span>Timezone: Asia/Kolkata</span>
          <Button variant="outline" size="sm" onClick={onClose} className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
            Close Bulletin
          </Button>
        </div>
      </div>
    </Modal>
  );
}
