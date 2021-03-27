import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Code, H1, H2, H3, H6, Text } from '../../../components/Titles';
import TextField from '../../../components/TextField';
import { Col, Row } from 'react-bootstrap';
import Button from '../../../components/Button';
import Spacer from '../../../components/Spacer';
import API from '../../../lib/Api';

export default function Unsubscribe(props: any) {

  const router = useRouter();

  const [email, setEmail] = React.useState<string>('');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  async function onUnsubscribe(): Promise<void> {
    setError("");
    setLoading(true);
    if(email !== router.query.email) {
      setError('Email does not match');
      setLoading(false);
      return;
    }
    try {
      await API.unsubscribeEmail(
        router.query.title as string,
        router.query.commentId as string,
        email
      );
    } catch (error) {
      setError("A server error occurred")
      setLoading(false);
      return;
    }

    setSuccess("Your email has been removed from the comment");
    setLoading(false);
    return;
  }

  return (
    <>
      <Head>
        <title>Unsubscribe Email - John Wright Stanly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{marginTop: 40}}/>
      <H1 centered marginBottom={20}>Unsubscribe</H1>
      <Row className="justify-content-center">
        <Col xs={10} md={8} lg={6} xl={6}>
          <H6 centered marginBottom={20}>Type in your email to confirm you want it permanently removed from your blog comment</H6>
          <H6 red marginTop={error ? 30 : 0}>{error}</H6>
          <H6 green marginTop={success ? 30 : 0}>{success}</H6>
          <TextField
            type="email"
            value={email}
            setValue={setEmail}
            placeholder={router.query.email as string}
          />
          <Spacer top={30} />
          <Button
            text="Confirm"
            onPress={onUnsubscribe}
            loading={loading}
          />
        </Col>
      </Row>
      <div style={{marginTop: '60vh'}}/>
      
    </>
  );
}