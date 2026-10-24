import React, { useState } from 'react';
import { Navigation } from '../components/ui/Navigation';
import { Hero } from '../components/Hero';
import { EventDateCountdown } from '../components/EventDateCountdown';
import { RoundsOverview } from '../components/RoundsOverview';
import { SelectedTeams } from '../components/SelectedTeams';
import { Schedule } from '../components/Schedule';
import { Announcements } from '../components/Announcements';
import { EventDetails } from '../components/EventDetails';
import { Footer } from '../components/ui/Footer';
import { RegistrationModal } from '../components/RegistrationModal';

export function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [preselectedTrack, setPreselectedTrack] = useState(null);

  const handleOpenRegister = (trackId = null) => {
    setPreselectedTrack(trackId);
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-700">
      {/* 1. Responsive Navigation */}
      <Navigation onOpenRegister={() => handleOpenRegister()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Cinematic Campus-Image Hero */}
        <Hero onOpenRegister={() => handleOpenRegister()} />

        {/* 3. Event Date and Countdown */}
        <EventDateCountdown />

        {/* 4. Three-Round Competition Overview */}
        <RoundsOverview />

        {/* 5. Selected-Team Highlights */}
        <SelectedTeams />

        {/* 6. Three-Day Schedule Overview */}
        <Schedule />

        {/* 7. Latest Published Announcements */}
        <Announcements />

        {/* 8. Event Details */}
        <EventDetails />
      </main>

      {/* 9. Footer with Verified Contact Details Only */}
      <Footer />

      {/* Registration Modal Dialog */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialTrack={preselectedTrack}
      />
    </div>
  );
}
