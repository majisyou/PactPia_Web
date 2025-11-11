import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import ListPage from '../Component/ListPage';
import type { RegisterUser } from '../api/register_user';
import { getRegisterUsers, deleteRegisterUser } from '../api/register_user';

export default function RegisterUsers() {
  const key = useRequireApiKey();
  if (!key) return null;

  return (
    <>
      <Header />
      <ListPage<RegisterUser>
        title="登録ユーザー一覧"
        fetcher={() => getRegisterUsers(key, undefined)}
        deleter={(discord_id) => deleteRegisterUser(discord_id, key)}
        detailPathPrefix="/registered_users/"
        specialRenderers={{
          mcid: (v) =>
            v === null || v === undefined
              ? ''
              : typeof v === 'object'
              ? JSON.stringify(v)
              : (
                  <a href={`https://ja.namemc.com/search?q=${String(v)}`} target="_blank" rel="noreferrer">
                    {String(v)}
                  </a>
                ),
        }}
      />
    </>
  );
}