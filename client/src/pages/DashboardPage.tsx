import MetricCard from '../components/ui/MetricCard';
import LineChart from '../components/charts/LineChart';
import Card from '../components/ui/Card';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value="2,543"
          change={12.5}
          trend="up"
          icon={<Users size={24} />}
        />

        <MetricCard
          title="Revenue"
          value="$45,231"
          change={8.2}
          trend="up"
          icon={<DollarSign size={24} />}
        />

        <MetricCard
          title="Orders"
          value="1,234"
          change={-3.1}
          trend="down"
          icon={<ShoppingCart size={24} />}
        />

        <MetricCard
          title="Growth"
          value="23.5%"
          change={5.4}
          trend="up"
          icon={<TrendingUp size={24} />}
        />
      </div>

      <div className="mt-6">
        <LineChart data={chartData} title="Monthly Revenue" />
      </div>

      <div className="mt-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          {/* <Table 
            columns={columns} 
            data={users}
          /> */}
        </Card>
      </div>
    </div>
  );
}
