import React from 'react'
import Head from 'next/head'

import styles from '../../styles/Card.module.css';

import HomeHeader from '../../components/HomeHeader'

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, Text } from '../../components/Titles';
import { ExperienceCard } from '../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../components/Card';
import { BlogArticle } from '../../lib/Types';
import API from '../../lib/Api';
import Util from '../../lib/Util';

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
        <title>Blog - John Wright Stanly</title>
        <meta 
          name="description"
          content="A collection of tips and stories about software engineering I wish I knew about earlier. I hope this blog inspires your next project or helps squash your bug!"
        />
        <meta property="og:title" content="John Wright Stanly's Personal Website" />
        <meta property="og:description" content="Home of John Wright Stanly's website and blog" />
        <meta property="og:image" content="/images/profileClipped.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{marginTop: 40}}/>
      <H1 centered marginBottom={40}>Recent Articles</H1>

      {articles && articles.map((article: BlogArticle) => {
        return (
          <Container key={article.id}>
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={9} xl={8}>
                <Link href={`/blog/article/${Util.serializeTitle(article.title)}`} passHref>
                  <div className={styles.blogCard}>
                    <img src={article.image} />
                    <Card
                      header={article.title}
                      subheader={article.subheader}
                      tags={article.tags}
                      content={
                        Util.formatPureText(
                          article.content.length > 400
                            ? article.content.substring(0,400) + "..."
                            : article.content
                        )
                      }
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