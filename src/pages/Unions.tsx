import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import ListPage from '../Component/ListPage';
import type { Union } from '../api/union';
import { getUnions, deleteUnion } from '../api/union';

export default function Unions() {
  const key = useRequireApiKey();
  if (!key) return null;

  return (
    <>
      <Header />
      <ListPage<Union>
        title="国家一覧"
        fetcher={() => getUnions(key, undefined)}
        deleter={(id) => deleteUnion(id as any, key)}
        detailPathPrefix="/unions/"
        idFields={[ 'union_id' ]}
      />
    </>
  );
}
