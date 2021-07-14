import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import Link from 'next/link';
import { MenuOption } from '../lib/Types';

interface FooterColumn {
  label: string;
  rowOptions: MenuOption[];
}

interface SocialMediaOption {
  href: string;
  icon: IconDefinition;
}

interface FooterProps {
  columnOptions: FooterColumn[];
  socialMediaOptions: SocialMediaOption[];
}

export default function Footer(props: FooterProps) {
  return (
    <footer className="bg-gray-800 pt-10 sm:mt-10 pt-10">
      <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-left">
        {props.columnOptions.map(column => (
          <div className="p-5 w-1/2 sm:w-4/12 md:w-3/12" key={column.label}>
            <div className="text-xs uppercase text-gray-400 font-medium mb-6">
              {column.label}
            </div>
            {column.rowOptions.map(row => (
              <Link href={row.href} key={row.href} passHref>
                <div className="cursor-pointer my-3 block text-gray-300 hover:text-gray-100 text-sm font-medium duration-700">
                  {row.label}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div
          className="flex pb-5 px-3 m-auto pt-5 
            border-t border-gray-500 text-gray-400 text-sm 
            flex-col md:flex-row max-w-6xl"
        >
          <Link href="https://github.com/jwstanly/personal-website" passHref>
            <div className="mt-2 cursor-pointer">
              Like this website? Check out the source code here...
            </div>
          </Link>

          <div className="mt-2" />

          <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex items-center">
            {props.socialMediaOptions.reverse().map(social => (
              <Link href={social.href} passHref key={social.href}>
                <div className="w-6 mx-1 cursor-pointer text-gray-500 hover:text-gray-400 text-sm font-medium duration-700">
                  <FontAwesomeIcon icon={social.icon} width={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
