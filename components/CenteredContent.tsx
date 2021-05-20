import React from "react";
// import { Col, Container, Row } from 'react-bootstrap';

interface CenteredContentProps {
  children: React.ReactNode;
};

export default function CenteredContent(props: CenteredContentProps) {

  return (
    <div className="justify-content-center">
      <div xs={12} md={10} lg={9} xl={8}>
        {props.children}
      </div>
    </div>
  );
}
