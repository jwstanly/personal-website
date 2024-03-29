import React from 'react';
import HeadTags from '../components/HeadTags';
import CenteredContainer from '../components/CenteredContainer';
import Spacer from '../components/Spacer';
import { H1, H4 } from '../components/Titles';

export default function NoPageFound() {
  return (
    <>
      <HeadTags title="404 No Page Found - John Wright Stanly" />

      <Spacer top={200} />
      <CenteredContainer>
        <H1 centered marginBottom={20}>
          404
        </H1>
        <H4 centered marginBottom={20}>
          No Page Found :(
        </H4>
      </CenteredContainer>
    </>
  );
}
