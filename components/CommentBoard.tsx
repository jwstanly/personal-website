import React, { ObjectHTMLAttributes } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BlogArticle, BlogComment, BlogUser } from '../lib/Types';
import styles from '../styles/comment.module.css';
import Button from './Button';
import CenteredContent from './CenteredContent';
import CommentBubble from './CommentBubble';
import TextArea from './TextArea';
import TextField from './TextField';
import { H2 } from './Titles';
import API from '../lib/Api';


interface CommentBoardProps {
  article: BlogArticle;
  onArticleModify: ()=>void;
}

export default function CommentBoard(props: CommentBoardProps){

  const [comments, setComments] = React.useState<BlogComment[]>(props.article.comments);
  const [replyingTo, setReplyingTo] = React.useState<BlogComment | undefined>();

  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');

  async function onSubmit() {
    setLoading(true);
    if (!comment) {
      setError("No comment added");
      setLoading(false);
      return;
    } else if (comment.length > 2000) {
      setError("Comments cannot be longer than 2000 characters");
      setLoading(false);
      return;
    }else if (name && name.length > 100) {
      setError("Names cannot be longer than 100 characters");
      setLoading(false);
      return;
    } else if (email && !email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setError("Please submit a valid email");
      setLoading(false);
      return;
    }

    let blogUser: BlogUser = { id: "1234567890" };
    if(name) blogUser = {...blogUser, name: name};
    if(email) blogUser = {...blogUser, email: email};

    const blogComment: BlogComment = {
      user: blogUser,
      comment: comment,
    }

    try {
      await API.upsertComment(props.article.title, blogComment);
    } catch {
      setError('The comments server experienced an error');
      setLoading(false);
    }

    props.onArticleModify();
    
    setComment('');
    setName('');
    setEmail('');
    setError('');
    setLoading(false);
  }

  function onReply() {
    
  }

  function onCancelReply() {
    setReplyingTo(undefined);
  }

  return (
    <CenteredContent>
      <H2>Comments</H2>
      <div style={{marginTop: 20}}/>
      {comments
        ? comments.map(comment => {
          return (
            <CommentBubble 
              commentObj={comment}
              onPressReply={setReplyingTo}
            />
          );
        }) : <></>}
      <div style={{marginTop: 50}} />
      <H2>{replyingTo ? "Reply To:" : "Add Comment"}</H2>
      <div style={{marginTop: 20}}/>
      {replyingTo ? 
        <>
          <CommentBubble 
            commentObj={replyingTo}
          />
          <div style={{marginBottom: 30}} />
        </> : <></>}
      <div className={styles.commentError}>{error}</div>
      <Row>
        <Col xs={12}>
          <TextArea 
            value={comment} 
            setValue={setComment}
            label="Comment*"
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
              text="Post"
              onPress={onSubmit}
              loading={loading}
            />
          </div>
          {replyingTo ? 
            <div style={{marginLeft: 10, float: "left"}}>
              <Button
                text="Cancel"
                onPress={onCancelReply}
                loading={loading}
              />
            </div>
             : <></>}
        </Col>
      </Row>
    </CenteredContent>
  );
}