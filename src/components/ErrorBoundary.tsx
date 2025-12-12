/**
 * React Error Boundary 컴포넌트
 * 정밀한 에러 추적 및 디버깅 지원
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { errorHandler, logger } from '@/utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 터미널에 즉시 출력 (가장 중요!)
    console.error('❌❌❌ ERROR BOUNDARY CAUGHT ERROR ❌❌❌');
    console.error('Error Message:', error.message);
    console.error('Error Name:', error.name);
    if (error.stack) {
      console.error('Stack Trace:', error.stack);
    }
    if (errorInfo.componentStack) {
      console.error('Component Stack:', errorInfo.componentStack);
    }
    console.error('==========================================');
    
    logger.error('ErrorBoundary', '에러 캐치됨', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      componentStack: errorInfo.componentStack,
    });

    errorHandler.handleReactError(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    logger.info('ErrorBoundary', '에러 바운더리 리셋');
  };

  handleCopyError = async (): Promise<void> => {
    const errorText = this.getErrorText();
    
    try {
      // Expo Clipboard 사용
      await Clipboard.setStringAsync(errorText);
      
      // 콘솔에도 출력 (개발자 도구에서 확인 가능)
      console.log('=== ERROR TO COPY ===');
      console.log(errorText);
      console.log('===================');
      
      Alert.alert(
        '복사 완료',
        '에러 메시지가 클립보드에 복사되었습니다.\n\nPC에서 Ctrl+V로 붙여넣기 하세요.',
        [{ text: '확인' }]
      );
    } catch (error) {
      console.error('❌ Failed to copy to clipboard:', error);
      // 복사 실패 시 콘솔에 출력
      console.log('=== ERROR TO COPY (Copy failed, see below) ===');
      console.log(errorText);
      console.log('===================');
      Alert.alert(
        '복사 실패',
        '클립보드 복사에 실패했습니다.\n\n터미널에서 에러 메시지를 확인하세요.',
        [{ text: '확인' }]
      );
    }
  };

  getErrorText = (): string => {
    const { error, errorInfo } = this.state;
    let errorText = '=== ERROR REPORT ===\n\n';
    
    if (error) {
      errorText += `Error Message: ${error.message}\n\n`;
      if (error.stack) {
        errorText += `Stack Trace:\n${error.stack}\n\n`;
      }
    }
    
    if (errorInfo?.componentStack) {
      errorText += `Component Stack:\n${errorInfo.componentStack}\n\n`;
    }
    
    // 로거 에러 추가
    try {
      const errorLogs = logger.getErrorLogs();
      if (errorLogs.length > 0) {
        errorText += `Error Logs:\n${JSON.stringify(errorLogs, null, 2)}\n\n`;
      }
    } catch (e) {
      // 로거 접근 실패 시 무시
    }
    
    errorText += `Timestamp: ${new Date().toISOString()}\n`;
    errorText += '===================\n';
    
    return errorText;
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🚨 에러 발생</Text>
            <Text style={styles.subtitle}>앱에서 예기치 않은 오류가 발생했습니다</Text>
          </View>

          <ScrollView style={styles.errorContainer}>
            {this.state.error && (
              <View style={styles.errorSection}>
                <Text style={styles.sectionTitle}>에러 메시지:</Text>
                <Text style={styles.errorText}>{this.state.error.message}</Text>
              </View>
            )}

            {this.state.error?.stack && (
              <View style={styles.errorSection}>
                <Text style={styles.sectionTitle}>스택 트레이스:</Text>
                <Text style={styles.stackText}>{this.state.error.stack}</Text>
              </View>
            )}

            {this.state.errorInfo?.componentStack && (
              <View style={styles.errorSection}>
                <Text style={styles.sectionTitle}>컴포넌트 스택:</Text>
                <Text style={styles.stackText}>{this.state.errorInfo.componentStack}</Text>
              </View>
            )}

            {__DEV__ && (
              <View style={styles.debugSection}>
                <Text style={styles.sectionTitle}>디버그 정보:</Text>
                <Text style={styles.debugText}>
                  로그 확인: global.__LOGGER__.getErrorLogs()
                </Text>
                <Text style={styles.debugText}>
                  모든 로그: global.__LOGGER__.getLogs()
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.copyButton]} onPress={this.handleCopyError}>
              <Text style={styles.buttonText}>📋 에러 복사</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={this.handleReset}>
              <Text style={styles.buttonText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f44336',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  errorContainer: {
    flex: 1,
    padding: 16,
  },
  errorSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    fontFamily: 'monospace',
  },
  stackText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  debugSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#1976d2',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#4caf50',
  },
  resetButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

