import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBuilding } from '../api/building';

export default function BuildingAdd() {
  const navigate = useNavigate();
  const [buildingType, setBuildingType] = useState('');
  const [createrId, setCreaterId] = useState('');
  const [x, setX] = useState<number | ''>('');
  const [y, setY] = useState<number | ''>('');
  const [z, setZ] = useState<number | ''>('');
  const [approveFlag, setApproveFlag] = useState(false);
  const [state, setState] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const key = useRequireApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    if (!key) return setError('APIキーが見つかりません');

    const payload: any = {};
    if (buildingType) payload.building_type = buildingType;
    if (createrId) payload.creater_id = createrId;
    if (x !== '') payload.x = Number(x);
    if (y !== '') payload.y = Number(y);
    if (z !== '') payload.z = Number(z);
    if (approveFlag) payload.approve_flag = true;
    if (state) payload.state = state;

    try {
      await createBuilding(payload, key);
      setStatus('作成に成功しました');
      setTimeout(() => navigate('/buildings'), 700);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('作成に失敗しました');
    }
  };

  if (!key) return null;

  return (
    <>
      <Header />
      <Container className="py-4">
        <h2>建築物作成</h2>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {status && <Alert variant="success">{status}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>building_type</Form.Label>
            <Form.Control value={buildingType} onChange={(e) => setBuildingType(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>creater_id</Form.Label>
            <Form.Control value={createrId} onChange={(e) => setCreaterId(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>x</Form.Label>
            <Form.Control type="number" value={x === '' ? '' : String(x)} onChange={(e) => setX(e.target.value === '' ? '' : Number(e.target.value))} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>y</Form.Label>
            <Form.Control type="number" value={y === '' ? '' : String(y)} onChange={(e) => setY(e.target.value === '' ? '' : Number(e.target.value))} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>z</Form.Label>
            <Form.Control type="number" value={z === '' ? '' : String(z)} onChange={(e) => setZ(e.target.value === '' ? '' : Number(e.target.value))} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="approve_flag" checked={approveFlag} onChange={(e) => setApproveFlag(e.target.checked)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>state</Form.Label>
            <Form.Control value={state} onChange={(e) => setState(e.target.value)} />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit">作成</Button>
            <Button variant="secondary" onClick={() => navigate('/buildings')}>キャンセル</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
