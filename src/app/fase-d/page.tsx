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
  faseDHero,
  faseDContext,
  faseDChecklist,
  faseDStorageKey,
  faseDMeetings,
  faseDMeetingModel,
  faseDTestingChecklist,
  faseDTestingStorageKey,
  faseDTestingCriteria,
  faseDDecisions,
  faseDErrors,
  faseDTimeline,
  faseDEscalationItems,
  faseDKitItems,
} from '@/data/fase-d-content';

const progressPhaseLabels = [
  'A \u00b7 Inicio',
  'B \u00b7 Preparaci\u00f3n',
  'C \u00b7 Modelado',
  'D \u00b7 Pre-lanzamiento',
  'E \u00b7 Post-lanzamiento',
];

const badgeColorClasses: Record<string, string> = {
  green: 'bg-green-light text-green-success',
  blue: 'bg-blue-light text-blue-primary',
  purple: 'bg-purple-light text-purple-accent',
};

const roleColorClasses: Record<string, { bg: string; text: string }> = {
  green: { bg: 'bg-green-light', text: 'text-green-success' },
  blue: { bg: 'bg-blue-light', text: 'text-blue-primary' },
  purple: { bg: 'bg-purple-light', text: 'text-purple-accent' },
};

export default function FaseDPage() {
  const [checklistCompleted, setChecklistCompleted] = useState(0);
  const [testingCompleted, setTestingCompleted] = useState(0);
  const totalChecklist = faseDChecklist.length;

  const handleChecklistChange = useCallback((completed: number) => {
    setChecklistCompleted(completed);
  }, []);

  const handleTestingChange = useCallback((completed: number) => {
    setTestingCompleted(completed);
  }, []);

  // Phase D base offset ~58% (A+B+C), adds up to ~17%
  const phasePercent = totalChecklist > 0 ? checklistCompleted / totalChecklist : 0;
  const totalPercent = Math.round(58 + phasePercent * 17);

  // Testing result
  const testingTotal = faseDTestingChecklist.length;
  const testingResultText =
    testingCompleted === 10
      ? '10/10 casos pasados — Listo para lanzar'
      : testingCompleted >= 7
        ? `${testingCompleted}/10 casos pasados — Casi listo`
        : `${testingCompleted}/10 casos pasados — No lanzar`;
  const testingResultClasses =
    testingCompleted === 10
      ? 'bg-green-light text-green-success'
      : testingCompleted >= 7
        ? 'bg-yellow-light text-yellow-warning'
        : 'bg-red-light text-red-alert';

  // Build accordion items from meetings data
  const accordionItems = faseDMeetings.map((meeting) => ({
    title: meeting.title,
    subtitle: meeting.subtitle,
    meetingNumber: meeting.number,
    meetingColor: 'green' as const,
    tags: [
      { label: meeting.tag, variant: meeting.tagType as 'required' | 'optional' },
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
            <AccordionDeliverable key={di} text={`\ud83d\udccb ${d.text}`} />
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
        {meeting.note && (
          <div className="mt-2 p-2.5 px-3.5 bg-green-light rounded-lg text-[13px] text-text-secondary">
            <strong>Decision:</strong> {meeting.note}
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-green-light text-green-success mb-4">
            <span className="w-2 h-2 rounded-full bg-green-success animate-[pulse_2s_infinite]" />
            {faseDHero.badge}
          </div>
          <h1 className="font-display text-[2.5rem] font-extrabold leading-tight mb-3">
            {faseDHero.title}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            {faseDHero.description}
          </p>
        </section>

        {/* Progress Bar */}
        <section className="pb-10">
          <ProgressBar
            completed={totalPercent}
            total={100}
            phaseLabels={progressPhaseLabels}
            activePhaseIndex={3}
          />
        </section>

        {/* Videos de la fase */}
        <FaseVideos faseLetter="D" />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 pb-10">
          {/* Main content */}
          <div className="flex flex-col gap-6">
            {/* Context card */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] border-l-[3px] border-l-green-success">
              <div className="flex items-start gap-3 p-5 pb-3">
                <div className="w-9 h-9 rounded-xl bg-green-light flex items-center justify-center text-base shrink-0">
                  \ud83d\udccd
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Donde estas — Contexto de la Fase D
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    Que deberia estar listo y que viene ahora
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="mb-3">
                  <div className="text-xs font-bold text-green-success mb-1.5">
                    COMPLETASTE EN FASE C
                  </div>
                  <ul className="text-[13px] text-text-secondary pl-5 list-disc leading-[1.8]">
                    {faseDContext.completedInC.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <div className="text-xs font-bold text-green-success mb-1.5">
                    FASE D SE ENFOCA EN
                  </div>
                  <p className="text-[13px] text-text-secondary">
                    {faseDContext.focusNow}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold text-orange-accent mb-1.5">
                    ROLES CRITICOS AHORA
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {faseDContext.criticalRoles.map((role, i) => (
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
                <div className="w-9 h-9 rounded-xl bg-green-light flex items-center justify-center text-base shrink-0">
                  \u2713
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Checklist — \u00bfPuedes lanzar?
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    Completa todo antes del lanzamiento
                  </div>
                </div>
              </div>
              <Checklist
                storageKey={faseDStorageKey}
                items={faseDChecklist}
                onCountChange={handleChecklistChange}
              />
            </div>

            {/* Meetings */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-green-light flex items-center justify-center text-base shrink-0">
                  \ud83d\udcc5
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Reuniones de la Fase D
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    4 reuniones de preparacion — click para expandir
                  </div>
                </div>
              </div>
              <Accordion items={accordionItems} />
            </div>

            {/* Meeting model card */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] border-l-[3px] border-l-orange-accent">
              <div className="flex items-start gap-3 p-5 pb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-light flex items-center justify-center text-base shrink-0">
                  \ud83e\udd1d
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Reuniones en pre-lanzamiento — Gesti\u00f3n aut\u00f3noma
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    El partner lidera. Sovra acompa\u00f1a solo en el go-live y escalamientos.
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <p className="text-[13px] text-text-secondary mb-3">
                  {faseDMeetingModel.description}
                </p>
                <div className="grid gap-2 mb-3">
                  <div className="p-2.5 px-3.5 bg-green-light rounded-lg text-xs text-text-secondary">
                    <strong className="text-green-success">Partner lidera:</strong>{' '}
                    {faseDMeetingModel.partnerLeads}
                  </div>
                  <div className="p-2.5 px-3.5 bg-purple-light rounded-lg text-xs text-text-secondary">
                    <strong className="text-purple-accent">Sovra acompa\u00f1a:</strong>{' '}
                    {faseDMeetingModel.sovraAccompanies}
                  </div>
                </div>
                <div className="p-3 px-3.5 bg-yellow-light rounded-lg">
                  <div className="text-[13px] text-text-primary">
                    <strong>Minuta semanal obligatoria.</strong>{' '}
                    {faseDMeetingModel.minutaRule}
                  </div>
                </div>
              </div>
            </div>

            {/* Testing pre-launch checklist */}
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-green-light flex items-center justify-center text-base shrink-0">
                  \ud83e\uddea
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold">
                    Checklist de testing pre-lanzamiento
                  </div>
                  <div className="text-[13px] text-text-secondary">
                    10 casos de prueba por tr\u00e1mite. Todos deben pasar antes de lanzar.
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-text-secondary mb-3 px-1">
                Ejecuta estos 10 casos para <strong>cada tr\u00e1mite</strong> en producci\u00f3n. Marca cada caso al completarlo.
              </p>
              <Checklist
                storageKey={faseDTestingStorageKey}
                items={faseDTestingChecklist.map((t) => ({ text: t.text }))}
                onCountChange={handleTestingChange}
              />
              <div
                className={`mt-4 p-3.5 px-4 rounded-xl text-[13px] font-semibold text-center ${testingResultClasses}`}
              >
                {testingResultText}
              </div>
              <div className="mt-4 p-3 px-3.5 bg-green-light rounded-lg">
                <div className="text-[13px] text-text-primary">
                  <strong>Criterio de &quot;listo para lanzar&quot;:</strong>{' '}
                  {faseDTestingCriteria}
                </div>
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
              {faseDDecisions.map((d, i) => (
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
              {faseDErrors.map((err, i) => (
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
              phases={faseDTimeline.map((t) => ({
                label: t.label,
                weeks: t.weeks,
                state: t.status,
              }))}
            />
            <EscalationBox
              title="\ud83d\udd37 Cu\u00e1ndo escalar a Sovra"
              items={faseDEscalationItems}
            />
            <KitSidebar
              title="\ud83d\udce6 Kit de materiales — Fase D"
              items={faseDKitItems}
            />
          </Sidebar>
        </div>

        {/* Phase Nav */}
        <PhaseNav
          prevHref="/fase-c"
          prevLabel="Fase C: Modelado"
          nextHref="/fase-e"
          nextLabel="Fase E: Post-lanzamiento"
        />
      </main>
    </>
  );
}
