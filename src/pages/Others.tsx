import Header from '../Component/Header';
import { useRequireApiKey } from '../utils/login';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { sendUser, sendUnion, sendAdmin } from '../api/redis';
import { useState } from 'react';


export default function Others() {
    const [userId, setUserId] = useState('');
    const [userMsg, setUserMsg] = useState('');
    const [userStatus, setUserStatus] = useState<string | null>(null);

    const [unionId, setUnionId] = useState('');
    const [unionMsg, setUnionMsg] = useState('');
    const [unionStatus, setUnionStatus] = useState<string | null>(null);

    const [adminMsg, setAdminMsg] = useState('');
    const [adminStatus, setAdminStatus] = useState<string | null>(null);

  const key = useRequireApiKey();
    const sendUserHandler = async () => {
        setUserStatus(null);
        if (!userId) return setUserStatus('ユーザーIDを入力してください');
            try {
                await sendUser(userId, { msg: userMsg }, key!);
            setUserStatus('送信に成功しました');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            setUserStatus('送信に失敗しました');
        }
    };

    const sendUnionHandler = async () => {
        setUnionStatus(null);
        if (!unionId) return setUnionStatus('国家IDを入力してください');
            try {
                await sendUnion(unionId, { msg: unionMsg }, key!);
            setUnionStatus('送信に成功しました');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            setUnionStatus('送信に失敗しました');
        }
    };

    const sendAdminHandler = async () => {
        setAdminStatus(null);
            try {
                await sendAdmin({ msg: adminMsg }, key!);
            setAdminStatus('送信に成功しました');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
            setAdminStatus('送信に失敗しました');
        }
    };

    if (!key) return null;

  return (
    <>
        <Header />
        <Container className="mt-4">
        <Row className="g-3">
            <h2>Send Redis</h2>
            <Col>
                <Card>
                        <Card.Header>
                                <h2>Send User</h2>
                        </Card.Header>
                        <Card.Body>
                                <p>ユーザーにRedis経由でメッセージを送信します。</p>
                                <Form.Group className="mb-2">
                                    <Form.Label>Discord ID</Form.Label>
                                    <Form.Control value={userId} onChange={(e) => setUserId(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>メッセージ</Form.Label>
                                    <Form.Control value={userMsg} onChange={(e) => setUserMsg(e.target.value)} />
                                </Form.Group>
                                <div className="d-flex gap-2">
                                    <Button onClick={sendUserHandler}>送信</Button>
                                    {userStatus && (
                                        <Alert variant={userStatus.includes('成功') ? 'success' : 'danger'} className="mb-0 py-1 px-2">
                                            {userStatus}
                                        </Alert>
                                    )}
                                </div>
                        </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card>
                        <Card.Header>
                                <h2>Send Union</h2>
                        </Card.Header>
                        <Card.Body>
                                <p>国家にRedis経由でメッセージを送信します。</p>
                                <Form.Group className="mb-2">
                                    <Form.Label>Union ID</Form.Label>
                                    <Form.Control value={unionId} onChange={(e) => setUnionId(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>メッセージ</Form.Label>
                                    <Form.Control value={unionMsg} onChange={(e) => setUnionMsg(e.target.value)} />
                                </Form.Group>
                                <div className="d-flex gap-2">
                                    <Button onClick={sendUnionHandler}>送信</Button>
                                    {unionStatus && (
                                        <Alert variant={unionStatus.includes('成功') ? 'success' : 'danger'} className="mb-0 py-1 px-2">
                                            {unionStatus}
                                        </Alert>
                                    )}
                                </div>
                        </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card>
                        <Card.Header>
                                <h2>Send Admin</h2>
                        </Card.Header>
                        <Card.Body>
                                <p>管理者にRedis経由でメッセージを送信します。</p>
                                <Form.Group className="mb-2">
                                    <Form.Label>メッセージ</Form.Label>
                                    <Form.Control value={adminMsg} onChange={(e) => setAdminMsg(e.target.value)} />
                                </Form.Group>
                                <div className="d-flex gap-2">
                                    <Button onClick={sendAdminHandler}>送信</Button>
                                    {adminStatus && (
                                        <Alert variant={adminStatus.includes('成功') ? 'success' : 'danger'} className="mb-0 py-1 px-2">
                                            {adminStatus}
                                        </Alert>
                                    )}
                                </div>
                        </Card.Body>
                </Card>
            </Col>
            <Col>
            <Card>
                <Card.Header>
                    <h2>Send Building</h2>
                </Card.Header>
                <Card.Body>
                    <p>建物にRedis経由でメッセージを送信します。</p>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    </>
  );
}
