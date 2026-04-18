interface CaseCardProps {
  title: string;
  category: string;
  date: string;
  onClick: () => void;
}

const CaseCard = ({ title, category, date, onClick }: CaseCardProps) => (
  <div onClick={onClick} className="card group cursor-pointer hover:border-tech-blue transition-all overflow-hidden">
    <div className="h-40 bg-slate-100 flex items-center justify-center" />
    <div className="p-5">
      <div className="flex items-center justify-between mb-3 text-[10px]">
        <span className="bg-blue-100 text-tech-blue px-2 py-0.5 rounded font-bold">{category}</span>
        <span className="text-slate-400">{date}</span>
      </div>
      <h3 className="font-bold text-slate-800 text-sm group-hover:text-tech-blue transition-colors">{title}</h3>
    </div>
  </div>
);

export default CaseCard;
