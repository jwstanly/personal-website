import React from 'react';
import { LargeIcon } from './LargeIcon';
import { Card } from './Card';

import styles from '../styles/Card.module.css';
import CenteredContainer from './CenteredContainer';

interface ExperienceCardProps {
  header: string;
  subheader: string;
  codeTags: string[];
  content: string[];
  imageUrl: string;
  imageAlt: string;
}

export function ExperienceCard(props: ExperienceCardProps){

  return (
    <CenteredContainer>
      <div className={styles.cardContainer}>
        <div style={{float:'left'}}>
          <LargeIcon
            imageUrl={props.imageUrl}
            alt={props.imageAlt}
          />
        </div>
        <div style={{float: 'left'}} className={styles.cardTextContainer}>
          <Card
            header={props.header}
            subheader={props.subheader}
            codeTags={props.codeTags}
            content={props.content}
          />
        </div>
      </div>
    </CenteredContainer>
  );
}