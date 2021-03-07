import React from 'react'
import Head from 'next/head'

import styles from '../styles/Home.module.css';

import HomeHeader from '../components/HomeHeader'
import Navbar from '../components/Navbar'

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, Text } from '../components/Titles';
import { ExperienceCard } from '../components/ExperienceCard';

export default function Home() {

  return (
    <>
      <Head>
        <title>John Wright Stanly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar 
        color="#FFF"
        options={[
          {label: "Contact", href: "#contact"},
          {label: "Blog", href: "#blog"},
          {label: "Home", href: "#home"},
        ]}
      />

      <HomeHeader />

      <div style={{padding: '20px'}}/>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={9}>
            <p className={styles.headerContentText}>
              I'm a software engineer out of Jacksonville, Florida. 
            </p>
            <p className={styles.headerContentText}>
              I graduated from Stanton College Prep in May 2020. 
              I plan to study aerospace engineering at Georgia Tech.
              However, I decided to take a gap year thanks to Covid-19.  
              In the meantime, I've been working on some pretty cool projects!
            </p>  
            <p className={styles.headerContentText}>
              Besides programming, I also really like aerospace engineering. 
              I also love to run, bike, golf, and learn about local history here in Jacksonville. 
            </p>
          </Col>
        </Row>
      </Container>

      <div style={{padding: '20px'}}/>

      <H1>Experience</H1>
      
      <ExperienceCard
        header='Winsight'
        subheader='Co-Founder, Software Engineer'
        codeTags={["Next.js", "React Native", "RTMP/HLS", "AWS", "TypeScript"]}
        content={[
          'Winsight is a livestreaming app for youth sports. Friends and family can watch personal highlight reels created just for their athletes.',
          "I've developed the mobile app and website. I've also helped deploy our websites, APIs, and servers to AWS."
        ]}
        imageUrl="https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/79/f5/86/79f5861c-ea2d-122d-7774-5b7bf93ddc69/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/230x0w.webp"
        alt="Winsight logo"
      />

      <ExperienceCard
        header='Synergy Technologies'
        subheader='Web Developer'
        codeTags={["React", "AR", "E-Commerce", "Shopify Liquid", "JavaScript"]}
        content={[
          'Synergy is a IT consulting firm that also operates various projects ranging from e-commerce to augmented reality to healthcare.',
          "I've operated the JavaScript and Liquid codebase for TheWMarketplace, an e-commerce website for women entrepreneurs. I wrote an augmented reality game that takes players on a scavenger hunt accross Jacksonville. I also connected smartwatch API's to Synergy's healthcare app, Project One."
        ]}
        imageUrl="https://media-exp1.licdn.com/dms/image/C4D0BAQHx7gtEoMobMQ/company-logo_200_200/0/1603997222550?e=2159024400&v=beta&t=g9nNgT-Pwn890yhcK3IGUZwb6FvzZeBJPlvVkv5GgLk"
        imageAlt="Winsight logo"
      />

      <ExperienceCard
        header='Audiodub'
        subheader='Junior Software Engineer'
        codeTags={["NLP", "STT", "Translation", "TTS", "YouTube API", "IBM Cloud", "GCP", "Python"]}
        content={[
          'Audiodub is a service that uses machine learning to automatically translate and dub YouTube videos into 20+ languages. ',
          "I developed parts of the NLP pipeline, like adding speaker diarization and minimizing API calls with IBM Watson. I also helped with biz-dev with things like writing an email scraper and talking to YouTubers like Minute Physics and 3Blue1Brown"
        ]}
        imageUrl="https://i.imgur.com/ITWU7N2.png"
        imageAlt="Winsight logo"
      />

      <div style={{padding: '5vw'}}/>
    </>
  )
}

{/* <div style={{justifyContent: "center", backgroundColor: 'red', position: 'relative', maxHeight: '500px', height: 'auto', aspectRatio: "1:1"}}>
  <img
    style={{position: 'absolute', left: '5%', width: '70%'}}
    src="/images/winsightWeb.png" 
    alt="John Wright Stanly"
  />
  <img
    style={{position: 'absolute', right: '5%',  width: '40%'}}
    src="/images/winsightPhone.png" 
    alt="John Wright Stanly"
  />
  <img
    style={{position: 'absolute', left: '15%', width: '30%', borderRadius: 20, boxShadow: '0px 0px 40px 5px #CCC'}}
    src="https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/79/f5/86/79f5861c-ea2d-122d-7774-5b7bf93ddc69/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/230x0w.webp" 
    alt="John Wright Stanly"
  />
</div> */}
