import React from 'react';
import {
  BlogArticle,
  BlogComment,
  BlogCommentReply,
  BlogCommentReplySubmit,
  BlogCommentSubmit,
  BlogUser,
} from '../lib/Types';
import styles from '../styles/comment.module.css';
import Button from './Button';
import CommentBubble from './CommentBubble';
import TextField from './TextField';
import { H2, H6 } from './Titles';
import API from '../lib/Api';
import Spacer from './Spacer';
import isValidEmail from '../lib/isValidEmail';

interface CommentBoardProps {
  article: BlogArticle;
  onArticleModify: () => void;
}

export default function CommentBoard(props: CommentBoardProps) {
  enum Mode {
    COMMENT,
    REPLY,
    EDIT,
  }

  const [mode, setMode] = React.useState<Mode>(Mode.COMMENT);
  const [comments, setComments] = React.useState<BlogComment[] | undefined>();
  const [highlightedComment, setHighlightedComment] = React.useState<
    BlogComment | BlogCommentReply | undefined
  >();

  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');

  function clearCommentBoard(): void {
    setMode(Mode.COMMENT);
    setHighlightedComment(undefined);
    setComment('');
    setName('');
    setEmail('');
    setError('');
    setLoading(false);
  }

  function getCommentBoardErrors(): string {
    if (!comment) {
      return 'No comment added';
    } else if (comment.length > 2000) {
      return 'Comments cannot be longer than 2000 characters';
    } else if (name && name.length > 100) {
      return 'Names cannot be longer than 100 characters';
    } else if (email && !isValidEmail(email)) {
      return 'Please submit a valid email';
    }
    return '';
  }

  async function onCommentSubmit() {
    setLoading(true);

    const error = getCommentBoardErrors();
    if (error) {
      setLoading(false);
      setError(error);
      return;
    }

    let blogUser: BlogUser = {
      id: localStorage.getItem('userId'),
    };
    if (name) blogUser.name = name;
    if (email) blogUser.email = email;

    // store email locally so users can edit their email securly without the database
    localStorage.setItem('userEmail', email);

    if (mode === Mode.COMMENT) {
      const blogComment: BlogCommentSubmit = {
        user: blogUser,
        comment: comment,
      };

      try {
        await API.upsertComment(props.article.title, blogComment);
        clearCommentBoard();
      } catch {
        setError('The comments server experienced an error');
        setLoading(false);
      }
    } else if (mode === Mode.REPLY) {
      const blogCommentReply: BlogCommentReplySubmit = {
        user: blogUser,
        replyToId: highlightedComment.id,
        rootCommentId: highlightedComment.replies
          ? highlightedComment.id
          : (highlightedComment as BlogCommentReply).rootCommentId,
        comment: comment,
      };

      try {
        await API.upsertCommentReply(
          props.article.title,
          blogCommentReply.rootCommentId,
          blogCommentReply,
        );
        clearCommentBoard();
      } catch {
        setError('The comments server experienced an error');
        setLoading(false);
      }
    } else if (mode === Mode.EDIT) {
      const blogCommentEdit: BlogComment | BlogCommentReply = {
        ...highlightedComment,
        user: blogUser,
        comment: comment,
      };

      console.log('highlightedComment', highlightedComment);
      console.log('blogCommentReply', blogCommentEdit);

      try {
        if (highlightedComment.replies) {
          await API.upsertComment(props.article.title, blogCommentEdit);
        } else {
          await API.upsertCommentReply(
            props.article.title,
            (blogCommentEdit as BlogCommentReply).rootCommentId,
            blogCommentEdit as BlogCommentReply,
          );
        }
        clearCommentBoard();
      } catch {
        setError('The comments server experienced an error');
        setLoading(false);
      }
    }

    props.onArticleModify();
  }

  function onPressReply(comment: BlogComment | BlogCommentReply) {
    if (mode === Mode.EDIT) {
      clearCommentBoard();
    }
    setMode(Mode.REPLY);
    setHighlightedComment(comment);
  }

  function onPressEdit(comment: BlogComment | BlogCommentReply) {
    setMode(Mode.EDIT);
    setHighlightedComment(comment);

    setComment(comment.comment);
    setName(comment.user.name);
    setEmail(localStorage.getItem('userEmail'));
  }

  async function onPressDelete(comment: BlogComment | BlogCommentReply) {
    setDeleteLoading(true);
    if (comment.replies && !(comment as BlogCommentReply).rootCommentId) {
      await API.deleteComment(props.article.title, comment.id);
    } else {
      await API.deleteCommentReply(
        props.article.title,
        (comment as BlogCommentReply).rootCommentId,
        comment.id,
      );
    }

    setDeleteLoading(false);

    props.onArticleModify();
  }

  function onCancelAction() {
    if (mode === Mode.EDIT) {
      clearCommentBoard();
    }
    setMode(Mode.COMMENT);
    setHighlightedComment(undefined);
  }

  React.useEffect(() => {
    setComments(
      props.article && props.article.comments ? props.article.comments : [],
    );
  }, [props.article]);

  return (
    <>
      <H2 marginBottom={20}>Comments</H2>
      {comments && comments.length ? (
        comments.map(comment => {
          return (
            <CommentBubble
              key={JSON.stringify(comment).length}
              commentObj={comment}
              onPressReply={onPressReply}
              onPressEdit={onPressEdit}
              onPressDelete={onPressDelete}
              deleteLoading={deleteLoading}
            />
          );
        })
      ) : (
        <H6 marginTop={25} marginLeft={40} italic>
          Be the first to add a comment!
        </H6>
      )}
      <div style={{ marginTop: 50 }} />
      <H2 marginBottom={25}>
        {mode === Mode.COMMENT
          ? 'Add Comment'
          : mode === Mode.REPLY
          ? 'Reply To:'
          : 'Edit:'}
      </H2>
      {highlightedComment ? (
        <>
          <CommentBubble commentObj={highlightedComment} shallowRender />
          <div style={{ marginBottom: 30 }} />
        </>
      ) : (
        <></>
      )}
      <div className={styles.commentError}>{error}</div>
      <div className="flex">
        <div className="flex-1">
          <TextField
            value={comment}
            setValue={setComment}
            label="Comment"
            lines={3}
            required
          />
        </div>
      </div>
      <div className="sm:flex justify-between">
        <div className="sm:flex-2">
          <TextField value={name} setValue={setName} label="Name" type="text" />
        </div>
        <Spacer left={20} />
        <div className="flex-1">
          <TextField
            value={email}
            setValue={setEmail}
            label="Email"
            type="email"
          />
        </div>
      </div>
      <div style={{ marginTop: 10 }} />
      <div>
        <div>
          <div style={{ float: 'left' }}>
            <Button
              text={
                mode === Mode.COMMENT
                  ? 'Post'
                  : mode === Mode.REPLY
                  ? 'Reply'
                  : 'Edit'
              }
              onPress={onCommentSubmit}
              loading={loading}
            />
          </div>
          {highlightedComment ? (
            <div style={{ marginLeft: 10, float: 'left' }}>
              <Button text="Cancel" onPress={onCancelAction} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
