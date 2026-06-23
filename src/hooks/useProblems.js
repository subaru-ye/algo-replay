import { useState, useEffect, useCallback } from 'react';
import { MASTERY_CONFIG, calcReviewDates, getLocalDateTime, getToday, normalizeLegacyLevel } from '@/lib/review';

const KEY = 'algo-problems';
const BACKUP_VERSION = 1;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

let globalProblems = [];
const listeners = new Set();

function notify() {
  listeners.forEach((l) => l(globalProblems));
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function isValidDateString(value) {
  return DATE_RE.test(String(value || ''));
}

function isValidMasteryLevel(value) {
  return Object.prototype.hasOwnProperty.call(MASTERY_CONFIG, normalizeLegacyLevel(value));
}

function normalizeAttempt(attempt, fallbackDate, fallbackLevel) {
  const masteryLevel = normalizeLegacyLevel(
    isValidMasteryLevel(attempt?.masteryLevel) ? attempt.masteryLevel : fallbackLevel
  );
  return {
    masteryLevel,
    date: isValidDateString(attempt?.date) ? attempt.date : fallbackDate,
  };
}

function normalizeProblem(problem, { strict = false } = {}) {
  if (!problem || typeof problem !== 'object') return null;

  const problemNumber = String(problem.problemNumber || '').trim();
  const problemName = String(problem.problemName || '').trim();
  const dateSolved = isValidDateString(problem.dateSolved) ? problem.dateSolved : '';
  const masteryLevel = normalizeLegacyLevel(
    isValidMasteryLevel(problem.masteryLevel) ? problem.masteryLevel : ''
  );

  if (!problemNumber || !problemName || !dateSolved || !masteryLevel) {
    return strict ? null : {
      id: problem.id || createId(),
      problemNumber,
      problemName,
      dateSolved: dateSolved || getToday(),
      masteryLevel: masteryLevel || 'completely_lost',
      attempts: [{ masteryLevel: masteryLevel || 'completely_lost', date: dateSolved || getToday() }],
      reviewDates: calcReviewDates(dateSolved || getToday(), masteryLevel || 'completely_lost'),
    };
  }

  const rawAttempts = Array.isArray(problem.attempts) && problem.attempts.length > 0
    ? problem.attempts
    : [{ masteryLevel, date: dateSolved }];
  const attempts = rawAttempts.slice(-5).map((attempt) => normalizeAttempt(attempt, dateSolved, masteryLevel));
  const lastAttempt = attempts.at(-1);
  const currentLevel = lastAttempt?.masteryLevel || masteryLevel;
  const reviewBaseDate = lastAttempt?.date || dateSolved;

  return {
    ...problem,
    id: problem.id || createId(),
    problemNumber,
    problemName,
    dateSolved,
    masteryLevel: currentLevel,
    attempts,
    reviewDates: calcReviewDates(reviewBaseDate, currentLevel),
  };
}

function normalizeProblems(rawProblems, options) {
  if (!Array.isArray(rawProblems)) return null;
  const normalized = rawProblems.map((problem) => normalizeProblem(problem, options));
  if (normalized.some((problem) => !problem)) return null;
  return normalized;
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    const normalized = normalizeProblems(raw) || [];
    globalProblems = normalized;
    save();
  } catch {
    globalProblems = [];
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(globalProblems));
}

load();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      load();
      notify();
    }
  });
}

export function useProblems() {
  const [problems, setProblems] = useState(globalProblems);

  useEffect(() => {
    listeners.add(setProblems);
    setProblems(globalProblems);
    return () => listeners.delete(setProblems);
  }, []);

  const add = useCallback((data) => {
    const id = createId();
    const attempts = [{ masteryLevel: data.masteryLevel, date: data.dateSolved }];
    globalProblems = [
      { id, ...data, attempts, reviewDates: calcReviewDates(data.dateSolved, data.masteryLevel) },
      ...globalProblems,
    ];
    save();
    notify();
  }, []);

  const addAttempt = useCallback((id, masteryLevel) => {
    if (!id) return;
    const today = getToday();
    globalProblems = globalProblems.map((p) => {
      if (String(p.id) !== String(id)) return p;
      const attempts = p.attempts && p.attempts.length > 0 ? [...p.attempts] : [{ masteryLevel: p.masteryLevel, date: p.dateSolved }];
      const newAttempt = { masteryLevel, date: today };
      if (attempts.length >= 5) {
        attempts[attempts.length - 1] = newAttempt;
      } else {
        attempts.push(newAttempt);
      }
      return {
        ...p,
        attempts,
        masteryLevel,
        reviewDates: calcReviewDates(today, masteryLevel),
      };
    });
    save();
    notify();
  }, []);

  const update = useCallback((id, data) => {
    if (!id) return;
    globalProblems = globalProblems.map((p) => {
      if (String(p.id) !== String(id)) return p;
      const u = { ...p, ...data };
      if (data.dateSolved || data.masteryLevel) {
        u.reviewDates = calcReviewDates(u.dateSolved, u.masteryLevel);
      }
      if (data.masteryLevel && u.attempts && u.attempts.length > 0) {
        u.attempts = u.attempts.map((a, idx) =>
          idx === u.attempts.length - 1 ? { ...a, masteryLevel: data.masteryLevel, date: a.date || u.dateSolved } : a
        );
      }
      return u;
    });
    save();
    notify();
  }, []);

  const remove = useCallback((id) => {
    if (!id) return;
    const beforeLen = globalProblems.length;
    globalProblems = globalProblems.filter((p) => String(p.id) !== String(id));
    if (globalProblems.length === beforeLen) return;
    save();
    notify();
  }, []);

  const getTodayProblems = useCallback(
    (today) => globalProblems.filter((p) => p.reviewDates.includes(today)),
    []
  );

  const exportBackup = useCallback(() => ({
    version: BACKUP_VERSION,
    exportedAt: getLocalDateTime(),
    problems: globalProblems,
  }), []);

  const importBackup = useCallback((backup) => {
    if (!backup || typeof backup !== 'object' || !Array.isArray(backup.problems)) {
      throw new Error('备份文件格式不正确');
    }

    const normalized = normalizeProblems(backup.problems, { strict: true });
    if (!normalized) {
      throw new Error('备份文件中的题目数据不完整');
    }

    globalProblems = normalized;
    save();
    notify();
  }, []);

  return { problems, add, addAttempt, update, remove, getTodayProblems, exportBackup, importBackup };
}
