import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/Home.module.css';

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, H6, Tag, Text } from './Titles';

interface TitleProps {
  header: string;
  subheader: string;
  tags?: string[];
  codeTags?: string[];
  content: string | string[];
}

export function Card(props: TitleProps){

  return (
    <div>
      <H2>{props.header}</H2>
      <H6 marginTop={3} marginBottom={10}>{props.subheader}</H6>
      {props.tags
        ? <div style={{display: 'inline-block', marginBottom: 10, marginTop: 10}}>
            {["These", "Are", "tags", "Next.js", "React", 'CloudFormation'].map(tag => {return <Tag key={tag}>{tag}</Tag>;})}
          </div>
        : <></>}
      {props.codeTags
        ? <div style={{display: 'inline-block', marginBottom: 10, marginTop: 10}}>
            {props.codeTags.map(tag => {return <Code key={tag}>{tag}</Code>;})}
          </div>
        : <></>}
      <div style={{marginBottom: 5}}/>
      {Array.isArray(props.content)
        ? props.content.map(content => {return <Text key={content} marginBottom={15}>{content}</Text>;})
        : <Text marginBottom={15}>{props.content}</Text>}
    </div>
  );
}