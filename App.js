import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Modal, Image, Share } from 'react-native';

import { Camera } from 'expo-camera';

import { FontAwesome } from "@expo/vector-icons"


export default function App() {

  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted");
    })();
  }, []);

  if(hasPermission === null) {
    return <View/>
  }

  if(hasPermission === false) {
    return <Text>Acesso negado</Text>
  }

  async function takePicture() {
    if(camRef) {
      const data = await camRef.current.takePictureAsync()
      setCapturedPhoto(data.uri)
      setOpen(true)
    }
  }

  const onShare = async () => {
    const result = await Share.share({
      message: capturedPhoto
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={camRef}
      > 
        <View style={styles.contentButtons}>
          <TouchableOpacity 
            style={styles.buttonChangeCamera}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back 
                ? Camera.Constants.Type.front 
                : Camera.Constants.Type.back
              )
            }}
          >
            <FontAwesome name='exchange' size={23} color='white'/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonTakePicture}
            onPress={takePicture}
          >
            <FontAwesome name='camera' size={35} color='white'/>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
      <Modal
        animationType='slide'
        transparent={true}
        visible={open}
      >
        <View style={styles.contentModal}>
          <TouchableOpacity
            style={styles.closePhoto}
            onPress={() => {setOpen(false)}}
          >
            <FontAwesome name='close' size={30} color='white'/>
          </TouchableOpacity>
          <Image style={styles.photo} source={{ uri: capturedPhoto }}/>
          <TouchableOpacity
            style={styles.share}
            onPress={onShare}
          >
            <FontAwesome name='share' size={23} color='white'/>
          </TouchableOpacity>
        </View>
      </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: "100%",
    height: "100%"
  },
  contentButtons: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonChangeCamera: {
    position: "absolute",
    bottom: 50,
    left: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    height: 50,
    width: 50, 
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    opacity: "50%"
  },
  buttonTakePicture: {
    position: "absolute",
    bottom: 40,
    left: 130,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    height: 70,
    width: 70, 
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    opacity: "50%"
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",

  },
  closePhoto: {
    position: "absolute",
    top: 2,
    left: 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    height: 50,
    width: 50, 
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    opacity: "50%",
    zIndex: 2
  },
  photo: {
    width: "100%",
    height: "100%",
  }, 
  share: {
    position: "absolute",
    bottom: 2,
    right: 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    height: 50,
    width: 50, 
    borderRadius: 50,
    backgroundColor: "#1877F2",
    opacity: "50%",
    zIndex: 2,
  }
});
