import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import {KaKaoMapAPIkey} from '@env';

const KakaoMap = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kakao Maps</title>
      <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=${KaKaoMapAPIkey}"></script>
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

        var circle = new kakao.maps.Circle({
            center : new kakao.maps.LatLng(33.450701, 126.570667),
            radius: 50, 
            strokeWeight: 5,
            strokeColor: '#75B8FA',
            strokeOpacity: 1,
            strokeStyle: 'dashed', 
            fillColor: '#CFE7FF', 
            fillOpacity: 0.7 
        }); 

        circle.setMap(map);

        var linePath = [
            new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
            new kakao.maps.LatLng(33.452739313807456, 126.5709308145358),
            new kakao.maps.LatLng(33.45178067090639, 126.5726886938753) 
        ];

        var polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#FFAE00',
            strokeOpacity: 0.7,
            strokeStyle: 'solid' 
        });

        polyline.setMap(map);

        var sw = new kakao.maps.LatLng(33.448842, 126.570379),
            ne = new kakao.maps.LatLng(33.450026,  126.568556);

        var rectangleBounds = new kakao.maps.LatLngBounds(sw, ne);

        var rectangle = new kakao.maps.Rectangle({
            bounds: rectangleBounds,
            strokeWeight: 4,
            strokeColor: '#FF3DE5',
            strokeOpacity: 1,
            strokeStyle: 'shortdashdot',
            fillColor: '#FF8AEF',
            fillOpacity: 0.8 
        });

        rectangle.setMap(map);

        var polygonPath = [
            new kakao.maps.LatLng(33.45133510810506, 126.57159381623066),
            new kakao.maps.LatLng(33.44955812811862, 126.5713551811832),
            new kakao.maps.LatLng(33.449986291544086, 126.57263296172184),
            new kakao.maps.LatLng(33.450682513554554, 126.57321034054742),
            new kakao.maps.LatLng(33.451346760004206, 126.57235740081413) 
        ];

        var polygon = new kakao.maps.Polygon({
            path:polygonPath,
            strokeWeight: 3,
            strokeColor: '#39DE2A',
            strokeOpacity: 0.8,
            strokeStyle: 'longdash',
            fillColor: '#A2FF99',
            fillOpacity: 0.7 
        });

        polygon.setMap(map);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
              style={{ flex: 1 }}   
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default KakaoMap;
