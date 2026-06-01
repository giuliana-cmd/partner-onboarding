'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import {
  Accordion,
  AccordionSection,
  AccordionList,
  AccordionDeliverable,
  AccordionAttendees,
} from '@/components/Accordion';
import { Checklist } from '@/components/Checklist';
import { ProgressBar } from '@/components/ProgressBar';
import { PhaseNav } from '@/components/PhaseNav';
import { FaseVideos } from '@/components/FaseVideos';
import {
  Sidebar,
  TimelineSidebar,
  EscalationBox,
  KitSidebar,
} from '@/components/Sidebar';
import {
  faseCHero,
  faseCContext,
  faseCChecklist,
  faseCStorageKey,
  faseCActivities,
  faseCDecisions,
  faseCErrors,
  faseCTimeline,
  faseCEscalationItems,
  faseCKitItems,
} from '@/data/fase-c-content';

const PHASE_LABELS = [
  'A · Inicio',
  'B · Preparación',
  'C · Modelado',
  'D · Pre-lanzamiento',
  'E · Post-lanzamiento',
];

const roleBadgeColors: Record<string, string> = {
  purple: 'bg-purple-light text-purple-accent',
  orange: 'bg-orange-light text-orange-accent',
  blue: 'bg-blue-light text-blue-primary',
};

export default function FaseCPage() {
  const [completed, setCompleted] = useState(0);
  const total = faseCChecklist.length;

  const handleCountChange = useCallback((count: number) => {
    setCompleted(count);
  }, []);

  // Build accordion items from activities data
  const activityAccordionItems = faseCActivities.map((activity) => ({
    title: activity.title,
    subtitle: activity.subtitle,
    meetingNumber: activity.number,
    meetingColor: 'orange' as const,
    tags: [
      {
        label: activity.tag,
        variant: activity.tagType as 'required' | 'optional',
      },
      { label: activity.duration, variant: 'duration' as const },
    ],
    children: (
      <>
        {activity.sections.map((section, si) => (
          <AccordionSection key={si} label={section.label}>
            {section.content && (
              <p className="text-[13px] text-text-secondary">{section.content}</p>
            )}
            {section.items && <AccordionList items={section.items} />}
          </AccordionSection>
        ))}
        <AccordionSection label="Entregables resultantes">
          {activity.deliverables.map((d, di) => (
            <AccordionDeliverable key={di} text={`📋 ${d.text}`} />
          ))}
        </AccordionSection>
        <AccordionSection label="Participan">
          <AccordionAttendees
            attendees={activity.attendees.map((a) => ({
              name: a.label,
              required: a.required,
            }))}
          />
        </AccordionSection>
        {activity.tip && (
          <div className="mt-3 p-4 bg-yellow-light rounded-xl border-l-[3px] border-l-yellow-warning">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-yellow-warning mb-1">
              TIPS
            </div>
            <div className="text-[13px] text-text-primary">{activity.tip}</div>
          </div>
        )}
      </>
    ),
  }));

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-6">
        {/* Hero */}
        <section className="py-10 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] text-[13px] font-semibold bg-orange-light text-orange-accent mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-accent" />
            {faseCHero.badge}
          </div>
          <h1 className="font-display text-4xl font-extrabold mb-3">{faseCHero.title}</h1>
          <p className="text-text-secondary text-[15px] max-w-2xl leading-relaxed">
            {faseCHero.description}
          </p>
        </section>

        {/* Progress */}
        <section className="mb-8">
          <ProgressBar
            completed={completed}
            total={total}
            phaseLabels={PHASE_LABELS}
            activePhaseIndex={2}
          />
        </section>

        {/* Videos de la fase */}
        <FaseVideos faseLetter="C" />

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main content */}
          <div className="flex flex-col gap-5">
            {/* Context card */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border-l-[3px] border-l-orange-accent">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-light flex items-center justify-center text-base">
                  📍
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Donde estas — Contexto de la Fase C
                  </div>
                  <div className="text-[13px] text-text-muted">
                    Que deberia estar listo y que viene ahora
                  </div>
                </div>
              </div>
              <div className="px-1">
                <div className="mb-3">
                  <div className="text-xs font-bold text-green-success mb-1.5">
                    COMPLETASTE EN FASE B
                  </div>
                  <ul className="text-[13px] text-text-secondary m-0 pl-5 leading-[1.8]">
                    {faseCContext.completedInB.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <div className="text-xs font-bold text-orange-accent mb-1.5">
                    FASE C SE ENFOCA EN
                  </div>
                  <p className="text-[13px] text-text-secondary m-0">
                    {faseCContext.focusNow}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold text-orange-accent mb-1.5">
                    ROLES CRITICOS AHORA
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {faseCContext.criticalRoles.map((role, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-[20px] font-semibold ${roleBadgeColors[role.color]}`}
                      >
                        {role.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-light flex items-center justify-center text-base font-bold text-orange-accent">
                  ✓
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Checklist — ¿Puedes avanzar a Fase D?
                  </div>
                  <div className="text-[13px] text-text-muted">
                    Completa todo antes de avanzar
                  </div>
                </div>
              </div>
              <Checklist
                storageKey={faseCStorageKey}
                items={faseCChecklist}
                onCountChange={handleCountChange}
              />
            </div>

            {/* Activities */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-light flex items-center justify-center text-base">
                  🧪
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Actividades de la Fase C
                  </div>
                  <div className="text-[13px] text-text-muted">
                    3 bloques de trabajo — click para expandir
                  </div>
                </div>
              </div>
              <Accordion items={activityAccordionItems} />
            </div>

            {/* Decisions */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-light flex items-center justify-center text-base">
                  ⚖️
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">Decisiones clave</div>
                  <div className="text-[13px] text-text-muted">
                    Judgment calls que vas a enfrentar
                  </div>
                </div>
              </div>
              {faseCDecisions.map((decision, i) => (
                <div
                  key={i}
                  className="py-3.5 border-b border-border-subtle last:border-b-0 pl-4 border-l-[3px] border-l-purple-accent mb-2 last:mb-0"
                >
                  <div className="font-semibold text-sm mb-1">{decision.question}</div>
                  <div className="text-[13px] text-text-secondary">{decision.criteria}</div>
                </div>
              ))}
            </div>

            {/* Errors */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-light flex items-center justify-center text-base">
                  ⚠️
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">Errores comunes</div>
                  <div className="text-[13px] text-text-muted">
                    Lo que sale mal y cómo resolverlo
                  </div>
                </div>
              </div>
              {faseCErrors.map((error, i) => (
                <div
                  key={i}
                  className="py-3.5 border-b border-border-subtle last:border-b-0 pl-4 border-l-[3px] border-l-red-alert mb-2 last:mb-0"
                >
                  <div className="font-semibold text-sm mb-1">{error.title}</div>
                  <div className="text-[13px] text-text-secondary">{error.fix}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar>
            <TimelineSidebar
              phases={faseCTimeline.map((t) => ({
                label: t.label,
                weeks: t.weeks,
                state: t.status,
              }))}
            />
            <EscalationBox
              title="🔷 Cuándo escalar a Sovra"
              items={faseCEscalationItems}
            />
            <KitSidebar title="📦 Kit de materiales — Fase C" items={faseCKitItems} />
          </Sidebar>
        </div>

        {/* Phase nav */}
        <PhaseNav
          prevHref="/fase-b"
          prevLabel="Fase B: Preparación"
          nextHref="/fase-d"
          nextLabel="Fase D: Pre-lanzamiento"
        />
      </main>
    </>
  );
}
