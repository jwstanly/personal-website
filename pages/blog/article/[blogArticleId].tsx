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
import ReactMarkdown from 'react-markdown';

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

  function fetchArticle() {
    API.getArticleByTitle(article.title).then(setArticle);
  }

  React.useEffect(fetchArticle, []);

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta 
          name="description"
          content={
            article.subheader 
            + ". " 
            + article.content.substring(0, 160 - (article.subheader.length + 5)) 
            + "..."
          }
        />
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
              tags={article.tags}
              content={[]}
              likes={0}
              dislikes={0}
              onLike={()=>{}}
              onDislike={()=>{}}
            />
          </Col>
        </Row>
        <div style={{marginTop: 10}} />
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={9} xl={8}>
            <ReactMarkdown>
              {article.content}
            </ReactMarkdown>
          </Col>
        </Row>
        <div style={{marginTop: 50}} />
        <CommentBoard
          key={JSON.stringify(article).length}
          article={article}
          onArticleModify={fetchArticle}
        />
        <div style={{marginTop: 50}} />
      </Container>
    </>
  );
}