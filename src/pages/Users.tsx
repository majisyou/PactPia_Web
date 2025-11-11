// ...existing code...
import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import ListPage from '../Component/ListPage';
import type { User } from '../api/user';
import { getUsers, deleteUser } from '../api/user';

export default function Users() {
  const key = useRequireApiKey();
  if (!key) return null;

  return (
    <>
      <Header />
      <ListPage<User>
        title="ユーザー一覧"
        fetcher={() => getUsers(key, undefined)}
        deleter={(discord_id) => deleteUser(discord_id, key)}
        idFields={[ 'discord_id' ]}
        detailPathPrefix="/users/"
      />
    </>
  );
}