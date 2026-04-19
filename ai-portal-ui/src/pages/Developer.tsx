import { useState } from 'react';

const Developer = () => {
  const [apiKey, setApiKey] = useState('');
  const [sessionId, setSessionId] = useState(`sess-${Date.now()}`);
  const [userMessage, setUserMessage] = useState('提取图片中的核心信息');
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  // 处理本地图片选择并转换为 Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!apiKey) return alert("请填写 X-API-KEY");
    if (!imageBase64) return alert("请提供图片 Base64");
    
    setLoading(true);
    setResponse(null);
    try {
      // 配合 Vite Proxy 发起请求
      const res = await fetch('/api/chat/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey
        },
        body: JSON.stringify({
          imageBase64: imageBase64,
          sessionid: sessionId,
          userMessage: userMessage
        })
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setResponse({ error: err.message || "请求异常，请检查网络或跨域配置" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full w-full">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">开发者集成中心</h2>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-grow overflow-hidden">
        {/* 左侧：接口文档说明 */}
        <div className="lg:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">多模态图片问答 API</h3>
              <span className="bg-blue-100 text-tech-blue text-[10px] px-2 py-0.5 rounded font-bold uppercase">Vision</span>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              该接口利用大模型的多模态能力，对传入的图片进行深度理解，并回答用户关于该图片的问题。适用于证件识别、报表解析、场景问答等业务场景。
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Endpoint</h4>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-sm font-mono text-slate-700 flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">POST</span>
                  /api/chat/vision
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">请求头 (Headers)</h4>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 font-medium">参数名</th>
                      <th className="py-2 font-medium">必填</th>
                      <th className="py-2 font-medium">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 font-mono text-xs text-slate-700">X-API-KEY</td>
                      <td className="py-2 text-red-500 text-xs">是</td>
                      <td className="py-2 text-slate-500 text-xs">系统鉴权与限流标识</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">请求体 (Body - JSON)</h4>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 font-medium">参数名</th>
                      <th className="py-2 font-medium">必填</th>
                      <th className="py-2 font-medium">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 font-mono text-xs text-slate-700">imageBase64</td>
                      <td className="py-2 text-red-500 text-xs">是</td>
                      <td className="py-2 text-slate-500 text-xs">图片的 Base64 编码数据</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 font-mono text-xs text-slate-700">userMessage</td>
                      <td className="py-2 text-red-500 text-xs">是</td>
                      <td className="py-2 text-slate-500 text-xs">针对图片提出的任务或问题指令</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 font-mono text-xs text-slate-700">sessionid</td>
                      <td className="py-2 text-slate-400 text-xs">否</td>
                      <td className="py-2 text-slate-500 text-xs">会话上下文标识符</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：API 调试器 */}
        <div className="lg:w-1/2 flex flex-col gap-4 overflow-hidden">
          <div className="card p-6 flex flex-col h-full border-t-4 border-tech-blue">
            <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">在线调试 (Playground)</h3>
            
            <div className="space-y-4 flex-grow overflow-y-auto pr-2 pb-4">
              {/* X-API-KEY */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">X-API-KEY <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="请输入用于限流的 API KEY"
                  className="w-full text-sm p-2 border border-slate-300 rounded focus:border-tech-blue focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* sessionid */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Session ID</label>
                  <input 
                    type="text" 
                    value={sessionId}
                    onChange={e => setSessionId(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded focus:border-tech-blue focus:outline-none transition-colors font-mono"
                  />
                </div>
                {/* userMessage */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">User Message <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={userMessage}
                    onChange={e => setUserMessage(e.target.value)}
                    placeholder="例如：提取证书编号"
                    className="w-full text-sm p-2 border border-slate-300 rounded focus:border-tech-blue focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* imageBase64 */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-600">Image Base64 <span className="text-red-500">*</span></label>
                  <label className="text-[10px] text-tech-blue hover:underline cursor-pointer font-normal flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    选择本地图片 (自动转换)
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                <textarea 
                  value={imageBase64}
                  onChange={e => setImageBase64(e.target.value)}
                  placeholder="可在此直接粘贴 Base64 编码，或点击右上方选择图片自动生成..."
                  rows={4}
                  className="w-full text-sm p-2 border border-slate-300 rounded focus:border-tech-blue focus:outline-none transition-colors font-mono text-[10px] resize-none"
                />
              </div>

              {/* Action */}
              <div className="pt-2">
                <button 
                  onClick={handleSend}
                  disabled={loading}
                  className={`w-full py-2.5 rounded text-white text-sm font-bold transition-all flex justify-center items-center gap-2 ${loading ? 'bg-tech-blue/60 cursor-wait' : 'bg-tech-blue hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? '模型处理中...' : '发起调用 (Send Request)'}
                </button>
              </div>

              {/* Response */}
              <div className="pt-4 border-t border-slate-100 flex-grow flex flex-col">
                <label className="block text-xs font-bold text-slate-600 mb-2">Response</label>
                <div className="bg-slate-900 rounded p-4 h-48 overflow-y-auto flex-grow relative">
                  {response ? (
                    <pre className="text-[11px] font-mono text-green-400 whitespace-pre-wrap break-all">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs font-mono">
                      等待发起调用...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;
