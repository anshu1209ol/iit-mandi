import React from 'react';
import { Container } from './ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Heading, Text } from './ui/Typography';
import { Badge } from './ui/Badge';
import { EVENT_DETAILS } from '../config/eventData';
import { ShieldCheck, BookOpen, CheckSquare, Award } from 'lucide-react';

export function Guidelines() {
  const criteria = [
    { label: 'Technical Rigor & Code Quality', weight: '30%', desc: 'Sound architectural principles, code documentation, and robustness.' },
    { label: 'Mountain & Himalayan Relevance', weight: '25%', desc: 'Direct applicability to environmental, terrain, or high-altitude challenges.' },
    { label: 'Feasibility & Edge Scalability', weight: '25%', desc: 'Ability to operate under constrained bandwidth, power, and compute resources.' },
    { label: 'Prototype Demonstration', weight: '20%', desc: 'Clarity of presentation, live prototype behavior, and jury Q&A.' },
  ];

  return (
    <section id="guidelines" className="py-20 sm:py-28 border-t border-surface-border">
      <Container size="wide">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="amber" size="sm">Academic Standards</Badge>
            <span className="text-xs font-mono text-slate-400">Rules & Evaluation</span>
          </div>
          <Heading as="h2" size="xl">
            Guidelines & Assessment Matrix
          </Heading>
          <Text variant="body" className="mt-2">
            All teams are held to peer-reviewed academic rigor. Review the fundamental guidelines below before finalizing team registration.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rules and Eligibility */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Participation Rules</span>
            </h3>

            <div className="space-y-3">
              {EVENT_DETAILS.guidelines.map((rule, idx) => (
                <Card key={idx} variant="subtle" className="p-4 sm:p-5 bg-white border-slate-200 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        {rule.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {rule.detail}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Assessment Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Evaluation Weighting</span>
            </h3>

            <div className="bg-white p-6 rounded-card border border-slate-200 shadow-xs space-y-4">
              {criteria.map((item, idx) => (
                <div key={idx} className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                    <Badge variant="emerald" size="sm">{item.weight}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-50/80 rounded-lg border border-amber-200/80 text-xs text-amber-900 leading-relaxed shadow-xs">
              <span className="font-bold text-amber-950">Plagiarism Zero-Tolerance: </span>
              Pre-existing commercial software or undeclared pre-built repositories will result in disqualification from technical jury scoring.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
