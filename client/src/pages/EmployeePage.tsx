import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

export default function EmployeePage() {
  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      render: (value: string) => <Avatar src={value} size="sm" />,
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => {
        const variant =
          value === 'Admin'
            ? 'info'
            : value === 'Manager'
              ? 'warning'
              : 'default';
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'default'}>
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Сотрудники
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
        Просмотр, удаление, редактирование
      </p>

      <Card>
        <Table columns={columns} data={[]} />
      </Card>
    </div>
  );
}
