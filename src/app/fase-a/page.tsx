'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
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
  faseAHero,
  faseAContext,
  faseAChecklist,
  faseAStorageKey,
  faseAMeetings,
  faseAMeetingsTip,
  faseAMeetingModel,
  faseADecisions,
  faseAErrors,
  faseATimeline,
  faseASidebarRoles,
  faseAEscalationItems,
  faseAKitItems,
} from '@/data/fase-a-content';

const PHASE_LABELS = [
  'A · Inicio',
  'B · Preparación',
  'C · Modelado',
  'D · Pre-lanzamiento',
  'E · Post-lanzamiento',
];

export default function FaseAPage() {
  const [completed, setCompleted] = useState(0);
  const total = faseAChecklist.length;

  const handleCountChange = useCallback((count: number) => {
    setCompleted(count);
  }, []);

  // Build accordion items from meetings data
  const meetingAccordionItems = faseAMeetings.map((meeting) => ({
    title: meeting.title,
    subtitle: meeting.subtitle,
    meetingNumber: meeting.number,
    meetingColor: 'blue' as const,
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
      </>
    ),
  }));

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-6">
        {/* Hero */}
        <section className="py-10 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] text-[13px] font-semibold bg-blue-light text-blue-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
            {faseAHero.badge}
          </div>
          <h1 className="font-display text-4xl font-extrabold mb-3">{faseAHero.title}</h1>
          <p className="text-text-secondary text-[15px] max-w-2xl leading-relaxed">
            {faseAHero.description}
          </p>
        </section>

        {/* Progress */}
        <section className="mb-8">
          <ProgressBar
            completed={completed}
            total={total}
            phaseLabels={PHASE_LABELS}
            activePhaseIndex={0}
          />
        </section>

        {/* Videos de la fase */}
        <FaseVideos faseLetter="A" />

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main content */}
          <div className="flex flex-col gap-5">
            {/* Where you are card */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border-l-[3px] border-l-blue-primary">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-light flex items-center justify-center text-base">
                  📍
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">Dónde estás</div>
                  <div className="text-[13px] text-text-muted">
                    Primera fase — todo empieza aquí
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-3 px-1">
                {faseAContext.description.replace('(ver en Fase 0)', '')}{' '}
                <Link href="/fase-0" className="text-blue-primary no-underline">
                  ver en Fase 0
                </Link>
              </p>
              <div className="flex flex-wrap gap-1.5 px-1">
                {faseAContext.criticalRoles.map((role, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs bg-blue-light text-blue-primary"
                  >
                    Roles críticos: {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-light flex items-center justify-center text-base font-bold text-blue-primary">
                  ✓
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Checklist — ¿Puedes avanzar a Fase B?
                  </div>
                  <div className="text-[13px] text-text-muted">
                    Completa todo antes de avanzar
                  </div>
                </div>
              </div>
              <Checklist
                storageKey={faseAStorageKey}
                items={faseAChecklist}
                onCountChange={handleCountChange}
              />
            </div>

            {/* Meetings */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-light flex items-center justify-center text-base">
                  📅
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Reuniones de la Fase A
                  </div>
                  <div className="text-[13px] text-text-muted">
                    3 reuniones + sesión cero opcional — click para expandir
                  </div>
                </div>
              </div>
              <Accordion items={meetingAccordionItems} />
              <div className="mt-4 p-4 bg-yellow-light rounded-xl border-l-[3px] border-l-yellow-warning">
                <div className="text-[11px] font-bold uppercase tracking-[1px] text-yellow-warning mb-1">
                  TIP
                </div>
                <div className="text-[13px] text-text-primary">{faseAMeetingsTip}</div>
              </div>
            </div>

            {/* Meeting model */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] border-l-[3px] border-l-orange-accent">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-light flex items-center justify-center text-base">
                  🤝
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Modelo de reuniones — Quién lidera qué
                  </div>
                  <div className="text-[13px] text-text-muted">
                    Las reuniones son del Partner con el gobierno. Sovra interviene solo por
                    excepción.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div className="p-3.5 bg-blue-light rounded-lg border-l-[3px] border-l-blue-primary">
                  <div className="font-semibold text-[13px] text-blue-primary mb-1.5">
                    Partner lidera
                  </div>
                  <ul className="text-xs text-text-secondary m-0 pl-4 leading-[1.8]">
                    {faseAMeetingModel.partnerLeads.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 bg-purple-light rounded-lg border-l-[3px] border-l-purple-accent">
                  <div className="font-semibold text-[13px] text-purple-accent mb-1.5">
                    Sovra solo por excepción
                  </div>
                  <ul className="text-xs text-text-secondary m-0 pl-4 leading-[1.8]">
                    {faseAMeetingModel.sovraException.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-3 bg-yellow-light rounded-lg">
                <p className="text-[13px] text-text-primary m-0">
                  <strong>Minuta semanal obligatoria.</strong> {faseAMeetingModel.minutaRule}
                </p>
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
              {faseADecisions.map((decision, i) => (
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
              {faseAErrors.map((error, i) => (
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
              phases={faseATimeline.map((t) => ({
                label: t.label,
                weeks: t.weeks,
                state: t.status,
              }))}
            />
            <RolesSidebar
              title="👥 Equipo del gobierno"
              roles={faseASidebarRoles.map((r) => ({
                name: r.name,
                description: r.desc,
              }))}
            />
            <EscalationBox
              title="🔷 Cuándo escalar a Sovra"
              items={faseAEscalationItems}
            />
            <KitSidebar title="📦 Kit de materiales — Fase A" items={faseAKitItems} />
          </Sidebar>
        </div>

        {/* Phase nav */}
        <PhaseNav
          prevHref="/fase-0"
          prevLabel="Fase 0: Preparación"
          nextHref="/fase-b"
          nextLabel="Fase B: Preparación"
        />
      </main>
    </>
  );
}
