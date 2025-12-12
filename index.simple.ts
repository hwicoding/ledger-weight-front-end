/**
 * 가장 단순한 진입점
 * 모든 복잡한 로직 제거
 */

console.log('=== INDEX.SIMPLE.TS: FILE LOADED ===');

import { registerRootComponent } from 'expo';
// 최종: 원래 App.tsx의 깨끗한 버전 (console 오버라이드 제거)
import App from './App.clean';
// 이전 작동 버전:
// import App from './App.absolute-minimal';
// import App from './App.simple';
// import App from './App.with-error-boundary';
// import App from './App.with-redux';
// import App from './App.with-navigation';

console.log('=== INDEX.SIMPLE.TS: IMPORTS LOADED ===');
console.log('=== INDEX.SIMPLE.TS: REGISTERING APP ===');

registerRootComponent(App);

console.log('=== INDEX.SIMPLE.TS: REGISTRATION COMPLETE ===');

