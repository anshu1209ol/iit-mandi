import React, { useState } from 'react';
import { Container } from './ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Heading, Text } from './ui/Typography';
import { Badge } from './ui/Badge';
import { CAMPUS_MEDIA } from '../config/campusMedia';
import { Camera, MapPin, ExternalLink, Mountain, Compass } from 'lucide-react';

export function CampusShowcase() {
  const images = CAMPUS_MEDIA.gallery;

  return (
    <section id="campus" className="py-20 sm:py-28 border-t border-surface-border bg-surface-subtle/30">
      <Container size="wide">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="emerald" size="sm" icon={<Compass className="w-3.5 h-3.5" />}>
                Ecosystem & Setting
              </Badge>
              <span className="text-xs font-mono text-slate-400">Kamand Valley · 1,000m Elevation</span>
            </div>
            <Heading as="h2" size="xl">
              Authentic Campus Environment
            </Heading>
            <Text variant="body" className="max-w-2xl mt-2">
              Nestled along the Uhl River valley in the Shivalik foothills of the Himalayas, IIT Mandi’s natural setting inspires our core problem statements in mountain resilience and clean technology.
            </Text>
          </div>
          <div className="text-xs font-mono text-slate-400">
            <span className="text-emerald-400">2 Campuses</span>: North & South Kamand
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {images.map((img) => (
            <Card key={img.id} variant="default" className="overflow-hidden flex flex-col justify-between group bg-white border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div>
                {/* Responsive Image Container with Aspect Ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur-md border-slate-200 text-slate-800 shadow-xs">
                      {img.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[11px] font-mono text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                      Captured: {img.dateCaptured}
                    </span>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 font-bold">
                    {img.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-2 text-sm leading-relaxed">
                    {img.description}
                  </CardDescription>
                </CardHeader>
              </div>

              {/* Attribution and License Footer */}
              <div className="p-5 sm:p-6 pt-3 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                  <span>Photo: {img.author}</span>
                </div>
                <a
                  href={img.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 hover:underline font-semibold"
                  title="Verify license on Wikimedia Commons"
                >
                  <span>{img.license}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* Setting Note */}
        <div className="mt-8 p-5 bg-white rounded-card border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <Mountain className="w-5 h-5 text-primary-600 shrink-0" />
            <p className="leading-relaxed">
              All photography is sourced from certified open repositories under Creative Commons licenses with attribution preserved. No official institute seals are used without authorization.
            </p>
          </div>
          <div className="shrink-0 font-mono text-slate-500">
            Coordinates: 31°46'26" N, 76°59'42" E
          </div>
        </div>
      </Container>
    </section>
  );
}
