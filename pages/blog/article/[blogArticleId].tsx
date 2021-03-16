import React from 'react'
import Head from 'next/head'

import styles from '../../../styles/Home.module.css';

import HomeHeader from '../../../components/HomeHeader'

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, H4, H5, H6, Text } from '../../../components/Titles';
import { ExperienceCard } from '../../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../../components/Card';
import { BlogMarkdown } from '../../../components/BlogMarkdown';
import { BlogArticle } from '../../../lib/Types';
import Util from '../../../lib/Util';
import API from '../../../lib/Api';
import CommentBoard from '../../../components/CommentBoard';

export async function getStaticPaths() {

  const paths = await Util.getBlogArticlePaths();

  return {
    paths: paths,
    fallback: false
  };
}

export async function getStaticProps(context) {
  
  const article: BlogArticle = await API.getArticleByTitle(context.params.blogArticleId);
  
  return { 
    props: {
      article: article
    } 
  }
}

export default function Blog(props: {article: BlogArticle}) {

  const [article, setArticle] = React.useState<BlogArticle>(props.article);

  function onArticleModify() {
    API.getArticleByTitle(article.title).then( article => {
      setArticle(article);
    });
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.subheader}  />
        {article.image ? <meta property="og:image" content={article.image} /> : <></>}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{marginTop: 40}}/>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={9} xl={8}>
            <Card
              header={article.title}
              subheader={article.subheader}
              codeTags={article.tags}
              content={[]}
            />
          </Col>
        </Row>
        <div style={{marginTop: 50}} />
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={9} xl={8}>
            <BlogMarkdown>  
              {article.content}
            </BlogMarkdown>
          </Col>
        </Row>
        <div style={{marginTop: 50}} />
        <CommentBoard
          key={JSON.stringify(article).length}
          article={article}
          onArticleModify={onArticleModify}
        />
        <div style={{marginTop: 50}} />
      </Container>
    </>
  );
}