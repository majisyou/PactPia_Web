import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRegisterUser } from '../api/register_user';

export default function RegisterUserAdd() {
  const navigate = useNavigate();
  const [discordId, setDiscordId] = useState('');
  const [mcid, setMcid] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const key = useRequireApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    if (!key) return setError('APIキーが見つかりません');
    if (!discordId) return setError('discord_id を入力してください');

    const payload: any = { discord_id: discordId };
    if (mcid) payload.mcid = mcid;
    if (name) payload.name = name;

    try {
      await createRegisterUser(payload, key);
      setStatus('作成に成功しました');
      setTimeout(() => navigate('/registered_users'), 700);
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
        <h2>登録申請ユーザー作成</h2>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {status && <Alert variant="success">{status}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>discord_id</Form.Label>
            <Form.Control value={discordId} onChange={(e) => setDiscordId(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>mcid</Form.Label>
            <Form.Control value={mcid} onChange={(e) => setMcid(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit">作成</Button>
            <Button variant="secondary" onClick={() => navigate('/registered_users')}>キャンセル</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
