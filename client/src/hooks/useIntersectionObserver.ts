import { RefObject, useCallback, useEffect, useState } from 'react';

export default function useIntersectionObserver<El extends HTMLElement>(
  options?: IntersectionObserverInit,
) {
  const [isVisible, setIsVisible] = useState(false);

  const [node, setNode] = useState<El | null>(null);

  const ref = useCallback((node: El | null) => setNode(node), []);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [node, options]);

  return { isVisible, ref };
}
