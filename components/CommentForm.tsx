import React from "react";
import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, H4, H5, H6, Text } from './Titles';
import TextArea from "./TextArea";
import TextField from "./TextField";
import Button from "./Button";

interface CommentFormProps {
  title: string;
  buttonText: string;
};

export default function CommentForm(props: CommentFormProps) {

  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [comment, setComment] = React.useState<string>('');

  function submitComment() {
    console.log("Comment submitted");
  }

  return (
    <>
      <H2>{props.title}</H2>
      <div style={{marginTop: 20}}/>
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
          <Button
            text={props.buttonText}
            onPress={submitComment}
          />
        </Col>
      </Row>
    </>
  );
}
