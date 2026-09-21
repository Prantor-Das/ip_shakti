'use client';

import * as React from 'react';
import {
  CLASSIFICATION_QUESTIONS,
  classifyFormulation,
  type ClassificationAnswer,
} from '@/lib/classification';
import type { FormulationType } from '@/lib/chat/types';

export function ClassifyPanel({
  value,
  onChange,
}: {
  value?: FormulationType;
  onChange: (value: FormulationType) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Partial<Record<number, ClassificationAnswer>>>({});
  const [selected, setSelected] = React.useState<ClassificationAnswer | undefined>();
  const result = classifyFormulation(answers);
  const question = CLASSIFICATION_QUESTIONS[step];

  function next() {
    if (!selected) return;
    const nextAnswers = { ...answers, [question.id]: selected };
    setAnswers(nextAnswers);
    const nextResult = classifyFormulation(nextAnswers);
    if (nextResult) onChange(nextResult.type);
    else {
      setStep((current) => current + 1);
      setSelected(undefined);
    }
  }

  return (
    <div className="rounded-xl border border-emerald-900/10 bg-white p-3 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-emerald-950"
      >
        <span>
          Formulation classification{' '}
          <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-primary">
            {value ?? 'unsure'}
          </span>
        </span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && !result && question && (
        <div className="mt-3 border-t border-emerald-900/10 pt-3">
          <p className="text-xs font-semibold text-emerald-950/50">
            Question {step + 1} of {CLASSIFICATION_QUESTIONS.length}
          </p>
          <p className="mt-2 text-sm leading-5 text-emerald-950">{question.text}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['yes', 'no', 'unsure'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                aria-pressed={selected === option}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize text-emerald-950 transition hover:border-primary hover:bg-emerald-50 ${selected === option ? 'border-primary bg-emerald-50' : 'border-emerald-900/15'}`}
              >
                {option === 'unsure' ? 'Not sure' : option}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStep((current) => current - 1);
                setSelected(undefined);
              }}
              disabled={step === 0}
              className="text-xs text-primary underline disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!selected}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {open && result && (
        <div className="mt-3 border-t border-emerald-900/10 pt-3 text-xs text-emerald-950/65">
          <p>{result.note}</p>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setStep(0);
              setSelected(undefined);
            }}
            className="mt-2 text-primary underline"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
