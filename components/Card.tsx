import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/Home.module.css';

import { Code, H1, H2, H3, H6, Tag, Text } from './Titles';
import Spacer from './Spacer';
import { LikeDislikePanel } from './LikeDislikePanel';

interface CardProps {
  header: string;
  subheader: string;
  tags?: string[];
  codeTags?: string[];
  content: string | string[];
}

export function Card(props: CardProps) {
  return (
    <div>
      <H2>{props.header}</H2>
      <H6 marginTop={3} marginBottom={10}>
        {props.subheader}
      </H6>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            flex: 10,
            display: 'inline-block',
            marginBottom: 5,
            marginTop: 10,
          }}
        >
          {props.tags ? (
            props.tags.map(tag => {
              return <Tag key={tag}>{tag}</Tag>;
            })
          ) : (
            <></>
          )}
          {props.codeTags ? (
            props.codeTags.map(tag => {
              return <Code key={tag}>{tag}</Code>;
            })
          ) : (
            <></>
          )}
        </div>
      </div>

      <Spacer bottom={5} />
      {Array.isArray(props.content) ? (
        props.content.map(content => {
          return (
            <Text key={content} marginBottom={15}>
              {content}
            </Text>
          );
        })
      ) : (
        <Text marginBottom={15}>{props.content}</Text>
      )}
    </div>
  );
}
