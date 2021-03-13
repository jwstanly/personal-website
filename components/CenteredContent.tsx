import React from "react";
import { Col, Container, Row } from 'react-bootstrap';

interface CenteredContentProps {
  children: JSX.Element | JSX.Element[];
};

export default function CenteredContent(props: CenteredContentProps) {

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={9} xl={8}>
        {props.children}
      </Col>
    </Row>
  );
}
