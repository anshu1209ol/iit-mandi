import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Label, Input, Textarea, Select, Checkbox, FormError, FormHelper } from './ui/FormControls';
import { Badge } from './ui/Badge';
import { EVENT_DETAILS } from '../config/eventData';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export function RegistrationModal({ isOpen, onClose, initialTrack }) {
  const [formData, setFormData] = useState({
    teamName: '',
    leadName: '',
    leadEmail: '',
    institution: '',
    teamSize: '2',
    trackId: initialTrack || EVENT_DETAILS.tracks[0]?.id || '',
    abstract: '',
    agreedToRules: false,
  });

  // Sync initialTrack if it changes
  useEffect(() => {
    if (initialTrack) {
      setFormData((prev) => ({ ...prev, trackId: initialTrack }));
    }
  }, [initialTrack]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.teamName.trim()) errs.teamName = 'Team name is required.';
    if (!formData.leadName.trim()) errs.leadName = 'Team lead name is required.';
    if (!formData.leadEmail.trim() || !formData.leadEmail.includes('@')) {
      errs.leadEmail = 'A valid institutional or personal email is required.';
    }
    if (!formData.institution.trim()) errs.institution = 'College / University / Organization is required.';
    if (!formData.abstract.trim()) errs.abstract = 'Brief problem / idea description is required.';
    if (!formData.agreedToRules) errs.agreedToRules = 'You must acknowledge hackathon rules and timing limits.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('registrations').insert([
          {
            team_name: formData.teamName,
            lead_name: formData.leadName,
            lead_email: formData.leadEmail,
            institution: formData.institution,
            team_size: parseInt(formData.teamSize, 10),
            track_id: formData.trackId,
            abstract: formData.abstract,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      } else {
        // Fallback simulate quick local receipt (until user links their Supabase credentials)
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setIsSuccess(true);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrors({});
    setFormData({
      teamName: '',
      leadName: '',
      leadEmail: '',
      institution: '',
      teamSize: '2',
      trackId: EVENT_DETAILS.tracks[0]?.id || '',
      abstract: '',
      agreedToRules: false,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={isSuccess ? 'Registration Received' : 'Team Registration'}
      description={
        isSuccess
          ? 'Your submission has been recorded for technical screening.'
          : 'Participate in the IIT Mandi Hackathon (27–29 October 2026).'
      }
      maxWidth="max-w-xl"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-slate-900 font-display">
              Team: {formData.teamName}
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your registration submission has been saved to the database for lead contact{' '}
              <span className="text-primary-600 font-mono font-bold">{formData.leadEmail}</span>. Shortlisted teams and schedule bulletins are published directly on this public site.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">Important Reminders:</div>
            <div>• Hackathon Operating Timings: Daily 9:00 AM – 5:00 PM IST (27–29 October 2026).</div>
            <div>• All code must be authored inside the hackathon evaluation window.</div>
          </div>
          <div className="pt-2">
            <Button variant="primary" onClick={handleReset} className="w-full">
              Close & Return to Overview
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSupabaseConfigured && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
              <ShieldAlert className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
              <span>
                <strong>System Notice:</strong> Supabase credentials are not connected yet. Form will validate inputs in preview mode.
              </span>
            </div>
          )}

          {errors.form && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamName" required>Team Name</Label>
              <Input
                id="teamName"
                placeholder="e.g. Apex Dynamics"
                value={formData.teamName}
                error={errors.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              />
              <FormError>{errors.teamName}</FormError>
            </div>

            <div>
              <Label htmlFor="teamSize" required>Team Size</Label>
              <Select
                id="teamSize"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              >
                <option value="1">1 Member (Individual)</option>
                <option value="2">2 Members</option>
                <option value="3">3 Members</option>
                <option value="4">4 Members (Maximum)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadName" required>Team Lead Full Name</Label>
              <Input
                id="leadName"
                placeholder="Your full name"
                value={formData.leadName}
                error={errors.leadName}
                onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
              />
              <FormError>{errors.leadName}</FormError>
            </div>

            <div>
              <Label htmlFor="leadEmail" required>Contact Email</Label>
              <Input
                id="leadEmail"
                type="email"
                placeholder="lead@university.edu"
                value={formData.leadEmail}
                error={errors.leadEmail}
                onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
              />
              <FormError>{errors.leadEmail}</FormError>
            </div>
          </div>

          <div>
            <Label htmlFor="institution" required>University / College / Institution</Label>
            <Input
              id="institution"
              placeholder="e.g. IIT Mandi, NIT Hamirpur, etc."
              value={formData.institution}
              error={errors.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
            <FormError>{errors.institution}</FormError>
          </div>

          <div>
            <Label htmlFor="trackId" required>Primary Challenge Track</Label>
            <Select
              id="trackId"
              value={formData.trackId}
              onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
            >
              {EVENT_DETAILS.tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title} ({track.tag})
                </option>
              ))}
            </Select>
            <FormHelper>You can refine your specific problem statement during Day 1 check-in.</FormHelper>
          </div>

          <div>
            <Label htmlFor="abstract" required>Abstract / Problem Statement Brief</Label>
            <Textarea
              id="abstract"
              rows={3}
              placeholder="Describe the problem, intended technical stack, and mountain/systems relevance..."
              value={formData.abstract}
              error={errors.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            />
            <FormError>{errors.abstract}</FormError>
          </div>

          <div className="pt-2">
            <Checkbox
              id="agreedToRules"
              checked={formData.agreedToRules}
              onChange={(e) => setFormData({ ...formData, agreedToRules: e.target.checked })}
              label="Acknowledge Official Rules & Timings"
              description="I confirm all code will be written during 27–29 October 2026 within the 9:00 AM – 5:00 PM IST daily evaluation period."
            />
            <FormError>{errors.agreedToRules}</FormError>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-border">
            <Button variant="ghost" onClick={handleReset} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Submit Registration
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
