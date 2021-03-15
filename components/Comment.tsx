import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/comment.module.css';

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, Text } from './Titles';
import { BlogComment } from '../lib/Types';
import Util from '../lib/Util';
import DateUtil from '../lib/Date';

interface CommentProps {
  comment: BlogComment
}

export default function Comment({comment}: CommentProps){

  return (
    <div>
      <div style={{display: 'flex', alignContent: 'space-between', justifyContent: 'space-between', marginLeft: 5, marginRight: 5}}>
        <div className={styles.commentName}>
          {comment.user.name || "Anonymous User"}
        </div>
        <div className={styles.commentDate}>
          {DateUtil.getFormattedDate(comment.lastModifiedAt)}
        </div>
      </div>
      <div className={styles.commentBubble}>
        <div className={styles.commentContent}>
          {comment.comment}
        </div>
      </div>
    </div>
   
  );
}