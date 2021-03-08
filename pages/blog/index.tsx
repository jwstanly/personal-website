import React from 'react'
import Head from 'next/head'

import styles from '../../styles/Card.module.css';

import HomeHeader from '../../components/HomeHeader'
import Navbar from '../../components/Navbar'

import { Col, Container, Row } from 'react-bootstrap'
import { Code, H1, H2, H3, Text } from '../../components/Titles';
import { ExperienceCard } from '../../components/ExperienceCard';
import Link from 'next/link';
import { Card } from '../../components/Card';
import { BlogPost } from '../../lib/Types';

export default function Blog() {

  const posts: BlogPost[] = [
    {
      id: "00001",
      title: "How to Build a Full Stack Blog",
      urlEncodedTitle: "How+to+Build+a+Full+Stack+Blog",
      subheader: "Deisgn, build, deploy, and own your website's entire tech stack",
      image: "/images/profileClipped.png",
      tags: ["Next.js", "AWS", "CloudFormation", "React", "HTML/CSS"],
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam",
      createdAt: Date.now(),
      lastModifiedAt: Date.now(),
    },
    {
      id: "00002",
      title: "How to Build a Full Stack Blog",
      urlEncodedTitle: "How+to+Build+a+Full+Stack+Blog",
      subheader: "Deisgn, build, deploy, and own your website's entire tech stack",
      image: "/images/profileClipped.png",
      tags: ["Next.js", "AWS", "CloudFormation", "React", "HTML/CSS"],
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam",
      createdAt: Date.now(),
      lastModifiedAt: Date.now(),
    },
    {
      id: "00003",
      title: "How to Build a Full Stack Blog",
      urlEncodedTitle: "How+to+Build+a+Full+Stack+Blog",
      subheader: "Deisgn, build, deploy, and own your website's entire tech stack",
      image: "/images/profileClipped.png",
      tags: ["Next.js", "AWS", "CloudFormation", "React", "HTML/CSS"],
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam",
      createdAt: Date.now(),
      lastModifiedAt: Date.now(),
    },
  ]

  return (
    <>
      <Head>
        <title>John Wright Stanly</title>
        <meta property="og:title" content="John Wright Stanly's Personal Website" />
        <meta property="og:description" content="Home of John Wright Stanly's website and blog" />
        <meta property="og:image" content="/images/profileClipped.png" />
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
      <H1>Recent Articles</H1>

      {posts.map((post: BlogPost) => {
        return (
          <Container key={post.id}>
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={9} xl={8}>
                <Link href={`/blog/post/${post.id}`} passHref>
                  <div className={styles.blogCard}>
                    <Card
                      header={post.title}
                      subheader={post.subheader}
                      codeTags={post.tags}
                      content={post.content}
                    />
                  </div>
                </Link>
                <div style={{marginTop: 50}}/>
              </Col>
            </Row>
          </Container>
        );
      })}
    </>
  );
}