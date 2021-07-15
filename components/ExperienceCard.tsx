import React from 'react';
import { LargeIcon } from './LargeIcon';
import { Card } from './Card';

import CenteredContainer from './CenteredContainer';

interface ExperienceCardProps {
  header: string;
  subheader: string;
  codeTags: string[];
  content: string[];
  imageUrl: string;
  imageAlt: string;
}

export function ExperienceCard(props: ExperienceCardProps) {
  return (
    <CenteredContainer>
      <div className="sm:inline md:flex mb-8 ">
        <div className="float-left">
          <LargeIcon imageUrl={props.imageUrl} alt={props.imageAlt} />
        </div>
        <div className="float-left mt-5 mb-10 md:ml-10 md:mt-0">
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
