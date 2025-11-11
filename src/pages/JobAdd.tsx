import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api/job';

export default function JobAdd() {
  const navigate = useNavigate();
  const [discordId, setDiscordId] = useState('');
  const [jobType, setJobType] = useState('');
  const [isLeave, setIsLeave] = useState(false);
  const [isBan, setIsBan] = useState(false);
  const [memberAuth, setMemberAuth] = useState('');
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
    if (jobType) payload.job_type = jobType;
    if (isLeave) payload.is_leave = true;
    if (isBan) payload.is_ban = true;
    if (memberAuth) payload.member_auth = memberAuth;

    try {
      await createJob(payload, key);
      setStatus('作成に成功しました');
      setTimeout(() => navigate('/jobs'), 700);
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
        <h2>ジョブ作成</h2>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {status && <Alert variant="success">{status}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>discord_id</Form.Label>
            <Form.Control value={discordId} onChange={(e) => setDiscordId(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>job_type</Form.Label>
            <Form.Control value={jobType} onChange={(e) => setJobType(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="is_leave" checked={isLeave} onChange={(e) => setIsLeave(e.target.checked)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check type="checkbox" label="is_ban" checked={isBan} onChange={(e) => setIsBan(e.target.checked)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>member_auth</Form.Label>
            <Form.Control value={memberAuth} onChange={(e) => setMemberAuth(e.target.value)} />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit">作成</Button>
            <Button variant="secondary" onClick={() => navigate('/jobs')}>キャンセル</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}
