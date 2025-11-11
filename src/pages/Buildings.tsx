import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import ListPage from '../Component/ListPage';
import type { Building } from '../api/building';
import { getBuildings, deleteBuilding } from '../api/building';

export default function Buildings() {
  const key = useRequireApiKey();
  if (!key) return null;

  return (
    <>
      <Header />
      <ListPage<Building>
        title="建物一覧"
        fetcher={() => getBuildings(key, undefined)}
        deleter={(id) => deleteBuilding(id as any, key)}
        detailPathPrefix="/buildings/"
        idFields={[ 'building_id' ]}
      />
    </>
  );
}
