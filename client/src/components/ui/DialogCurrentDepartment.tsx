import { useCallback, useEffect, useState } from 'react';
import Dialog from './Dialog';
import departments from '../../api/departments';
import { toast } from 'react-toastify';
import useLoadingState from '../../hooks/useLoadingState';
import { Department } from 'types/department';
import Loader from './Loader';
import { toDate } from 'utils/ag-grid';
import { Link } from 'react-router-dom';

interface Props {
  id: number;

  open: boolean;
  onClose: VoidFunction;
}

export default function DialogCurrentDepartment({ id, open, onClose }: Props) {
  const [isLoading, _, setState] = useLoadingState();

  const [department, setDepartment] = useState<Department>();

  const fetch = useCallback(async () => {
    setState('loading');

    const {
      data: { ok, data },
    } = await departments.getById(id);

    if (!ok) {
      onClose();
      return toast('Ошибка при получении');
    }

    setDepartment(data);

    setState('ready');
  }, [id, onClose, setDepartment]);

  useEffect(() => {
    if (open) fetch();
  }, [open, id, onClose, fetch]);

  return (
    <Dialog open={open} onClose={onClose} title={'Отдел'}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div>id: {department?.id}</div>
          <div>
            Дата основания:{' '}
            {new Date(department!.established_date as Date).toLocaleDateString(
              'ru-RU',
            )}
          </div>
          <div>Бюджет: {department?.budget ?? 'Нет'}</div>
          <div>Название: {department?.name}</div>

          <Link className="text-blue-500 underline" to="/departments">
            Перейти к отделам
          </Link>
        </>
      )}
    </Dialog>
  );
}
