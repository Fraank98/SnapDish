import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Pressable } from 'react-native';

import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(false);
  const [camera, setCamera] = useState(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [activateFlash, setActivateFlash] = useState(false);
  const type = Camera.Constants.Type.back;
  const flashIcon = useRef(null)
  const initialflashText = {
    text: 'Off',
    style: {
      color: 'white',
    },
    iconColor: {
      color:'white',
    }
  }
  const [flashText, setFlashText] = useState(initialflashText)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (activateFlash) {
      setFlash(Camera.Constants.FlashMode.torch);
      console.log("sono nell' IF")
    }
    if (!camera) return;
    const photo = await camera.takePictureAsync(null);
    setImageUri(photo.uri);
    setFlash(Camera.Constants.FlashMode.off);
    setFlashText(initialflashText)
    setActivateFlash(false)
  };

  const toggleFlash = () => {
    if (!activateFlash){
      setActivateFlash(true);
      setFlashText({
        text: 'On',
        style: {
          color: 'yellow',
        },
        iconColor: {
          color:'yellow',
        }
      })
    }
    else {
      setActivateFlash(false)
      setFlashText(initialflashText)
    }
  };

  const closeButton = () => {
    setImageUri(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!imageUri && 
      <Camera flashMode={flash} style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          {!imageUri && <TouchableOpacity
            style={styles.snapButton}
            onPress={takePicture}>
            <Ionicons name="camera" size={60} color="red"/>
          </TouchableOpacity> 
          }
        </View>
        <Pressable onPress={toggleFlash} style={styles.flashButton}>
          <Ionicons name="flash" size={40} ref={flashIcon} style={flashText.iconColor} />
          <Text style={[flashText.style, styles.flashText]}>{flashText.text}</Text>
        </Pressable>
      </Camera>}
      {!!imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      {!!imageUri &&
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.closeButton} onPress={closeButton}>
            <Ionicons name="arrow-back-circle" size={60} color="red"/>
            {/* <Text style={styles.backTest}>back</Text> */}
          </TouchableOpacity>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    // flex: 1,
    height: '100%', 
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  snapButton: {
    position: 'absolute',
    bottom: 60,
  },

  flashButton: {
    position: 'absolute',
    top: 50,
    right: 15,
  },

  flashText: {
    fontSize: 10,
    position: 'absolute',
    marginTop : 40,
    marginLeft : 20,
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

  closeButton: {
    position: 'absolute',
    bottom: 60,
    paddingRight: 5,
    paddingLeft: 5
  },

  preview: {
    height: '100%', 
  },

  backTest: {
    position: 'absolute',
    marginTop: 60,
    marginLeft: 14,
    color: 'red',
    fontSize: 18,
  }

});