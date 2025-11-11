import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import type { Job } from '../api/job';
import { getJob, updateJob, deleteJob } from '../api/job';
import { getJobScores } from '../api/job_score';
import { Button, Container, Alert, Spinner, Form, Row, Col, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';

// helpers to format UTC input into Japan timezone for display
const normalizeUtcString = (s: string) => {
  if (!s) return s;
  // if timezone present (Z or +hh or -hh) assume it's explicit
  if (/[zZ]$/.test(s) || /[+-]\d{2}(:?\d{2})?$/.test(s)) return s;
  // otherwise assume provided timestamp is UTC and append Z
  return s + 'Z';
};

const formatToJstDate = (iso: string) => {
  try {
    const s = normalizeUtcString(String(iso));
    const d = new Date(s);
    return new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d).replace(/\//g, '-');
  } catch (e) {
    return String(iso).split('T')[0];
  }
};

const formatToJstDateTime = (iso: string) => {
  try {
    const s = normalizeUtcString(String(iso));
    const d = new Date(s);
    // format like 2025-10-21 00:58:31
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(d);
    const get = (type: string) => parts.find((p: any) => p.type === type)?.value ?? '';
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
  } catch (e) {
    return String(iso);
  }
};

// convert a YYYY-MM-DD (JST date selected by user) to UTC ISO for start of day (JST 00:00 => UTC -9h)
const jstDateToUtcIsoStart = (dateStr: string) => {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  if (!y || !m || !d) return null;
  const utcMs = Date.UTC(y, m - 1, d, 0, 0, 0) - 9 * 60 * 60 * 1000;
  return new Date(utcMs).toISOString();
};

// convert YYYY-MM-DD to UTC ISO for end of day (JST 23:59:59)
const jstDateToUtcIsoEnd = (dateStr: string) => {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  if (!y || !m || !d) return null;
  const utcMs = Date.UTC(y, m - 1, d, 23, 59, 59) - 9 * 60 * 60 * 1000;
  return new Date(utcMs).toISOString();
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const key = useRequireApiKey();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [jobType, setJobType] = useState('');
  const [isLeave, setIsLeave] = useState(false);
  const [isBan, setIsBan] = useState(false);
  const [memberAuth, setMemberAuth] = useState('');
  // score chart state
  const [valueDays, setValueDays] = useState<number>(7);
  const [jobScores, setJobScores] = useState<any[] | null>(null);
  const [scoresLoading, setScoresLoading] = useState(false);
  
  // hover handled by Recharts tooltip
  // date range state (calendar inputs). default: end = today, start = end - valueDays
  const fmtDate = (d: Date) => d.toISOString().split('T')[0];
  const today = new Date();
  const defaultEnd = fmtDate(today);
  const defaultStart = fmtDate(new Date(today.getTime() - valueDays * 24 * 60 * 60 * 1000));
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  useEffect(() => {
    if (!key || !id) return;
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const j = await getJob(id, key);
        if (mounted) setJob(j);
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
    if (!job) return;
    setJobType(job.job_type ?? '');
    setIsLeave(Boolean(job.is_leave));
    setIsBan(Boolean(job.is_ban));
    setMemberAuth(job.member_auth ?? '');
  }, [job]);

  // load job scores for chart when job or valueDays changes
  useEffect(() => {
    if (!job || !key) return;
    let mounted = true;
    const loadScores = async () => {
      setScoresLoading(true);
      try {
        // use startDate / endDate (from calendar). inputs are JST dates; convert to UTC ISO
        const startIso = jstDateToUtcIsoStart(startDate as string);
        const endIso = jstDateToUtcIsoEnd(endDate as string);
        if (!startIso || !endIso) {
          if (mounted) setJobScores([]);
          return;
        }
        const startDt = new Date(startIso);
        const endDt = new Date(endIso);
        const params: Record<string, any> = {
          job_id: String(job.job_id),
          // backend expects score_date_from / score_date_to for date range filtering
          score_date_from: startDt.toISOString(),
          score_date_to: endDt.toISOString(),
          // request ordered by date ascending for chart plotting
          sort_by: 'score_date',
          order: 'asc',
          skip: 0,
          limit: 1000,
        };
  // no score range filtering by default (UI removed)
        const res = await getJobScores(key, params);
        if (!mounted) return;
        setJobScores(res ?? []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        if (mounted) setScoresLoading(false);
      }
    };
    void loadScores();
    return () => { mounted = false; };
  }, [job, key, valueDays, startDate, endDate]);

  // keep startDate in sync with valueDays unless the user manually changed the range
  useEffect(() => {
    try {
      const end = new Date(endDate + 'T00:00:00');
      const start = new Date(end.getTime() - valueDays * 24 * 60 * 60 * 1000);
      setStartDate(fmtDate(start));
    } catch (e) {
      // ignore invalid date
    }
  }, [valueDays, endDate]);

  const renderScoreChart = (scores: any[]) => {
    // build date range from selected startDate / endDate
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return <div>日付範囲が無効です</div>;
    }
    const dayMs = 24 * 60 * 60 * 1000;
    const dates: string[] = [];
    for (let d = new Date(start); d <= end; d = new Date(d.getTime() + dayMs)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    // aggregate scores by date
    const map = new Map<string, number>();
    const detailsMap = new Map<string, any[]>();
    for (const date of dates) map.set(date, 0);
    for (const date of dates) detailsMap.set(date, []);
    for (const s of scores) {
      const raw = s.score_date ?? s.created_at ?? null;
      if (!raw) continue;
      const key = String(raw).split('T')[0];
      const val = Number(s.score ?? 0);
      map.set(key, (map.get(key) ?? 0) + val);
      const arr = detailsMap.get(key) ?? [];
      arr.push(s);
      detailsMap.set(key, arr);
    }

    const values = dates.map((d) => map.get(d) ?? 0);
    // use absolute daily totals for the chart
    const transformed: number[] = values;
    const rawMax = Math.max(...transformed, 1);
    // compute a "nice" rounded max for the axis (1,2,5,10,20,50...)
    const computeNiceMax = (v: number) => {
      if (v <= 10) return Math.max(1, Math.ceil(v));
      const pow = Math.pow(10, Math.floor(Math.log10(v)));
      const mant = Math.ceil(v / pow);
      if (mant <= 1) return pow;
      if (mant <= 2) return 2 * pow;
      if (mant <= 5) return 5 * pow;
      return 10 * pow;
    };
    const max = computeNiceMax(rawMax);

  // layout handled by Recharts

    // prepare data for Recharts
    const data = dates.map((d) => ({ date: d, value: map.get(d) ?? 0, details: detailsMap.get(d) ?? [] }));

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (!active || !payload || payload.length === 0) return null;
      const p = payload[0].payload;
      return (
        <div style={{ background: 'white', border: '1px solid #ddd', padding: 8, borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.1)', fontSize: 12, maxWidth: 320 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{formatToJstDate(String(label))}</div>
          <div style={{ marginBottom: 6 }}><strong>value:</strong> {String(p.value)}</div>
          {Array.isArray(p.details) && p.details.length > 0 ? (
            <div>
              {p.details.slice(0, 10).map((d: any, i: number) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <div><strong>date:</strong> {formatToJstDateTime(String(d.score_date ?? d.created_at ?? ''))}</div>
                  <div><strong>score:</strong> {String(d.score ?? '')} <strong>id:</strong> {String(d.job_score_id ?? '')}</div>
                </div>
              ))}
              {p.details.length > 10 && <div>...plus {p.details.length - 10} more</div>}
            </div>
          ) : null}
        </div>
      );
    };

    return (
      <div style={{ width: '100%', minHeight: 240 }}>
        {/* Give ResponsiveContainer a fixed pixel height to avoid initial zero-size measurements */}
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => formatToJstDate(String(d))} />
            <YAxis domain={[0, max]} allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#colorUv)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const handleDelete = async () => {
    if (!job) return;
    if (!window.confirm('このジョブを削除しますか？')) return;
    if (!key) return setError('APIキーが見つかりません');
    try {
      await deleteJob(String(job.job_id), key);
      navigate('/jobs');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('削除に失敗しました');
    }
  };

  const handleUpdate = async () => {
    if (!job) return;
    if (!key) return setError('APIキーが見つかりません');
    setLoading(true);
    try {
      const payload: Partial<Job> = {
        job_type: jobType || undefined,
        is_leave: isLeave,
        is_ban: isBan,
        member_auth: memberAuth || undefined,
      };
      const updated = await updateJob(String(job.job_id), payload, key);
      setJob(updated);
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
          <h2 className="m-0">ジョブ詳細</h2>
          <Button variant="outline-danger" onClick={handleDelete}>削除</Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="d-flex justify-content-center my-4"><Spinner animation="border" /></div>
        ) : !job ? (
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
                      <Form.Label>job_type</Form.Label>
                      <Form.Control value={jobType} onChange={(e) => setJobType(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>member_auth</Form.Label>
                      <Form.Control value={memberAuth} onChange={(e) => setMemberAuth(e.target.value)} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Check type="checkbox" label="退職済" checked={isLeave} onChange={(e) => setIsLeave(e.target.checked)} disabled={!isEdit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Check type="checkbox" label="BAN" checked={isBan} onChange={(e) => setIsBan(e.target.checked)} disabled={!isEdit} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <div className="mt-3">
                <strong>job_id:</strong> {job.job_id}<br />
                <strong>discord_id:</strong> {job.discord_id}<br />
                <strong>created_at:</strong> {formatToJstDateTime(String(job.created_at ?? ''))}<br />
                <strong>updated_at:</strong> {formatToJstDateTime(String(job.updated_at ?? ''))}<br />
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
      <Container>
        <h2>ジョブスコアの変動</h2>
        <div className="mb-2 d-flex align-items-center">
          <div>期間（日数）：
            <select value={String(valueDays)} onChange={(e) => setValueDays(Number(e.target.value))} className="ms-2">
            <option value="7">7</option>
            <option value="14">14</option>
            <option value="30">30</option>
          </select>
          </div>
          <div className="ms-4">開始日 (自動計算):
            <input type="date" value={startDate} readOnly className="ms-2 form-control" style={{ width: 150, display: 'inline-block', backgroundColor: '#f8f9fa' }} />
          </div>
          <div className="ms-3">終了日:
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); }} className="ms-2 form-control" style={{ width: 150, display: 'inline-block' }} />
          </div>
        </div>
        <Card>
          <Card.Header>スコア</Card.Header>
          <Card.Body>
            {scoresLoading ? (
              <Spinner animation="border" />
            ) : !jobScores || jobScores.length === 0 ? (
              <div>スコアデータがありません</div>
            ) : (
              <div>
                {renderScoreChart(jobScores)}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
