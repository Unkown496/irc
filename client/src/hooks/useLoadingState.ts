import { useState } from 'react';

type States = 'loading' | 'errored' | 'ready';

type UseLoadingStateReturn = [boolean, boolean, (state: States) => void];

export default function useLoadingState(): UseLoadingStateReturn {
  const [isLoading, setIsLoading] = useState(true),
    [isErrored, setIsErrored] = useState(false);

  const setState = (state: States) => {
    switch (state) {
      case 'loading':
        setIsErrored(false);
        setIsLoading(true);

        return;
      case 'errored':
        setIsErrored(true);
        setIsLoading(false);
        return;
      case 'ready':
        setIsErrored(false);
        setIsLoading(false);
        return;
    }
  };

  return [isLoading, isErrored, setState];
}
