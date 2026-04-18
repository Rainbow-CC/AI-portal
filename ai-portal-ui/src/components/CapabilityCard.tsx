interface CapabilityCardProps {
  title: string;
  desc: string;
}

const CapabilityCard = ({ title, desc }: CapabilityCardProps) => (
  <div className="card p-6 hover:shadow-lg transition-all group">
    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-tech-blue transition-colors">
      <div className="w-6 h-6 bg-tech-blue rounded-sm" />
    </div>
    <h4 className="font-bold mb-2 text-sm text-slate-800">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default CapabilityCard;
