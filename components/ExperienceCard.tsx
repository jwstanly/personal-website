import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { LargeIcon } from './LargeIcon';
import { Card } from './Card';

import styles from '../styles/Card.module.css';

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
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <div className={styles.cardContainer}>
            <div style={{float:'left', marginLeft: 10}}>
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
        </Col>
      </Row>
    </Container>
  );
}