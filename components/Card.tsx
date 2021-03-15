import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/Home.module.css';

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, Text } from './Titles';

interface TitleProps {
  header: string;
  subheader: string;
  codeTags?: string[];
  content: string | string[];
}

export function Card(props: TitleProps){

  return (
    <div>
      <H2>{props.header}</H2>
      <H3>{props.subheader}</H3>
      <div style={{padding:10}}/>
      {props.codeTags
        ? <div style={{display: 'inline-block'}}>
            {props.codeTags.map(tag => {return <Code key={tag}>{tag}</Code>;})}
          </div> 
        : <></>}
       <div style={{padding:2}}/>
      {Array.isArray(props.content)
        ? props.content.map(content => {return <Text key={content} style={{marginBottom: 15}}>{content}</Text>;})
        : <Text style={{marginBottom: 15}}>{props.content}</Text>}
    </div>
  );
}