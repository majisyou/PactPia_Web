
import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShop } from '../api/shop';

export default function ShopAdd() {
	const navigate = useNavigate();

	const [shopId, setShopId] = useState('');
	const [item, setItem] = useState('');
	const [value, setValue] = useState<number | ''>('');
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const key = useRequireApiKey();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus(null);
		setError(null);
		if (!key) return setError('APIキーが見つかりません');
		if (!shopId) return setError('shop_id を入力してください');

		const payload: any = { shop_id: shopId };
		if (item) payload.item = item;
		if (value !== '') payload.value = Number(value);

		try {
			await createShop(payload, key);
			setStatus('作成に成功しました');
			// 少し待って一覧へ戻る
			setTimeout(() => navigate('/shops'), 700);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			setError('作成に失敗しました');
		}
	};

	if (!key) return null;

	return (
		<>
			<Header />
			<Container className="py-4">
				<h2>ショップアイテム作成</h2>
				<Form onSubmit={handleSubmit}>
					{error && <Alert variant="danger">{error}</Alert>}
					{status && <Alert variant="success">{status}</Alert>}

					<Form.Group className="mb-3">
						<Form.Label>shop_id</Form.Label>
						<Form.Control value={shopId} onChange={(e) => setShopId(e.target.value)} />
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>item</Form.Label>
						<Form.Control value={item} onChange={(e) => setItem(e.target.value)} />
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>value</Form.Label>
						<Form.Control
							type="number"
							value={value === '' ? '' : String(value)}
							onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
						/>
					</Form.Group>

					<div className="d-flex gap-2">
						<Button type="submit">作成</Button>
						<Button variant="secondary" onClick={() => navigate('/shops')}>キャンセル</Button>
					</div>
				</Form>
			</Container>
		</>
	);
}