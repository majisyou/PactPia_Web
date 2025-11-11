import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequireApiKey } from '../utils/login';
import { Container, Row, Col , Card} from 'react-bootstrap';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const key = useRequireApiKey();
  if (!key) return null;
  
  return (
    <Container className="py-4">
      <h1 className="mb-3">PactPia 管理画面</h1>
      {/* md以上は2列、xsは1列で固定するシンプルな実装 */}
      <Row className="g-3">
        <Col>
        <Card>
          <Card.Body            
            role='button'
            onClick={() => navigate('/users')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/users');
            }}
            onMouseEnter={(e) => { e.currentTarget.style.cursor = 'pointer'; }}
            className="text-indigo-600">
          ユーザー管理
          </Card.Body>
        </Card>
        </Col>
        <Col>
        <Card>
          <Card.Body
            role='button'
            onClick={() => navigate('/registered_users')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/registered_users');
            }}
            onMouseEnter={(e) => { e.currentTarget.style.cursor = 'pointer'; }}
            className="text-indigo-600">
          登録中ユーザー管理
          </Card.Body>
        </Card>
        </Col>
      </Row>
      <Row className="g-3 mt-3">
        <Col>
        <Card>
          <Card.Body
            role='button'
            onClick={() => navigate('/unions')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/unions');
            }}
            onMouseEnter={(e) => { e.currentTarget.style.cursor = 'pointer'; }}
            className="text-indigo-600">
          国家管理
          </Card.Body>
        </Card>
        </Col>
        <Col>
        <Card>
          <Card.Body
            role='button'
            onClick={() => navigate('/buildings')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/buildings');
            }}
            onMouseEnter={(e) => { e.currentTarget.style.cursor = 'pointer'; }}
            className="text-indigo-600">
          建築物管理
          </Card.Body>
        </Card>
        </Col>
      </Row>
      <Row className="g-3 mt-3">
        <Col>
        <Card>
          <Card.Body
            role='button'
            onClick={() => navigate('/shops')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/shops');
            }}
            onMouseEnter={(e) => { e.currentTarget.style.cursor = 'pointer'; }}
            className="text-indigo-600">
          ショップ管理
          </Card.Body>
        </Card>
        </Col>
        <Col>
        <Card>
          <Card.Body
            role='button'
            onClick={() => navigate('/jobs')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/jobs');
            }}
            onMouseEnter={(e) => { e.currentTarget.style.cursor = 'pointer'; }}
            className="text-indigo-600">
          ジョブ管理
          </Card.Body>
        </Card>
        </Col>
      </Row> <Row className="g-3 mt-3">
        <Col>
        <Card>
          <Card.Body
            role='button'
            onClick={() => navigate('/others')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/others');
            }}
            onMouseEnter={(e) => { e.currentTarget.style.cursor = 'pointer'; }}
            className="text-indigo-600">
          その他管理
          </Card.Body>
        </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
