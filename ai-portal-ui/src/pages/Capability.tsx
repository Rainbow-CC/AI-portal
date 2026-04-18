import CapabilityCard from '../components/CapabilityCard';

const Capability = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in w-full">
      <CapabilityCard title="合同要素提取" desc="精准识别复杂长文本合同中的关键条款、交易标的、违约责任等核心要素。" />
      <CapabilityCard title="多模态 OCR" desc="适配母行下发的通用证照、财务报表与非标手工票据高精度识别模型。" />
      <CapabilityCard title="语义意图识别" desc="针对金融语境进行微调，支持复杂对话场景下的客户意图精准锚定。" />
    </div>
  );
};

export default Capability;
