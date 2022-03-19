import React from 'react';
import { Card } from './Card';
import CenteredContainer from './CenteredContainer';
import { LargeIcon } from './LargeIcon';

interface ExperienceCardProps {
  header: string;
  subheader: string;
  codeTags?: string[];
  content: string[];
  imageUrl: string;
  imageAlt: string;
}

export function ExperienceCard(props: ExperienceCardProps) {
  return (
    <CenteredContainer>
      <div className="flex flex-col md:flex-row mb-8 w-full">
        <div className="flex-none">
          <LargeIcon imageUrl={props.imageUrl} alt={props.imageAlt} />
        </div>
        <div className="flex-auto mt-5 mb-10 md:ml-10 md:mt-0">
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
