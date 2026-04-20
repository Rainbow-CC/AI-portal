import { useState } from 'react';

// API 定义类型
interface ApiItem {
  id: string;
  title: string;
  method: 'POST' | 'GET';
  path: string;
  tag: string;
  description: string;
}

const Developer = () => {
  // 控制哪个 API 卡片展开
  const [expandedId, setExpandedId] = useState<string | null>('vision-api');

  // --- Vision API 专用状态 ---
  const [apiKey, setApiKey] = useState('');
  const [sessionId, setSessionId] = useState(`sess-${Date.now()}`);
  const [userMessage, setUserMessage] = useState('提取图片中的核心信息');
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const apiList: ApiItem[] = [
    {
      id: 'vision-api',
      title: '多模态图片问答接口',
      method: 'POST',
      path: '/api/chat/vision',
      tag: 'Vision',
      description: '该接口利用大模型的多模态能力，对传入的图片进行深度理解，并回答用户关于该图片的问题。适用于证件识别、报表解析、场景问答等业务场景。'
    },
    {
      id: 'text-extract',
      title: '合同要素提取 (Beta)',
      method: 'POST',
      path: '/api/extract/elements',
      tag: 'NLP',
      description: '自动解析 PDF/图片格式合同，返回结构化 JSON 数据。'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSendVision = async () => {
    if (!apiKey) return alert("请填写 X-API-KEY");
    if (!imageBase64) return alert("请提供图片 Base64");
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/chat/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
        body: JSON.stringify({ imageBase64, sessionid: sessionId, userMessage })
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message || "请求失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col w-full pb-20">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">开发者集成中心</h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">在线查看 API 文档并进行即时功能调试</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {apiList.map((api) => (
          <div key={api.id} className={`card overflow-hidden transition-all duration-300 ${expandedId === api.id ? 'ring-2 ring-blue-500/20 shadow-xl' : 'hover:border-slate-300'}`}>
            {/* 卡片头部 */}
            <div 
              onClick={() => setExpandedId(expandedId === api.id ? null : api.id)}
              className={`p-4 md:p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${expandedId === api.id ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}
            >
              <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                <span className={`flex-shrink-0 text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded tracking-tighter ${api.method === 'POST' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {api.method}
                </span>
                <span className="font-mono text-[10px] md:text-xs text-slate-500 hidden sm:inline truncate">{api.path}</span>
                <h3 className="font-bold text-slate-700 text-sm md:text-base truncate">{api.title}</h3>
                <span className="hidden xs:inline flex-shrink-0 bg-slate-200 text-slate-600 text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded uppercase font-bold tracking-widest scale-90 md:scale-100 origin-left">{api.tag}</span>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 md:gap-3 text-slate-400 hover:text-blue-600 transition-colors ml-2">
                <span className="hidden md:inline text-[10px] uppercase font-bold tracking-widest">{expandedId === api.id ? '收起详情' : '展开文档与调试'}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${expandedId === api.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 详细内容区 */}
            <div className={`transition-all duration-500 ease-in-out ${expandedId === api.id ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="p-4 md:p-8 flex flex-col xl:flex-row gap-8 xl:gap-12 bg-white text-slate-800">
                
                {/* 1. 文档侧 */}
                <div className="xl:w-1/2 space-y-6 md:space-y-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900">{api.title}</h3>
                        <span className="bg-blue-600 text-white text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded font-bold uppercase tracking-widest">v1.0 / Stable</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{api.description}</p>
                  </div>

                  {/* Endpoint 区块 */}
                  <section>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">请求地址 (Endpoint)</h4>
                    <div className="bg-slate-900 text-blue-300 p-3 md:p-4 rounded border border-slate-700 font-mono text-[10px] md:text-xs flex justify-between items-center group overflow-hidden">
                        <div className="flex items-center gap-2 md:gap-3 truncate">
                            <span className="text-green-400 font-bold">POST</span>
                            <span className="truncate">{api.path}</span>
                        </div>
                        <button className="flex-shrink-0 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold underline decoration-dotted underline-offset-4 ml-2">COPY</button>
                    </div>
                  </section>

                  {/* 参数表格 */}
                  <div className="space-y-6 text-slate-800">
                    <section className="overflow-x-auto">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Headers</h4>
                        <table className="w-full text-left text-[11px] md:text-xs border-collapse min-w-[300px]">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 uppercase">
                                    <th className="py-2 font-bold w-1/3">Key</th>
                                    <th className="py-2 font-bold w-1/6">Type</th>
                                    <th className="py-2 font-bold">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                <tr className="border-b border-slate-50">
                                    <td className="py-3 font-mono text-blue-600 font-bold">X-API-KEY</td>
                                    <td className="py-3 italic">string</td>
                                    <td className="py-3">系统鉴权与限流标识（必填）</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="overflow-x-auto">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Request Body (JSON)</h4>
                        <table className="w-full text-left text-[11px] md:text-xs border-collapse min-w-[400px]">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 uppercase">
                                    <th className="py-2 font-bold w-1/3">Field</th>
                                    <th className="py-2 font-bold w-1/6">Type</th>
                                    <th className="py-2 font-bold">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {api.id === 'vision-api' ? (
                                    <>
                                        <tr className="border-b border-slate-50">
                                            <td className="py-3 font-mono text-blue-600 font-bold">imageBase64</td>
                                            <td className="py-3 italic">string</td>
                                            <td className="py-3">图片的 Base64 数据（必填）</td>
                                        </tr>
                                        <tr className="border-b border-slate-50">
                                            <td className="py-3 font-mono text-blue-600 font-bold">userMessage</td>
                                            <td className="py-3 italic">string</td>
                                            <td className="py-3">针对图片的提问或指令（必填）</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-blue-600 font-bold">sessionid</td>
                                            <td className="py-3 italic">string</td>
                                            <td className="py-3">会话 ID，用于上下文追踪</td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr><td colSpan={3} className="py-8 text-center text-slate-300 italic">参数文档整理中...</td></tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                  </div>
                </div>

                {/* 2. 调试侧 (Playground) */}
                <div className="xl:w-1/2">
                    <div className="card p-4 md:p-6 bg-slate-50 border-2 border-slate-200 border-dashed relative">
                        {/* 显眼的调试标签 */}
                        <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-3 md:px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                          Online Debugger
                        </div>
                        
                        {api.id === 'vision-api' ? (
                            <div className="space-y-4 md:space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">X-API-Key</label>
                                        <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="必填密钥" className="w-full text-xs p-2.5 border border-slate-300 rounded shadow-sm outline-none focus:border-blue-600 bg-white text-slate-900" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">UserMessage</label>
                                        <input type="text" value={userMessage} onChange={e=>setUserMessage(e.target.value)} className="w-full text-xs p-2.5 border border-slate-300 rounded shadow-sm outline-none focus:border-blue-600 bg-white text-slate-900" />
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">imageBase64</label>
                                        <label className="text-[9px] md:text-[10px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer font-bold flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded transition-all shadow-md active:scale-95">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            SELECT
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <textarea value={imageBase64} onChange={e=>setImageBase64(e.target.value)} rows={4} className="w-full text-[10px] font-mono p-3 border border-slate-300 rounded bg-white shadow-inner resize-none text-slate-800" placeholder="Base64 Data content..." />
                                </div>

                                <button 
                                    onClick={handleSendVision}
                                    disabled={loading}
                                    className={`w-full py-2.5 md:py-3 rounded text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-[0.98] ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-500 ring-offset-2'}`}
                                >
                                    {loading ? 'Processing...' : 'Execute Request'}
                                </button>

                                <div className="pt-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-2 block">Response Payload</label>
                                    <div className="bg-slate-900 rounded p-4 md:p-5 h-48 md:h-56 overflow-y-auto font-mono text-[10px] border border-slate-800 shadow-2xl relative">
                                        {response ? (
                                            <pre className="text-green-400 whitespace-pre-wrap break-all leading-relaxed">
                                                {JSON.stringify(response, null, 2)}
                                            </pre>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 italic px-4 text-center">
                                                <svg className="w-8 h-8 mb-2 opacity-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                Ready for testing...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 md:h-96 flex flex-col items-center justify-center text-slate-400 text-[10px] md:text-xs italic gap-3">
                                <svg className="w-10 h-10 md:w-12 md:h-12 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                Playground under development
                            </div>
                        )}
                    </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Developer;
