'use client';

import { useEffect, useMemo, useState } from 'react';

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

const PARTICIPANTS_REGISTERED = 533;
const PARTICIPANTS_CAP = 2000;

const getCompetitionTimeline = () => {
  const now = new Date();
  const currentYear =
    now.getUTCMonth() > 10 ? now.getUTCFullYear() + 1 : now.getUTCFullYear();

  const start = new Date(Date.UTC(currentYear, 10, 1, 0, 0, 0));
  const end = new Date(Date.UTC(currentYear, 10, 30, 23, 59, 59));

  return { start, end } as const;
};

const getCountdown = (targetDate: Date): Countdown => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();
  const clampedDifference = Math.max(difference, 0);

  const days = Math.floor(clampedDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clampedDifference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clampedDifference / (1000 * 60)) % 60);
  const seconds = Math.floor((clampedDifference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: difference <= 0,
  };
};

const useCountdown = (targetDate: Date) => {
  const [countdown, setCountdown] = useState<Countdown>(() =>
    getCountdown(targetDate)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return countdown;
};

const padTime = (value: number) => value.toString().padStart(2, '0');

const formatCountdown = (countdown: Countdown) => {
  return `${padTime(countdown.days)}d : ${padTime(
    countdown.hours
  )}h : ${padTime(countdown.minutes)}m : ${padTime(countdown.seconds)}s`;
};

export default function CompetitionStatus() {
  const { start, end } = useMemo(() => getCompetitionTimeline(), []);
  const startCountdown = useCountdown(start);
  const endCountdown = useCountdown(end);

  const progressPercent = Math.min(
    100,
    Math.round((PARTICIPANTS_REGISTERED / PARTICIPANTS_CAP) * 100)
  );

  return (
    <div className='grid gap-4 text-left md:grid-cols-3'>
      <div className='rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-5 shadow-[0_0_45px_rgba(6,182,212,0.25)] backdrop-blur'>
        <div className='text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80'>
          Starts
        </div>
        <p className='mt-1 text-lg font-semibold text-white md:text-xl'>
          November 1
        </p>
        <p className='mt-6 font-mono text-lg text-cyan-100 md:text-2xl'>
          {startCountdown.isPast ? 'Live Now' : formatCountdown(startCountdown)}
        </p>
      </div>

      <div className='rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 shadow-[0_0_45px_rgba(245,158,11,0.25)] backdrop-blur'>
        <div className='text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/80'>
          Participants
        </div>
        <p className='mt-1 text-lg font-semibold text-white md:text-xl'>
          {PARTICIPANTS_REGISTERED.toLocaleString()} /{' '}
          {PARTICIPANTS_CAP.toLocaleString()}
        </p>
        <div className='mt-5 h-2 w-full overflow-hidden rounded-full bg-amber-100/20'>
          <div
            className='h-full rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-400 shadow-[0_0_25px_rgba(251,191,36,0.45)] transition-all'
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className='mt-2 text-xs font-medium text-amber-100/70'>
          {progressPercent}% of slots claimed
        </p>
      </div>

      <div className='rounded-2xl border border-fuchsia-400/40 bg-fuchsia-500/10 p-5 shadow-[0_0_45px_rgba(217,70,239,0.25)] backdrop-blur'>
        <div className='text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-100/80'>
          Ends
        </div>
        <p className='mt-1 text-lg font-semibold text-white md:text-xl'>
          November 30
        </p>
        <p className='mt-6 font-mono text-lg text-fuchsia-100 md:text-2xl'>
          {endCountdown.isPast ? 'Completed' : formatCountdown(endCountdown)}
        </p>
      </div>
    </div>
  );
}
