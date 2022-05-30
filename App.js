import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; 
import firebaseConfig from './firebase.js';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

firebase.initializeApp(firebaseConfig);

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
  const [uploading, setUploading] = useState(false)
  const [showUploading, setShowUploading] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (activateFlash) {
      setFlash(Camera.Constants.FlashMode.torch);
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

  const uploadButton = () => {
    uploadImage(imageUri);
  }
 
  const uploadImage = async (uri) => { 
    const response = await fetch (uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/" + "test");
    const snapshot = ref.put(blob);

    snapshot.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
         setUploading(true);
         setShowUploading(true)
      },
       (error) => {
         setUploading(false)
         console.log(error);
         blob.close()
         return
      },
       () => {
         snapshot.snapshot.ref.getDownloadURL().then((url)=>{
           setUploading(false)
           Alert.alert("Uploading Completed!");
           setTimeout(() => {
              setImageUri(false)
           }, 1800);
           blob.close();
           return url;
          });
        
        }
    );

    // if (uploading) {
    //   
    //     setUploading(false);
    //     setImageUri(false);
    //     console.log("Uploading");
    // }

}      


  return (
    <View style={styles.container}>
      {!imageUri && 
      <Camera flashMode={flash} style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          {!imageUri && 
          <TouchableOpacity
            style={styles.snapButton}
            onPress={takePicture}>
            <Ionicons name="radio-button-on-outline" size={80} color="white"/>
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
      <Pressable onPress={uploadButton} style={styles.uploadIcon}>
        <Ionicons name="cloud-upload" size={50} color="white"/>
      </Pressable>
      }
      {!!uploading && 
      <View style={styles.uploadingContainer}>
        <ActivityIndicator size="large" color="white" style={styles.uploading} animating={showUploading}/>
      </View>
      }
      {!!imageUri &&
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.closeButton} onPress={closeButton}>
          <Ionicons name="close-circle" size={60} color="red"/>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3 )',
    padding: 5,
    height: 60,
    width: 60,
    borderRadius: 55,
  },

  flashText: {
    fontSize: 9,
    position: 'absolute',
    marginTop : 40,
    marginLeft : 25,
  },

  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: 'red',
  },
  
  bottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    position: 'absolute',
    bottom: 60,
  },

  preview: {
    height: '100%', 
  },

  uploadIcon: { 
    position: 'absolute',
    top: 50,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3 )',
    padding: 5,
    height: 60,
    width: 60,
    borderRadius: 55,
  },

  uploadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },  

  uploading: {
    //position: 'absolute',
    bottom: 400,
  }

});