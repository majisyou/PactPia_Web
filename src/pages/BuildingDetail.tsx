import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import type { Building } from '../api/building';
import { getBuilding, updateBuilding, deleteBuilding } from '../api/building';
import { Button, Container, Alert, Spinner, Form, Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBuildingStateLabel } from '../utils/enumLabels';

export default function BuildingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const key = useRequireApiKey();

  const [b, setB] = useState<Building | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [buildingType, setBuildingType] = useState('');
  const [createrId, setCreaterId] = useState('');
  const [x, setX] = useState<number | ''>('');
  const [y, setY] = useState<number | ''>('');
  const [z, setZ] = useState<number | ''>('');
  const [approveFlag, setApproveFlag] = useState(false);

  useEffect(() => {
    if (!key || !id) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const d = await getBuilding(id, key);
        if (mounted) setB(d);
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
    if (!b) return;
    setBuildingType(b.building_type ?? '');
    setCreaterId(b.creater_id ?? '');
    setX(b.x ?? '');
    setY(b.y ?? '');
    setZ(b.z ?? '');
    setApproveFlag(Boolean(b.approve_flag));
  }, [b]);

  const handleDelete = async () => {
    if (!b) return;
    if (!window.confirm('この建築を削除しますか？')) return;
    if (!key) return setError('APIキーが見つかりません');
    try {
      await deleteBuilding(String(b.building_id), key);
      navigate('/buildings');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  const handleUpdate = async () => {
    if (!b) return;
    if (!key) return setError('APIキーが見つかりません');
    setLoading(true);
    try {
      const payload: Partial<Building> = {
        building_type: buildingType || undefined,
        creater_id: createrId || undefined,
        x: x === '' ? undefined : Number(x),
        y: y === '' ? undefined : Number(y),
        z: z === '' ? undefined : Number(z),
        approve_flag: approveFlag,
      };
      const updated = await updateBuilding(String(b.building_id), payload, key);
      setB(updated);
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
          <h2 className="m-0">建築詳細</h2>
          <Button variant="outline-danger" onClick={handleDelete}>削除</Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center my-4"><Spinner animation="border" /></div>
        ) : !b ? (
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
                      <Form.Label>building_type</Form.Label>
                      <Form.Control value={buildingType} onChange={(e) => setBuildingType(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>creater_id</Form.Label>
                      <Form.Control value={createrId} onChange={(e) => setCreaterId(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>x</Form.Label>
                      <Form.Control type="number" value={x === '' ? '' : String(x)} onChange={(e) => setX(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>y</Form.Label>
                      <Form.Control type="number" value={y === '' ? '' : String(y)} onChange={(e) => setY(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>z</Form.Label>
                      <Form.Control type="number" value={z === '' ? '' : String(z)} onChange={(e) => setZ(e.target.value === '' ? '' : Number(e.target.value))} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Check type="checkbox" label="承認済" checked={approveFlag} onChange={(e) => setApproveFlag(e.target.checked)} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="mt-3">
                <strong>building_id:</strong> {b.building_id}<br />
                <strong>created_at:</strong> {b.created_at}<br />
                <strong>updated_at:</strong> {b.updated_at}<br />
                <strong>state:</strong> {getBuildingStateLabel(b.state)}<br />
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
