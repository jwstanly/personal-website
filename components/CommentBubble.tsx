import React from 'react';
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
  onPressEdit?: (comment:BlogComment)=>void;
  onPressDelete?: (comment:BlogComment)=>void;
  shallowRender?: boolean;
}

export default function CommentBubble({commentObj, onPressReply, onPressEdit, onPressDelete, shallowRender}: CommentProps){

  const [showOptions, setShowOptions] = React.useState<boolean>(false);
  React.useEffect(() => {
    setShowOptions(commentObj.user.id === localStorage.getItem("userId"));
  }, []);

  return (
    <>
      <div style={{marginBottom: 25}}>
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
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{alignSelf: 'flex-start'}}>
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
            </div>
            {showOptions ? (
              <div style={{alignSelf: 'flex-end', display: 'flex'}}>
                <div className={styles.commentOption} onClick={() => onPressEdit(commentObj)}>
                  Edit
                </div>
                <div style={{marginLeft: 10}} />
                <div className={styles.commentOption} style={{marginLeft: 5}} onClick={() => onPressDelete(commentObj)}>
                  Delete
                </div>
              </div>
            ) : <></>}
          </div>
        ) : (
          <></>
        )}
      </div>
      {!shallowRender && commentObj.replies ? commentObj.replies.map(reply => {
        return (
          <div style={{width: '85%', marginLeft: 'auto', marginRight: 0}}>
            <CommentBubble
              commentObj={reply}
              onPressReply={onPressReply}
              onPressEdit={onPressEdit}
              onPressDelete={onPressDelete}
            />
          </div>
        );
      }) : <></>}
    </>
  );
}