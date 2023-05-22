import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TouchableOpacity, Image, Modal, Pressable, Dimensions, TouchableWithoutFeedback, TextInput, } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Location from 'expo-location';
import Friends from './Friends';
import HomeScreen from './Page1';
import Traffic from './Traffic';
import { useState, useEffect, useContext } from 'react';
import { locationContext } from './Context';
import axios from 'axios';
const windowWidth = Dimensions.get('window').width;
function MyTabBar({ state, descriptors, navigation, position }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { userLocation, setUserLocation } = useContext(locationContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loggedUser, setLoggedUser] = useState(null)

  const closeModal = () => {
    setModalVisible(false);
  }; useEffect(() => {
    // Request location permission
    requestLocationPermission();
  }, []);
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        console.log('Location permission granted');

        // Get current location
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      console.log('Current location:', latitude, longitude);
      setUserLocation([latitude, longitude])
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };
  useEffect(() => {
    if (loggedUser) {
      console.log('Logged user:', loggedUser);

    }
  }, [loggedUser]);

  useEffect(() => {
    checkLoginStatus();
  }, []);
  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('name');
      console.log("value", value);
      if (value !== null) {
        await setLoggedIn(true);
        console.log("loggedin", loggedIn);

        const emails = await AsyncStorage.getItem("email")
        const image = await AsyncStorage.getItem("image")
        await setLoggedUser({
          name: value,
          email: emails,
          image: image
        })
      }
    } catch (error) {
      console.log('Error retrieving login status:', error);
    }
  };
  async function handleLogin() {
    console.log("login ajilav");
    if (userLocation.length > 0) {
      try {
        const response = await axios.post("http://192.168.1.146:9000/api/user/login", {
          email: email,
          password: password,
          location: userLocation
        });
        if (response.data.status == true) {
          await setLoggedIn(true);
          await setUser(response.data.user)

          await AsyncStorage.setItem("name", response.data.user.name)
          await AsyncStorage.setItem("email", response.data.user.email)
          await AsyncStorage.setItem("image", response.data.user.image)
          await AsyncStorage.setItem("id", response.data.user._id)
          await setModalVisible(false)
        }
        console.log(response.data);
      } catch (error) {
        console.log("An error occurred:", error);
      }
    }
  }
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await setLoggedIn(false);
      await console.log("Logged out");
      await setModalVisible(false);
      await setLoggedUser(null)
    } catch (error) {
      console.log('Error removing login status:', error);
    }
  };
  return (

    <View style={{ flexDirection: "row", height: "10%", paddingLeft: 0, paddingTop: 5, backgroundColor: "white" }}>
      <View style={{ flex: 1, flexDirection: "row", width: windowWidth, paddingTop: 0, marginBottom: 0, alignItems: "center", justifyContent: "space-between" }}>
        <View style={{}} >
          <Image
            source={require("../assets/logo.png")}
            style={
              {
                width: 30,
                height: 30,
                position: "relative"
              }
            }
          />
        </View>


        <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between", width: "50%" }}>
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
              <View style={{ backgroundColor: isFocused ? 'blue' : 'transparent', padding: 10, }} key={index}>
                <TouchableOpacity

                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}

                >
                  <Text style={{ color: isFocused ? "white" : "black" }}>{label}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={{ flex: 0 }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {!loggedIn ? (<Image
              source={require("../assets/icon.png")}
              style={{
                width: 30,
                height: 30
              }}

            />) : (
              loggedUser && <Image
                source={{ uri: loggedUser.image }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20
                }}

              />
            )}

          </TouchableOpacity>


        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}

          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(false)
          }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)} >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View
                  style={{
                    width: "50%",
                    height: "50%",
                    // margin: 20,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 35,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    position: "absolute",
                    top: 100,
                    right: 0,
                    zIndex: 10
                  }}>


                  {loggedIn ? (<View>
                    {loggedUser && <View>

                      <Text>{loggedUser.name}</Text>
                      <Text>{loggedUser.email}</Text></View>}
                    <TouchableOpacity onPress={() => handleLogout()}>
                      <Text>Logout</Text>
                    </TouchableOpacity>
                  </View>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <Text>Your email</Text>

                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          padding: 10,
                          marginBottom: 10
                        }}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@company.com"
                        placeholderTextColor="gray"
                        autoCapitalize="none"
                        autoCompleteType="email"
                        autoCorrect={false}
                        required
                      />



                      <Text>Your password</Text>

                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: 'gray',
                          padding: 10,
                          marginBottom: 10
                        }}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        autoCapitalize="none"
                        autoCompleteType="password"
                        autoCorrect={false}
                        required
                        placeholderTextColor="gray"
                      />

                      <TouchableOpacity onPress={() => handleLogin()}>
                        <Text>Login</Text>
                      </TouchableOpacity>
                    </View>
                  )}



                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

        </Modal>

      </View>


    </View >


  );
}







const Tab = createMaterialTopTabNavigator();

export default function DetailsScreen() {



  return (

    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen name="Location">
        {(props) => <HomeScreen {...props} activeTab="Location" />}
      </Tab.Screen>
      <Tab.Screen name="Friend">
        {(props) => <Friends {...props} activeTab="Friend" />}
      </Tab.Screen>
      <Tab.Screen name="Traffic">
        {(props) => <Traffic {...props} activeTab="Traffic" />}
      </Tab.Screen>
    </Tab.Navigator>

  );
}
