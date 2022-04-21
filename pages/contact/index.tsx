import React from 'react';

import { H1, H6 } from '../../components/Titles';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import API from '../../lib/Api';
import CenteredContainer from '../../components/CenteredContainer';
import HeadTags from '../../components/HeadTags';
import isValidEmail from '../../lib/isValidEmail';
import { ContactMessage } from '../../lib/Types';
import Link from 'next/link';

export default function Unsubscribe(props: any) {
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [subject, setSubject] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  async function onContact(): Promise<void> {
    setError('');
    setSuccess('');
    setLoading(true);

    const error = validateForm();
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    const inputMessage: ContactMessage = {
      user: {
        id: localStorage.getItem('userId'),
        name: name,
        email: email,
      },
      message: message,
    };
    if (subject) inputMessage.subject = subject;

    await API.postContact(inputMessage);

    setName('');
    setEmail('');
    setSubject('');
    setMessage('');

    setSuccess('Your message has been sent');
    setLoading(false);
    return;
  }

  function validateForm(): string | null {
    const missingAttributes = [];

    if (!name) missingAttributes.push('name');
    if (!email) missingAttributes.push('email');
    if (!message) missingAttributes.push('message');

    if (missingAttributes.length) {
      return `Missing: ${missingAttributes.join(', ')}`;
    }
    if (!isValidEmail(email)) {
      return 'Please submit a valid email';
    }
    if (message.length > 10000) {
      return 'Comments cannot be longer than 10000 characters';
    }

    return null;
  }

  return (
    <>
      <HeadTags title="Contact John Wright Stanly" />

      <Spacer top={100} />
      <CenteredContainer>
        <H1 centered marginBottom={20}>
          Contact Me
        </H1>
        <H6 centered marginBottom={20}>
          Send me a message and I'll try to respond to your email address within
          the next couple days.
        </H6>
        <H6 centered marginBottom={20}>
          My Calendly is also available{' '}
          <Link href="https://calendly.com/jwstanly/chat">here</Link>.
        </H6>
        {error && (
          <H6 red marginTop={30} marginBottom={20}>
            {error}
          </H6>
        )}
        {success && (
          <H6 green marginTop={30} marginBottom={20}>
            {success}
          </H6>
        )}
        <TextField value={name} setValue={setName} label="Name" />
        <TextField
          value={email}
          setValue={setEmail}
          label="Email"
          type="email"
        />
        <TextField
          value={subject}
          setValue={setSubject}
          label="Subject"
          optional
        />
        <TextField
          value={message}
          setValue={setMessage}
          label="Message"
          lines={5}
          onEnter={onContact}
        />
        <Spacer top={30} />
        <Button text="Confirm" onPress={onContact} loading={loading} />
      </CenteredContainer>
    </>
  );
}
