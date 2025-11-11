import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import ListPage from '../Component/ListPage';
import type { Shop } from '../api/shop';
import { getShops, deleteShop } from '../api/shop';

export default function Shops() {
  const key = useRequireApiKey();
  if (!key) return null;

  return (
    <>
      <Header />
      <ListPage<Shop>
        title="店舗一覧"
        fetcher={() => getShops(key, undefined)}
        deleter={(id) => deleteShop(id as any, key)}
        detailPathPrefix="/shops/"
        idFields={[ 'shop_id' ]}
      />
    </>
  );
}
