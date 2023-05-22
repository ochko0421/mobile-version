import { useState } from "react"
import { View, Text, TextInput } from "react-native"
import * as DocumentPicker from 'expo-document-picker';
import { Pressable } from "react-native";

export default function Signup() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [image, setImage] = useState("")
    const handleFileSelection = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });

            if (res.type === 'success') {
                const url = 'https://api.cloudinary.com/v1_1/dlwizyzqi/upload';
                const formData = new FormData();

                formData.append('file', {
                    uri: res.uri,
                    name: res.name,
                    type: 'image/jpeg', // Update the file type if necessary
                });

                formData.append('api_key', '796678243292196');
                formData.append('folder', 'project');
                formData.append('upload_preset', 'sdvojfor');

                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const data = await response.json();

                console.log(data.secure_url); // Handle the response from Cloudinary as needed

                setImage(data.secure_url);
            } else {
                console.log('File selection canceled');
            }
        } catch (error) {
            console.log('Error selecting file:', error);
        }
    };
    return <View>
        <Text>Name</Text>

        <Text>Email</Text>
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
        <Text>Confirm password</Text>

        <TextInput
            style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
                marginBottom: 10
            }}
            secureTextEntry
            value={password2}
            onChangeText={setPassword2}
            placeholder="••••••••"
            autoCapitalize="none"
            autoCompleteType="password"
            autoCorrect={false}
            required
            placeholderTextColor="gray"
        />
        <Pressable onPress={handleFileSelection}>
            <Text>
                Select Image
            </Text>
        </Pressable>
    </View>
}