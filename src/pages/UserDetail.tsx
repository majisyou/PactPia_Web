import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import type { User } from '../api/user';
import { getUser, deleteUser , updateUser , getUserBuildingMemberships , getUserBuildings, getUserHome, getUserSkins, getUserJobs , getUserUnionMembers} from '../api/user';
import { Button, Container, Alert, Spinner, Form, Row, Col, Card, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sendUser } from '../api/redis';

export default function UserDetail() {
  const { id } = useParams(); // expecting discord_id in the route as :id
  const navigate = useNavigate();
  const key = useRequireApiKey();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // form state
  const [name, setName] = useState<string>('');
  const [mcid, setMcid] = useState<string>('');
  const [money, setMoney] = useState<number | ''>('');
  const [ipAddr, setIpAddr] = useState<string>('');
  const [xId, setXId] = useState<string>('');
  // related data
  const [unionMembers, setUnionMembers] = useState<any[] | null>(null);
  const [home, setHome] = useState<any | null>(null);
  const [ownedBuildings, setOwnedBuildings] = useState<any[] | null>(null);
  const [createdBuildings, setCreatedBuildings] = useState<any[] | null>(null);
  const [jobsList, setJobsList] = useState<any[] | null>(null);
  const [skinsList, setSkinsList] = useState<any[] | null>(null);
  const [relatedLoading, setRelatedLoading] = useState(false);

    const [userMsg, setUserMsg] = useState('');
    const [userStatus, setUserStatus] = useState<string | null>(null);

    const sendUserHandler = async () => {
        setUserStatus(null);
        if (!id) return setUserStatus('ユーザーが見つかりません');
            try {
                await sendUser(id, { msg: userMsg }, key!);
            setUserStatus('送信に成功しました');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            setUserStatus('送信に失敗しました');
        }
    };

  useEffect(() => {
    if (!key) return;
    if (!id) {
      setError('ユーザーIDが指定されていません');
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const u = await getUser(id, key);
        if (mounted) setUser(u);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (mounted) setError('ユーザー取得に失敗しました');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [id, key]);

  // load related lists after user loaded
  useEffect(() => {
    if (!key || !user) return;
    let mounted = true;
    const loadRelated = async () => {
      setRelatedLoading(true);
      try {
        const [ums, h, ub, ubc, uj, us] = await Promise.all([
          getUserUnionMembers(user.discord_id, key),
          getUserHome(user.discord_id, key),
          getUserBuildingMemberships(user.discord_id, key),
          getUserBuildings(user.discord_id, key),
          getUserJobs(user.discord_id, key),
          getUserSkins(user.discord_id, key),
        ]);
        if (!mounted) return;
        setUnionMembers(ums ?? []);
        setHome(h ?? null);
        setOwnedBuildings(ub ?? []);
        setCreatedBuildings(ubc ?? []);
        setJobsList(uj ?? []);
        setSkinsList(us ?? []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        if (mounted) setRelatedLoading(false);
      }
    };

    void loadRelated();
    return () => {
      mounted = false;
    };
  }, [user, key]);

  const navigateIfPossible = (row: any) => {
    if (!row || typeof row !== 'object') return;
    const idCandidates = ['union_id', 'shop_id', 'building_id', 'job_id', 'discord_id'];
    for (const k of idCandidates) {
      if (row[k] !== undefined && row[k] !== null) {
        // pick route based on key
        if (k === 'union_id') return navigate(`/unions/${row[k]}`);
        if (k === 'shop_id') return navigate(`/shops/${row[k]}`);
        if (k === 'building_id') return navigate(`/buildings/${row[k]}`);
        if (k === 'job_id') return navigate(`/jobs/${row[k]}`);
        if (k === 'discord_id') return navigate(`/users/${row[k]}`);
      }
    }
  };

  const renderAnyTable = (items: any, emptyLabel = '該当データがありません') => {
    // items can be null, primitive, object, or array
    if (relatedLoading && (items === null || items === undefined)) return <Spinner animation="border" />;

    if (items === null || items === undefined) return <div>{emptyLabel}</div>;

    // if primitive
    if (typeof items !== 'object') {
      return (
        <Table striped bordered hover responsive size="sm">
          <tbody>
            <tr>
              <td>{String(items)}</td>
            </tr>
          </tbody>
        </Table>
      );
    }

    // if single object (not array) -> key/value table
    if (!Array.isArray(items)) {
      const obj = items as Record<string, any>;
      const entries = Object.entries(obj);
      if (entries.length === 0) return <div>{emptyLabel}</div>;

      // find a navigation target: prefer top-level id keys, otherwise shallow search nested objects
      const idCandidates = ['union_id', 'shop_id', 'building_id', 'job_id', 'discord_id'];
      const findNavTarget = (o: Record<string, any>) => {
        for (const k of idCandidates) {
          if (o[k] !== undefined && o[k] !== null) return { [k]: o[k] };
        }
        for (const v of Object.values(o)) {
          if (v && typeof v === 'object') {
            for (const k of idCandidates) {
              if (v[k] !== undefined && v[k] !== null) return v;
            }
          }
        }
        return null;
      };

      const navTarget = findNavTarget(obj);

      return (
        <Table size="sm" bordered style={navTarget ? { cursor: 'pointer' } : undefined} >
          <tbody onClick={() => navTarget && navigateIfPossible(navTarget)}>
            {entries.map(([k, v]) => {
              const isIdKey = idCandidates.includes(k);
              const isObjValue = v !== null && typeof v === 'object';
              return (
                <tr key={k}>
                  <th style={{ width: '30%' }}>{k}</th>
                  <td>
                    {v === null || v === undefined ? (
                      ''
                    ) : isObjValue ? (
                      // object value: clickable (inner click still allowed)
                      <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateIfPossible(v);
                        }}
                      >
                        {JSON.stringify(v)}
                      </span>
                    ) : isIdKey ? (
                      // primitive id field: clicking navigates using the key
                      <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateIfPossible({ [k]: v });
                        }}
                      >
                        {String(v)}
                      </span>
                    ) : (
                      String(v)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    }

    // items is an array
    const arr: any[] = items as any[];
    if (arr.length === 0) return <div>{emptyLabel}</div>;

    const hasObject = arr.some((it) => it && typeof it === 'object');
    if (!hasObject) {
      return (
        <Table striped bordered hover responsive size="sm">
          <tbody>
            {arr.map((it, idx) => (
              <tr key={idx}>
                <td>{it === null || it === undefined ? '' : String(it)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    // build union of keys across all object items (skip null/primitive entries)
    const colsSet = new Set<string>();
    for (const it of arr) {
      if (it && typeof it === 'object') {
        Object.keys(it).forEach((k) => colsSet.add(k));
      }
    }
    const cols = Array.from(colsSet);

    return (
      <Table striped bordered hover responsive size="sm" >
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arr.map((it, idx) => (
            <tr key={idx} role={typeof it === 'object' ? 'button' : undefined} onClick={() => typeof it === 'object' && navigateIfPossible(it)}>
              {cols.map((c) => (
                <td key={c}>{it && it[c] !== null && it[c] !== undefined ? (typeof it[c] === 'object' ? JSON.stringify(it[c]) : String(it[c])) : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm('このユーザーを削除しますか？')) return;
    if (!key) return setError('APIキーが見つかりません');
    try {
      await deleteUser(user.discord_id, key);
      // 削除後は一覧へ戻る
      navigate('/users');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  // sync form state when user changes / loaded
  useEffect(() => {
    if (!user) return;
    setName(user.name ?? '');
    setMcid(user.mcid ?? '');
    setMoney(user.money ?? '');
    setIpAddr(user.ip_addr ?? '');
    setXId(user.x_id ?? '');
  }, [user]);

  const handleStartEdit = () => {
    setStatus(null);
    setIsEdit(true);
  };

  const handleCancelEdit = () => {
    // revert to loaded user values
    if (user) {
      setName(user.name ?? '');
      setMcid(user.mcid ?? '');
      setMoney(user.money ?? '');
      setIpAddr(user.ip_addr ?? '');
      setXId(user.x_id ?? '');
    }
    setIsEdit(false);
    setStatus(null);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!user) return;
    if (!key) return setError('APIキーが見つかりません');
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const payload: Partial<User> = {
        name: name || undefined,
        mcid: mcid || undefined,
        money: money === '' ? undefined : Number(money),
        ip_addr: ipAddr || undefined,
        x_id: xId || undefined
      };
      const updated = await updateUser(user.discord_id, payload, key);
      setUser(updated);
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
          <h2 className="m-0">ユーザー詳細</h2>
          <div>
            <Button variant="outline-danger" onClick={handleDelete}>削除</Button>
          </div>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        ) : !user ? (
          <p>ユーザーが見つかりません。</p>
        ) : (
          <>
            <Card className="mb-4">
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h3 className='m-0'>基本情報</h3>
                        
                        <div className="mb-3">
                            {!isEdit ? (
                                <>
                                <Button variant="outline-secondary" className="me-2" onClick={handleStartEdit}>✏️</Button>
                                </>
                            ) : (
                                <>
                                <Button variant="primary" className="me-2" onClick={handleUpdate} disabled={loading}>更新</Button>
                                <Button variant="secondary" onClick={handleCancelEdit} disabled={loading}>キャンセル</Button>
                                </>
                            )}
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    {status && <Alert variant="success">{status}</Alert>}
                    <div>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                    <Form.Label>name</Form.Label>
                                    <Form.Control
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEdit}
                                    />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>mcid</Form.Label>
                                        <Form.Control
                                            value={mcid}
                                            onChange={(e) => setMcid(e.target.value)}
                                            disabled={!isEdit}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>money</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={money === '' ? '' : String(money)}
                                            onChange={(e) => setMoney(e.target.value === '' ? '' : Number(e.target.value))}
                                            disabled={!isEdit}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>ip_addr</Form.Label>
                                        <Form.Control
                                            value={ipAddr}
                                            onChange={(e) => setIpAddr(e.target.value)}
                                            disabled={!isEdit}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>x_id</Form.Label>
                                        <Form.Control
                                            value={xId}
                                            onChange={(e) => setXId(e.target.value)}
                                            disabled={!isEdit}
                                        />
                                    </Form.Group>

                                </Col>
                            </Row>
                        </Form>

                        <div className="mt-3">
                            <strong>discord_id:</strong> {user.discord_id}<br />
                            <strong>delete_flag:</strong> {user.delete_flag ? 'Yes' : 'No'}<br />
                            <strong>deleted_at:</strong> {user.deleted_at ?? ''}<br />
                            <strong>created_at:</strong> {user.created_at}<br />
                            <strong>updated_at:</strong> {user.updated_at}<br />
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>
                    <h2>Send User</h2>
                </Card.Header>
                <Card.Body>
                    <p>ユーザーにRedis経由でメッセージを送信します。</p>
                    <Form.Group className="mb-2">
                        <Form.Label>メッセージ</Form.Label>
                        <Form.Control value={userMsg} onChange={(e) => setUserMsg(e.target.value)} />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button onClick={sendUserHandler}>送信</Button>
                        {userStatus && (
                            <Alert variant={userStatus.includes('成功') ? 'success' : 'danger'} className="mb-0 py-1 px-2">
                                {userStatus}
                            </Alert>
                        )}
                    </div>
                </Card.Body>
            </Card>            
            <Card className="mb-4">
                <Card.Header>
                    <h3 className='m-0'>所属国家一覧</h3>
                </Card.Header>
                <Card.Body>
                    {renderAnyTable(unionMembers, '所属国家がありません')}
                </Card.Body>
            </Card>
            <Card className="mb-4">
                <Card.Header>
                    <h3 className='m-0'>Home情報</h3>
                </Card.Header>
                <Card.Body>
                   {renderAnyTable(home, 'Home情報はありません')}
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header>
                    <h3 className='m-0'>所持建築物一覧</h3>
                </Card.Header>
           <Card.Body>
                {renderAnyTable(ownedBuildings, '所持建築物はありません')}
           </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header>
                    <h3 className='m-0'>作成建築物一覧</h3>
                </Card.Header>
            <Card.Body>
                {renderAnyTable(createdBuildings, '作成建築物はありません')}
            </Card.Body>
            </Card>
            <Card className="mb-4">
                <Card.Header>
                    <h3 className='m-0'>所属ジョブ一覧</h3>
                </Card.Header>
                <Card.Body>
                    {renderAnyTable(jobsList, '所属ジョブはありません')}
                </Card.Body>
            </Card>
            <Card className="mb-4">
                <Card.Header>
                    <h3 className='m-0'>スキン一覧</h3>
                </Card.Header>
                <Card.Body>
                    {renderAnyTable(skinsList, 'スキンはありません')}
                </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}