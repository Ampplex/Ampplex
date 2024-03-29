import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";

interface PropsInterface {
  userID: string;
  myUserID : string;
  commentID: string;
}

const Block_report = ({ userID, myUserID, commentID }: PropsInterface) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isReportModalVisible, setReportModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleModalClick = (): void => {
    setModalVisible(!isModalVisible);
  };

  const handleBlock = async (): Promise<void> => {
    const url: string = `https://ampplex-backened.herokuapp.com/BlockUser/${userID}/${myUserID}`;

    await fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        if (data === "success") {
          alert("User Blocked");
        }
      });
  };

  const handleReport = async (): Promise<void> => {
    const url = `https://ampplex-backened.herokuapp.com/ReportComment/${commentID}/${userID}/${myUserID}/${selectedCategory}`;

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message === "success") {
          alert(
            "We have sent your request to Ampplex team. Thank you for reporting!"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Some error occured. Please try again later.");
      });
  };

  return (
    <>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          top: 3,
        }}
        onPress={() => {
          handleModalClick();
        }}
      >
        <Image
          style={{
            width: 30,
            height: 30,
          }}
          source={require("../assets/images/more-icon.png")}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <Modal isVisible={isModalVisible}>
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "white",
              width: "80%",
              height: "27%",
              borderRadius: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleBlock();
                handleModalClick();
              }}
            >
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: "10%",
                  fontSize: 16,
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Block
              </Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "lightgrey",
                height: 1,
                width: "100%",
                marginTop: "6%",
              }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 35,
                right: Dimensions.get("window").width / 4,
              }}
              onPress={() => {
                setReportModalVisible(true);
              }}
            >
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: "22%",
                  fontSize: 16,
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                  right: Dimensions.get("window").width * 0.039,
                  alignSelf: "center",
                }}
              >
                Report
              </Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "lightgrey",
                height: 1,
                width: "100%",
                marginTop: 55,
              }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 20,
                right: Dimensions.get("window").width / 3.5,
              }}
              onPress={() => {
                handleModalClick();
              }}
            >
              <Text
                style={{
                  color: "skyblue",
                  textAlign: "center",
                  marginTop: "2.5%",
                  fontSize: 16,
                  fontWeight: "bold",
                  fontFamily: "sans-serif",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {isModalVisible ? (
          <Modal isVisible={isReportModalVisible}>
            <View style={styles.reportModalContainer}>
              <Text style={styles.reportCategoryTitle}>
                Report this comment for:
              </Text>
              <View style={styles.breakpointStyle} />
              <ScrollView>
                <TouchableOpacity
                  style={styles.Category1_Style}
                  onPress={() => {
                    setSelectedCategory("Unwanted commercial content or spam");
                    handleReport();
                    handleModalClick();
                    setReportModalVisible(false);
                  }}
                >
                  <Text style={styles.Category1_Text_Style}>
                    Unwanted commercial content or spam
                  </Text>
                </TouchableOpacity>
                <View style={styles.breakpointStyle} />
                <TouchableOpacity
                  style={styles.Category1_Style}
                  onPress={() => {
                    setSelectedCategory("Hate speech or graphic violence");
                    handleReport();
                    handleModalClick();
                    setReportModalVisible(false);
                  }}
                >
                  <Text style={styles.Category1_Text_Style}>
                    Hate speech or graphic violence
                  </Text>
                </TouchableOpacity>
                <View style={styles.breakpointStyle} />
                <TouchableOpacity
                  style={styles.Category1_Style}
                  onPress={() => {
                    setSelectedCategory("Harassment or bullying");
                    handleReport();
                    handleModalClick();
                    setReportModalVisible(false);
                  }}
                >
                  <Text style={styles.Category1_Text_Style}>
                    Harassment or bullying
                  </Text>
                </TouchableOpacity>
                <View style={styles.breakpointStyle} />
                <TouchableOpacity
                  style={styles.Category1_Style}
                  onPress={() => {
                    setSelectedCategory("Child abuse");
                    handleReport();
                    handleModalClick();
                    setReportModalVisible(false);
                  }}
                >
                  <Text style={styles.Category1_Text_Style}>Child abuse</Text>
                </TouchableOpacity>
                <View style={styles.breakpointStyle} />
                <TouchableOpacity
                  style={styles.Category1_Style}
                  onPress={() => {
                    handleModalClick();
                    setReportModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "sans-serif-medium",
                      fontWeight: "bold",
                      color: "skyblue",
                      marginBottom: 10,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>
        ) : null}
      </View>
    </>
  );
};

export default Block_report;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  reportModalContainer: {
    backgroundColor: "white",
    width: "90%",
    height: "45%",
    borderRadius: 20,
    alignSelf: "center",
  },
  reportCategoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "sans-serif-medium",
    alignSelf: "center",
    marginTop: "5%",
    color: "skyblue",
  },
  Category1_Style: {
    alignSelf: "center",
    marginTop: "5%",
  },
  Category1_Text_Style: {
    fontSize: 16,
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
    color: "red",
    alignSelf: "center",
  },
  breakpointStyle: {
    backgroundColor: "lightgrey",
    height: 1,
    marginTop: "5%",
  },
});
