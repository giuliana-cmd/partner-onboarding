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
  RolesSidebar,
  EscalationBox,
  KitSidebar,
} from '@/components/Sidebar';
import {
  faseBHero,
  faseBContext,
  faseBChecklist,
  faseBStorageKey,
  faseBPrinciple,
  faseBPartnerPrep,
  faseBMeetings,
  faseBMeetingsTip,
  faseBDecisions,
  faseBErrors,
  faseBTimeline,
  faseBSidebarRoles,
  faseBEscalationItems,
  faseBKitItems,
} from '@/data/fase-b-content';

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

export default function FaseBPage() {
  const [completed, setCompleted] = useState(0);
  const total = faseBChecklist.length;

  const handleCountChange = useCallback((count: number) => {
    setCompleted(count);
  }, []);

  // Build accordion items from meetings data
  const meetingAccordionItems = faseBMeetings.map((meeting) => ({
    title: meeting.title,
    subtitle: meeting.subtitle,
    meetingNumber: meeting.number,
    meetingColor: 'purple' as const,
    tags: [
      {
        label: meeting.tag,
        variant: meeting.tagType as 'required' | 'optional',
      },
      { label: meeting.duration, variant: 'duration' as const },
    ],
    children: (
      <>
        {meeting.sections.map((section, si) => (
          <AccordionSection key={si} label={section.label}>
            {section.content && (
              <p className="text-[13px] text-text-secondary">{section.content}</p>
            )}
            {section.items && <AccordionList items={section.items} />}
          </AccordionSection>
        ))}
        <AccordionSection label="Entregables resultantes">
          {meeting.deliverables.map((d, di) => (
            <AccordionDeliverable key={di} text={`📋 ${d.text}`} />
          ))}
        </AccordionSection>
        <AccordionSection label="Asistentes">
          <AccordionAttendees
            attendees={meeting.attendees.map((a) => ({
              name: a.label,
              required: a.required,
            }))}
          />
        </AccordionSection>
        {meeting.tip && (
          <div className="mt-3 p-4 bg-yellow-light rounded-xl border-l-[3px] border-l-yellow-warning">
            <div className="text-[11px] font-bold uppercase tracking-[1px] text-yellow-warning mb-1">
              TIP
            </div>
            <div className="text-[13px] text-text-primary">{meeting.tip}</div>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] text-[13px] font-semibold bg-purple-light text-purple-accent mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-accent" />
            {faseBHero.badge}
          </div>
          <h1 className="font-display text-4xl font-extrabold mb-3">{faseBHero.title}</h1>
          <p className="text-text-secondary text-[15px] max-w-2xl leading-relaxed">
            {faseBHero.description}
          </p>
        </section>

        {/* Progress */}
        <section className="mb-8">
          <ProgressBar
            completed={completed}
            total={total}
            phaseLabels={PHASE_LABELS}
            activePhaseIndex={1}
          />
        </section>

        {/* Videos de la fase */}
        <FaseVideos faseLetter="B" />

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main content */}
          <div className="flex flex-col gap-5">
            {/* Context card */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border-l-[3px] border-l-purple-accent">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-light flex items-center justify-center text-base">
                  📍
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Donde estas — Contexto de la Fase B
                  </div>
                  <div className="text-[13px] text-text-muted">
                    Que deberia estar listo y que viene ahora
                  </div>
                </div>
              </div>
              <div className="px-1">
                <div className="mb-3">
                  <div className="text-xs font-bold text-green-success mb-1.5">
                    COMPLETASTE EN FASE A
                  </div>
                  <ul className="text-[13px] text-text-secondary m-0 pl-5 leading-[1.8]">
                    {faseBContext.completedInA.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <div className="text-xs font-bold text-purple-accent mb-1.5">
                    FASE B SE ENFOCA EN
                  </div>
                  <p className="text-[13px] text-text-secondary m-0">
                    {faseBContext.focusNow}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold text-orange-accent mb-1.5">
                    ROLES CRITICOS AHORA
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {faseBContext.criticalRoles.map((role, i) => (
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
                <div className="w-9 h-9 rounded-xl bg-purple-light flex items-center justify-center text-base font-bold text-purple-accent">
                  ✓
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Checklist — ¿Puedes avanzar a Fase C?
                  </div>
                  <div className="text-[13px] text-text-muted">
                    Completa todo antes de avanzar
                  </div>
                </div>
              </div>
              <Checklist
                storageKey={faseBStorageKey}
                items={faseBChecklist}
                onCountChange={handleCountChange}
              />
            </div>

            {/* Guiding principle */}
            <div className="p-4 bg-yellow-light rounded-xl border-l-[3px] border-l-purple-accent -mt-2">
              <div className="text-[11px] font-bold uppercase tracking-[1px] text-purple-accent mb-1">
                {faseBPrinciple.label}
              </div>
              <div className="text-[13px] text-text-primary">
                <strong>Aprender haciendo.</strong> Los 90 días son para transferir capacidades.
                El Partner facilita y enseña — el gobierno aprende operando. Si al final del
                ciclo el gobierno no puede operar sin el Partner, la implementación no fue
                exitosa.
              </div>
            </div>

            {/* Meetings */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-light flex items-center justify-center text-base">
                  📅
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Reuniones de la Fase B
                  </div>
                  <div className="text-[13px] text-text-muted">
                    4 reuniones de capacitacion y alineacion — click para expandir
                  </div>
                </div>
              </div>

              {/* Partner prep tip */}
              <div className="mb-3 p-4 bg-yellow-light rounded-xl border-l-[3px] border-l-purple-accent">
                <div className="text-[11px] font-bold uppercase tracking-[1px] text-purple-accent mb-1">
                  {faseBPartnerPrep.label}
                </div>
                <div className="text-[13px] text-text-primary">{faseBPartnerPrep.text}</div>
              </div>

              <Accordion items={meetingAccordionItems} />

              <div className="mt-4 p-4 bg-yellow-light rounded-xl border-l-[3px] border-l-yellow-warning">
                <div className="text-[11px] font-bold uppercase tracking-[1px] text-yellow-warning mb-1">
                  TIP
                </div>
                <div className="text-[13px] text-text-primary">{faseBMeetingsTip}</div>
              </div>
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
              {faseBDecisions.map((decision, i) => (
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
              {faseBErrors.map((error, i) => (
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
              phases={faseBTimeline.map((t) => ({
                label: t.label,
                weeks: t.weeks,
                state: t.status,
              }))}
            />
            <RolesSidebar
              title="👥 Roles clave en Fase B"
              roles={faseBSidebarRoles.map((r) => ({
                name: r.name,
                description: r.desc,
              }))}
            />
            <EscalationBox
              title="🔷 Cuándo escalar a Sovra"
              items={faseBEscalationItems}
            />
            <KitSidebar title="📦 Kit de materiales — Fase B" items={faseBKitItems} />
          </Sidebar>
        </div>

        {/* Phase nav */}
        <PhaseNav
          prevHref="/fase-a"
          prevLabel="Fase A: Inicio"
          nextHref="/fase-c"
          nextLabel="Fase C: Modelado"
        />
      </main>
    </>
  );
}
