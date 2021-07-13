import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTwitter,
  faSnapchatGhost,
  faGithub,
  faLinkedin,
  faStrava,
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <footer className="bg-gray-800 pt-10 sm:mt-10 pt-10">
        <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-left">
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">
              Getting Started
            </div>

            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Installation
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Release Notes
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Upgrade Guide
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Using with Preprocessors
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Optimizing for Production
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Browser Support
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              IntelliSense
            </a>
          </div>

          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">
              Core Concepts
            </div>

            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Utility-First
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Responsive Design
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Hover, Focus, & Other States
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Dark Mode
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Adding Base Styles
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Extracting Components
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Adding New Utilities
            </a>
          </div>

          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">
              Customization
            </div>

            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Configuration
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Theme Configuration
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Breakpoints
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Customizing Colors
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Customizing Spacing
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Configuring Variants
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Plugins
            </a>
          </div>

          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12">
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">
              Community
            </div>

            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              GitHub
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Discord
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              Twitter
            </a>
            <a
              href="#"
              className="my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700"
            >
              YouTube
            </a>
          </div>
        </div>

        <div className="pt-2">
          <div
            className="flex pb-5 px-3 m-auto pt-5 
            border-t border-gray-500 text-gray-400 text-sm 
            flex-col md:flex-row max-w-6xl"
          >
            <div className="mt-2">
              © Copyright 1998-year. All Rights Reserved.
            </div>

            <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
              <Icon
                href="https://www.strava.com/athletes/22312632"
                icon={faStrava}
              />
              <Icon
                href="https://www.strava.com/athletes/22312632"
                icon={faSnapchatGhost}
              />
              <Icon
                href="https://www.strava.com/athletes/22312632"
                icon={faInstagram}
              />
              <Icon
                href="https://www.strava.com/athletes/22312632"
                icon={faTwitter}
              />
              <Icon
                href="https://www.strava.com/athletes/22312632"
                icon={faLinkedin}
              />
              <Icon
                href="https://www.strava.com/athletes/22312632"
                icon={faGithub}
              />
            </div>
          </div>
        </div>
      </footer>
    </footer>
  );
}

interface IconProps {
  href: string;
  icon: IconDefinition;
}

function Icon(props: IconProps) {
  return (
    <Link href={props.href} passHref>
      <div className="w-6 mx-1 cursor-pointer transition duration-200 ease-in-out hover:text-gray-100">
        <FontAwesomeIcon icon={props.icon} size="xs" />
      </div>
    </Link>
  );
}
