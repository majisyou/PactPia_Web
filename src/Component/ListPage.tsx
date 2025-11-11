import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Table, Button, Spinner, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type IdLike = string | number | null | undefined;

export type ListConfig<T> = {
  title: string;
  fetcher: () => Promise<T[] | null | undefined>;
  deleter?: (id: any) => Promise<any>;
  detailPathPrefix?: string; 
  addPath?: string;
  idFields?: string[]; // order to try id fields
  specialRenderers?: Record<string, (value: any, row: T) => React.ReactNode>;
};

export default function ListPage<T>({
  title,
  fetcher,
  deleter,
  detailPathPrefix,
  addPath: explicitAddPath,
  idFields = ['id', 'pk', 'value'],
  specialRenderers = {},
}: ListConfig<T>) {
  const navigate = useNavigate();

  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetcher();
      setRows(data ?? []);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const columns = useMemo(() => {
    return rows.length > 0 ? Object.keys(rows[0] as any) : [];
  }, [rows]);

  const visibleRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let r = rows.slice();

    if (q !== '') {
      r = r.filter((item) => {
        const vals = Object.values(item as any);
        return vals.some((v) => {
          if (v === null || v === undefined) return false;
          if (typeof v === 'object') return JSON.stringify(v).toLowerCase().includes(q);
          return String(v).toLowerCase().includes(q);
        });
      });
    }

    if (sortColumn) {
      r.sort((a: any, b: any) => {
        const va = a[sortColumn];
        const vb = b[sortColumn];
        if (va === undefined || va === null) return 1;
        if (vb === undefined || vb === null) return -1;

        const na = Number(va);
        const nb = Number(vb);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) {
          return sortDir === 'asc' ? na - nb : nb - na;
        }

        const sa = String(va).toLowerCase();
        const sb = String(vb).toLowerCase();
        if (sa < sb) return sortDir === 'asc' ? -1 : 1;
        if (sa > sb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return r;
  }, [rows, searchQuery, sortColumn, sortDir]);

  const resolveId = (row: any): IdLike => {
    for (const k of idFields) {
      if (row[k] !== undefined && row[k] !== null) return row[k];
    }
    return undefined;
  };

  const handleDelete = useCallback(
    async (row: any) => {
      if (!deleter) return;
      const id = resolveId(row);
      if (!id) {
        alert('このレコードは削除できません（ID がありません）。');
        return;
      }
      if (!window.confirm('本当に削除しますか？')) return;
      try {
        await deleter(id);
        await fetchData();
      } catch (err) {
        alert('削除に失敗しました。');
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    [deleter, fetchData]
  );

  // compute add page path: explicitAddPath > (detailPathPrefix + 'add') > undefined
  const computedAddPath = useMemo(() => {
    if (explicitAddPath) return explicitAddPath;
    if (!detailPathPrefix) return undefined;
    // ensure trailing slash then add 'add'
    const prefix = detailPathPrefix.replace(/\/?$/, '/');
    return `${prefix}add`;
  }, [explicitAddPath, detailPathPrefix]);

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">{title}</h2>
        <div>
          <Button
            variant="primary"
            onClick={() => {
              if (computedAddPath) navigate(computedAddPath);
              else alert('追加ページが指定されていません');
            }}
          >
            追加
          </Button>
        </div>
      </div>

      <Row className="mb-3 g-2 align-items-center">
        <Col xs={12} md={6}>
          <InputGroup>
            <Form.Control
              placeholder="検索（全列を対象）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>
              クリア
            </Button>
          </InputGroup>
        </Col>

        <Col xs={8} md={4}>
          <Form.Select
            value={sortColumn ?? ''}
            onChange={(e) => setSortColumn(e.target.value || null)}
          >
            <option value="">ソートしない</option>
            {columns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={4} md={2} className="d-flex justify-content-end">
          <Button
            variant="outline-primary"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            disabled={!sortColumn}
          >
            {sortDir === 'asc' ? '昇順' : '降順'}
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" />
        </div>
      ) : visibleRows.length === 0 ? (
        <p>該当するデータが存在しません。</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              {columns.map((col) => (
                <th key={col}>
                  {col}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 ms-2"
                    onClick={() => {
                      if (sortColumn === col) {
                        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortColumn(col);
                        setSortDir('asc');
                      }
                    }}
                  >
                    ソート
                  </Button>
                </th>
              ))}
              <th>表示</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, idx) => {
              const row = r as any;
              const id = resolveId(row) ?? idx;
              return (
                <tr
                  key={String(id)}
                  role={detailPathPrefix ? 'button' : undefined}
                  onClick={() => {
                    if (detailPathPrefix) navigate(`${detailPathPrefix}${id}`);
                  }}
                  onMouseEnter={(e) => {
                    if (detailPathPrefix) (e.currentTarget as HTMLTableRowElement).style.cursor = 'pointer';
                  }}
                >
                  <td>{idx + 1}</td>
                  {columns.map((col) => {
                    const v = row[col];
                    const renderer = specialRenderers[col];
                    if (renderer) {
                      return <td key={col}>{renderer(v, row)}</td>;
                    }
                    return (
                      <td key={col}>
                        {v === null || v === undefined
                          ? ''
                          : typeof v === 'object'
                          ? JSON.stringify(v)
                          : String(v)}
                      </td>
                    );
                  })}
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (detailPathPrefix) navigate(`${detailPathPrefix}${id}`);
                        }}
                      >
                        表示
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          void handleDelete(row);
                        }}
                      >
                        削除
                      </Button>
                    </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
