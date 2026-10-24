import React from 'react';
import { Container } from './ui/Container';
import { Card } from './ui/Card';
import { Heading, Text } from './ui/Typography';
import { EVENT_DETAILS } from '../config/eventData';
import { CAMPUS_MEDIA } from '../config/campusMedia';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Camera,
  ExternalLink,
  Shield,
  Mountain,
  Compass,
  FileCheck
} from 'lucide-react';

export function EventDetails() {
  const galleryImages = CAMPUS_MEDIA.gallery || [];

  return (
    <section id="details" className="py-16 sm:py-24 border-t border-slate-200 bg-white">
      <Container size="wide">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-primary-700 border border-blue-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary-600" />
              Operational Framework
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">Kamand Campus Desk</span>
          </div>
          <Heading as="h2" size="xl" className="text-slate-900 text-2xl sm:text-4xl font-bold tracking-tight">
            Event Logistics & Institutional Setting
          </Heading>
          <Text variant="body" className="mt-2 text-slate-600">
            Hosted at the Indian Institute of Technology Mandi, Kamand Campus. Operating parameters, campus access windows, and regional geography.
          </Text>
        </div>

        {/* 4 Core Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Confirmed Dates */}
          <Card variant="default" className="p-6 space-y-3 bg-slate-50 border-slate-200 shadow-xs hover:border-primary-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
              Event Dates
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              {EVENT_DETAILS.dates.display}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              3 consecutive operating days with synchronized milestone check-ins.
            </p>
          </Card>

          {/* Card 2: Operating Hours */}
          <Card variant="default" className="p-6 space-y-3 bg-slate-50 border-slate-200 shadow-xs hover:border-primary-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
              Daily Operating Hours
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              {EVENT_DETAILS.dates.startTime} – {EVENT_DETAILS.dates.endTime}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-mono">
              Timezone: {EVENT_DETAILS.timezone} (Asia/Kolkata).
            </p>
          </Card>

          {/* Card 3: Host Venue */}
          <Card variant="default" className="p-6 space-y-3 bg-slate-50 border-slate-200 shadow-xs hover:border-primary-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
              Host Location
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              Kamand Campus
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {EVENT_DETAILS.location.venue}, {EVENT_DETAILS.location.city} ({EVENT_DETAILS.location.pinCode}).
            </p>
          </Card>

          {/* Card 4: Evaluation Mode */}
          <Card variant="default" className="p-6 space-y-3 bg-slate-50 border-slate-200 shadow-xs hover:border-primary-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
              Participation Mode
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              Hybrid Mode
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              On-campus workstation desks and remote milestone code synchronization.
            </p>
          </Card>
        </div>

        {/* Operational Guidelines */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 mb-12 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Operational Standards & Guidelines
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            {EVENT_DETAILS.guidelines.map((rule, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-primary-600 font-mono">0{idx + 1}.</span>
                  <span>{rule.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rule.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Campus Environment Imagery */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-primary-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                Campus Environment & Himalayan Context
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Kamand Valley · Elevation 1,000m</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages.map((img) => (
              <Card key={img.id} variant="default" className="overflow-hidden flex flex-col justify-between bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all">
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-slate-800 shadow-xs">
                      {img.category}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-2">
                    <h4 className="text-base font-bold text-slate-900 font-display">
                      {img.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {img.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
                  <span>Photo by {img.author}</span>
                  <a
                    href={img.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    <span>{img.license} License</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
