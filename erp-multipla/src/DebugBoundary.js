// src/DebugBoundary.js
import React from 'react';

export default class DebugBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error("💥 Caught by DebugBoundary:", error);
    console.group("Component stack:");
    console.error(info.componentStack);
    console.groupEnd();
  }
  render() {
    return this.props.children;
  }
}
