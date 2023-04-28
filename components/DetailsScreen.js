import * as React from 'react';
import { Text, View, TouchableOpacity,Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Map from './Map';
import HomeScreen from './HomeScreen';

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View>
 <View style={{ flexDirection: 'row', paddingTop: 20 }}>
        <Image 
        source={require("../assets/logo.png")}
        style={
         {
            marginLeft:30,
            marginRight:30,
            width:30,
            height:30
         }   
        }
        />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
    

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
           <Text>{label}</Text>
          </TouchableOpacity>
        );
      })}
      <Image
      source={require("../assets/icon.png")}
      style={{
        width:30,
        height:30
      }}
      />
    </View>
    
      <Map style={{
        marginLeft:100,
        width:100,height:100}}/>
    
    </View>
   
  );
}



function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function DetailsScreen() {
  return (

      <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
        <Tab.Screen name="Bus Tracking" component={HomeScreen} />
        <Tab.Screen name="Friends Location" component={SettingsScreen} />
        <Tab.Screen name="Traffic" component={ProfileScreen} />
      </Tab.Navigator>

  );
}
