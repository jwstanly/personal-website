import React from 'react'
import Head from 'next/head'

import styles from '../../styles/Card.module.css';

import HomeHeader from '../../components/HomeHeader'
import Navbar from '../../components/Navbar'

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, Text } from '../../components/Titles';
import { ExperienceCard } from '../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../components/Card';
import { BlogArticle } from '../../lib/Types';
import API from '../../lib/Api';

export async function getStaticProps(context) {
  
  const articles: BlogArticle[] = await API.getAllArticles();
  
  return { 
    props: {
      articles: articles
    } 
  }
}

export default function Blog({articles}: {articles: BlogArticle[]}) {

  return (
    <>
      <Head>
        <title>John Wright Stanly</title>
        <meta property="og:title" content="John Wright Stanly's Personal Website" />
        <meta property="og:description" content="Home of John Wright Stanly's website and blog" />
        <meta property="og:image" content="/images/profileClipped.png" />
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
      <H1>Recent Articles</H1>

      {articles && articles.map((article: BlogArticle) => {
        return (
          <Container key={article.id}>
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={9} xl={8}>
                <Link href={`/blog/article/${article.id}`} passHref>
                  <div className={styles.blogCard}>
                    <Card
                      header={article.title}
                      subheader={article.subheader}
                      codeTags={article.tags}
                      content={article.content}
                    />
                  </div>
                </Link>
                <div style={{marginTop: 50}}/>
              </Col>
            </Row>
          </Container>
        );
      })}
    </>
  );
}