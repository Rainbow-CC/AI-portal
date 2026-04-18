import { useState } from 'react';
import './index.css';

type View = 'dashboard' | 'capability' | 'cases' | 'case-detail' | 'developer' | 'monitoring';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [breadcrumb, setBreadcrumb] = useState('数据大盘');
  const [caseId, setCaseId] = useState<'contract' | 'aml' | null>(null);

  const showView = (view: View, label?: string) => {
    setCurrentView(view);
    if (label) setBreadcrumb(label);
  };

  const showCaseDetail = (id: 'contract' | 'aml') => {
    setCaseId(id);
    showView('case-detail', '案例详情');
  };

  const viewNames: Record<Exclude<View, 'case-detail'>, string> = {
    dashboard: '数据大盘',
    capability: '能力地图',
    cases: 'AI 案例汇总',
    developer: '开发者中心',
    monitoring: '监控审计',
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* 1. 侧边导航栏 */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-50">
          <div className="w-8 h-8 bg-tech-blue rounded-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-tech-blue">AI Portal</span>
        </div>

        <nav className="flex-grow mt-4 px-3 space-y-1">
          {Object.entries(viewNames).map(([key, label]) => (
            <button
              key={key}
              onClick={() => showView(key as View, label)}
              className={`${
                currentView === key ? 'sidebar-active' : 'text-slate-600'
              } w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50`}
            >
              {key === 'dashboard' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
              {key === 'capability' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
              {key === 'cases' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              {key === 'developer' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
              {key === 'monitoring' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2-0 01-2-2z" /></svg>}
              {label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-sm bg-slate-50">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 italic">User</div>
            <div className="text-xs">
              <p className="font-bold">Admin_Trust</p>
              <p className="text-slate-400">系统管理员</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主体内容区 */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* 头部 Breadcrumb */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>控制台</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              系统连接正常
            </div>
            <button className="p-2 text-slate-400 hover:text-tech-blue">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* 视图容器 */}
        <div className="flex-grow overflow-y-auto p-8 bg-[#F8FAFC]">
          {/* Dashboard */}
          {currentView === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          )}

          {/* Capability Map */}
          {currentView === 'capability' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              <CapabilityCard title="合同要素提取" desc="精准识别复杂长文本合同中的关键条款、交易标的、违约责任等核心要素。" />
              <CapabilityCard title="多模态 OCR" desc="适配母行下发的通用证照、财务报表与非标手工票据高精度识别模型。" />
              <CapabilityCard title="语义意图识别" desc="针对金融语境进行微调，支持复杂对话场景下的客户意图精准锚定。" />
            </div>
          )}

          {/* Cases */}
          {currentView === 'cases' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <CaseCard
                title="信托合同自动合规审计系统"
                category="风险合规"
                date="2026-03-20"
                onClick={() => showCaseDetail('contract')}
              />
              <CaseCard
                title="智能反洗钱资金穿透分析"
                category="运营大盘"
                date="2026-02-15"
                onClick={() => showCaseDetail('aml')}
              />
            </div>
          )}

          {/* Case Detail */}
          {currentView === 'case-detail' && (
            <div className="animate-fade-in">
              <button onClick={() => showView('cases', 'AI 案例汇总')} className="text-tech-blue mb-4 flex items-center gap-1 font-bold">
                ← 返回案例列表
              </button>
              <div className="card p-8">
                <h1 className="text-3xl font-bold mb-6">{caseId === 'contract' ? '信托合同自动合规审计系统' : '智能反洗钱资金穿透分析'}</h1>
                <p className="text-slate-600">正在显示 {caseId} 的详细信息方案...</p>
              </div>
            </div>
          )}

          {/* Developer Center */}
          {currentView === 'developer' && (
            <div className="card p-8 animate-fade-in h-[600px] flex items-center justify-center text-slate-400">
               开发者集成中心模块
            </div>
          )}

          {/* Monitoring */}
          {currentView === 'monitoring' && (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 animate-fade-in">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <p className="font-bold">监控审计页面开发中</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sub-components
const StatCard = ({ label, value, subValue, subColor = "text-slate-400", border = false, pulse = false }: any) => (
  <div className={`card p-6 ${border ? 'border-l-4 border-tech-blue' : ''}`}>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
    <div className="flex items-center gap-2 mt-2">
      {pulse && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
      <p className={`text-3xl font-bold ${border ? 'text-tech-blue' : ''}`}>{value}</p>
    </div>
    <p className={`text-xs mt-2 ${subColor}`}>{subValue}</p>
  </div>
);

const CapabilityCard = ({ title, desc }: any) => (
  <div className="card p-6 hover:shadow-lg transition-all group">
    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-tech-blue transition-colors">
      <div className="w-6 h-6 bg-tech-blue rounded-sm" />
    </div>
    <h4 className="font-bold mb-2 text-sm text-slate-800">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const CaseCard = ({ title, category, date, onClick }: any) => (
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

export default App;
