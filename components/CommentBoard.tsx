import React, { ObjectHTMLAttributes } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BlogArticle, BlogComment, BlogCommentReply, BlogUser } from '../lib/Types';
import styles from '../styles/comment.module.css';
import Button from './Button';
import CenteredContent from './CenteredContent';
import CommentBubble from './CommentBubble';
import TextArea from './TextArea';
import TextField from './TextField';
import { H2, H6 } from './Titles';
import API from '../lib/Api';


interface CommentBoardProps {
  article: BlogArticle;
  onArticleModify: ()=>void;
}

export default function CommentBoard(props: CommentBoardProps){

  enum Mode {
    COMMENT, 
    REPLY, 
    EDIT
  }

  const [mode, setMode] = React.useState<Mode>(Mode.COMMENT);
  const [comments, setComments] = React.useState<BlogComment[]>(props.article.comments);
  const [highlightedComment, setHighlightedComment] = React.useState<BlogComment | BlogCommentReply | undefined>();

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
      return "No comment added";
    } else if (comment.length > 2000) {
      return "Comments cannot be longer than 2000 characters";
    } else if (name && name.length > 100) {
      return "Names cannot be longer than 100 characters";
    } else if (email && !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      return "Please submit a valid email";
    }
    return "";
  }

  async function onCommentSubmit() {
    
    setLoading(true);

    const error = getCommentBoardErrors();
    if(error) {
      setLoading(false);
      setError(error);
      return;
    }

    let blogUser: BlogUser = { 
      id: localStorage.getItem("userId") 
    };
    if (name) blogUser.name = name;
    if (email) blogUser.email = email;

    // store email locally so users can edit their email securly without the database
    localStorage.setItem("userEmail", email);

    if(mode === Mode.COMMENT) {
      
      const blogComment: BlogComment = {
        user: blogUser,
        comment: comment,
      }

      try {
        await API.upsertComment(props.article.title, blogComment);
        clearCommentBoard();
      } catch {
        setError('The comments server experienced an error');
        setLoading(false);
      } 

    } else if (mode === Mode.REPLY) {

      const blogCommentReply: BlogCommentReply = {
        user: blogUser,
        replyToId: highlightedComment.id,
        rootCommentId: highlightedComment.replies
          ? highlightedComment.id
          : (highlightedComment as BlogCommentReply).rootCommentId,
        comment: comment,
      }

      try {
        await API.upsertCommentReply(props.article.title, blogCommentReply.rootCommentId, blogCommentReply);
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
      }

      console.log('highlightedComment', highlightedComment);
      console.log('blogCommentReply', blogCommentEdit);

      try {
        if (highlightedComment.replies) {
          await API.upsertComment(props.article.title, blogCommentEdit);
        } else {
          await API.upsertCommentReply(
            props.article.title,
            (blogCommentEdit as BlogCommentReply).rootCommentId,
            blogCommentEdit as BlogCommentReply
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
    if(mode === Mode.EDIT) {
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
    setEmail(localStorage.getItem("userEmail"));
  }

  async function onPressDelete(comment: BlogComment | BlogCommentReply) {
    setDeleteLoading(true);
    console.log("What", comment, !!comment.replies, !comment.rootCommentId);
    if(comment.replies && !comment.rootCommentId) {
      await API.deleteComment(props.article.title, comment.id)
    } else {
      await API.deleteCommentReply(props.article.title, (comment as BlogCommentReply).rootCommentId, comment.id)
    }

    setDeleteLoading(false);

    props.onArticleModify();
  }

  function onCancelAction() {
    if(mode === Mode.EDIT) {
      clearCommentBoard();
    }
    setMode(Mode.COMMENT);
    setHighlightedComment(undefined);
  }

  return (
    <CenteredContent>
      <H2 marginBottom={20}>
        Comments
      </H2>
      {comments && comments.length
        ? comments.map(comment => {
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
        }) : <H6 marginTop={25} marginLeft={40} italic>Be the first to add a comment!</H6>}
      <div style={{marginTop: 50}} />
      <H2 marginBottom={25}>
        {mode === Mode.COMMENT 
          ? "Add Comment"
          : mode === Mode.REPLY
            ? "Reply To:"
            : "Edit:"
        }
      </H2>
      {highlightedComment ? 
        <>
          <CommentBubble 
            commentObj={highlightedComment}
            shallowRender
          />
          <div style={{marginBottom: 30}} />
        </> : <></>}
      <div className={styles.commentError}>{error}</div>
      <Row>
        <Col xs={12}>
          <TextArea 
            value={comment} 
            setValue={setComment}
            label="Comment"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={5}>
          <TextField 
            value={name}
            setValue={setName}
            label="Name" 
            type="text"
          />
        </Col>
        <Col xs={12} md={7}>
          <TextField 
            value={email}
            setValue={setEmail}
            label="Email"
            type="email"
          />
        </Col>
      </Row>
      <div style={{marginTop: 10}}/>
      <Row>
        <Col>
          <div style={{float: "left"}}>
            <Button
              text={mode === Mode.COMMENT ? "Post" : mode === Mode.REPLY ? "Reply" : "Edit"}
              onPress={onCommentSubmit}
              loading={loading}
            />
          </div>
          {highlightedComment ? 
            <div style={{marginLeft: 10, float: "left"}}>
              <Button
                text="Cancel"
                onPress={onCancelAction}
              />
            </div>
             : <></>}
        </Col>
      </Row>
    </CenteredContent>
  );
}