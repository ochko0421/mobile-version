
import { StyleSheet, Text, View,Image, TouchableOpacity, Button } from 'react-native';
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {NavigationContainer} from "@react-navigation/native"

import DetailsScreen from "./components/DetailsScreen"

const Stack= createNativeStackNavigator()
function HomeScreen({navigation}){
  return <View style={styles.container}>
  <View>
  <Image 
    style={styles.stretch}
    source={require("./assets/logo.png")}
  />
  </View>
 <View>
 <Text style={styles.text}>SIMPLE TRANSIT</Text>
 </View>
  <View>
  <TouchableOpacity

  style={styles.button}
  onPress={()=>navigation.navigate("Details")}
  >
    <Text style={styles.buttontext}>Get started !</Text>
  </TouchableOpacity>
  </View>

</View>
}

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:100,
    marginBottom:100,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stretch: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',
  },
  button: {
    width:200,
    height:40,
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin:"auto",
    borderColor: "rgb(66, 168, 249)",
    borderStyle:'solid',
    borderRadius:20,
    borderWidth:1
  },
  buttontext:{
    paddingLeft:5,
    marginTop:5,
    fontSize:20,
    marginBottom:5,
    color:"rgb(66, 168, 249)"
  },
  text:{
    width:200,
    fontSize:23,
    color:"rgb(66, 168, 249)"
  }
});
