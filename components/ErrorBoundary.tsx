import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactChild | React.ReactChild[];
  errorContent?: React.ReactChild | React.ReactChild[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  intervalId: any;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, intervalId: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      this.setState({
        hasError: false,
      });
    }, 1000);

    this.setState(prevState => ({
      ...prevState,
      intervalId,
    }));
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    if (this.state.hasError) {
      return this.props.errorContent || <span>Error</span>;
    } else {
      return this.props.children;
    }
  }
}
