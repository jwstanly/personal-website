import ReactMarkdown from 'react-markdown';
import { BlogArticle } from '../lib/Types';
import CodeBlockRenderer from './markdown/CodeBlockRenderer';
import CodeInlineRenderer from './markdown/CodeInlineRenderer';
import HeadingRenderer from './markdown/HeadingRenderer';
import ImageRenderer from './markdown/ImageRenderer';

interface ArticleTextProps {
  content: string;
}

export default function ArticleText(props: ArticleTextProps) {
  return (
    <ReactMarkdown
      source={props.content}
      escapeHtml={false}
      renderers={{
        image: ImageRenderer,
        code: CodeBlockRenderer,
        inlineCode: CodeInlineRenderer,
        heading: HeadingRenderer,
        /*
          break: 'br',
          paragraph: 'p',
          emphasis: 'em',
          strong: 'strong',
          thematicBreak: 'hr',
          blockquote: 'blockquote',
          delete: 'del',
          link: 'a',
          image: 'img',
          linkReference: 'a',
          imageReference: 'img',
          table: SimpleRenderer.bind(null, 'table'),
          tableHead: SimpleRenderer.bind(null, 'thead'),
          tableBody: SimpleRenderer.bind(null, 'tbody'),
          tableRow: SimpleRenderer.bind(null, 'tr'),
          tableCell: TableCell,
          root: Root,
          text: TextRenderer,
          list: List,
          listItem: ListItem,
          definition: NullRenderer,
          heading: Heading,
          inlineCode: InlineCode,
          code: CodeBlock,
          html: Html,
          virtualHtml: VirtualHtml,
          parsedHtml: ParsedHtml
          */
      }}
    />
  );
}
