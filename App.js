import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Pressable } from 'react-native';
import { Camera } from 'expo-camera';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(false);
  const [camera, setCamera] = useState(null);
  const type = Camera.Constants.Type.back;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!camera) return
      const photo = await camera.takePictureAsync(null)
      setImageUri(photo.uri)
  }

  function closeButton() {
    setImageUri(false)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          {imageUri ? null : <TouchableOpacity
            style={styles.buttonSnap}
            onPress={takePicture}>
            <Text style={styles.text}> Snap </Text>
          </TouchableOpacity>
          }
        </View>
      </Camera>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
      {imageUri ? (
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.buttonClose} onPress={closeButton}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSnap: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: 'white'
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: 'red',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  buttonClose: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: 'white',
    paddingRight: 5,
    paddingLeft: 5
  },

  preview: {
    height: '100%', 
  },

});