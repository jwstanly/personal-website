import { BlogArticle } from '../lib/Types';
import { Card } from './Card';
import { LikeDislikePanel } from './LikeDislikePanel';
import Spacer from './Spacer';
import * as DateUtil from '../lib/Date';
import ArticleText from './ArticleText';
import profilePic from '../public/images/profilePicYellowstone.jpg';
import Image from 'next/image';
import Link from 'next/link';

interface BlogArticleProps {
  article: BlogArticle;
  fetchedArticle?: BlogArticle;
  onArticleModify?: () => any;
}

export default function Article(props: BlogArticleProps) {
  return (
    <>
      <Card
        header={props.article.title}
        subheader={props.article.subheader}
        tags={props.article.tags}
        content={[]}
      />
      <div className="sm:flex">
        <div className="sm:flex-shrink-2">
          <div className="inline-flex mb-5">
            {props.article.guestAuthors &&
              props.article.guestAuthors.map(a => (
                <>
                  <Image
                    key={a.name}
                    src={a.image}
                    alt={`Picture of ${a.name}, author of this blog article`}
                    className="rounded-full object-cover"
                    width="45"
                    height="45"
                  />
                  <Spacer left={8} />
                </>
              ))}
            <Image
              src={profilePic}
              alt="Picture of John Wright Stanly, author of this blog article"
              className="rounded-full object-cover"
              width="45"
              height="45"
            />
            <Spacer left={10} />
            <div className="flex-col">
              <div className="text-gray-500 text-sm font-bold">
                {props.article.guestAuthors && (
                  <>
                    {props.article.guestAuthors
                      .map(a => (
                        <Link key={a.name} href={a.link}>
                          <a className="text-gray-500 hover:text-gray-700 duration-700">
                            {a.name}
                          </a>
                        </Link>
                      ))
                      .reduce((prev, curr) => (
                        <>
                          {prev}
                          {', '}
                          {curr}
                        </>
                      ))}
                    {', '}
                  </>
                )}
                John Wright Stanly
              </div>
              <div className="text-gray-500 text-sm">
                {DateUtil.getFormattedDate(props.article.createdAt)}
              </div>
            </div>
          </div>
        </div>
        <Spacer left={20} />
        <div className="flex-grow-1 ml-auto mr-0">
          <LikeDislikePanel
            // key={JSON.stringify(props.article).length}
            article={props.fetchedArticle}
            onArticleModify={props.onArticleModify}
          />
        </div>
      </div>
      <Spacer top={20} />
      <ArticleText content={props.article.content} />
    </>
  );
}
