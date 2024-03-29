import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import Spacer from './Spacer';
import {
  faInstagram,
  faTwitter,
  faSnapchatGhost,
  faGithub,
  faLinkedin,
  faStrava,
} from '@fortawesome/free-brands-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { MenuOption } from '../lib/Types';
import Api from '../lib/Api';
import sortBy from '../lib/sortBy';
import serializeTitle from '../lib/serializeTitle';
import env from '../.env-cmdrc.js';

const { DOMAIN_NAME } = env.production;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [recentArticles, setRecentArticles] = React.useState<MenuOption[]>([]);

  function giveUserId() {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', Math.random().toString(36).substr(2, 11));
    }
  }

  function fetchRecentArticles() {
    Api.getAllPublishedArticles().then(articles => {
      setRecentArticles(
        sortBy(articles, 'createdAt')
          .reverse()
          .splice(0, 3)
          .map(article => ({
            label: article.title,
            href: `/blog/article/${serializeTitle(article.title)}`,
          })),
      );
    });
  }

  React.useEffect(() => {
    giveUserId();
    fetchRecentArticles();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <Navbar
          color="#FFF"
          options={[
            { label: 'Contact', href: '/contact' },
            { label: 'Blog', href: '/blog' },
            { label: 'Home', href: '/' },
          ]}
        />
        {children}
        <Spacer top={50} />
      </div>
      <Footer
        columnOptions={[
          {
            label: 'General',
            rowOptions: [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/#about' },
              { label: 'Experience', href: '/#experience' },
              { label: 'Resume', href: '/resume.pdf' },
            ],
          },
          {
            label: 'Blog',
            rowOptions: [
              { label: 'Recent Posts', href: '/blog' },
              ...recentArticles,
            ],
          },
          {
            label: 'Communication',
            rowOptions: [
              { label: 'Contact Me', href: '/contact' },
              { label: 'Email Unsubscribe', href: '/blog/unsubscribe' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
            ],
          },
          {
            label: 'Featured On',
            rowOptions: [
              { label: 'Tech-Blogs.dev', href: 'https://tech-blogs.dev/' },
              {
                label: 'Awesome Personal Blogs',
                href: 'https://github.com/jkup/awesome-personal-blogs',
              },
            ],
          },
        ]}
        socialMediaOptions={[
          {
            icon: faGithub,
            href: 'https://www.github.com/jwstanly',
          },
          {
            icon: faLinkedin,
            href: 'https://www.linkedin.com/in/jwstanly/',
          },
          {
            icon: faCalendar as IconDefinition,
            href: 'https://calendly.com/jwstanly/chat',
          },
          {
            icon: faTwitter,
            href: 'https://twitter.com/jwstanlydev',
          },
          {
            icon: faInstagram,
            href: 'https://www.instagram.com/jwstanly/',
          },
          {
            icon: faSnapchatGhost,
            href: 'https://www.snapchat.com/add/jwstanly',
          },
          {
            icon: faStrava,
            href: 'https://www.strava.com/athletes/22312632',
          },
        ]}
      />
    </div>
  );
}
