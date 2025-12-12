/**
 * 에러 핸들링 및 추적 유틸리티
 */

import { logger } from './logger';
import { ErrorInfo } from 'react';

interface ErrorContext {
  component?: string;
  action?: string;
  props?: Record<string, unknown>;
  state?: Record<string, unknown>;
}

class ErrorHandler {
  /**
   * React 에러 바운더리용 에러 핸들러
   */
  handleReactError(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ReactErrorBoundary', 'React 컴포넌트 에러 발생', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      componentStack: errorInfo.componentStack || undefined,
    });

    // 추가 에러 추적 로직 (필요시)
    this.reportError(error, {
      component: errorInfo.componentStack || undefined,
    });
  }

  /**
   * 일반 에러 핸들러
   */
  handleError(error: Error, context?: ErrorContext): void {
    logger.error('ErrorHandler', '에러 발생', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context,
    });

    this.reportError(error, context);
  }

  /**
   * Promise rejection 핸들러
   */
  handlePromiseRejection(reason: unknown, promise: Promise<unknown>): void {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    
    logger.error('PromiseRejection', 'Promise rejection 발생', {
      error: {
        message: error.message,
        stack: error.stack,
      },
      promise: promise.toString(),
    });

    this.reportError(error);
  }

  /**
   * 에러 리포트 (추후 에러 리포팅 서비스 연동 가능)
   */
  private reportError(error: Error, context?: ErrorContext): void {
    // 개발 환경에서는 콘솔에 출력
    if (__DEV__) {
      console.group('🚨 에러 리포트');
      console.error('에러:', error);
      console.error('컨텍스트:', context);
      console.groupEnd();
    }

    // 프로덕션 환경에서는 에러 리포팅 서비스로 전송
    // 예: Sentry, Bugsnag 등
  }

  /**
   * WebSocket 에러 핸들러
   */
  handleWebSocketError(error: Error, context?: { url?: string; action?: string }): void {
    logger.error('WebSocket', 'WebSocket 에러 발생', {
      error: {
        message: error.message,
        stack: error.stack,
      },
      context,
    });
  }

  /**
   * Redux 에러 핸들러
   */
  handleReduxError(error: Error, context?: { action?: string; state?: unknown }): void {
    logger.error('Redux', 'Redux 에러 발생', {
      error: {
        message: error.message,
        stack: error.stack,
      },
      context,
    });
  }
}

export const errorHandler = new ErrorHandler();

// 전역 에러 핸들러 등록
// React Native에서는 window.addEventListener가 없으므로 제거
// 대신 ErrorBoundary와 console.error 오버라이드를 사용합니다
// if (typeof window !== 'undefined' && window.addEventListener) {
//   window.addEventListener('error', (event) => {
//     errorHandler.handleError(event.error);
//   });
//
//   window.addEventListener('unhandledrejection', (event) => {
//     errorHandler.handlePromiseRejection(event.reason, Promise.resolve());
//   });
// }

