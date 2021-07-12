import React from 'react';
import { BlogArticle, BlogVote, BlogVoteSubmit } from '../lib/Types';
import styles from '../styles/Home.module.css';
import Spacer from './Spacer';
import API from '../lib/Api';
import { VoteType } from '../lib/enums';

interface LikeDislikePanelProps {
  article: BlogArticle;
  onArticleModify: () => void;
}

export function LikeDislikePanel(props: LikeDislikePanelProps) {
  const [likes, setLikes] = React.useState<number>();
  const [dislikes, setDislikes] = React.useState<number>();

  const [userCurrentVote, setUserCurrentVote] = React.useState<
    VoteType | undefined
  >();

  const [loading, setLoading] = React.useState<boolean>(true);

  function setVotes() {
    let tempLikes = 0;
    let tempDislikes = 0;
    props.article &&
      props.article.votes &&
      props.article.votes.map(vote => {
        if (vote.vote === VoteType.LIKE) tempLikes++;
        if (vote.vote === VoteType.DISLIKE) tempDislikes++;
      });
    setLikes(tempLikes);
    setDislikes(tempDislikes);
  }

  function assignUsersVote() {
    const userId = localStorage.getItem('userId');
    props.article &&
      props.article.votes &&
      props.article.votes.map(vote => {
        if (vote.userId === userId) {
          setUserCurrentVote(vote.vote);
        }
      });
  }

  async function onVote(newVote: VoteType) {
    const userId = localStorage.getItem('userId');
    let newUserVote: VoteType;

    // console.log("newVote:", newVote, "userCurrentVote:", userCurrentVote)

    if (
      newVote === VoteType.LIKE &&
      (!userCurrentVote || userCurrentVote === VoteType.NEUTRAL)
    ) {
      setLikes(likes + 1);
      newUserVote = VoteType.LIKE;
    } else if (
      newVote === VoteType.DISLIKE &&
      (!userCurrentVote || userCurrentVote === VoteType.NEUTRAL)
    ) {
      setDislikes(dislikes + 1);
      newUserVote = VoteType.DISLIKE;
    } else if (
      newVote === VoteType.DISLIKE &&
      userCurrentVote === VoteType.LIKE
    ) {
      setLikes(likes - 1);
      setDislikes(dislikes + 1);
      newUserVote = VoteType.DISLIKE;
    } else if (
      newVote === VoteType.LIKE &&
      userCurrentVote === VoteType.DISLIKE
    ) {
      setLikes(likes + 1);
      setDislikes(dislikes - 1);
      newUserVote = VoteType.LIKE;
    } else if (
      newVote === VoteType.DISLIKE &&
      userCurrentVote === VoteType.DISLIKE
    ) {
      setDislikes(dislikes - 1);
      newUserVote = VoteType.NEUTRAL;
    } else if (newVote === VoteType.LIKE && userCurrentVote === VoteType.LIKE) {
      setLikes(likes - 1);
      newUserVote = VoteType.NEUTRAL;
    }

    setUserCurrentVote(newUserVote);

    const voteObj: BlogVoteSubmit = {
      userId: userId,
      vote: newUserVote,
    };
    await API.upsertVote(props.article.title, voteObj);
  }

  React.useEffect(() => {
    setLoading(!props.article);
    setVotes();
    assignUsersVote();
  }, [props.article]);

  return (
    <div style={{ display: 'flex', justifyContent: 'stretch' }}>
      <p
        className={styles.likeText}
        style={userCurrentVote === VoteType.LIKE ? { color: '#222' } : {}}
      >
        {loading ? '-' : likes}
      </p>
      <svg
        viewBox="-60 -30 350 300"
        onClick={() => onVote(VoteType.LIKE)}
        className={styles.likeButton}
        style={userCurrentVote === VoteType.LIKE ? { fill: '#222' } : {}}
      >
        <path d="M7.67,93.896h52.077V215.34H7.67V93.896z M207.67,106.682c-7.189-7.189-14.382-14.379-21.572-21.57h-41.451l9.877-25.102  l2.801-7.119l-0.258-2.049L151,2.33L121.115,0L110.15,37.822L80.954,85.176V215.34h107.89L207.67,106.682z" />
      </svg>
      <Spacer left={10} />
      <p
        className={styles.likeText}
        style={userCurrentVote === VoteType.DISLIKE ? { color: '#222' } : {}}
      >
        {loading ? '-' : dislikes}
      </p>
      <svg
        viewBox="-60 -30 350 300"
        onClick={() => onVote(VoteType.DISLIKE)}
        className={styles.likeButton}
        style={
          userCurrentVote === VoteType.DISLIKE
            ? { fill: '#222', transform: 'rotate(180deg)' }
            : { transform: 'rotate(180deg)' }
        }
      >
        <path d="M7.67,93.896h52.077V215.34H7.67V93.896z M207.67,106.682c-7.189-7.189-14.382-14.379-21.572-21.57h-41.451l9.877-25.102  l2.801-7.119l-0.258-2.049L151,2.33L121.115,0L110.15,37.822L80.954,85.176V215.34h107.89L207.67,106.682z" />
      </svg>
    </div>
  );
}
