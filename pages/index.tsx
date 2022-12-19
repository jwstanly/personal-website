import React from 'react';
import styles from '../styles/Home.module.css';
import CenteredContainer from '../components/CenteredContainer';
import { ExperienceCard } from '../components/ExperienceCard';
import HeadTags from '../components/HeadTags';
import HomeHeader from '../components/HomeHeader';
import { H1 } from '../components/Titles';
import Spacer from '../components/Spacer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <HeadTags
        title="John Wright Stanly"
        description="I'm John Wright Stanly, a software engineer from Jacksonville, Florida. I've been working on some pretty cool projects while on my gap year before Georgia Tech."
      />

      <div id="home" />

      <div style={{ paddingTop: 50, backgroundColor: '#F1F1F1' }} />

      <HomeHeader />

      <div id="about" />

      <div style={{ padding: '3vw' }} />

      <CenteredContainer>
        <p className={styles.headerContentText}>
          I'm John Wright Stanly, a Georgia Tech student from Jacksonville,
          Florida.
        </p>
        <p className={styles.headerContentText}>
          I got into tech by accident. After enrolling in 2019 at the{' '}
          <Link href="https://socalfoodallergy.org/">
            SOCAL Food Allergy Institute
          </Link>{' '}
          to treat my childhood food allergies, I wasn't able to attend college
          during Covid. Instead, I took a gap year after high school.
        </p>
        <p className={styles.headerContentText}>
          I always wanted to be an aerospace engineer, but that dream quickly
          faded when I couldn't find a job in Jacksonville. Despite hating
          coding, I pivoted to tech. I reluctantly gave it a chance, but I
          couldn't have been more wrong.
        </p>
        <p className={styles.headerContentText}>
          The gap year exposed me to so many wonderful people and projects. I
          joined an <Link href="https://audiodub.app">early stage startup</Link>{' '}
          and a <Link href="https://synergytechs.net">local tech firm</Link>. I
          then met my founding team, and we broke off to build{' '}
          <Link href="https://getwinsight.com">our own startup</Link>. I learned
          coding is awesome, and so is building a company.
        </p>
        <p className={styles.headerContentText}>
          Come 2022, and I've made it to college, my food allergies are gone, we
          exited our startup, and I've interned at Google and Cloudflare.
        </p>
        <p className={styles.headerContentText}>
          My life predictions were totally incorrect. The last three years have
          been a wonderful accident, and I'm now even more excited for the
          future, as unpredictable as it might be.
        </p>
      </CenteredContainer>

      <div id="experience" />

      <div style={{ padding: '3vw' }} />

      <H1 centered marginBottom={40}>
        Experience
      </H1>

      <Spacer top={5} />

      <ExperienceCard
        header="Google"
        subheader="Software Engineer Intern"
        codeTags={['Android', 'SQL', 'Protobuf', 'Java']}
        content={['Joining Google Maps. Starting August 2022.']}
        imageUrl="/images/google.png"
        imageAlt="Google logo"
      />

      <ExperienceCard
        header="Cloudflare"
        subheader="Software Engineer Intern"
        codeTags={[
          'Apache Kafka',
          'Kubernetes',
          'Docker',
          'PostgreSQL',
          'Golang',
        ]}
        content={[
          'Cloudflare is a global network designed to make everything you connect to the Internet secure, private, fast, and reliable.',
          "I've revamped notifications for Cloudflare Workers by redesigning the architecture for scalability, helping add a new alert type, and automate deployments.",
        ]}
        imageUrl="/images/cloudflare.png"
        imageAlt="Cloudflare logo"
      />

      <ExperienceCard
        header="Winsight"
        subheader="Co-Founder, Software Engineer"
        codeTags={[
          'AWS',
          'React Native',
          'Next.js',
          'RTMP/HLS',
          'FFmpeg',
          'TypeScript',
        ]}
        content={[
          'Winsight is a livestreaming app for youth sports. Friends and family can watch personal highlight reels created just for their athletes.',
          "I've developed the mobile app and website. I've also helped develop our APIs and servers hosted on AWS.",
        ]}
        imageUrl="/images/winsight.webp"
        imageAlt="Winsight logo"
      />

      <ExperienceCard
        header="Synergy Technologies"
        subheader="Web Developer"
        codeTags={['React', 'AR', 'E-Commerce', 'Shopify Liquid', 'JavaScript']}
        content={[
          'Synergy is a IT consulting firm that also operates various projects ranging from e-commerce to augmented reality to healthcare.',
          "I've operated the JavaScript and Liquid codebase for TheWMarketplace, an e-commerce website for women entrepreneurs. I wrote an augmented reality game that takes players on a scavenger hunt across Jacksonville. I also connected smartwatch API's to Synergy's healthcare app, Project One.",
        ]}
        imageUrl="/images/synergy.jpg"
        imageAlt="Synergy Technologies logo"
      />

      <ExperienceCard
        header="Audiodub"
        subheader="Junior Software Engineer"
        codeTags={[
          'NLP',
          'STT',
          'Translation',
          'TTS',
          'YouTube API',
          'IBM Cloud',
          'GCP',
          'Python',
        ]}
        content={[
          'Audiodub is a service that uses machine learning to automatically translate and dub YouTube videos into 20+ languages. ',
          'I developed parts of the NLP pipeline, like adding speaker diarization and minimizing API calls with IBM Watson. I also helped with biz-dev with things like writing an email scraper and talking to YouTubers like Minute Physics and 3Blue1Brown.',
        ]}
        imageUrl="/images/audiodub.png"
        imageAlt="Audiodub logo"
      />

      <H1 centered marginBottom={40}>
        Education
      </H1>

      <ExperienceCard
        header="Georgia Tech"
        subheader="Computer Science"
        content={[
          'The Georgia Institute of Technology is a public research university in the heart of Atlanta, Georgia.',
          "While at Georgia Tech, I've started getting involved with clubs like Startup Exchange and GT Blockchain. In the Fall 2022 semester, I'll be managing Community Membership at Startup Exchange, a new program to foster a community of entrepreneurship at GT.",
        ]}
        imageUrl="/images/gt.png"
        imageAlt="Georgia Tech logo"
      />

      <ExperienceCard
        header="Stanton College Prep"
        subheader="International Baccalaureate"
        content={[
          "Stanton is a magnet high school in Jacksonville. Known for it's academics, it ranks as one of the nation's most difficult high schools.",
          'While at Stanton I served on student government, helping create new events like Mental Health Week and Voter Registration Day. I also was a captain of the varsity cross country and track teams.',
        ]}
        imageUrl="/images/stanton.jpg"
        imageAlt="Stanton College Prep logo"
      />
    </>
  );
}
