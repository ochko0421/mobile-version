import { View } from "react-native";
import MapView from "react-native-maps"


export default function Map(){

    const center = {
        latitude: 47.90771,
        longitude: 106.88324,
        latitudeDelta:0.05,
        longitudeDelta:0.05
      };

    return <View>
        <MapView
        style={{
            width:"100%",
            height:300
        }}
        initialRegion={center}
        
        >
            </MapView>
    </View>
}