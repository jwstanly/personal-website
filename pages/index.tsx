import React from 'react';
import styles from '../styles/Home.module.css';
import CenteredContainer from '../components/CenteredContainer';
import { ExperienceCard } from '../components/ExperienceCard';
import HeadTags from '../components/HeadTags';
import HomeHeader from '../components/HomeHeader';
import { H1 } from '../components/Titles';
import Spacer from '../components/Spacer';

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
          I'm John Wright Stanly, a student at Georgia Tech. I'm from
          Jacksonville, Florida.
        </p>
        <p className={styles.headerContentText}>
          I deferred my admission last year and worked at a startup. I also
          worked at a local tech company.
        </p>
        <p className={styles.headerContentText}>
          I'm passionate about startups and software engineering.
        </p>
        <p className={styles.headerContentText}>
          In my free time I enjoy running, biking, and golfing.
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
        imageUrl="https://www.techdatacloud.eu/media/2148/education-large.png"
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
        imageUrl="images/cloudflare.png"
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
        imageUrl="https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/79/f5/86/79f5861c-ea2d-122d-7774-5b7bf93ddc69/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/230x0w.webp"
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
        imageUrl="https://media-exp1.licdn.com/dms/image/C4D0BAQHx7gtEoMobMQ/company-logo_200_200/0/1603997222550?e=2159024400&v=beta&t=g9nNgT-Pwn890yhcK3IGUZwb6FvzZeBJPlvVkv5GgLk"
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
        imageUrl="https://i.imgur.com/ITWU7N2.png"
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
