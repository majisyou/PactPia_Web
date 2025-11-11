import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveApiKey, hasApiKey } from '../utils/api_key';
import { requestLogin } from '../api/authentication';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState('');

  useEffect(() => {
    if (hasApiKey()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key) return;
    requestLogin(key).then(() => {
      saveApiKey(key);
      navigate('/home');
    }).catch(_ => {
      alert('合言葉が間違えています');
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">合言葉を入力してください</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border px-3 py-2 rounded"
          placeholder="合言葉"
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">ログイン</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
