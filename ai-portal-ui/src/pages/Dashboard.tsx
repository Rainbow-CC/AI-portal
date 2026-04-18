import StatCard from '../components/StatCard';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in w-full max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        <StatCard label="今日累计请求" value="156,204" subValue="↑ 12.5% 较昨日" subColor="text-green-500" />
        <StatCard label="网关运行状态" value="稳定运行" subValue="Uptime: 142d 5h" pulse />
        <StatCard label="母行能力集成" value="24 核" subValue="含 4 个 Beta 阶段能力" />
        <StatCard label="系统平均可用性" value="99.98%" subValue="实时监控统计" border />
      </div>
      <div className="card p-6">
        <h3 className="font-bold mb-6">网关调用趋势 (近7日)</h3>
        <div className="h-64 w-full flex items-end gap-1">
          {[60, 70, 65, 85, 95, 75, 90].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-grow ${i === 6 ? 'bg-tech-blue/20' : 'bg-blue-50'} border-t-2 border-tech-blue transition-all cursor-pointer relative group`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
