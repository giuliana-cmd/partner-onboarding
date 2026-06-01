'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Accordion, AccordionSection, AccordionList } from '@/components/Accordion';
import { Checklist } from '@/components/Checklist';
import { ProgressBar } from '@/components/ProgressBar';
import { PhaseNav } from '@/components/PhaseNav';
import {
  Sidebar,
  TimelineSidebar,
  KitSidebar,
  EscalationBox,
} from '@/components/Sidebar';
import { Phase0Readiness } from '@/components/ReadinessAssessment';
import { FaseVideos } from '@/components/FaseVideos';
import {
  fase0Checklist,
  fase0StorageKey,
  rolePersistenceSections,
  rolePersistenceRule,
  contingencySteps,
  contingencyRule,
  fase0Hero,
  fase0Timeline,
  fase0KitItems,
  fase0EscalationItems,
  readinessTemplate,
} from '@/data/fase-0-content';
import { partnerRoles, governmentRoles } from '@/data/roles';
import { supportLevels, supportGoldenRule } from '@/data/support-model';
import {
  formalReadinessSignals,
  formalReadinessRule,
  readinessCheckItems,
  readinessCheckRule,
} from '@/data/readiness';
import type { Role } from '@/data/roles';
import type { AccordionItemData } from '@/components/Accordion';

/* ── Helpers ── */

function roleToAccordionItems(roles: Role[], defaultOpen = 0): AccordionItemData[] {
  return roles.map((role) => ({
    title: role.title,
    subtitle: role.subtitle,
    tags: [{ label: role.tag, variant: role.tagType }],
    children: (
      <>
        {role.sections.map((section, si) => (
          <AccordionSection key={si} label={section.label}>
            {section.items ? (
              <AccordionList items={section.items} />
            ) : (
              <p className="text-[13px] text-text-secondary">{section.content}</p>
            )}
          </AccordionSection>
        ))}
        {role.warning && (
          <div className="p-2.5 px-3.5 bg-red-light rounded-lg mt-2">
            <div className="text-xs text-red-alert">⚠️ {role.warning}</div>
          </div>
        )}
        {role.tip && (
          <div className="flex items-start gap-2 p-2.5 px-3.5 bg-blue-light rounded-lg mt-2">
            <span className="text-[11px] font-bold text-blue-primary shrink-0 mt-px">TIP</span>
            <span className="text-xs text-text-secondary">{role.tip}</span>
          </div>
        )}
      </>
    ),
  }));
}

/** Warning-style roles get yellow bg instead of red */
function roleToAccordionItemsPartner(roles: Role[], defaultOpen = 0): AccordionItemData[] {
  return roles.map((role) => ({
    title: role.title,
    subtitle: role.subtitle,
    tags: [{ label: role.tag, variant: role.tagType }],
    children: (
      <>
        {role.sections.map((section, si) => (
          <AccordionSection key={si} label={section.label}>
            {section.items ? (
              <AccordionList items={section.items} />
            ) : (
              <p className="text-[13px] text-blue-primary">{section.content}</p>
            )}
          </AccordionSection>
        ))}
        {role.warning && (
          <div className="p-2.5 px-3.5 bg-yellow-light rounded-lg mt-2">
            <div className="text-xs text-text-secondary">⚠️ {role.warning}</div>
          </div>
        )}
      </>
    ),
  }));
}

const supportColorClasses: Record<string, { bg: string; border: string }> = {
  green: { bg: 'bg-green-light', border: 'border-l-[3px] border-l-green-success' },
  blue: { bg: 'bg-blue-light', border: 'border-l-[3px] border-l-blue-primary' },
  purple: { bg: 'bg-purple-light', border: 'border-l-[3px] border-l-purple-accent' },
};

const progressPhaseLabels = [
  '0 · Preparacion',
  'A · Inicio',
  'B · Preparacion',
  'C · Modelado',
  'D-E',
];

/* ── Page ── */

export default function Fase0Page() {
  const [checklistCompleted, setChecklistCompleted] = useState(0);
  const [checklistTotal, setChecklistTotal] = useState(fase0Checklist.length);

  const handleCountChange = useCallback((completed: number, total: number) => {
    setChecklistCompleted(completed);
    setChecklistTotal(total);
  }, []);

  const timelinePhases = fase0Timeline.map((t) => ({
    label: t.label,
    weeks: t.weeks,
    state: t.status as 'active' | 'pending' | 'done',
  }));

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-6">
        {/* Hero */}
        <section className="pt-10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] bg-blue-light text-blue-primary text-[13px] font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
            {fase0Hero.badge}
          </div>
          <h1 className="font-display text-[2rem] font-bold leading-tight mb-3">
            {fase0Hero.title}
          </h1>
          <p className="text-text-secondary text-base max-w-2xl">
            {fase0Hero.description}
          </p>
        </section>

        {/* Progress bar */}
        <section className="mb-8">
          <ProgressBar
            completed={checklistCompleted}
            total={checklistTotal}
            phaseLabels={progressPhaseLabels}
            activePhaseIndex={0}
          />
        </section>

        {/* Videos de la fase */}
        <FaseVideos faseLetter="0" />

        {/* Content grid */}
        <div className="grid grid-cols-[1fr_340px] gap-8 max-lg:grid-cols-1">
          {/* Main content */}
          <div className="flex flex-col gap-6">

            {/* Card 1: Readiness signals */}
            <Card icon="🏛️" iconColor="blue" title="¿El gobierno esta listo?" subtitle="4 senales de readiness — evalua antes de comprometer timeline">
              <Accordion
                items={formalReadinessSignals.map((signal, i) => ({
                  title: signal.title,
                  subtitle: signal.subtitle,
                  children: (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 bg-green-light rounded-lg border-l-[3px] border-l-green-success">
                        <div className="font-semibold text-[13px] text-green-success mb-1">{signal.greenLabel}</div>
                        <div className="text-[13px] text-text-secondary">{signal.greenDetail}</div>
                      </div>
                      <div className="p-3 bg-red-light rounded-lg border-l-[3px] border-l-red-alert">
                        <div className="font-semibold text-[13px] text-red-alert mb-1">{signal.redLabel}</div>
                        <div className="text-[13px] text-text-secondary">{signal.redDetail}</div>
                      </div>
                    </div>
                  ),
                }))}
                defaultOpen={0}
              />
              <RuleCallout variant="yellow">
                <strong>Regla:</strong> {formalReadinessRule}
              </RuleCallout>
            </Card>

            {/* Card 2: Partner roles */}
            <Card icon="👤" iconColor="blue" title="Tu equipo (Partner) — 3 roles minimos" subtitle="Lo que necesitas de tu lado antes de la primera reunion">
              <Accordion
                items={roleToAccordionItemsPartner(partnerRoles)}
                defaultOpen={0}
              />
            </Card>

            {/* Card 3: Government roles */}
            <Card icon="👥" iconColor="purple" title="Equipo del gobierno — 5 roles obligatorios" subtitle="Sin estos 5 roles con nombre y apellido, no arranques Fase A">
              <Accordion
                items={roleToAccordionItems(governmentRoles)}
                defaultOpen={-1}
              />
            </Card>

            {/* Card 4: Persistencia de roles */}
            <Card icon="🔄" iconColor="red" title="Persistencia de roles — Que no se pierdan en el camino" subtitle="Los roles se definen una vez. Mantenerlos claros 90 dias es el reto real.">
              <Accordion
                items={rolePersistenceSections.map((section) => ({
                  title: section.title,
                  children: (
                    <AccordionSection>
                      <AccordionList items={section.items} />
                    </AccordionSection>
                  ),
                }))}
                defaultOpen={-1}
              />
              <RuleCallout variant="yellow">
                <strong>Regla:</strong> {rolePersistenceRule}
              </RuleCallout>
            </Card>

            {/* Card 5: Contingencia */}
            <Card icon="🚨" iconColor="red" title="Contingencia — Transicion de dueno politico" subtitle="Si el dueno politico se va durante el proyecto, el proyecto no se pausa — se evalua.">
              <Accordion
                items={[
                  {
                    title: 'Protocolo de handover',
                    subtitle: '5 pasos para mantener el proyecto viable ante un cambio politico',
                    children: (
                      <AccordionSection>
                        <AccordionList
                          items={contingencySteps.map((s) => `**${s.label}:** ${s.detail}`)}
                        />
                      </AccordionSection>
                    ),
                  },
                ]}
                defaultOpen={-1}
              />
              <RuleCallout variant="red">
                <strong>Regla:</strong> {contingencyRule}
              </RuleCallout>
            </Card>

            {/* Card 6: Modelo de soporte */}
            <Card icon="🛟" iconColor="green" title="Modelo de soporte — 3 niveles" subtitle="Quien resuelve que, en cuanto tiempo, como se escala">
              <div className="grid gap-2.5">
                {supportLevels.map((level) => {
                  const colors = supportColorClasses[level.color];
                  return (
                    <div
                      key={level.level}
                      className={`p-4 rounded-xl ${colors.bg} ${colors.border}`}
                    >
                      <div className="font-bold text-[15px] mb-1.5">
                        {level.name} — {level.label}
                      </div>
                      <div className="text-[13px] text-text-secondary mb-2">
                        {level.description}
                      </div>
                      <div className="text-xs text-text-muted">{level.detail}</div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[13px] text-text-secondary mt-3.5">
                <strong>Regla de oro:</strong> {supportGoldenRule}
              </p>
            </Card>

            {/* Card 7: Readiness Assessment formal */}
            <Card icon="📋" iconColor="green" title="Readiness Assessment — Evaluacion formal" subtitle="4 senales con checkboxes. Completa antes de comprometer timeline.">
              <Phase0Readiness items={readinessCheckItems} />

              <div className="px-4 pt-4">
                <RuleCallout variant="yellow">
                  <strong>Regla:</strong> {readinessCheckRule}
                </RuleCallout>
              </div>

              <div className="px-4 pt-2">
                <Accordion
                  items={[
                    {
                      title: 'Template: Declaracion de Readiness',
                      subtitle: 'Copia y completa este template para documentar la evaluacion.',
                      children: (
                        <AccordionSection>
                          <div className="p-3 bg-bg-elevated rounded-lg font-mono text-xs leading-[1.8] text-text-secondary whitespace-pre-wrap">
                            {readinessTemplate}
                          </div>
                        </AccordionSection>
                      ),
                    },
                  ]}
                  defaultOpen={-1}
                />
              </div>
            </Card>

            {/* Card 8: Checklist */}
            <Card icon="✓" iconColor="blue" title="Checklist — ¿Estas listo para Fase A?" subtitle="Completa todo antes de la primera reunion con el gobierno">
              <Checklist
                storageKey={fase0StorageKey}
                items={fase0Checklist}
                onCountChange={handleCountChange}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <Sidebar>
            <TimelineSidebar phases={timelinePhases} />
            <KitSidebar
              title="📦 Lo que recibes como partner"
              items={fase0KitItems}
            />
            <EscalationBox
              title="🔷 Sovra esta contigo"
              items={fase0EscalationItems}
            />
          </Sidebar>
        </div>

        {/* Phase navigation */}
        <PhaseNav
          prevHref="/"
          prevLabel="Roadmap"
          nextHref="/fase-a"
          nextLabel="Fase A: Inicio"
        />
      </main>
    </>
  );
}

/* ── Reusable sub-components ── */

const iconColorClasses: Record<string, string> = {
  blue: 'bg-blue-light',
  purple: 'bg-purple-light',
  green: 'bg-green-light',
  red: 'bg-red-light',
  orange: 'bg-orange-light',
};

function Card({
  icon,
  iconColor,
  title,
  subtitle,
  children,
}: {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3.5 mb-5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconColorClasses[iconColor] ?? 'bg-bg-elevated'}`}
        >
          {icon}
        </div>
        <div>
          <div className="font-display text-lg font-bold">{title}</div>
          <div className="text-[13px] text-text-secondary">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function RuleCallout({
  variant,
  children,
}: {
  variant: 'yellow' | 'red';
  children: React.ReactNode;
}) {
  const styles =
    variant === 'yellow'
      ? 'bg-yellow-light border border-[rgba(202,138,4,0.15)]'
      : 'bg-red-light border border-[rgba(220,38,38,0.15)]';

  return (
    <div className={`p-3.5 px-4 rounded-xl mt-4 text-[13px] text-text-primary ${styles}`}>
      {children}
    </div>
  );
}
