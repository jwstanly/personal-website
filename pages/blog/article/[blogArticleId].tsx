import React from 'react';
import { BlogArticle } from '../../../lib/Types';
import API from '../../../lib/Api';
import CommentBoard from '../../../components/CommentBoard';
import CenteredContainer from '../../../components/CenteredContainer';
import Spacer from '../../../components/Spacer';
import HeadTags from '../../../components/HeadTags';
import getBlogArticlePaths from '../../../lib/getBlogArticlePaths';
import Article from '../../../components/Article';

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

export default function Blog(props: {
  article: BlogArticle;
  noCommentBoard?: boolean;
}) {
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
        <Article article={article} onArticleModify={fetchArticle} />
        <Spacer top={50} />
        <CommentBoard
          key={JSON.stringify(props.article).length}
          article={fetchedArticle || article}
          onArticleModify={fetchArticle}
        />
      </CenteredContainer>
      <Spacer top={50} />
    </>
  );
}
