import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can log the error to an external service here
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2>予期しないエラーが発生しました</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f8d7da', padding: 12 }}>{String(this.state.error)}</pre>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()}>ページを再読み込み</button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
