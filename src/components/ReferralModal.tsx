'use client';

import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type ReferralDetails = {
  id: string;
  code: string;
  name: string;
};

type ReferralModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ReferralModal({ open, onClose }: ReferralModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState<ReferralDetails | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      const timer = window.setTimeout(() => {
        setName('');
        setEmail('');
        setError('');
        setLoading(false);
        setReferral(null);
      }, 200);

      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const launchConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return () => undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return () => undefined;
    }

    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    type Particle = {
      x: number;
      y: number;
      radius: number;
      color: string;
      velocityX: number;
      velocityY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    };

    const colors = ['#38bdf8', '#a855f7', '#f97316', '#facc15', '#22d3ee'];
    const particles: Particle[] = Array.from({ length: 140 }, () => {
      const color =
        colors[Math.floor(Math.random() * colors.length)] ?? colors[0];
      return {
        x: Math.random() * width,
        y: height + Math.random() * 180,
        radius: Math.random() * 6 + 2,
        color,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: -Math.random() * 7 - 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 18,
        opacity: 1,
      };
    });

    const start = performance.now();
    const duration = 1800;
    let animationFrame = 0;

    const draw = (time: number) => {
      const elapsed = time - start;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.velocityX * 0.5;
        particle.y += particle.velocityY * 0.5;
        particle.velocityY += 0.18;
        particle.rotation += particle.rotationSpeed;
        particle.opacity = Math.max(0, 1 - elapsed / duration);

        context.save();
        context.globalAlpha = particle.opacity;
        context.translate(particle.x, particle.y);
        context.rotate((particle.rotation * Math.PI) / 180);
        context.fillStyle = particle.color;
        context.fillRect(
          -particle.radius,
          -particle.radius / 2,
          particle.radius * 2,
          particle.radius
        );
        context.restore();
      });

      if (elapsed < duration) {
        animationFrame = window.requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      context.clearRect(0, 0, width, height);
    };
  }, []);

  useEffect(() => {
    if (!open || !referral) {
      return;
    }

    return launchConfetti();
  }, [launchConfetti, open, referral]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError('');
      setLoading(true);
      try {
        const response = await fetch('/api/referrals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email }),
        });

        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          referral?: ReferralDetails;
        };

        if (!response.ok || !result.success || !result.referral) {
          throw new Error(result.error ?? 'Unable to create referral.');
        }

        setReferral(result.referral);
      } catch (err) {
        setError((err as Error).message);
        setReferral(null);
      } finally {
        setLoading(false);
      }
    },
    [email, name]
  );

  const handleCopy = useCallback(async () => {
    if (!referral) {
      return;
    }

    try {
      await navigator.clipboard.writeText(referral.code);
      setError('');
    } catch {
      setError('Copy failed. Please copy manually.');
    }
  }, [referral]);

  const modalContent = useMemo(() => {
    if (!open || !mounted) {
      return null;
    }

    return (
      <div
        className='fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur'
        onClick={handleOverlayClick}
        role='presentation'
      >
        <canvas
          ref={canvasRef}
          className='pointer-events-none absolute inset-0 h-full w-full'
        />
        <div className='relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/90 p-8 shadow-2xl'>
          <button
            type='button'
            onClick={onClose}
            className='absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-200 transition hover:bg-white/20'
          >
            Close
          </button>
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-semibold text-white'>
                Unlock your referral edge
              </h2>
              <p className='mt-2 text-sm text-slate-300'>
                Share your code, earn 35% on every conversion. Input your
                details and we&apos;ll mint your premium referral ID.
              </p>
            </div>
            {!referral ? (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='referral-name'
                    className='block text-xs uppercase tracking-wide text-slate-400'
                  >
                    Full name
                  </label>
                  <input
                    id='referral-name'
                    name='name'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Asha K. Trader'
                    className='mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/40'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='referral-email'
                    className='block text-xs uppercase tracking-wide text-slate-400'
                  >
                    Email
                  </label>
                  <input
                    id='referral-email'
                    type='email'
                    name='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='you@cardicnexus.ai'
                    className='mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/40'
                    required
                  />
                </div>
                {error ? (
                  <p className='text-sm text-rose-400'>{error}</p>
                ) : null}
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 py-3 text-sm font-semibold text-black shadow-lg shadow-indigo-500/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {loading ? 'Minting your code…' : 'Generate referral code'}
                </button>
              </form>
            ) : (
              <div className='space-y-5'>
                <div>
                  <p className='text-xs uppercase tracking-[0.3em] text-cyan-300/80'>
                    Here&apos;s your referral code
                  </p>
                  <p className='mt-3 text-4xl font-bold tracking-widest text-white'>
                    {referral.code}
                  </p>
                  <p className='mt-2 text-sm text-slate-300'>
                    Share it with traders to activate your 35% lifetime
                    commission stream.
                  </p>
                </div>
                {error ? (
                  <p className='text-sm text-rose-400'>{error}</p>
                ) : null}
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <button
                    type='button'
                    onClick={handleCopy}
                    className='flex-1 rounded-xl border border-cyan-500/40 bg-black/50 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400 hover:text-white'
                  >
                    Copy code
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setReferral(null);
                    }}
                    className='flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-white'
                  >
                    Create another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    email,
    error,
    handleCopy,
    handleOverlayClick,
    handleSubmit,
    loading,
    mounted,
    name,
    onClose,
    open,
    referral,
  ]);

  if (!mounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
}
