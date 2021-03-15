import React, { ObjectHTMLAttributes } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BlogComment } from '../lib/Types';
import styles from '../styles/comment.module.css';
import Button from './Button';
import CenteredContent from './CenteredContent';
import CommentBubble from './CommentBubble';
import TextArea from './TextArea';
import TextField from './TextField';
import { H2 } from './Titles';


interface CommentBoardProps {
  comments: BlogComment[];
}

export default function CommentBoard(props: CommentBoardProps){

  const [comments, setComments] = React.useState<BlogComment[]>(props.comments);
  const [replyingTo, setReplyingTo] = React.useState<BlogComment | undefined>();

  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');

  function onSubmit() {
    console.log("Comment submitted");
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
      <Row>
        <Col xs={12}>
          <TextArea 
            value={comment} 
            setValue={setComment}
            label="Comment *"
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
            />
          </div>
          {replyingTo ? 
            <div style={{marginLeft: 10, float: "left"}}>
              <Button
                text="Cancel"
                onPress={onCancelReply}
              />
            </div>
             : <></>}
        </Col>
      </Row>
    </CenteredContent>
  );
}