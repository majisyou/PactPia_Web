import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import type { Union } from '../api/union';
import { getUnion, updateUnion, deleteUnion } from '../api/union';
import { Button, Container, Alert, Spinner, Form, Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sendUnion } from '../api/redis';
import { getUnionTypeLabel } from '../utils/enumLabels';

export default function UnionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const key = useRequireApiKey();

  const [union, setUnion] = useState<Union | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // form
  const [name, setName] = useState('');
  const [areaSize, setAreaSize] = useState<number | ''>('');
  const [money, setMoney] = useState<number | ''>('');
  const [tax, setTax] = useState<number | ''>('');
  const [extra, setExtra] = useState<number | ''>('');
  const [power, setPower] = useState<number | ''>('');
  const [unionType, setUnionType] = useState('');
  const [deleteFlag, setDeleteFlag] = useState(false);

    const [unionMsg, setUnionMsg] = useState('');
    const [unionStatus, setUnionStatus] = useState<string | null>(null);

    const sendUnionHandler = async () => {
        setUnionStatus(null);
        if (!id) return setUnionStatus('国家が見つかりません');
            try {
                await sendUnion(id, { msg: unionMsg }, key!);
            setUnionStatus('送信に成功しました');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            setUnionStatus('送信に失敗しました');
        }
    };
    
  
  useEffect(() => {
    if (!key || !id) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const u = await getUnion(id, key);
        if (mounted) setUnion(u);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (mounted) setError('取得に失敗しました');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [id, key]);

  useEffect(() => {
    if (!union) return;
    setName(union.name ?? '');
    setAreaSize(union.area_size ?? '');
    setMoney(union.money ?? '');
    setTax(union.tax ?? '');
    setPower(union.power ?? '');
    setUnionType(union.union_type ?? '');
    setDeleteFlag(Boolean(union.delete_flag));
    setExtra(union.extra ?? '');
  }, [union]);

  const handleDelete = async () => {
    if (!union) return;
    if (!window.confirm('この国家を削除しますか？')) return;
    if (!key) return setError('APIキーが見つかりません');
    try {
      await deleteUnion(union.union_id, key);
      navigate('/unions');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  const handleUpdate = async () => {
    if (!union) return;
    if (!key) return setError('APIキーが見つかりません');
    setLoading(true);
    try {
      const payload: Partial<Union> = {
        name: name || undefined,
        area_size: areaSize === '' ? undefined : Number(areaSize),
        money: money === '' ? undefined : Number(money),
        tax: tax === '' ? undefined : Number(tax),
        extra: extra === '' ? undefined : Number(extra),
        power: power === '' ? undefined : Number(power),
        union_type: unionType || undefined,
        delete_flag: deleteFlag,
      };
      const updated = await updateUnion(union.union_id, payload, key);
      setUnion(updated);
      setStatus('更新に成功しました');
      setIsEdit(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!key) return null;

  return (
    <>
      <Header />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="m-0">国家詳細</h2>
          <Button variant="outline-danger" onClick={handleDelete}>削除</Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center my-4"><Spinner animation="border" /></div>
        ) : !union ? (
          <p>国家が見つかりません。</p>
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
                      <Form.Label>名前</Form.Label>
                      <Form.Control value={name} onChange={(e) => setName(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>国庫</Form.Label>
                      <Form.Control type="number" value={money === '' ? '' : String(money)} onChange={(e) => setMoney(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>面積</Form.Label>
                      <Form.Control type="number" value={areaSize === '' ? '' : String(areaSize)} onChange={(e) => setAreaSize(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>上納金</Form.Label>
                      <Form.Control type="number" value={tax === '' ? '' : String(tax)} onChange={(e) => setTax(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>エクストラ</Form.Label>
                      <Form.Control type="number" value={extra === '' ? '' : String(extra)} onChange={(e) => setExtra(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="mt-3">
                <strong>union_id:</strong> {union.union_id}<br />
                <strong>created_at:</strong> {union.created_at}<br />
                <strong>updated_at:</strong> {union.updated_at}<br />
                <strong>union_type:</strong> {getUnionTypeLabel(union.union_type)}<br />
              </div>
            </Card.Body>
          </Card>
        )}
        <Card>
            <Card.Header>
                    <h2>Send Union</h2>
            </Card.Header>
            <Card.Body>
                    <p>国家にRedis経由でメッセージを送信します。</p>
                    <Form.Group className="mb-2">
                        <Form.Label>メッセージ</Form.Label>
                        <Form.Control value={unionMsg} onChange={(e) => setUnionMsg(e.target.value)} />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button onClick={sendUnionHandler}>送信</Button>
                        {unionStatus && (
                            <Alert variant={unionStatus.includes('成功') ? 'success' : 'danger'} className="mb-0 py-1 px-2">
                                {unionStatus}
                            </Alert>
                        )}
                    </div>
            </Card.Body>
        </Card>
      </Container>
    </>
  );
}
