import React from 'react';
import { Card } from '../../../components/Card';
import { BlogArticle } from '../../../lib/Types';
import API from '../../../lib/Api';
import CommentBoard from '../../../components/CommentBoard';
import ReactMarkdown from 'react-markdown';
import { LikeDislikePanel } from '../../../components/LikeDislikePanel';
import CenteredContainer from '../../../components/CenteredContainer';
import Spacer from '../../../components/Spacer';
import HeadTags from '../../../components/HeadTags';
import getBlogArticlePaths from '../../../lib/getBlogArticlePaths';
import CodeBlockRenderer from '../../../components/markdown/CodeBlockRenderer';
import ImageRenderer from '../../../components/markdown/ImageRenderer';
import * as DateUtil from '../../../lib/Date';
import CodeInlineRenderer from '../../../components/markdown/CodeInlineRenderer';
import HeadingRenderer from '../../../components/markdown/HeadingRenderer';

export async function getStaticPaths() {
  const paths = await getBlogArticlePaths();

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const article: BlogArticle = await API.getArticleByTitle(
    context.params.blogArticleId,
  );

  return {
    props: {
      article: article,
    },
  };
}

export default function Blog(props: { article: BlogArticle }) {
  const [article, setArticle] = React.useState<BlogArticle>(props.article);
  const [fetchedArticle, setFetchedArticle] = React.useState<BlogArticle>();

  function fetchArticle() {
    API.getArticleByTitle(article.title).then(newArticle => {
      setArticle(newArticle);
      setFetchedArticle(newArticle);
    });
  }

  React.useEffect(fetchArticle, [article.title]);

  return (
    <>
      <HeadTags
        title={article.title}
        description={
          article.subheader +
          '. ' +
          article.content.substring(0, 160 - (article.subheader.length + 5)) +
          '...'
        }
        imageUrl={article.image}
      />

      <Spacer top={100} />

      <CenteredContainer>
        <Card
          header={article.title}
          subheader={article.subheader}
          tags={article.tags}
          content={[]}
        />
        <div className="sm:flex">
          <div className="sm:flex-shrink-2">
            <div className="inline-flex mb-5">
              <img
                style={{
                  width: 45,
                  height: 45,
                  left: 0,
                  top: 0,
                }}
                src="/images/profileClipped.png"
                alt="John Wright Stanly"
              />
              <Spacer left={10} />
              <div className="flex-col">
                <div className="text-gray-500 text-sm font-bold">
                  John Wright Stanly
                </div>
                <div className="text-gray-500 text-sm">
                  {DateUtil.getFormattedDate(article.createdAt)}
                </div>
              </div>
            </div>
          </div>
          <Spacer left={20} />
          <div className="flex-grow-1 ml-auto mr-0">
            <LikeDislikePanel
              // key={JSON.stringify(article).length}
              article={fetchedArticle}
              onArticleModify={fetchArticle}
            />
          </div>
        </div>
        <Spacer top={20} />
        <ReactMarkdown
          source={article.content}
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

        <Spacer top={50} />
        <CommentBoard
          key={JSON.stringify(article).length}
          article={fetchedArticle}
          onArticleModify={fetchArticle}
        />
      </CenteredContainer>
      <Spacer top={50} />
    </>
  );
}
