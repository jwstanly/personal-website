import { BlogArticle } from '../lib/Types';
import { Card } from './Card';
import { LikeDislikePanel } from './LikeDislikePanel';
import Spacer from './Spacer';
import * as DateUtil from '../lib/Date';
import ArticleText from './ArticleText';

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
            <img
              style={{
                width: 45,
                height: 45,
                left: 0,
                top: 0,
                borderRadius: 999,
              }}
              src="/images/profilePicYellowstone.jpg"
              alt="John Wright Stanly"
            />
            <Spacer left={10} />
            <div className="flex-col">
              <div className="text-gray-500 text-sm font-bold">
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
            article={props.fetchedArticle || props.article}
            onArticleModify={props.onArticleModify}
          />
        </div>
      </div>
      <Spacer top={20} />
      <ArticleText content={props.article.content} />
    </>
  );
}
