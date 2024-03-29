import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Video } from "expo-av";
import EditProfile from "../components/EditProfile";
import Likes from "../components/Like";
import LongVideo from "./LongVideo";
import Likes4 from "../components/Like4";

interface IState {
  UserData: {
    ImgPath: string;
    Type: string;
    Post_ID: string;
    Caption: string;
    Timestamp: string;
  }[]
}

const Profile = ({ navigation, route }: any) => {
  const [posts, SetPosts] = useState<number>(0);
  const [response, setResponse] = useState<IState["UserData"]>([]);
  const [myProfilePic, setMyProfilePic] = useState<string | null>(null);
  const [profilePicLoading, setProfilePicLoading] = useState<boolean>(true);
  const [follower, setFollower] = useState<number>(0);
  const video = React.useRef(null);
  const [alreadyFollowed, setAlreadyFollowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditProfile, setShowEditProfile] = useState<boolean | null>(null);
  const [bio, setBio] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const userID: string = route.params.clickedUserID;
  const myUserId: string = route.params.myUserId;

  const wait = (timeout: number): Promise<unknown> => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback((): void => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    getProfilePicture();
    getUserInfo();
    getUserName();
    getFollowers();
    getPost();
    getMyPosts();
  }, []);

  const getUserName = async (): Promise<void> => {
    const url: string = `https://ampplex-backened.herokuapp.com/getUserNameFromUserID/${userID}/`;

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserName(data.UserName);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserInfo = async (): Promise<void> => {
    const url: string = `https://ampplex-backened.herokuapp.com/getUserData/${userID}`;
    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBio(data.Bio);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getFollowers = async (): Promise<void> => {
    const url: string = `http://ampplex-backened.herokuapp.com/GetFollower/${userID}/`;
    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setFollower(data.Followers);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const Check_Followed = async (): Promise<void> =>  {
    const url: string = `http://ampplex-backened.herokuapp.com/Check_Followed/${userID}/MyID/${myUserId}`;

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "success" && data.Already_Followed == "true") {
          setAlreadyFollowed(true);
        } else if (
          data.status === "success" &&
          data.Already_Followed == "false"
        ) {
          setAlreadyFollowed(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (userID != myUserId) {
    useEffect(() => {
      Check_Followed();
    }, []);
  } else {
    useEffect(() => {
      setShowEditProfile(true);
    }, []);
  }

  const IncreaseFollower = async (): Promise<void> => {
    const url: string = `http://ampplex-backened.herokuapp.com/Increament_Followers/${userID}/MyID/${myUserId}`;

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          getFollowers();
          Check_Followed();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const Unfollow = async (): Promise<void> => {
    const url: string = `http://ampplex-backened.herokuapp.com/Unfollow/${userID}/MyID/${myUserId}`;

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          getFollowers();
          Check_Followed();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getProfilePicture = async (): Promise<void> => {
    const url: string = `https://ampplex-backened.herokuapp.com/getProfilePicture/${userID}`;
    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMyProfilePic(data.profilePic);
        setProfilePicLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPost = async (): Promise<void> => {
    const url: string = `https://ampplex-backened.herokuapp.com/Count_Posts/${userID}`;

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        SetPosts(data.Posts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMyPosts = async (): Promise<void> => {
    const url: string = `https://ampplex-backened.herokuapp.com/getMyPosts/${userID}`;

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const CreateTimeStamp = (time_stamp: string): string => {
    let time_stamp_lst: string | string[] = time_stamp.split("|")[1];
    time_stamp_lst = time_stamp_lst.trim().split(" ");

    const month: string = time_stamp_lst[1];
    const date: number = parseInt(time_stamp_lst[2]);
    const year: number = parseInt(time_stamp_lst[3]);

    const current_year: number = new Date().getFullYear();
    const current_month: string = new Date().toDateString().split(" ")[1];
    const current_date: number = new Date().getDate();

    enum months {
      Jan,
      Feb,
      Mar,
      Apr,
      May,
      Jun,
      Jul,
      Aug,
      Sep,
      Oct,
      Nov,
      Dec,
    };

    if (current_year != year) {
      const yearDifference: number = current_year - year;

      return yearDifference > 1
        ? yearDifference + " years ago"
        : yearDifference + " year ago";
    } else if (current_month === month) {
      const dateDifference: number = current_date - date;

      return dateDifference > 1
        ? dateDifference + " days ago"
        : dateDifference + " day ago";
    } else if (current_month != month) {
      const monthDifference: number = new Date().getMonth() + 1 - (months[month] + 1);

      return monthDifference > 1
        ? monthDifference + " months ago"
        : monthDifference + " month ago";
    }
  };


  useEffect(() => {
    getProfilePicture();
    getMyPosts();
    getPost();
    getFollowers();
    getUserInfo();
    getUserName();
  }, []);

  return (
    <>
      <ScrollView
        style={{
          marginTop: 10,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.Profile}>
          <Text style={styles.UserName}>{userName}</Text>
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 20,
            }}
          >
            {myProfilePic !== null ? (
              <Image
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 90,
                  position: "absolute",
                  left: 20,
                  top: 70,
                }}
                source={{
                  uri: myProfilePic,
                }}
              />
            ) : (
              <Image
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 90,
                  position: "absolute",
                  left: 20,
                  top: 70,
                }}
                source={require("../assets/images/default_profile_picture.png")}
              />
            )}
            {profilePicLoading === true ? (
              <View
                style={{
                  marginLeft: 50,
                  position: "absolute",
                  top: 100,
                }}
              >
                <ActivityIndicator size="large" color="black" />
              </View>
            ) : (
              <View />
            )}
          </View>

          <View>
            <Text style={styles.PostsNumber}>{posts}</Text>
            <Text
              style={{
                position: "absolute",
                top: 70,
                fontSize: 15,
                fontFamily: "sans-serif-medium",
                left: -36,
              }}
            >
              Posts
            </Text>
          </View>
          <View>
            <Text style={styles.Followers}>{follower}</Text>
            <Text
              style={{
                position: "absolute",
                top: 70,
                fontSize: 15,
                fontFamily: "sans-serif-medium",
                alignSelf: "center",
                left: 50,
              }}
            >
              Followers
            </Text>
          </View>
          {alreadyFollowed == true ? (
            <TouchableOpacity
              style={styles.FollowBtn}
              onPress={() => {
                if (follower >= 1) {
                  setAlreadyFollowed(false);
                  Unfollow();
                }
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "white",
                  alignSelf: "center",
                }}
              >
                Unfollow
              </Text>
            </TouchableOpacity>
          ) : alreadyFollowed == false ? (
            <TouchableOpacity
              style={styles.FollowBtn}
              onPress={() => {
                setAlreadyFollowed(true);
                IncreaseFollower();
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  fontFamily: "sans-serif-medium",
                  color: "white",
                  alignSelf: "center",
                }}
              >
                Follow
              </Text>
            </TouchableOpacity>
          ) : showEditProfile ? (
            <EditProfile navigation={navigation} userID={userID} />
          ) : (
            <View />
          )}
          <View>
            <Text style={styles.bio}>{bio}</Text>
          </View>

          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                position: "absolute",
                top: 250,
                alignSelf: "center",
              }}
            >
              My Posts
            </Text>
          </View>
        </View>
        {loading ? (
          <View
            style={{
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <ActivityIndicator size="large" color="skyblue" />
          </View>
        ) : (
          response.map((element, index: number) => {
            return (
              <View style={styles.postView}>
                <View>
                  {/*Profile Picture*/}
                  <Image
                    style={styles.profilePicture}
                    source={{
                      uri: myProfilePic,
                    }}
                  />
                </View>
                <View style={styles.UserNameContainer}>
                  <Text style={{ fontSize: 19, fontWeight: "bold" }}>
                    {userName}
                  </Text>
                </View>
                {element.Type == "Image" ? (
                  <>
                    <Image
                      source={{
                        uri: element.ImgPath,
                      }}
                      style={styles.postImg}
                    />
                    <Likes
                      postID={element.Post_ID}
                      myUserId={myUserId}
                      pressedUserID={userID}
                    />
                  </>
                ) : (
                  <>
                    <LongVideo
                      imgPath={element.ImgPath}
                      caption={element.Caption}
                      postID={element.Post_ID}
                      userID={myUserId}
                      timestamp={element.Timestamp}
                      myUserId={myUserId}
                      navigation={navigation}
                      userName={userName}
                    />
                    <Likes4
                      postID={element.Post_ID}
                      myUserId={myUserId}
                      pressedUserID={userID}
                    />
                  </>
                )}
                <TouchableOpacity
                  style={{
                    marginLeft: 90,
                    marginTop: -47,
                  }}
                  onPress={() => {
                    let postID = element.Post_ID;
                    let myUserID = myUserId;
                    let clickedUserID = userID;

                    navigation.navigate("Comments", {
                      myUserID,
                      clickedUserID,
                      postID,
                    });
                  }}
                >
                  <Image
                    style={styles.comment}
                    source={require("../Images/comment-icon.png")}
                  />
                </TouchableOpacity>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      marginLeft: 20,
                      marginTop: 40,
                    }}
                  >
                    {element.Caption}
                  </Text>
                </View>
                <View>
                    <Text
                      key={index}
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        alignSelf: "flex-start",
                        marginLeft: 22,
                        marginTop: 10,
                        fontFamily: "sans-serif-medium",
                        color: "#828282",
                      }}
                    >
                      {CreateTimeStamp(element.Timestamp)}
                    </Text>
                  </View>
                <View
                  style={{
                    marginTop: 70,
                  }}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  Profile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 350,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 12,
  },
  Profile2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  UserName: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "sans-serif-medium",
    marginTop: -280,
    alignSelf: "center",
  },
  Profile_Picture: {
    width: 90,
    height: 90,
    borderRadius: 100,
    position: "absolute",
    left: 20,
    top: 50,
  },
  PostsNumber: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "sans-serif-medium",
    position: "absolute",
    top: 30,
    left: -25,
  },
  FollowBtn: {
    backgroundColor: "dodgerblue",
    width: 100,
    height: 30,
    borderRadius: 5,
    position: "absolute",
    bottom: 150,
    left: Dimensions.get("window").width / 2.1,
    alignSelf: "center",
  },
  Followers: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "sans-serif-medium",
    position: "absolute",
    left: 70,
    top: 30,
  },
  postImg: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height / 2,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 10,
    alignSelf: "center",
  },
  postView: {
    width: Dimensions.get("window").width,
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 30,
    marginTop: 30,
    elevation: 12,
  },
  video: {
    alignSelf: "center",
    width: 365,
    height: 490,
    borderRadius: 15,
  },
  profilePicture: {
    width: 43,
    height: 43,
    borderRadius: 50,
    marginTop: 10,
    marginLeft: 15,
  },
  UserNameContainer: {
    marginLeft: 80,
    position: "absolute",
    top: 20,
  },
  comment: {
    width: 27,
    height: 27,
  },
  bio: {
    fontFamily: "sans-serif-medium",
    fontSize: 14.5,
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 80,
    position: "absolute",
    top: 160,
    alignSelf: "center",
  },
});
