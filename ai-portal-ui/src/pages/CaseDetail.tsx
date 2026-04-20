interface CaseDetailProps {
  caseId: 'contract' | 'aml' | null;
  onBack: () => void;
}

const CaseDetail = ({ caseId, onBack }: CaseDetailProps) => {
  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-tech-blue mb-4 flex items-center gap-1 font-bold">
        ← 返回案例列表
      </button>
      <div className="card p-4 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">{caseId === 'contract' ? '信托合同自动合规审计系统' : '智能反洗钱资金穿透分析'}</h1>
        <p className="text-sm md:text-base text-slate-600">正在显示 {caseId} 的详细信息方案...</p>
      </div>
    </div>
  );
};

export default CaseDetail;
