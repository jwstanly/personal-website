import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';

interface CodeBlockRendererProps {
  language: string;
  value: string;
}

export default function CodeBlockRenderer(props: CodeBlockRendererProps) {
  return (
    <SyntaxHighlighter
      language={props.language}
      style={style}
      showLineNumbers={false}
      wrapLines={true}
      customStyle={
        {
          fontSize: 14,
          padding: 20,
          borderRadius: 8,
        } as React.CSSProperties
      }
      useInlineStyles={true}
    >
      {props.value}
    </SyntaxHighlighter>
  );
}
