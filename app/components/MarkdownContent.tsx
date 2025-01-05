import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  urls: string[];
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({urls}) => {
  const [contents, setContents] = useState<{title?: string; content: string}[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retry, setRetry] = useState<number>(0);

  useEffect(() => {
    const fetchMarkdowns = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedContents = await Promise.all(
          urls.map(async (url) => {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            const markdown = await response.text();
            const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

            const titleMatch = match
              ? match[1].split('\n').find((line) => line.startsWith('title:'))
              : undefined;
            const title = titleMatch
              ? titleMatch.split(':')[1].trim()
              : undefined;
            const content = match ? match[2] : markdown;

            return {title, content};
          }),
        );

        setContents(fetchedContents);
      } catch (err: any) {
        console.error('Error loading markdown:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdowns();
  }, [urls, retry]);

  if (loading) {
    return <div>Loading content...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading content: {error}</p>
        <button onClick={() => setRetry((prev) => prev + 1)}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {contents.map((item, index) => (
        <section key={index} className="markdown-section">
          {item.title && <h2>{item.title}</h2>}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.content}
          </ReactMarkdown>
        </section>
      ))}
    </div>
  );
};

export default MarkdownContent;
