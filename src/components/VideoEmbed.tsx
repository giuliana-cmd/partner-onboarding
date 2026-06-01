'use client';

import type { VideoEntry } from '@/data/videos';

type Props = {
  video: VideoEntry;
  className?: string;
};

/**
 * Single video player. Renders an HTML5 <video> element when ready,
 * or a placeholder card when pending.
 *
 * Videos are served from /videos/Fase_X/ in the repo's public folder,
 * so they ship with the Vercel deployment — no external auth, no iframe.
 */
export function VideoEmbed({ video, className = '' }: Props) {
  if (video.status === 'pending' || !video.src) {
    return (
      <div className={`relative aspect-video rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 ${className}`}>
        <div className="text-3xl mb-2">📹</div>
        <div className="text-xs font-semibold">Próximamente</div>
        <div className="text-[10px] mt-1 px-3 text-center">Video {video.num} — {video.title}</div>
      </div>
    );
  }

  return (
    <video
      key={video.src}
      src={video.src}
      controls
      preload="metadata"
      playsInline
      className={`w-full aspect-video rounded-lg border border-slate-200 bg-black ${className}`}
      aria-label={`Video ${video.num} — ${video.title}`}
    >
      <p className="p-4 text-sm text-slate-700">
        Tu navegador no soporta video HTML5. {' '}
        <a href={video.src} className="text-blue-600 hover:underline">Descargar el video</a>.
      </p>
    </video>
  );
}
