interface StatCardProps {
  label: string;
  value: string;
  subValue: string;
  subColor?: string;
  border?: boolean;
  pulse?: boolean;
}

const StatCard = ({ label, value, subValue, subColor = "text-slate-400", border = false, pulse = false }: StatCardProps) => (
  <div className={`card p-4 md:p-6 ${border ? 'border-l-4 border-tech-blue' : ''}`}>
    <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">{label}</p>
    <div className="flex items-center gap-2 mt-2">
      {pulse && <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>}
      <p className={`text-xl md:text-3xl font-bold truncate ${border ? 'text-tech-blue' : ''}`}>{value}</p>
    </div>
    <p className={`text-[10px] md:text-xs mt-2 ${subColor}`}>{subValue}</p>
  </div>
);

export default StatCard;
