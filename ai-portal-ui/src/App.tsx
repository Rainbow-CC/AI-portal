import { useState, useEffect } from 'react';
import './index.css';
import Dashboard from './pages/Dashboard';
import Capability from './pages/Capability';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import Developer from './pages/Developer';
import Monitoring from './pages/Monitoring';

type View = 'dashboard' | 'capability' | 'cases' | 'case-detail' | 'developer' | 'monitoring';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [breadcrumb, setBreadcrumb] = useState('数据大盘');
  const [caseId, setCaseId] = useState<'contract' | 'aml' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 健康状态: 'UP' | 'DOWN' | 'LOADING'
  const [healthStatus, setHealthStatus] = useState<'UP' | 'DOWN' | 'LOADING'>('LOADING');

  const checkHealth = async () => {
    setHealthStatus('LOADING');
    try {
      const res = await fetch(`/actuator/health?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data.status === 'UP' ? 'UP' : 'DOWN');
      } else {
        setHealthStatus('DOWN');
      }
    } catch (err) {
      setHealthStatus('DOWN');
    }
  };

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, 60000); // 1分钟轮询
    return () => clearInterval(timer);
  }, []);

  const showView = (view: View, label?: string) => {
    setCurrentView(view);
    if (label) setBreadcrumb(label);
    setIsSidebarOpen(false); // 移动端点击后自动关闭侧边栏
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
    <div className="flex h-screen overflow-hidden w-full relative">
      {/* 0. 移动端遮罩层 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. 侧边导航栏 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-tech-blue rounded-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-tech-blue">AI Portal</span>
          </div>
          {/* 移动端关闭按钮 */}
          <button className="md:hidden p-1 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-grow mt-4 px-3 space-y-1 overflow-y-auto">
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
        {/* 头部 Breadcrumb */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 w-full">
          <div className="flex items-center gap-3">
            {/* 移动端汉堡菜单按钮 */}
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400 overflow-hidden">
              <span className="hidden sm:inline">控制台</span>
              <span className="hidden sm:inline text-slate-300">/</span>
              <span className="text-slate-900 font-medium truncate">{breadcrumb}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={checkHealth}
              title="点击手动刷新系统状态"
              className={`flex items-center gap-2 text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full transition-all border ${
                healthStatus === 'UP' 
                  ? 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100 shadow-sm' 
                  : healthStatus === 'DOWN'
                    ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100 shadow-sm'
                    : 'text-slate-400 bg-slate-50 border-slate-100 animate-pulse'
              }`}
            >
              <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                healthStatus === 'UP' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : healthStatus === 'DOWN' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-300'
              }`}></span>
              <span className="hidden xs:inline">{healthStatus === 'UP' ? '系统连接正常' : healthStatus === 'DOWN' ? '网关连接断开' : '正在检测状态...'}</span>
              <span className="xs:hidden">{healthStatus === 'UP' ? '网关连接' : healthStatus === 'DOWN' ? '网关断开' : '...'}</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-tech-blue">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* 视图容器 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC] w-full">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'capability' && <Capability />}
          {currentView === 'cases' && <Cases onShowDetail={showCaseDetail} />}
          {currentView === 'case-detail' && <CaseDetail caseId={caseId} onBack={() => showView('cases', 'AI 案例汇总')} />}
          {currentView === 'developer' && <Developer />}
          {currentView === 'monitoring' && <Monitoring />}
        </div>
      </main>
    </div>
  );
}

export default App;
