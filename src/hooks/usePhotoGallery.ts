import { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Catch } from './useCatches';

export interface PhotoGallery {
  id: number;
  url: string;
  catchId?: number;
  date: string;
  weight?: number;
  friendName?: string;
  caption?: string;
}

export function usePhotoGallery(catches: Catch[]) {
  const [photoCaptions, setPhotoCaptions] = useLocalStorage<Record<number, string>>('fishingapp.photoCaptions.v1', {});
  const [photoLikes, setPhotoLikes] = useState<Record<number, boolean>>({});
  const [photoComments, setPhotoComments] = useState<Record<number, string[]>>({});

  // Fallback gallery photos (static)
  const fallbackPhotos: PhotoGallery[] = useMemo(() => [
    { id: 1, url: '/home-gallery/ayoub-allaoui-r4UnstvRgkE-unsplash.jpg', catchId: 1, date: '2026-02-15', caption: 'Amanhecer perfeito na beira do mar' },
    { id: 2, url: '/home-gallery/cast-spear-hApQr0GDDP8-unsplash.jpg', catchId: 2, date: '2026-02-14', caption: 'Tentativa com lança — água bem clara' },
    { id: 3, url: '/home-gallery/clay-knight-Gn5i7ZWw00I-unsplash.jpg', catchId: 1, date: '2026-02-13', caption: 'Dia de vento, mas rendeu boas fotos' },
    { id: 4, url: '/home-gallery/diego-rubilar-NwEUY1xts1U-unsplash.jpg', date: '2026-02-12', caption: 'Ponto novo testado hoje — promissor' },
    { id: 5, url: '/home-gallery/drew-farwell-0C20qeLQwi8-unsplash.jpg', catchId: 2, date: '2026-02-11' },
    { id: 6, url: '/home-gallery/jack-murrey-SIj8yWcxC0k-unsplash.jpg', date: '2026-02-10' },
    { id: 7, url: '/home-gallery/jeff-vanderspank-8jh4zljhyDg-unsplash.jpg', catchId: 1, date: '2026-02-09' },
    { id: 8, url: '/home-gallery/jp-popham-BEK8qXGzF4A-unsplash.jpg', catchId: 2, date: '2026-02-08' },
    { id: 9, url: '/home-gallery/luis-arias-WnqewLN8Suk-unsplash.jpg', date: '2026-02-07' },
    { id: 10, url: '/home-gallery/mael-balland-0asA95b8yzM-unsplash.jpg', catchId: 1, date: '2026-02-06' },
    { id: 11, url: '/home-gallery/michael-yero-AHrsj0zlN-E-unsplash.jpg', catchId: 2, date: '2026-02-05' },
    { id: 12, url: '/home-gallery/natali-martynova-akd9GO5srJ8-unsplash.jpg', date: '2026-02-04' }
  ], []);

  // Combine real photos from catches with fallback photos
  const mineGalleryPhotos = useMemo(() => {
    const realPhotos = catches
      .filter(c => c.photoUrl)
      .map(c => ({
        id: c.id,
        url: c.photoUrl!,
        catchId: c.id,
        date: c.time ? `${c.date}T${c.time}:00` : c.date,
        weight: c.weight,
        caption: photoCaptions[c.id]
      } as PhotoGallery))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const fallbackWithWeight = fallbackPhotos.map(p => {
      const match = p.catchId ? catches.find(c => c.id === p.catchId) : undefined;
      return {
        ...p,
        weight: match?.weight,
        caption: photoCaptions[p.id] || p.caption
      };
    });

    const realCatchIds = new Set(realPhotos.map(p => p.catchId).filter((v): v is number => typeof v === 'number'));
    const combined = [
      ...realPhotos,
      ...fallbackWithWeight.filter(p => !p.catchId || !realCatchIds.has(p.catchId))
    ];

    return combined;
  }, [catches, fallbackPhotos, photoCaptions]);

  const toggleLike = useCallback((photoId: number) => {
    setPhotoLikes(prev => ({ ...prev, [photoId]: !prev[photoId] }));
  }, []);

  const addComment = useCallback((photoId: number, comment: string) => {
    if (!comment.trim()) return;
    setPhotoComments(prev => ({
      ...prev,
      [photoId]: [...(prev[photoId] || []), comment]
    }));
  }, []);

  const updateCaption = useCallback((photoId: number, caption: string) => {
    setPhotoCaptions(prev => ({ ...prev, [photoId]: caption }));
  }, [setPhotoCaptions]);

  return {
    mineGalleryPhotos,
    photoLikes,
    photoComments,
    photoCaptions,
    toggleLike,
    addComment,
    updateCaption
  };
}
