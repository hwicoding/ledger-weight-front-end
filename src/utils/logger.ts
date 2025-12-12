/**
 * 정밀 디버깅을 위한 로거 유틸리티
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private enabled = __DEV__;

  /**
   * 로그 기록
   */
  private log(level: LogLevel, category: string, message: string, data?: unknown): void {
    if (!this.enabled) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };

    // 에러인 경우 스택 트레이스 추가
    if (level === 'error' && data instanceof Error) {
      entry.stack = data.stack;
    }

    this.logs.push(entry);

    // 최대 로그 수 제한
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 콘솔 출력 (터미널에 실시간 표시)
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    
    // 타임스탬프 포맷팅 (간단하게)
    const time = new Date(entry.timestamp).toLocaleTimeString('ko-KR', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
    
    // 이모지로 레벨 표시 (터미널에서 더 잘 보이도록)
    const levelEmoji = {
      error: '❌',
      warn: '⚠️',
      info: 'ℹ️',
      debug: '🔍',
    }[level] || '📝';
    
    const prefix = `${levelEmoji} [${time}] [${level.toUpperCase()}] [${category}]`;
    
    // 터미널에 구조화된 형식으로 출력
    if (data) {
      consoleMethod(`${prefix} ${message}`, data);
    } else {
      consoleMethod(`${prefix} ${message}`);
    }
    
    // 에러인 경우 스택 트레이스도 출력
    if (level === 'error' && entry.stack) {
      console.error('Stack:', entry.stack);
    }
  }

  /**
   * Debug 로그
   */
  debug(category: string, message: string, data?: unknown): void {
    this.log('debug', category, message, data);
  }

  /**
   * Info 로그
   */
  info(category: string, message: string, data?: unknown): void {
    this.log('info', category, message, data);
  }

  /**
   * Warning 로그
   */
  warn(category: string, message: string, data?: unknown): void {
    this.log('warn', category, message, data);
  }

  /**
   * Error 로그
   */
  error(category: string, message: string, error?: unknown): void {
    this.log('error', category, message, error);
  }

  /**
   * 모든 로그 가져오기
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * 특정 카테고리 로그 필터링
   */
  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  /**
   * 에러 로그만 가져오기
   */
  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.level === 'error');
  }

  /**
   * 로그 초기화
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * 로그 내보내기 (디버깅용)
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// 전역에서 접근 가능하도록 (디버깅용)
if (__DEV__) {
  (global as any).__LOGGER__ = logger;
}

