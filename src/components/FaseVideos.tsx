'use client';

import { useState } from 'react';
import { getFaseVideos } from '@/data/videos';
import { VideoEmbed } from './VideoEmbed';

type Props = {
  faseLetter: string; // e.g. "0", "A", "B", "C", "D", "E"
};

/**
 * Renders only the videos that are ready (status === 'ready').
 * Player at top with thumbnail strip below for navigation between videos of the fase.
 */
export function FaseVideos({ faseLetter }: Props) {
  const allVideos = getFaseVideos(faseLetter);
  const videos = allVideos.filter((v) => v.status === 'ready');
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (videos.length === 0) return null;

  const current = videos[selectedIndex];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-bold pb-2">Videos de la fase</h2>
        <span className="text-xs text-slate-500 font-mono">
          {videos.length} {videos.length === 1 ? 'video' : 'videos'}
        </span>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-blue-600 text-white">
              {current.num}
            </span>
            <h3 className="font-display font-semibold text-sm text-slate-900 truncate">
              {current.title}
            </h3>
          </div>

          <VideoEmbed video={current} />
        </div>

        {videos.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {videos.map((v, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={v.num}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`
                    relative aspect-video rounded text-left p-2 transition-all cursor-pointer
                    ${isSelected ? 'ring-2 ring-blue-600 bg-blue-50' : 'bg-slate-100 hover:bg-blue-50/50'}
                  `}
                  title={`Video ${v.num} — ${v.title}`}
                >
                  <div className="text-[10px] font-mono font-bold mb-1 text-blue-600">
                    V{v.num}
                  </div>
                  <div className="text-[10px] text-slate-700 line-clamp-2 leading-tight">
                    {v.title}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
