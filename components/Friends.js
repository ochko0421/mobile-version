import { View } from "react-native"
import Map from "./Map";
export default function Friends() {
    const traffic = false;
    const style = {
        width: "100%",
        height: 700
    }

    return (
        <View style={{
            flex: 1,
            flexDirection: "column"
        }}>
            <Map
                traffic={traffic}
                style={style}
                activeTab="friends"
            />

        </View>
    );
}