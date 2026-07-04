import { useEffect } from 'react';

export default function useResize(
  onResize: (ev: UIEvent) => void = _ => {},
  deps: unknown[] = [],
) {
  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [...deps]);
}
