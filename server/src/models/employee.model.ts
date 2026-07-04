import { DataTypes, Model, Optional, QueryTypes } from 'sequelize';

import Department from './department.model';
import orm from '@orm';
import { getPagination, toDate, toFloat } from 'utils/orm.utils';
import { pagination } from 'utils/express.utils';
import z from 'utils/zod.utils';
import { BodySchemas } from 'schemas/employee.schemas';
import { NotFoundError } from 'errors/not-found.error';

interface EmployeeAttributes {
  id: number;
  name: string;
  salary?: number | null;
  hire_date?: Date | null;
  department_id: number;
}

interface EmployeeCreationAttributes extends Optional<
  EmployeeAttributes,
  'id'
> {}

class Employee
  extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes
{
  declare public id: number;
  declare public name: string;
  declare public salary: number | null;
  declare public hire_date: Date | null;
  declare public department_id: number;

  async findAll(
    page: number = 1,
    limit: number = 10,
    departmentId: number | null = null,
  ) {
    const total = await Employee.count();

    const { limit: limitPagination, offset } = getPagination(
      page,
      limit,
      total,
    );

    const data = await this.sequelize.query<Employee>(
      `
        SELECT
          e.id,
          e.name,
          e.salary,
          e.hire_date,
          json_build_object(
            'id', d.id,
            'name', d.name,
            'budget', d.budget,
            'established_date', d.established_date
          ) AS department
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE (:departmentId IS NULL OR e.department_id = :departmentId)
        ORDER BY e.id
        LIMIT :limit OFFSET :offset
    `,
      {
        mapToModel: true,
        instance: this,
        replacements: {
          limit: limitPagination,
          offset,
          departmentId,
        },
        type: QueryTypes.SELECT,
      },
    );

    return { data, meta: pagination(total, page, limit) };
  }

  async create(data: z.infer<typeof BodySchemas.create>) {
    const department = await Department.findByPk(data.department_id);

    if (!department)
      throw new NotFoundError({
        message: 'Department by id not found',
        details: { department_id: 'not found' },
      });

    return await Employee.create({
      ...data,
      hire_date: data.hire_date,
    });
  }

  async edit(id: number, data: z.infer<typeof BodySchemas.edit>) {
    const [affectedCount, [employee]] = await Employee.update(
      {
        ...data,
        department_id: data.department_id,
        hire_date: data.hire_date,
      },
      {
        returning: true,
        where: { id },
        individualHooks: false,
      },
    );

    if (affectedCount === 0)
      throw new NotFoundError({
        message: 'Employee by id not found!',
      });

    return employee;
  }

  async delete(id: number) {
    const deleteCount = await Employee.destroy({
      where: { id },
    });

    if (!deleteCount)
      throw new NotFoundError({ message: 'Employee by id not found!' });

    return;
  }
}

Employee.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING(100), allowNull: false },

    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      get: toFloat('salary'),
    },

    hire_date: {
      type: DataTypes.DATE,
      allowNull: true,
      get: toDate('hire_date'),
    },

    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Department, key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  { sequelize: orm, tableName: 'employees', timestamps: false },
);

Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

export default Employee;
