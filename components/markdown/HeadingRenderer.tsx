import React from 'react';
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';
import serializeTitle from '../../lib/serializeTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

interface HeadingRendererProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: any;
  node: any;
}

export default function HeadingRenderer(props: HeadingRendererProps) {
  const router = useRouter();

  function handleLink() {
    router.push(`#${serializeTitle(props.children[0].props.children)}`);
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <>
      <style jsx id="heading-renderer-styles">{`
        .container {
          display: table-row;
          align-items: center;
        }
        .header-container {
          display: table-cell;
        }
        .link-container {
          display: none;
        }
        .link {
          margin-top: ${props.level <= 3 ? 20 : props.level == 4 ? 15 : 0}px;
          padding: 5px;
          padding-left: 10px;
          cursor: pointer;
        }
        .fade-out {
          animation: fadeOut 0.3s;
          opacity: 0;
        }
        .fade-in {
          animation: fadeIn 0.3s;
          opacity: 1;
        }
        .header-container:hover + .link-container {
          display: table-cell;
          vertical-align: middle;
          justify-content: center;
          align-items: center;
        }
        .link-container:hover {
          display: table-cell;
          vertical-align: middle;
          justify-content: center;
          align-items: center;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
      <div className="container">
        <div className="header-container">
          <Header {...props} />
        </div>
        <span className="link-container fade-in fade-out">
          <div className="link" onClick={handleLink}>
            <FontAwesomeIcon icon={faLink} width={20} color="#666" />
          </div>
        </span>
      </div>
    </>
  );
}

function Header(props: HeadingRendererProps) {
  return React.createElement(`h${props.level}`, {
    ...props,
    id: serializeTitle(props.children[0].props.children),
  });
}
