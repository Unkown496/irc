import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  ListboxProps,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Fragment,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Label from './Label';
import LoadMore from './LoadMore';
import Loader from './Loader';
import clsx from 'clsx';

export interface SelectObject {
  text: string;
  value: string | number;
}

type SelectValue = string | SelectObject;

interface Props extends Omit<ListboxProps, 'value' | 'onChange'> {
  emptyText?: string;
  label?: string;
  value: string | number;
  items: Array<SelectValue>;
  infinity?: boolean;

  error?: string;

  ref?: Ref<HTMLElement>;

  loading?: boolean;
  loadingText?: string;

  onLoad?: VoidFunction;
  onChange(val: SelectObject): void;
}

interface PropsSelectButton {
  loading?: boolean;
  loadingText?: string;

  isError?: boolean;

  emptyText?: string;
  text: string;
}

function SelectButton({
  text,
  emptyText = 'Не выбрано',
  loadingText = 'Загружается...',
  isError = false,
  loading = false,
}: PropsSelectButton) {
  const showText = useMemo(
    () => (loading ? loadingText : text),
    [loading, loadingText, text],
  );

  return (
    <ListboxButton
      className={clsx(
        isError
          ? 'border-red-500 focus:border-red-500'
          : 'border-gray-300 focus:border-primary-500',
        ' border relative w-full cursor-default rounded-lg bg-white px-3 py-2 text-left focus:outline-none focus:ring-2  sm:text-sm',
      )}
    >
      <span className="block truncate">
        {showText.length ? showText : emptyText}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        {loading ? (
          <Loader />
        ) : (
          <ChevronsUpDown
            className={clsx('h-5 w-5 text-gray-400')}
            aria-hidden="true"
          />
        )}
      </span>
    </ListboxButton>
  );
}

interface PropsSelectOptions {
  items: Array<SelectObject>;
  children?: ReactNode;
}

function SelectOptions({ items, children }: PropsSelectOptions) {
  return (
    <ListboxOptions
      className={clsx(
        'absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-[9999]',
      )}
    >
      {items.map((item, i) => (
        <ListboxOption
          key={i}
          value={String(i)}
          className={({ active }) =>
            `relative cursor-default select-none py-2 pl-10 pr-4 ${
              active ? 'bg-blue-300/40' : 'text-gray-900'
            }`
          }
        >
          {({ selected }) => (
            <>
              {selected && (
                <Check className="text-emerald-500 absolute inset-0 -translate-y-1/2 top-1/2 ml-2" />
              )}

              {typeof item === 'object' ? item.text : item}
            </>
          )}
        </ListboxOption>
      ))}

      {children}
    </ListboxOptions>
  );
}

function Select({
  items,
  value,
  label,
  infinity = false,
  emptyText = 'Не выбрано',

  error,

  loading = false,
  loadingText,

  onChange = _ => {},
  onLoad,
  ...selectProps
}: Props) {
  const selectItems = useMemo(
    () =>
      items.map(item =>
        typeof item === 'object'
          ? item
          : {
              value: item,
              text: item,
            },
      ),
    [items],
  );

  const itemByValue = useMemo(
    () => selectItems.find(item => item.value === value),
    [value, selectItems],
  );

  const valueText = useMemo(() => itemByValue?.text ?? '', [itemByValue]);

  const [deepValue, setDeepValue] = useState<string>();

  const handleChange = useCallback(
    (val: string) => {
      if (!selectItems.length) return;
      const item = selectItems.find((_, i) => i === +val);

      if (!item) return;

      setDeepValue(val);

      return onChange(item);
    },
    [setDeepValue, selectItems],
  );

  useEffect(() => {
    if (!itemByValue) return;

    const valueIndex = selectItems.findIndex(
      item => item.text === itemByValue.text,
    );

    setDeepValue(String(valueIndex));
  }, [itemByValue]);

  const isError = useMemo(() => !!error?.length, [error]);

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Listbox
        {...selectProps}
        disabled={loading}
        value={deepValue}
        onChange={handleChange}
      >
        <div className="relative mt-1">
          <SelectButton
            text={valueText}
            emptyText={emptyText}
            loading={loading}
            isError={isError}
            loadingText={loadingText}
          />

          {/* <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <TransitionChild as={Fragment}>
            </TransitionChild>
            <TransitionChild as={Fragment}>
            </TransitionChild>
          </Transition> */}
          <SelectOptions items={selectItems} />
          <LoadMore onLoad={onLoad!} />

          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </Listbox>
    </div>
  );
}

Select.Options = SelectOptions;
Select.Button = SelectButton;

export default Select;
