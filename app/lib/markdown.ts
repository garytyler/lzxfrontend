import {useEffect, useState} from 'react';
import {Remarkable} from 'remarkable';

export function useGetMarkdownURLToHTML(url: string) {
  const [markdownString, setMarkdownString] = useState('');
  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        setMarkdownString(text);
      });
  }, [url]);

  const markdownRenderer = new Remarkable();
  const response = markdownRenderer.render(markdownString);
  return response;
}

export function getMarkdownToHTML(markdownString: string) {
  const markdownRenderer = new Remarkable();
  const response = markdownRenderer.render(markdownString);
  return response;
}
