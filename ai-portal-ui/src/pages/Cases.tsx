import CaseCard from '../components/CaseCard';

interface CasesProps {
  onShowDetail: (id: string) => void;
}

// 简单的 Frontmatter 解析函数，避免 gray-matter 在浏览器端的潜在问题
const parseFrontmatter = (content: string) => {
  const meta: Record<string, string> = {};
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (match) {
    const yaml = match[1];
    yaml.split('\n').forEach(line => {
      const [key, ...value] = line.split(':');
      if (key && value.length > 0) {
        meta[key.trim()] = value.join(':').trim();
      }
    });
  }
  return meta;
};

const Cases = ({ onShowDetail }: CasesProps) => {
  // 使用 Vite 4+ 推荐的 'as: raw' 方式获取字符串内容
  const modules = import.meta.glob('../articles/*.md', { eager: true, as: 'raw' });

  const cases = Object.entries(modules).map(([path, rawContent]) => {
    const fileName = path.split('/').pop()?.replace('.md', '') || '';
    const content = typeof rawContent === 'string' ? rawContent : (rawContent as any).default || '';
    const data = parseFrontmatter(content);
    
    return {
      id: fileName,
      title: data.title || fileName,
      category: data.category || '未分类',
      date: data.date || '',
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in w-full">
      {cases.map((item) => (
        <CaseCard
          key={item.id}
          title={item.title}
          category={item.category}
          date={item.date}
          onClick={() => onShowDetail(item.id)}
        />
      ))}
      
      {cases.length === 0 && (
        <div className="col-span-full py-20 text-center text-slate-400">
          暂无案例文章，请在 src/articles 目录下添加 .md 文件。
        </div>
      )}
    </div>
  );
};

export default Cases;
