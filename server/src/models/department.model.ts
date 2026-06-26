import orm from '@orm';
import { BodySchemas } from 'schemas/department.schemas';
import { DataTypes, Model, QueryTypes, type Optional } from 'sequelize';
import { pagination } from 'utils/express.utils';
import { count, getPagination, toDate, toFloat } from 'utils/orm.utils';
import z from 'utils/zod.utils';

export interface DepartmentAttributes {
  id: number;
  name: string;
  budget?: number | null;
  established_date?: Date | null;
}

export interface DepartmentCreationAttributes extends Optional<
  DepartmentAttributes,
  'id'
> {}

class Department
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  declare public id: number;
  declare public name: string;
  declare public budget: number | null;
  declare public established_date: Date | null;

  public async findAll(page: number = 1, limit: number = 10) {
    const total = await count('departments');

    const { limit: limitPagination, offset } = getPagination(
      page,
      limit,
      total,
    );

    const data = await this.sequelize.query<Department>(
      `
        SELECT id, name, budget, established_date
        FROM departments
        LIMIT :limit OFFSET :offset
    `,
      {
        mapToModel: true,
        instance: this,
        replacements: {
          limit: limitPagination,
          offset,
        },
        type: QueryTypes.SELECT,
      },
    );

    return {
      data,
      meta: pagination(total, page, limit),
    };
  }

  public async create(data: z.infer<typeof BodySchemas.create>) {
    return Department.create({
      ...data,
      established_date: data?.establishedDate,
    });
  }

  public async edit(id: number, data: z.infer<typeof BodySchemas.edit>) {
    const [affectedCount, [department]] = await Department.update(
      {
        ...data,
        established_date: data.establishedDate,
      },
      { returning: true, where: { id }, individualHooks: false },
    );

    if (affectedCount === 0) return;

    return department;
  }

  public async delete(id: number) {
    const deleteCount = await Department.destroy({
      where: { id },
    });

    if (deleteCount === 0) return false;

    return true;
  }
}

Department.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    budget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
      get: toFloat('budget'),
    },
    established_date: {
      type: DataTypes.DATE,
      allowNull: true,
      get: toDate('established_date'),
    },
  },
  {
    sequelize: orm,
    tableName: 'departments',
    timestamps: false,
  },
);

export default Department;
