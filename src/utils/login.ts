import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey, hasApiKey } from '../utils/api_key';

export const useRequireApiKey = () => {
  const navigate = useNavigate();
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (!hasApiKey()) {
      navigate('/');
    } else {
      setKey(getApiKey() || null);
    }
  }, [navigate]);

  return key;
};