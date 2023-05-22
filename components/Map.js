import React, { useState, useEffect } from "react";
import MapView, { DirectionRenderer } from "react-native-maps"
import { View, Alert, Modal, StyleSheet, Text, Pressable, TextInput, Button } from "react-native";
import axios from "axios";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from "@env"
import MapViewDirections from 'react-native-maps-directions';
import * as turf from '@turf/turf';
import { Graph } from "graphlib"
const { point, distance } = turf;
export default function Map({ traffic, style, activeTab }) {
    const [busRoutesData, setBusRoutesData] = useState(null)
    const [busStopsData, setBusStopsData] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [origin, setOrigin] = useState(null)
    const [destination, setDestination] = useState(null)
    const [directions, setDirections] = useState(null);

    const params = {
        origin: '47.91293096971795, 106.85225408526205',
        destination: '47.91580878760547, 106.90349504705897',
        waypoints: [
            '47.91420700307684, 106.8711302033715',
            '47.91461424113228, 106.88409234352166',
        ],
        travelMode: 'driving',
    };
    useEffect(() => {
        console.log("RUNNING");
        axios.get("http://192.168.1.146:9000/api/busroutes")
            .then((res) => setBusRoutesData(res.data.result))
            .catch((err) => console.log(err))
    }, [])
    useEffect(() => {
        axios
            .get("http://192.168.1.146:9000/api/busstops")
            .then((res) => setBusStopsData(res.data.result))
            .catch((err) => console.log(err))
    }, []);

    function findRoutes() {
        const walkingDistance = 0.5;
        const stopsWithinWalkingDistanceToStart = [];
        const stopsWithinWalkingDistanceToEnd = [];
        const uniqueStops = [];
        const graph = new Graph();
        if (destination == null && origin == null) {
            alert("Please input your destination")
            return;
        }

        busRoutesData.forEach((route) => {
            route.busStopDetails.forEach((stop) => {

                const stopPoint = point(stop.busStopCoord);
                const distFromOrigin = distance(point(origin), stopPoint, { units: 'kilometers' });
                const distFromDestination = distance(point(destination), stopPoint, { units: 'kilometers' });

                if (distFromOrigin <= walkingDistance) {
                    const key = stop.busStopName + JSON.stringify(stop.busStopCoord);
                    const index = uniqueStops.findIndex((item) => item.key === key);
                    if (index === -1) {
                        uniqueStops.push({ key, stop });
                        stopsWithinWalkingDistanceToStart.push(stop.busStopName);
                    }
                }

                if (distFromDestination <= walkingDistance) {
                    const key = stop.busStopName + JSON.stringify(stop.busStopCoord);
                    const index = uniqueStops.findIndex((item) => item.key === key);
                    if (index === -1) {
                        uniqueStops.push({ key, stop });
                        stopsWithinWalkingDistanceToEnd.push(stop.busStopName);
                    }
                }
            });
        });
        busRoutesData.forEach((route) => {
            const stops = route.busStopDetails.map((stop) => stop.busStopName);

            for (let i = 0; i < stops.length - 1; i++) {
                const from = stops[i];
                const to = stops[i + 1];
                graph.setEdge(from, to, route.busRouteId);
            }
        });
        const queue = [];
        const visited = new Set();
        stopsWithinWalkingDistanceToStart.forEach((startStop) => {
            queue.push([{ name: startStop, route: null }]);
        });
        const routes = [];
        while (queue.length > 0) {
            const path = queue.shift();
            const lastStop = path[path.length - 1];
            if (stopsWithinWalkingDistanceToEnd.includes(lastStop.name)) {
                routes.push(path);
                continue;
            }
            if (visited.has(lastStop.name)) {
                continue;
            }
            visited.add(graph.hasNode(lastStop.name) ? lastStop.name : null);

            if (graph.hasNode(lastStop.name)) {
                const neighbors = graph.successors(lastStop.name);
                neighbors?.forEach((neighbor) => {
                    const edge = graph.edge(lastStop.name, neighbor);
                    const route = { name: neighbor, route: edge };
                    queue.push([...path, route]);
                });
            }
        }
        const formattedRoutes = routes.map((route) => {
            const formattedPath = route.map((stop) => {
                const stopName = stop.name;
                const routeId = stop.route;

                return { stopName, routeId };
            });
            return formattedPath;
        });
        console.log(formattedRoutes[0]);
    }

    const center = {
        latitude: 47.90771,
        longitude: 106.88324,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
    };

    return <View style={{ position: "relative" }}>
        <MapView
            provider={"google"}
            style={style}
            initialRegion={center}
            showsTraffic={traffic}
            showsUserLocation={true}
        >
            {origin && destination && (<MapViewDirections
                origin={origin.toString()}
                destination={destination.toString()}
                apikey={GOOGLE_API_KEY}

                travelMode="driving"
                strokeWidth={6}
                strokeColor="red"
            />)}

        </MapView>

        <Modal

            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            {activeTab == "location" ?
                (<View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <GooglePlacesAutocomplete

                            placeholder="origin"
                            placeholderTextColor="ff0000"
                            onPress={(data, details) => {
                                const { place_id } = data;

                                axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_API_KEY}`)
                                    .then(response => {
                                        const { result } = response.data;
                                        const { geometry } = result;
                                        const { location } = geometry;
                                        const { lat, lng } = location;
                                        setOrigin([lat, lng])

                                        console.log('Latitude:', lat);
                                        console.log('Longitude:', lng);
                                    })
                                    .catch(error => {
                                        console.error('Error retrieving place details:', error);
                                    });
                            }}
                            query={{
                                key: GOOGLE_API_KEY,
                                language: 'en',
                            }}

                            styles={{

                                container: styles.autocompleteContainer2,
                                textInput: styles.inputStyle,
                                listView: styles.listViewStyle,
                                predefinedPlacesDescription: styles.predefinedPlacesDescription,

                            }}
                        />
                        <GooglePlacesAutocomplete
                            placeholder="destination"
                            onPress={(data, details) => {
                                const { place_id } = data;

                                axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_API_KEY}`)
                                    .then(response => {
                                        const { result } = response.data;
                                        const { geometry } = result;
                                        const { location } = geometry;
                                        const { lat, lng } = location;
                                        setDestination([lat, lng])

                                        console.log('Latitude:', lat);
                                        console.log('Longitude:', lng);
                                    })
                                    .catch(error => {
                                        console.error('Error retrieving place details:', error);
                                    });
                            }}
                            query={{
                                key: 'AIzaSyAhjl1X_pQkIAeTUWlWv4cKKUDqgyxDCQE',
                                language: 'en',
                            }}

                            styles={{
                                container: styles.autocompleteContainer,
                                textInput: styles.inputStyle,
                                listView: styles.listViewStyle,
                                predefinedPlacesDescription: styles.predefinedPlacesDescription,
                            }}
                        />

                        <Pressable style={{ position: "absolute", top: 200, backgroundColor: "white" }} onPress={() => findRoutes()}>
                            <Text>findRoutes</Text>
                        </Pressable>
                        <Pressable
                            style={
                                {
                                    position: "relative",
                                    marginTop: 100
                                }

                            }
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>) : (<View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Search Friends</Text>
                        <Pressable
                            style={
                                {
                                    position: "relative",
                                    marginTop: 100
                                }

                            }
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>)}
        </Modal>

        {/* <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable> */}

        {activeTab === 'location' && (
            <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Direction</Text>
            </Pressable>
        )}

        {activeTab === 'friends' && (
            <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Friends</Text>
            </Pressable>
        )}

        {/* {activeTab !== 'traffic' && (
            <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Other</Text>
            </Pressable>
        )} */}

    </View>
}

const styles = StyleSheet.create({
    textinput: {
        textAlign: "center",
        paddingTop: 1,
        width: 300,
        borderColor: "rgb(66, 168, 249)",
        borderStyle: 'solid',
        borderRadius: 20,
        borderWidth: 1,
        textColor: "black",

    },
    centeredView: {
        flex: 1,
        position: "relative"

    },
    modalView: {
        width: "50%",
        height: "30%",
        // margin: 20,
        backgroundColor: 'blue',
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
        left: 0


    },
    button: {
        position: "absolute",
        width: 200,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        top: 0,
        left: 0
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        flex: 1,
    },
    autocompleteContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    autocompleteContainer2: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    inputStyle: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingLeft: 16,
    },
    listViewStyle: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: "100%",
        position: "absolute",
        zIndex: 1,
        left: "100%"
    },
    predefinedPlacesDescription: {
        color: '#1faadb',
        width: "50%",
        zIndex: 1
    },
});