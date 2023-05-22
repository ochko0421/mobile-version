import { View } from "react-native";
import Map from "./Map";
export default function Traffic() {
    const traffic = true;
    const style = {
        width: "100%",
        height: 700
    }
    return (
        <View style={{}}>
            <Map traffic={traffic}
                style={style}
                activeTab="traffic"
            />

        </View>
    );
}