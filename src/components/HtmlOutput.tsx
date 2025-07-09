import React from 'react';
import { FileCode, } from 'lucide-react';

interface Props {
  html: string;
}

const HtmlOutput: React.FC<Props> = ({ html }) => {
  const downloadHtml = () => {
    const blob = new Blob(
      [
        `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Документ</title>
</head>
<body>
${html}
</body>
</html>`,
      ],
      { type: 'text/html' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'export.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="html-output">
      <h2>HTML-код</h2>
      <pre>{html}</pre>
      <button
        onClick={downloadHtml}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#d7d7d7',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        <FileCode size={18} strokeWidth={2} /> Скачать как HTML
      </button>
    </div>
  );
};

export default HtmlOutput;
