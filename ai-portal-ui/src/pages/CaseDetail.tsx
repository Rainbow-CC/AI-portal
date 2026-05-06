import ReactMarkdown from 'react-markdown';

interface CaseDetailProps {
  caseId: string | null;
  onBack: () => void;
}

const CaseDetail = ({ caseId, onBack }: CaseDetailProps) => {
  // 使用 Vite 4+ 推荐的 'as: raw' 方式获取字符串内容
  const modules = import.meta.glob('../articles/*.md', { eager: true, as: 'raw' });
  
  // 查找匹配的文章
  const targetPath = Object.keys(modules).find(path => path.endsWith(`${caseId}.md`));
  const rawContentBlob = targetPath ? modules[targetPath] : null;
  const rawContent = typeof rawContentBlob === 'string' ? rawContentBlob : (rawContentBlob as any)?.default || '';

  if (!rawContent) {
    return (
      <div className="card p-12 text-center text-slate-400">
        未找到相关案例内容。
        <button onClick={onBack} className="block mx-auto mt-4 text-tech-blue">返回列表</button>
      </div>
    );
  }

  // 去除 Frontmatter 部分，仅保留正文
  const content = rawContent.replace(/^---\r?\n[\s\S]*?\r?\n---/, '').trim();

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <button 
        onClick={onBack} 
        className="text-tech-blue mb-6 flex items-center gap-2 font-bold hover:translate-x-[-4px] transition-transform"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回案例列表
      </button>

      <div className="card p-6 md:p-12 bg-white shadow-sm border border-slate-100">
        <article className="prose prose-slate lg:prose-lg max-w-none 
          prose-headings:text-slate-800 prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mb-8
          prose-h2:text-xl prose-h2:border-l-4 prose-h2:border-tech-blue prose-h2:pl-4 prose-h2:mt-12
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-tech-blue
          prose-blockquote:border-tech-blue prose-blockquote:bg-blue-50/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
        ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default CaseDetail;
