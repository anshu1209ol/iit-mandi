import React from 'react';
import { Container } from './Container';
import { Mountain, MapPin, Clock, Calendar, Mail } from 'lucide-react';
import { EVENT_DETAILS } from '../../config/eventData';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80 pt-16 pb-12 mt-20">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Identity & Scope */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary-600">
                <Mountain className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-slate-900 text-lg">
                {EVENT_DETAILS.name}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {EVENT_DETAILS.subheading}. High-altitude geospatial hazards, sustainable infrastructure, and edge systems.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Edition: {EVENT_DETAILS.edition}
            </div>
          </div>

          {/* Key Event Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Event Details
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <span>{EVENT_DETAILS.dates.display}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <span>{EVENT_DETAILS.dates.startTime} – {EVENT_DETAILS.dates.endTime} ({EVENT_DETAILS.timezone})</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <span>{EVENT_DETAILS.location.campus}, {EVENT_DETAILS.location.city} ({EVENT_DETAILS.location.pinCode})</span>
              </li>
            </ul>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#overview" className="hover:text-primary-600 transition-colors">
                  Overview & Hero
                </a>
              </li>
              <li>
                <a href="#countdown" className="hover:text-primary-600 transition-colors">
                  Countdown Clock
                </a>
              </li>
              <li>
                <a href="#rounds" className="hover:text-primary-600 transition-colors">
                  Three Competition Rounds
                </a>
              </li>
              <li>
                <a href="#teams" className="hover:text-primary-600 transition-colors">
                  20 Indian Finalist Teams
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-primary-600 transition-colors">
                  Three-Day Schedule
                </a>
              </li>
              <li>
                <a href="/details" className="hover:text-primary-600 transition-colors">
                  Full Event Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Official Verification Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Official Desk
            </h4>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5 text-xs text-slate-600 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Mail className="w-4 h-4 text-primary-600 shrink-0" />
                <span>{EVENT_DETAILS.contact.email}</span>
              </div>
              <p className="leading-relaxed">
                {EVENT_DETAILS.contact.campusDesk}
              </p>
              <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                Operating Window: {EVENT_DETAILS.contact.operatingHours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {currentYear} IIT Mandi Hackathon Organizing Committee.
          </div>
          <div className="flex items-center gap-4">
            <span>Kamand Campus, Mandi, HP 175005</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
