interface StatCardProps {
  label: string;
  value: string;
  subValue: string;
  subColor?: string;
  border?: boolean;
  pulse?: boolean;
}

const StatCard = ({ label, value, subValue, subColor = "text-slate-400", border = false, pulse = false }: StatCardProps) => (
  <div className={`card p-6 ${border ? 'border-l-4 border-tech-blue' : ''}`}>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
    <div className="flex items-center gap-2 mt-2">
      {pulse && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
      <p className={`text-3xl font-bold ${border ? 'text-tech-blue' : ''}`}>{value}</p>
    </div>
    <p className={`text-xs mt-2 ${subColor}`}>{subValue}</p>
  </div>
);

export default StatCard;
