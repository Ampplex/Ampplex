import React, { useState, useEffect, createRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import Modal from "react-native-modal";
import ActionSheet from "react-native-actions-sheet";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const Push_User_Data_To_RealTime_DB = (
  imgPath,
  caption,
  timestamp,
  userID,
  type
) => {
  const Likes = 0; // Initial likes are 0

  // Generating unique postID

  if (userID === null || userID === undefined || userID === "") {
    alert("Some error occurred please restart the app");
  } else {
    const date = new Date();

    const postID =
      date.getMilliseconds() * date.getSeconds() +
      Math.floor(Math.random() * 1000 + 2) *
        Math.floor(Math.random() * 150000 + 100);

    firebase
      .database()
      .ref(`User/${userID}/Post/`)
      .push({
        imgPath,
        caption,
        timestamp,
        type,
        Likes,
        postID,
      })
      .then((res) => {
        console.log(`Success: ${res}`);
        sendNotification(userID, postID, caption, timestamp);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }
};

const sendNotification = async (myUserID, postID, caption, PostTime) => {
  const url = `https://ampplex-backened.herokuapp.com/Send_Push_notification/${myUserID}/${postID}/${caption}/${PostTime}`;

  await fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getWindowDimensionsWidth = () => {
  const dimensions = Dimensions.get("window").width;
  return dimensions;
};
const getWindowDimensionsHeight = () => {
  const dimensions = Dimensions.get("window").height;
  return dimensions;
};

require("firebase/firestore");
require("firebase/firebase-storage");

export default function AddPost({ navigation, route, userID }) {
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [postTxt, setPostTxt] = useState("");
  const [posted, setPosted] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(0);
  const [error, setError] = useState(false); // if true then user have not attached picture or video or not written caption
  const [clickedPost, setClickedPost] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const [autoFocus, setAutoFocus] = useState(true); // Change default focus to true
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTaskCompleteSheet, setShowTaskCompleteSheet] = useState(false);
  const actionSheetRef = createRef();

  setInterval(() => {
    if (showTaskCompleteSheet) {
      actionSheetRef.current?.setModalVisible();
      setTimeout(() => {
        setShowTaskCompleteSheet(false);
      }, 3000);
    }
  }, 3500);

  const SetImage = () => {
    try {
      setImage(route.params.image);
    } catch {
      console.log("No image selected!");
    }
  };

  const ErrorFlasher = (msg) => {
    showMessage({
      message: `Error: ${msg}`,
      type: "danger",
    });
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const sendPostToCloudServer = async () => {
    console.log("Posting...");
    setPosted(false);
    SetImage();
    if (image !== null) {
      setClickedPost(true);
      const URI = image;
      let filename = URI.substring(URI.lastIndexOf("/") + 1);
      const response = await fetch(URI);
      const blob = await response.blob();

      const childPath = `post/${userID}/${filename}`;
      console.log(`Child Path is : ${childPath}`);

      try {
        const uploadUri =
          Platform.OS === "ios" ? uri.replace("file://", "") : URI;
        const task = firebase.storage().ref().child(childPath).put(blob);

        task.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setIsModalVisible(true);
            setUploadStatus(progress);
            setAutoFocus(false);
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log("Upload is paused");
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            ErrorFlasher("Some error occured! :(");
          },
          () => {
            // Handle successful uploads on complete
            task.snapshot.ref.getDownloadURL().then((downloadURL) => {
              setIsModalVisible(false);

              console.log("File available at", downloadURL);
              Push_User_Data_To_RealTime_DB(
                downloadURL,
                postTxt,
                new Date().toLocaleTimeString() +
                  " | " +
                  new Date().toDateString(),
                userID,
                mediaType
              );
            });

            setShowTaskCompleteSheet(true);
            setPosted(true);
            setImage(null);
            setPostTxt(null);
            setAutoFocus(true);
          }
        );
      } catch (e) {
        console.log(e);
      }
    } else if (image === null || postTxt === "" || postTxt === null) {
      ErrorFlasher("Please type caption or attach media to your post");
      setError(true);
    } else {
      console.log(postTxt);
    }
  };

  const PostInput = () => {
    return (
      <>
        <StatusBar style="light" />
        <View style={styles.container}>
          <View style={styles.PostInputView}>
            <TextInput
              placeholder="What's on your mind?"
              onChangeText={(e) => setPostTxt(e)}
              maxLength={100}
              value={postTxt}
              autoFocus={autoFocus}
              style={styles.PostInputStyle}
            />
          </View>
        </View>

        <ActionSheet ref={actionSheetRef} bounceOnOpen={true}>
          <View style={styles.ActionSheetStyle}>
            {/* Post sent animation  */}
            <LottieView
              style={styles.task_completed}
              source={require("../assets/lottie/task-complete.json")}
              autoPlay
              loop={true}
            />
          </View>
        </ActionSheet>
        <FlashMessage position="bottom" />
      </>
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setMediaType("Image");
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
      videoQuality: 7,
    });

    console.log(result);

    if (!result.cancelled) {
      if (result.uri.substring(result.uri.lastIndexOf(".")) != ".mp4") {
        console.log("Please select a video");
      }
      setImage(result.uri);
      setMediaType("Video");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <PostInput />

        <TouchableOpacity
          style={styles.postBtnStyle}
          onPress={() => {
            sendPostToCloudServer();
          }}
        >
          <LinearGradient
            colors={["#E125FF", "#5CD5FF", "#fff"]}
            end={{ x: 2, y: 0.3 }}
            style={styles.LinearGradient}
          >
            <Text style={styles.postBtnTextStyle}>Post</Text>
          </LinearGradient>
        </TouchableOpacity>

        {image && (
          // Selected Image container
          <View
            style={{
              position: "absolute",
              top: Dimensions.get("window").height * 0.15,
            }}
          >
            <View style={styles.Imgcontainer} />

            <Image
              source={{ uri: image }}
              style={{
                width: getWindowDimensionsWidth() - 50,
                height: getWindowDimensionsWidth(),
                alignSelf: "center",
                marginTop: 45,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={styles.Cancel_btn_Position}
              onPress={() => setImage(null)}
            >
              <Image
                style={{
                  width: 40,
                  height: 40,
                }}
                source={require("../assets/images/cancel-icon.png")}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Add post button */}
        {/* Includes 
        1. Upload picture from camera
        2. Upload Picture from gallery
        3. Upload video from camera
         */}
        <ActionButton buttonColor="#7b68ee">
          <ActionButton.Item
            buttonColor="#fafafa"
            title="Camera"
            onPress={() => {
              navigation.navigate("TakePic", { navParent: "AddPost", userID });
            }}
          >
            <Icon name="camera-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#fafafa"
            title="Choose pictures"
            onPress={() => {
              pickImage();
            }}
          >
            <MaterialCommunityIcons
              name="video-outline"
              size={17}
              color={"grey"}
              style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#fafafa"
            title="Choose Video"
            onPress={() => {
              pickVideo();
            }}
          >
            <Icon name="md-images-outline" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        {posted === false && error === false ? (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
              }}
            ></Text>
          </View>
        ) : (
          <View />
        )}
        {/* clickedPost === true && isModalVisible */}
        {clickedPost === true ? (
          <Modal isVisible={isModalVisible}>
            <View
              style={{
                width: Dimensions.get("window").width / 1.5,
                height: Dimensions.get("window").height / 4,
                backgroundColor: "#fff",
                alignSelf: "center",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "sans-serif-medium",
                  fontSize: 20,
                  fontWeight: "bold",
                  position: "absolute",
                  top: 10,
                  color: "grey",
                }}
              >
                Uploading...
              </Text>
              <View
                style={{
                  position: "absolute",
                  top: 5,
                  right: "10%",
                  opacity: 0,
                }}
              >
                <ActivityIndicator size="large" color="skyblue" />
              </View>
              <View
                style={{
                  width: uploadStatus,
                  height: 5,
                  backgroundColor: "lightgreen",
                  borderRadius: 10,
                  marginBottom: 20,
                }}
              />
            </View>
          </Modal>
        ) : (
          <View />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  PostInputStyle: {
    fontSize: 20,
    fontWeight: "800",
    backgroundColor: "#EEEEEE",
    width: getWindowDimensionsWidth() - 50,
    height: getWindowDimensionsHeight() / 12,
    borderRadius: 50,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 20,
    shadowColor: "blue",
    shadowRadius: 20,
  },
  postBtnStyle: {
    width: 120,
    height: 30,
    borderRadius: 10,
    alignSelf: "center",
    position: "absolute",
    top: getWindowDimensionsHeight() * 0.8,
    paddingBottom: 5,
  },
  postBtnTextStyle: {
    alignSelf: "center",
    fontWeight: "bold",
    fontFamily: "sans-serif-medium",
    color: "white",
    fontSize: 18,
  },
  Imgcontainer: {
    width: getWindowDimensionsWidth() - 20,
    height: getWindowDimensionsWidth() + 32,
    marginTop: 45,
    borderRadius: 21,
    position: "absolute",
    alignSelf: "center",
    top: -22,
  },
  ActionSheetStyle: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  PostInputView: {
    position: "absolute",
    top: getWindowDimensionsHeight() * 0.1,
  },
  LinearGradient: {
    borderRadius: 40,
    width: 170,
    height: 40,
    elevation: 12,
    alignSelf: "center",
    justifyContent: "center",
    paddingBottom: 5,
  },
  Cancel_btn_Position: {
    position: "absolute",
    top: getWindowDimensionsHeight() * 0.09,
    right: getWindowDimensionsWidth() * 0.02,
  },
  actionButtonIcon: {
    width: 17,
    height: 17,
  },
});
