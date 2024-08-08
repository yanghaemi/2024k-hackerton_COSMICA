/**
 * @format
 */
import 'react-native-gesture-handler'; // 이 줄이 가장 먼저 위치해야 합니다.
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';


AppRegistry.registerComponent(appName, () => App);

