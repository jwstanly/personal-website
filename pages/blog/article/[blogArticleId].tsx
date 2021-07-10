import React from 'react';
import Head from 'next/head';

import styles from '../../../styles/Home.module.css';

import HomeHeader from '../../../components/HomeHeader';

import { Code, H1, H2, H3, H4, H5, H6, Text } from '../../../components/Titles';
import { ExperienceCard } from '../../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../../components/Card';
import { BlogMarkdown } from '../../../components/BlogMarkdown';
import { BlogArticle, BlogVote } from '../../../lib/Types';
import Util from '../../../lib/Util';
import API from '../../../lib/Api';
import CommentBoard from '../../../components/CommentBoard';
import ReactMarkdown from 'react-markdown';
import { LikeDislikePanel } from '../../../components/LikeDislikePanel';
import CenteredContainer from '../../../components/CenteredContainer';
import Spacer from '../../../components/Spacer';
import HeadTags from '../../../components/HeadTags';

export async function getStaticPaths() {
  const paths = await Util.getBlogArticlePaths();

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
        <LikeDislikePanel
          key={JSON.stringify(article).length}
          article={fetchedArticle}
          onArticleModify={fetchArticle}
        />
        <Spacer top={10} />
        <ReactMarkdown>{article.content}</ReactMarkdown>
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
