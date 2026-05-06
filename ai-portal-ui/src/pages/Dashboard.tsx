import { useState, useEffect } from 'react';
import TopBarChart from '../components/TopBarChart';

interface StatItem {
  name: string;
  value: number;
}

const Dashboard = () => {
  const [topSystems, setTopSystems] = useState<StatItem[]>([]);
  const [topApis, setTopApis] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [systemsRes, apisRes] = await Promise.all([
        fetch('/api/admin/stats/top-systems'),
        fetch('/api/admin/stats/top-apis')
      ]);

      if (systemsRes.ok && apisRes.ok) {
        const systems = await systemsRes.json();
        const apis = await apisRes.json();
        setTopSystems(systems);
        setTopApis(apis);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 30000); // 30秒更新一次
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading && topSystems.length === 0 ? (
          <div className="card p-12 flex items-center justify-center text-slate-400 lg:col-span-2">
            数据加载中...
          </div>
        ) : (
          <>
            <TopBarChart title="发起请求系统 TOP 10" data={topSystems} />
            <TopBarChart title="被调用接口 TOP 10" data={topApis} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
