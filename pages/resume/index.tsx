import HeadTags from '../../components/HeadTags';
import Spacer from '../../components/Spacer';

import React from 'react';
import { H1 } from '../../components/Titles';

export default function Resume(props) {
  React.useEffect(() => {
    window.location.replace('/resume.pdf');
  }, []);

  return (
    <>
      <HeadTags
        title="Resume - John Wright Stanly"
        description="John Wright Stanly's resume"
      />

      <Spacer top={100} />

      <H1 centered>Loading...</H1>
    </>
  );
}
