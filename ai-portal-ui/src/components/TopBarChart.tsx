import ReactECharts from 'echarts-for-react';

interface DataItem {
  name: string;
  value: number;
}

interface TopBarChartProps {
  title: string;
  data: DataItem[];
  unit?: string;
}

const TopBarChart = ({ title, data, unit = '次' }: TopBarChartProps) => {
  // 确保数据按从大到小排序，且只取前10
  const sortedData = [...data].sort((a, b) => a.value - b.value).slice(-10);

  const option = {
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: false,
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748b',
        fontSize: 12,
        formatter: (value: string) => {
          return value.length > 15 ? value.substring(0, 15) + '...' : value;
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: sortedData.map(item => item.value),
        barWidth: 14,
        itemStyle: {
          color: '#0052D9',
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: `{c} ${unit}`,
          color: '#94a3b8',
          fontSize: 11
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    }
  };

  return (
    <div className="card p-6">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-1 h-4 bg-tech-blue rounded-full"></div>
        {title}
      </h3>
      <div className="h-64">
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};

export default TopBarChart;
