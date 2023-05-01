import { View } from "react-native";
import MapView from "react-native-maps"


export default function Map({traffic,style}){

    const center = {
        latitude: 47.90771,
        longitude: 106.88324,
        latitudeDelta:0.05,
        longitudeDelta:0.05
      };

    return <View>
        <MapView
        style={style}
        initialRegion={center}
        showsTraffic={traffic}
        >
            </MapView>
    </View>
}