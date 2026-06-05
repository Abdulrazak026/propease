"use client";
import { Component, ReactNode } from "react";
import Button from "./Button";

interface Props {
 children: ReactNode;
 fallback?: ReactNode;
}

interface State {
 hasError: boolean;
 error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
 state: State = { hasError: false };

 static getDerivedStateFromError(error: Error): State {
 return { hasError: true, error };
 }

 render() {
 if (this.state.hasError) {
 if (this.props.fallback) return this.props.fallback;
 return (
 <div className="flex-1 flex items-center justify-center py-24 px-4">
 <div className="text-center max-w-md">
 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
 </svg>
 </div>
 <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
 <p className="text-sm text-gray-500 mb-6">{this.state.error?.message || "An unexpected error occurred"}</p>
 <Button onClick={() => this.setState({ hasError: false })}>Try Again</Button>
 </div>
 </div>
 );
 }
 return this.props.children;
 }
}
