import React from 'react'
import Head from 'next/head'

import styles from '../../../styles/Home.module.css';

import HomeHeader from '../../../components/HomeHeader'
import Navbar from '../../../components/Navbar'

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, H6, Text } from '../../../components/Titles';
import { ExperienceCard } from '../../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../../components/Card';
import { BlogMarkdown } from '../../../components/BlogMarkdown';
import { BlogPost } from '../../../lib/Types';
import API from '../../../lib/Api';

export async function getStaticPaths() {
  return {
    paths: [
      {params: { blogPostId: "00001" } },
      {params: { blogPostId: "00002" } },
      {params: { blogPostId: "00003" } },
    ],
    fallback: false
  };
}

export async function getStaticProps(context) {
  
  const blogPost: BlogPost = {
    id: "00001",
    title: "How to Build a Full Stack Blog",
    urlEncodedTitle: "How+to+Build+a+Full+Stack+Blog",
    subheader: "Deisgn, build, deploy, and own your website's entire tech stack",
    image: "/images/profileClipped.png",
    tags: ["Next.js", "AWS", "CloudFormation", "React", "HTML/CSS"],
    content: 
      `Lorem ipsum dolor sit amet consectetur adipisicing elit.
      # Big Title
      Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem.
      ## Smaller Title
      Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam`,
    createdAt: Date.now(),
    lastModifiedAt: Date.now(),
  }
  
  return { props: blogPost }
}

export default function Blog(props: BlogPost) {

  console.log(props);

  async function getBlogArticle() {
    console.log("API RAN");
    API.getArticleByTitle(props.urlEncodedTitle).then(
      res => console.log("SUCCESS", res)
    ).catch(
      error => console.log("ERROR:", error)
    )
  }

  React.useEffect(() => getBlogArticle(), []);

  return (
    <>
      <Head>
        <title>John Wright Stanly</title>
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.subheader}  />
        <meta property="og:image" content={props.image} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar 
        color="#FFF"
        options={[
          {label: "Contact", href: "/#contact"},
          {label: "Blog", href: "/blog"},
          {label: "Home", href: "/#home"},
        ]}
      />

      <div style={{marginTop: 40}}/>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={9} xl={8}>
            <Card
              header={props.title}
              subheader={props.subheader}
              codeTags={props.tags}
              content={[]}
            />
          </Col>
        </Row>
        <div style={{marginTop: 50}} />
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={9} xl={8}>
            <BlogMarkdown>  
              {props.content}
            </BlogMarkdown>
          </Col>
        </Row>
      </Container>
    </>
  );
}