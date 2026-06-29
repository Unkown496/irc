import { Dispatch, SetStateAction, useState } from 'react';

type UseToggleReturn = [
  boolean,
  VoidFunction,
  Dispatch<SetStateAction<boolean>>,
];

export default function useToggle(
  defaultValue: boolean = false,
): UseToggleReturn {
  const [value, setValue] = useState(defaultValue);

  const toggle = () => setValue(!value);

  return [value, toggle, setValue];
}
