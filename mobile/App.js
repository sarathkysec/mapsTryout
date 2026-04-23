import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// The bundled HTML from Vite single file
const webUri = require('./assets/web/index.html');

export default function App() {
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.webviewContainer}>
        {isWeb ? (
          <iframe 
            src={webUri} 
            style={{ flex: 1, border: 'none', width: '100%', height: '100%' }} 
            title="WebView"
          />
        ) : (
          <WebView 
            source={webUri}
            originWhitelist={['*']}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode="always"
            bounces={false}
            style={styles.webview}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 24 : 0, // Fallback for android status bar
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  }
});
