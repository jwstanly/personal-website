import React from 'react';
import styles from '../../styles/Card.module.css';
import Link from 'next/link';
import { Card } from '../../components/Card';
import { BlogArticle } from '../../lib/Types';
import API from '../../lib/Api';
import Spacer from '../../components/Spacer';
import CenteredContainer from '../../components/CenteredContainer';
import HeadTags from '../../components/HeadTags';
import serializeTitle from '../../lib/serializeTitle';
import formatPureText from '../../lib/formatPureText';

export async function getStaticProps(context) {
  const articles: BlogArticle[] = await API.getAllArticles();

  articles.sort((a, b) => b.createdAt - a.createdAt);

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

      <Spacer top={100} />

      {articles &&
        articles
          .map((article: BlogArticle) => {
            return (
              <div key={article.id}>
                <CenteredContainer>
                  <Link
                    href={`/blog/article/${serializeTitle(article.title)}`}
                    passHref
                  >
                    <div className={styles.blogCard}>
                      <img
                        src={article.image}
                        style={{
                          width: '100%',
                          aspectRatio: '16 / 9',
                          objectFit: 'cover',
                        }}
                        alt={article.title}
                      />
                      <Spacer top={20} />
                      <Card
                        header={article.title}
                        subheader={article.subheader}
                        tags={article.tags}
                        content={formatPureText(
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
