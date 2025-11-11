import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import type { Shop } from '../api/shop';
import { getShop, updateShop, deleteShop } from '../api/shop';
import { Button, Container, Alert, Spinner, Form, Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ShopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const key = useRequireApiKey();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [item, setItem] = useState('');
  const [value, setValue] = useState<number | ''>('');

  useEffect(() => {
    if (!key || !id) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const s = await getShop(id, key);
        if (mounted) setShop(s);
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
    if (!shop) return;
    setItem(shop.item ?? '');
    setValue(shop.value ?? '');
  }, [shop]);

  const handleDelete = async () => {
    if (!shop) return;
    if (!window.confirm('このショップアイテムを削除しますか？')) return;
    if (!key) return setError('APIキーが見つかりません');
    try {
      await deleteShop(shop.shop_id, key);
      navigate('/shops');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  const handleUpdate = async () => {
    if (!shop) return;
    if (!key) return setError('APIキーが見つかりません');
    setLoading(true);
    try {
      const payload: Partial<Shop> = { item: item || undefined, value: value === '' ? undefined : Number(value) };
      const updated = await updateShop(shop.shop_id, payload, key);
      setShop(updated);
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
          <h2 className="m-0">ショップアイテム詳細</h2>
          <Button variant="outline-danger" onClick={handleDelete}>削除</Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center my-4"><Spinner animation="border" /></div>
        ) : !shop ? (
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
                  <Col>
                    <Form.Group className="mb-2">
                      <Form.Label>item</Form.Label>
                      <Form.Control value={item} onChange={(e) => setItem(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>value</Form.Label>
                      <Form.Control type="number" value={value === '' ? '' : String(value)} onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="mt-3">
                <strong>shop_id:</strong> {shop.shop_id}<br />
                <strong>created_at:</strong> {shop.created_at}<br />
                <strong>updated_at:</strong> {shop.updated_at}<br />
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
