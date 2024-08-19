import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const KakaoMapPathDrawer = () => {
  const webviewRef = useRef(null);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>카카오맵 드래그 경로 그리기</title>
      <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY"></script>
    </head>
    <body>
      <div id="map" style="width:100%;height:100%;"></div>
      <script>
        var mapContainer = document.getElementById('map'),
            mapOption = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };  

        var map = new kakao.maps.Map(mapContainer, mapOption); 
        var linePath = [];
        var polyline = new kakao.maps.Polyline({
            map: map,
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#FF0000',
            strokeOpacity: 0.7,
            strokeStyle: 'solid'
        });

        var drawing = false;

        kakao.maps.event.addListener(map, 'mousedown', function(mouseEvent) {        
            drawing = true;
            addLine(mouseEvent.latLng);
        });

        kakao.maps.event.addListener(map, 'mousemove', function(mouseEvent) {
            if (drawing) {
                addLine(mouseEvent.latLng);
            }
        });

        kakao.maps.event.addListener(map, 'mouseup', function(mouseEvent) {
            drawing = false;
        });

        function addLine(position) {
            linePath.push(position);
            polyline.setPath(linePath);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default KakaoMapPathDrawer;
