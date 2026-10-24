import React, { useState } from 'react';
import { Container } from './ui/Container';
import { Heading, Text } from './ui/Typography';
import { Badge } from './ui/Badge';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What are the exact event dates and daily timings?',
      a: 'The hackathon takes place from 27 to 29 October 2026. The technical workspace, mentorship sessions, and daily evaluation checkpoints operate strictly between 9:00 AM and 5:00 PM IST each day.',
    },
    {
      q: 'What is the permitted team composition?',
      a: 'Teams may consist of 2 to 4 members. Interdisciplinary cross-departmental teams (e.g., computer science with civil, mechanical, or earth science) are highly encouraged given the mountain resilience themes.',
    },
    {
      q: 'Can teams bring specialized hardware or sensors?',
      a: 'Yes. Teams working on edge compute, IoT sensing, UAV perception, or geotechnical monitoring may bring microcontrollers (e.g., Raspberry Pi, ESP32, Jetson) and sensor kits. Prior declaration in team abstract submission is appreciated.',
    },
    {
      q: 'Are pretrained models and open-source libraries permitted?',
      a: 'Standard public open-source libraries, pretrained model weights (e.g., Hugging Face, PyTorch models), and framework scaffolding are permitted, provided they are cited in the repository README. All project-specific logic and integration code must be written during the hackathon.',
    },
    {
      q: 'Is there a registration fee to participate?',
      a: 'Participation in the academic hackathon is entirely free of charge for shortlisted student teams and research scholars.',
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 border-t border-surface-border">
      <Container size="narrow">
        <div className="text-center mb-12">
          <Badge variant="default" size="sm" className="mb-2">FAQ</Badge>
          <Heading as="h2" size="xl">
            Frequently Asked Questions
          </Heading>
          <Text variant="body" className="mt-2">
            Key logistical, technical, and operational details for participating teams.
          </Text>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-card border border-slate-200 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-900 font-display">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
                      isOpen && 'rotate-180 text-primary-600'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
