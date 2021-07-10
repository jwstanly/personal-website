import React from 'react';
import Head from 'next/head';

import styles from '../../styles/Card.module.css';

import HomeHeader from '../../components/HomeHeader';

import { Code, H1, H2, H3, Text } from '../../components/Titles';
import { ExperienceCard } from '../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../components/Card';
import { BlogArticle } from '../../lib/Types';
import API from '../../lib/Api';
import Util from '../../lib/Util';
import Spacer from '../../components/Spacer';
import CenteredContainer from '../../components/CenteredContainer';
import HeadTags from '../../components/HeadTags';

export async function getStaticProps(context) {
  const articles: BlogArticle[] = await API.getAllArticles();

  return {
    props: {
      articles: articles,
    },
  };
}

export default function Blog({ articles }: { articles: BlogArticle[] }) {
  return (
    <>
      <HeadTags
        title="Blog - John Wright Stanly"
        description="A collection of tips and stories about software engineering I wish I knew about earlier. I hope this blog inspires your next project or helps squash that bug."
      />

      <div style={{ marginTop: 40 }} />
      <H1 centered marginBottom={40}>
        Recent Articles
      </H1>

      {articles &&
        articles
          .map((article: BlogArticle) => {
            return (
              <div key={article.id}>
                <CenteredContainer>
                  <Link
                    href={`/blog/article/${Util.serializeTitle(article.title)}`}
                    passHref
                  >
                    <div className={styles.blogCard}>
                      <img
                        src={article.image}
                        style={{
                          objectFit: 'cover',
                        }}
                        alt={article.title}
                      />
                      <Card
                        header={article.title}
                        subheader={article.subheader}
                        tags={article.tags}
                        content={Util.formatPureText(
                          article.content.length > 400
                            ? article.content.substring(0, 400) + '...'
                            : article.content,
                        )}
                      />
                    </div>
                  </Link>
                </CenteredContainer>
              </div>
            );
          })
          .reduce((prev, curr) => {
            return (
              <>
                {prev}
                <Spacer top={50} />
                {curr}
              </>
            );
          })}
      <Spacer top={50} />
    </>
  );
}
