import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import type { RegisterUser } from '../api/register_user';
import { getRegisterUser, updateRegisterUser, deleteRegisterUser } from '../api/register_user';
import { Button, Container, Alert, Spinner, Form, Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function RegisterUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const key = useRequireApiKey();

  const [ru, setRu] = useState<RegisterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [mcid, setMcid] = useState('');
  const [approvedFlag, setApprovedFlag] = useState(false);
  const [rejectedFlag, setRejectedFlag] = useState(false);

  useEffect(() => {
    if (!key || !id) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const d = await getRegisterUser(id, key);
        if (mounted) setRu(d);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (mounted) setError('取得に失敗しました');
      } finally { if (mounted) setLoading(false); }
    };
    void load();
    return () => { mounted = false; };
  }, [id, key]);

  useEffect(() => {
    if (!ru) return;
    setName(ru.name ?? '');
    setMcid(ru.mcid ?? '');
    setApprovedFlag(Boolean(ru.approved_flag));
    setRejectedFlag(Boolean(ru.rejected_flag));
  }, [ru]);

  const handleDelete = async () => {
    if (!ru) return;
    if (!window.confirm('この登録ユーザーを削除しますか？')) return;
    if (!key) return setError('APIキーが見つかりません');
    try {
      await deleteRegisterUser(ru.discord_id, key);
      navigate('/registered_users');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  const handleUpdate = async () => {
    if (!ru) return;
    if (!key) return setError('APIキーが見つかりません');
    setLoading(true);
    try {
      const payload: Partial<RegisterUser> = {
        name: name || undefined,
        mcid: mcid || undefined,
        approved_flag: approvedFlag,
        rejected_flag: rejectedFlag,
      };
      const updated = await updateRegisterUser(ru.discord_id, payload, key);
      setRu(updated);
      setStatus('更新に成功しました');
      setIsEdit(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('更新に失敗しました');
    } finally { setLoading(false); }
  };

  if (!key) return null;

  return (
    <>
      <Header />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="m-0">登録ユーザー詳細</h2>
          <Button variant="outline-danger" onClick={handleDelete}>削除</Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center my-4"><Spinner animation="border" /></div>
        ) : !ru ? (
          <p>データが見つかりません。</p>
        ) : (
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-start">
              <h3 className="m-0">基本情報</h3>
              <div>
                {!isEdit ? (
                  <Button variant="outline-secondary" onClick={() => setIsEdit(true)}>✏️</Button>
                ) : (
                  <>
                    <Button variant="primary" className="me-2" onClick={handleUpdate} disabled={loading}>更新</Button>
                    <Button variant="secondary" onClick={() => setIsEdit(false)} disabled={loading}>キャンセル</Button>
                  </>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {status && <Alert variant="success">{status}</Alert>}
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>name</Form.Label>
                      <Form.Control value={name} onChange={(e) => setName(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>mcid</Form.Label>
                      <Form.Control value={mcid} onChange={(e) => setMcid(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>approved_flag</Form.Label>
                      <Form.Check type="checkbox" label="承認済" checked={approvedFlag} onChange={(e) => setApprovedFlag(e.target.checked)} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>rejected_flag</Form.Label>
                      <Form.Check type="checkbox" label="却下済" checked={rejectedFlag} onChange={(e) => setRejectedFlag(e.target.checked)} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="mt-3">
                <strong>discord_id:</strong> {ru.discord_id}<br />
                <strong>created_at:</strong> {ru.created_at}<br />
                <strong>updated_at:</strong> {ru.updated_at}<br />
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
