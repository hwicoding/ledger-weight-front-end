/**
 * 가장 단순한 진입점
 * 모든 복잡한 로직 제거
 */

console.log('=== INDEX.TS: FILE LOADED ===');

import { registerRootComponent } from 'expo';
import App from './App';

console.log('=== INDEX.TS: IMPORTS LOADED ===');
console.log('=== INDEX.TS: REGISTERING APP ===');

registerRootComponent(App);

console.log('=== INDEX.TS: REGISTRATION COMPLETE ===');
