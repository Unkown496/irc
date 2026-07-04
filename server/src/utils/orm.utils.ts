import { Model } from 'sequelize';
import type { Attributes } from 'types/orm.types';

export const getPagination = (page: number, limit: number, total: number) => {
  if (limit > total) return { limit: total, offset: 0 };

  const safeFilters = {
    page: Math.max(1, page),
    limit: Math.max(1, limit),
  };
  const offset = (safeFilters.page - 1) * safeFilters.limit;

  if (offset >= total) return { limit: 0, offset: total };

  return { limit: safeFilters.limit, offset };
};

export function toFloat<T extends Model<any>, K = keyof Attributes<T>>(
  fieldKey: K,
) {
  return function (this: T) {
    const val = this.getDataValue(fieldKey as string);

    if (typeof val === 'string') return parseFloat(val);
    else return null;
  };
}

export function toDate<T extends Model<any>, K = keyof Attributes<T>>(
  fieldKey: K,
) {
  return function (this: T) {
    const val = this.getDataValue(fieldKey as string);

    if (typeof val === 'string') return new Date(val);
    else return null;
  };
}
