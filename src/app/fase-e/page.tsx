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
  KitSidebar,
  EscalationBox,
} from '@/components/Sidebar';
import {
  faseEHero,
  faseEContext,
  faseEChecklist,
  faseEStorageKey,
  faseEActivities,
  faseEMetrics,
  faseEDecisions,
  faseEErrors,
  faseETimeline,
  faseEEscalationItems,
  faseEKitItems,
} from '@/data/fase-e-content';

const progressPhaseLabels = [
  'A \u00b7 Inicio',
  'B \u00b7 Preparaci\u00f3n',
  'C \u00b7 Modelado',
  'D \u00b7 Pre-lanzamiento',
  'E \u00b7 Post-lanzamiento',
];

const roleColorClasses: Record<string, { bg: string; text: string }> = {
  green: { bg: 'bg-green-light', text: 'text-green-success' },
  blue: { bg: 'bg-blue-light', text: 'text-blue-primary' },
  purple: { bg: 'bg-purple-light', text: 'text-purple-accent' },
};

const metricColorClasses: Record<string, { bg: string; border: string; title: string }> = {
  blue: { bg: 'bg-blue-light', border: 'border-l-blue-primary', title: 'text-blue-primary' },
  orange: { bg: 'bg-orange-light', border: 'border-l-orange-accent', title: 'text-orange-accent' },
  green: { bg: 'bg-green-light', border: 'border-l-green-success', title: 'text-green-success' },
};

export default function FaseEPage() {
  const [checklistCompleted, setChecklistCompleted] = useState(0);
  const totalChecklist = faseEChecklist.length;

  const handleChecklistChange = useCallback((completed: number) => {
    setChecklistCompleted(completed);
  }, []);

  // Phase E base offset ~75% (A+B+C+D), adds up to ~25%
  const phasePercent = totalChecklist > 0 ? checklistCompleted / totalChecklist : 0;
  const totalPercent = Math.round(75 + phasePercent * 25);

  // Build accordion items from activities data
  const accordionItems = faseEActivities.map((activity) => ({
    title: activity.title,
    subtitle: activity.subtitle,
    meetingNumber: activity.number,
    meetingColor: 'orange' as const,
    tags: [
      { label: activity.tag, variant: activity.tagType as 'required' | 'optional' },
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
            <AccordionDeliverable key={di} text={`\ud83d\udccb ${d.text}`} />
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
          <div className="mt-2 p-2.5 px-3.5 bg-blue-light rounded-lg">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-blue-primary mb-1">
              TIP
            </div>
            <div className="text-[13px] text-text-secondary">{activity.tip}</div>
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
        <section className="pt-10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-yellow-light text-yellow-warning mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-warning animate-[pulse_2s_infinite]" />
            {faseEHero.badge}
          </div>
          <h1 className="font-display text-[2.5rem] font-extrabold leading-tight mb-3">
            {faseEHero.title}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            {faseEHero.description}
          </p>
        </section>

        {/* Progress Bar */}
        <section className="pb-10">
          <ProgressBar
            completed={totalPercent}
            total={100}
            phaseLabels={progressPhaseLabels}
            activePhaseIndex={4}
          />
        </section>

        {/* Videos de la fase */}
        <FaseVideos faseLetter="E" />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 pb-10">
          {/* Main content */}
          <div className="flex flex-col gap-6">
            {/* Context card */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] border-l-[3px] border-l-yellow-warning">
              <div className="flex items-start gap-3 p-5 pb-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-light flex items-center justify-center text-base shrink-0">
                  \ud83d\udccd
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Donde estas — Contexto de la Fase E
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    Que deberia estar listo y que viene ahora
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="mb-3">
                  <div className="text-xs font-bold text-green-success mb-1.5">
                    COMPLETASTE EN FASE D
                  </div>
                  <ul className="text-[13px] text-text-secondary pl-5 list-disc leading-[1.8]">
                    {faseEContext.completedInD.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <div className="text-xs font-bold text-yellow-warning mb-1.5">
                    FASE E SE ENFOCA EN
                  </div>
                  <p className="text-[13px] text-text-secondary">
                    {faseEContext.focusNow}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold text-orange-accent mb-1.5">
                    ROLES CRITICOS AHORA
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {faseEContext.criticalRoles.map((role, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${roleColorClasses[role.color].bg} ${roleColorClasses[role.color].text}`}
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
                <div className="w-9 h-9 rounded-xl bg-yellow-light flex items-center justify-center text-base shrink-0">
                  \u2713
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Checklist — \u00bfPuedes cerrar los 90 d\u00edas?
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    Completa todo para cerrar el ciclo
                  </div>
                </div>
              </div>
              <Checklist
                storageKey={faseEStorageKey}
                items={faseEChecklist}
                onCountChange={handleChecklistChange}
              />
            </div>

            {/* Activities */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-yellow-light flex items-center justify-center text-base shrink-0">
                  \ud83d\udcc5
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Actividades de la Fase E
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    3 bloques de trabajo — click para expandir
                  </div>
                </div>
              </div>
              <Accordion items={accordionItems} />
            </div>

            {/* Metrics */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-yellow-light flex items-center justify-center text-base shrink-0">
                  \ud83d\udcca
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Metricas clave
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    3 categorias para medir el exito
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                {faseEMetrics.map((cat, i) => {
                  const colors = metricColorClasses[cat.color];
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border-l-[3px] ${colors.bg} ${colors.border}`}
                    >
                      <div className={`text-xs font-bold mb-2 ${colors.title}`}>
                        {cat.name}
                      </div>
                      <div className="text-[13px] text-text-secondary leading-relaxed">
                        {cat.metrics.map((m, mi) => (
                          <span key={mi}>
                            {m}
                            {mi < cat.metrics.length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decisions */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-light flex items-center justify-center text-base shrink-0">
                  \u2696\ufe0f
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Decisiones clave
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    Judgment calls que vas a enfrentar
                  </div>
                </div>
              </div>
              {faseEDecisions.map((d, i) => (
                <div
                  key={i}
                  className="py-3 border-b border-border-subtle last:border-b-0"
                >
                  <div className="text-sm font-semibold mb-1">{d.question}</div>
                  <div className="text-[13px] text-text-secondary">{d.criteria}</div>
                </div>
              ))}
            </div>

            {/* Errors */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-light flex items-center justify-center text-base shrink-0">
                  \u26a0\ufe0f
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Errores comunes
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    Lo que sale mal y c\u00f3mo resolverlo
                  </div>
                </div>
              </div>
              {faseEErrors.map((err, i) => (
                <div
                  key={i}
                  className="py-3 border-b border-border-subtle last:border-b-0"
                >
                  <div className="text-sm font-semibold text-red-alert mb-1">
                    {err.title}
                  </div>
                  <div className="text-[13px] text-text-secondary">{err.fix}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar>
            <TimelineSidebar
              phases={faseETimeline.map((t) => ({
                label: t.label,
                weeks: t.weeks,
                state: t.status,
              }))}
            />
            <EscalationBox
              title="\ud83d\udd37 Cu\u00e1ndo escalar a Sovra"
              items={faseEEscalationItems}
            />
            <KitSidebar
              title="\ud83d\udce6 Kit de materiales — Fase E"
              items={faseEKitItems}
            />
          </Sidebar>
        </div>

        {/* Phase Nav */}
        <PhaseNav
          prevHref="/fase-d"
          prevLabel="Fase D: Pre-lanzamiento"
          nextHref="/takeover"
          nextLabel="Partner Takeover"
        />
      </main>
    </>
  );
}
