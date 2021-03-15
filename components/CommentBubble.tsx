import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/comment.module.css';

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, Text } from './Titles';
import { BlogComment } from '../lib/Types';
import Util from '../lib/Util';
import DateUtil from '../lib/Date';
import { propTypes } from 'react-bootstrap/esm/Image';

interface CommentProps {
  commentObj: BlogComment
  onPressReply?: (comment:BlogComment)=>void;
}

export default function CommentBubble({commentObj, onPressReply}: CommentProps){

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', margin: "0px 5px 5px 5px"}}>
        <div className={styles.commentName}>
          {commentObj.user.name || "Anonymous User"}
        </div>
        <div className={styles.commentDate}>
          {DateUtil.getFormattedDate(commentObj.lastModifiedAt)}
        </div>
      </div>

      <div className={styles.commentBubble}>
        <div className={styles.commentContent}>
          {commentObj.comment}
        </div>
      </div>

      {onPressReply ? (
        <div onClick={() => onPressReply(commentObj)} className={styles.commentReplyButton}>
          <div style={{display:'table-row', alignItems: 'center'}}>
            <div style={{display:'table-cell'}}>
              <svg width="16" height="24" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 11.015L14.0261 0.0567513V6.59467H11.9055C5.3302 6.59467 0 11.9353 0 18.5235V21.9882L0.941895 20.954C4.14423 17.4385 8.67535 15.4354 13.4258 15.4354H14.0261V21.9733L24 11.015Z" fill="#444"/>
              </svg>
            </div>
            <div style={{display:'table-cell', paddingLeft: 5}}>
              Reply
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
   
  );
}