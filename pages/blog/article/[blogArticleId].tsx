import React from 'react'
import Head from 'next/head'

import styles from '../../../styles/Home.module.css';

import HomeHeader from '../../../components/HomeHeader'
import Navbar from '../../../components/Navbar'

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, H6, Text } from '../../../components/Titles';
import { ExperienceCard } from '../../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../../components/Card';
import { BlogMarkdown } from '../../../components/BlogMarkdown';
import { BlogArticle } from '../../../lib/Types';
import Util from '../../../lib/Util';
import API from '../../../lib/Api';

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

export default function Blog({article}: {article: BlogArticle}) {

  console.log("SSG PROPS", article);

  return (
    <>
      <Head>
        <title>John Wright Stanly</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.subheader}  />
        <meta property="og:image" content={article.image} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar 
        color="#FFF"
        options={[
          {label: "Contact", href: "/#contact"},
          {label: "Blog", href: "/blog"},
          {label: "Home", href: "/#home"},
        ]}
      />

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
      </Container>
    </>
  );
}