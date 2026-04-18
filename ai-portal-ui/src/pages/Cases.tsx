import CaseCard from '../components/CaseCard';

interface CasesProps {
  onShowDetail: (id: 'contract' | 'aml') => void;
}

const Cases = ({ onShowDetail }: CasesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in w-full">
      <CaseCard
        title="信托合同自动合规审计系统"
        category="风险合规"
        date="2026-03-20"
        onClick={() => onShowDetail('contract')}
      />
      <CaseCard
        title="智能反洗钱资金穿透分析"
        category="运营大盘"
        date="2026-02-15"
        onClick={() => onShowDetail('aml')}
      />
    </div>
  );
};

export default Cases;
