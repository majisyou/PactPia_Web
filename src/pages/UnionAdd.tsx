import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUnion } from '../api/union';

export default function UnionAdd() {
  const navigate = useNavigate();
  const [unionId, setUnionId] = useState('');
  const [name, setName] = useState('');
  const [areaSize, setAreaSize] = useState<number | ''>('');
  const [money, setMoney] = useState<number | ''>('');
  const [unionType, setUnionType] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const key = useRequireApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    if (!key) return setError('APIキーが見つかりません');
    if (!unionId) return setError('union_id を入力してください');

    const payload: any = { union_id: unionId };
    if (name) payload.name = name;
    if (areaSize !== '') payload.area_size = Number(areaSize);
    if (money !== '') payload.money = Number(money);
    if (unionType) payload.union_type = unionType;

    try {
      await createUnion(payload, key);
      setStatus('作成に成功しました');
      setTimeout(() => navigate('/unions'), 700);
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
        <h2>ユニオン作成</h2>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {status && <Alert variant="success">{status}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>union_id</Form.Label>
            <Form.Control value={unionId} onChange={(e) => setUnionId(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>area_size</Form.Label>
            <Form.Control type="number" value={areaSize === '' ? '' : String(areaSize)} onChange={(e) => setAreaSize(e.target.value === '' ? '' : Number(e.target.value))} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>money</Form.Label>
            <Form.Control type="number" value={money === '' ? '' : String(money)} onChange={(e) => setMoney(e.target.value === '' ? '' : Number(e.target.value))} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>union_type</Form.Label>
            <Form.Control value={unionType} onChange={(e) => setUnionType(e.target.value)} />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit">作成</Button>
            <Button variant="secondary" onClick={() => navigate('/unions')}>キャンセル</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
