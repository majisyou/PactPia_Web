// ...existing code...
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="md" className="mb-3 shadow-sm">
      <Container>
        <Navbar.Brand
          role="button"
          onClick={() => navigate('/home')}
          style={{ cursor: 'pointer' }}
        >
          PactPia 管理画面
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link role="button" onClick={() => navigate('/home')}>ホーム</Nav.Link>
            <Nav.Link role="button" onClick={() => navigate('/users')}>ユーザー管理</Nav.Link>
            <Nav.Link role="button" onClick={() => navigate('/registered_users')}>登録中ユーザー管理</Nav.Link>
            <Nav.Link role="button" onClick={() => navigate('/unions')}>国家管理</Nav.Link>
            <Nav.Link role="button" onClick={() => navigate('/buildings')}>建築管理</Nav.Link>
            <Nav.Link role="button" onClick={() => navigate('/shops')}>ショップ管理</Nav.Link>
            <Nav.Link role="button" onClick={() => navigate('/jobs')}>ジョブ管理</Nav.Link>
            <Nav.Link role="button" onClick={() => navigate('/others')}>その他管理</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;