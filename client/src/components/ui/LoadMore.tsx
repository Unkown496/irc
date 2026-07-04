import {
  AllHTMLAttributes,
  ElementType,
  PropsWithChildren,
  useEffect,
} from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface Props extends AllHTMLAttributes<HTMLElement>, PropsWithChildren {
  as?: string;
  onLoad: VoidFunction;
}

export default function LoadMore({
  as = 'div',
  onLoad = () => {},
  children,
  ...attrs
}: Props) {
  const Tag = as as unknown as ElementType;

  const { ref, isVisible } = useIntersectionObserver();

  useEffect(() => {
    if (isVisible) onLoad();

    return;
  }, [isVisible, onLoad]);

  return (
    <Tag {...attrs} ref={ref}>
      {children}
    </Tag>
  );
}
