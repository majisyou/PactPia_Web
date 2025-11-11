import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import ListPage from '../Component/ListPage';
import type { Job } from '../api/job';
import { getJobs, deleteJob } from '../api/job';
import { getJobScores } from '../api/job_score';
import { Container, Spinner, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
export default function Jobs() {
  const key = useRequireApiKey();

  // score chart state
  const [valueDays, setValueDays] = useState<number>(7);
  const [jobScores, setJobScores] = useState<any[] | null>(null);
  const [scoresLoading, setScoresLoading] = useState(false);
  const today = new Date();
  const fmtDate = (d: Date) => d.toISOString().split('T')[0];
  const defaultEnd = fmtDate(today);
  const defaultStart = fmtDate(new Date(today.getTime() - valueDays * 24 * 60 * 60 * 1000));
  const [startDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  // load job scores for chart when job or valueDays changes
  useEffect(() => {
    if (!key) return;
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
        }, [key, valueDays, startDate, endDate]);


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

  // if no API key yet, don't render UI — but keep hooks above this line so
  // the number and order of hooks stay stable between renders.
  if (!key) return null;

  return (
    <>
      <Header />
      <ListPage<Job>
        title="ジョブ一覧"
        fetcher={() => getJobs(key, undefined)}
        deleter={(id) => deleteJob(id as any, key)}
        detailPathPrefix="/jobs/"
        idFields={[ 'job_id' ]}
      />

      
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
