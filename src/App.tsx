import React from 'react';
import profilePic from './assets/images/profileClipped.png';
import { Container, Nav } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />
      <Container>
        {/*<Nav
          activeKey="/home"
          className="justify-content-center"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <Nav.Item>
            <Nav.Link href="/home">John</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Wright</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">Stanly</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Website
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Coming
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Soon
            </Nav.Link>
          </Nav.Item>
        </Nav>*/}
        <Container className="App-body">
          <br/>
          <br/>
          <img src={profilePic} className="App-logo animated-1 fadeInUpFar" alt="John Wright Stanly" />
          <br/>
          <h2 className="animated-1 fadeInUp animation-delay-350">Welcome to my website</h2>
          <p className="animated-1 fadeInUp animation-delay-450">This website is currently under construction. Come back soon.</p>
        </Container>
      </Container>
      
      
    </>
  );
}

export default App;
