import Card from '../components/ui/Card';
import TableDepartments from '../components/TableDepartments';

export default function DepartmentsPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Отделы
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
        Просмотр, удаление, редактирование
      </p>

      <Card>
        <TableDepartments />
      </Card>
    </div>
  );
}
