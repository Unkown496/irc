import orm from '@orm';
import { BodySchemas } from 'schemas/department.schemas';
import { DataTypes, Model, QueryTypes, type Optional } from 'sequelize';
import { pagination } from 'utils/express.utils';
import { getPagination, toDate, toFloat } from 'utils/orm.utils';
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
    const total = await Department.count();

    const { limit: limitPagination, offset } = getPagination(
      page,
      limit,
      total,
    );

    const data = await orm.query<Department>(
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
    const query = `INSERT INTO "departments" ("id","name","budget","established_date") VALUES (DEFAULT,$name,$budget,$established_date) RETURNING "id","name","budget","established_date"`;

    const [result] = await orm.query(query, {
      mapToModel: true,
      instance: this,
      bind: {
        name: data.name,
        budget: data.budget ?? null,
        established_date: data.established_date ?? null,
      },
      type: QueryTypes.INSERT,
    });

    return result;
  }

  public async edit(id: number, data: z.infer<typeof BodySchemas.edit>) {
    const query = `
    UPDATE "departments" 
    SET 
      "name" = COALESCE($name, "name"),
      "budget" = COALESCE($budget, "budget"),
      "established_date" = COALESCE($established_date, "established_date")
    WHERE "id" = $id 
    RETURNING "id","name","budget","established_date"`;

    const [result, countUpdated] = await this.sequelize.query(query, {
      instance: this,
      mapToModel: true,
      bind: {
        id,
        name: data?.name ?? null,
        budget: data?.budget ?? null,
        established_date: data?.established_date ?? null,
      },
      type: QueryTypes.UPDATE,
    });

    if (countUpdated === 0) return;

    return result;
  }

  public async delete(id: number) {
    const [_, meta] = await orm.query(
      `DELETE FROM "departments" WHERE "id" = $id`,
      {
        bind: { id },
      },
    );

    return (meta as { rowCount: number }).rowCount > 0;
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
