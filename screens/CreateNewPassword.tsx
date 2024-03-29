import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface CreateNewPassword_INTERFACE {
  route: any;
  navigation: any;
}

const CreateNewPassword = ({ route, navigation }: CreateNewPassword_INTERFACE) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error1, setError1] = useState<string>("");
  const [error2, setError2] = useState<string>("");
  let email: string = route.params.email;

  const errorChecker1 = (): void => {
    if (password === "") {
      setError1("Password cannot be empty");
    } else if (password.length < 6) {
      setError1("Password must be at least 6 characters");
    } else if (password != confirmPassword) {
      setError1("Password does not match");
      setError2("Password does not match");
    } else {
      setError1("");
    }
  };

  const errorChecker2 = (): void => {
    if (confirmPassword === "") {
      setError2("Password cannot be empty");
    } else if (confirmPassword.length < 6) {
      setError2("Password must be at least 6 characters");
    } else if (password != confirmPassword) {
      setError1("Password does not match");
      setError2("Password does not match");
    } else {
      setError2("");
    }
  };

  const Cryptography_Encrypt = (text: string): string => {
    const alpha: object = {
      a: 2073,
      b: 2076,
      c: 2079,
      d: 2082,
      e: 2085,
      f: 2088,
      g: 2091,
      h: 2094,
      i: 2097,
      j: 2100,
      k: 2103,
      l: 2106,
      m: 2109,
      n: 2112,
      o: 2115,
      p: 2118,
      q: 2121,
      r: 2124,
      s: 2127,
      t: 2130,
      u: 2133,
      v: 2136,
      w: 2139,
      x: 2142,
      y: 2145,
      z: 2148,
      " ": 2151,
      1: 234,
      2: 89,
      3: 45,
      4: 1095,
      5: 77,
      6: 12,
      7: 61,
      8: 55,
      9: 23,
      0: 22,
      "`": 1288,
      "~`": 226096,
      "!": 33,
      "@": 44,
      "#": 59,
      $: 66,
      "%": 7754,
      "^": 88,
      "&": 99,
      "*": 401,
      "(": 402,
      ")": 403,
      "-": 404,
      _: "405",
      "=": 406,
      "+": 407,
      "[": 408,
      "]": 409,
      "{": 410,
      "}": 411,
      "\\": 412,
      "|": 413,
      ";": 414,
      ":": 415,
      "'": 416,
      '"': 417,
      ",": 418,
      ".": 419,
      "/": 420,
      "?": 422,
      A: 630,
      B: 632,
      C: 634,
      D: 636,
      E: "638",
      F: 640,
      G: 642,
      H: 644,
      I: 646,
      J: 648,
      K: 650,
      L: 652,
      M: 654,
      N: 656,
      O: 658,
      P: 660,
      Q: 662,
      R: 664,
      S: 666,
      T: 668,
      U: 670,
      V: 672,
      W: 674,
      X: 676,
      Y: 678,
      Z: 680,
    };
  
    let encryptedTxt: string = "";
    let firstTime: boolean = true;
  
    const text_Arr: string[] = text.split("");
  
    text_Arr.forEach((e) => {
      if (firstTime) {
        encryptedTxt += alpha[e];
        firstTime = false;
      } else {
        encryptedTxt += " ";
        encryptedTxt += alpha[e];
      }
    });
  
    return encryptedTxt;
  };

  const SubmitBtnHandler = async (): Promise<void> => {
    errorChecker1();
    errorChecker2();

    if (error1 === "" && error2 === "" && password === confirmPassword) {
      const url: string = `https://ampplex-backened.herokuapp.com/CreateNewPassword/${email}/${Cryptography_Encrypt(confirmPassword)}/;';][][3543{]';[sidjg868567**-+~&=32057dfjgiodfgoidfo;ji><<><>][[+-`;

      await fetch(url)
        .then((response) => response.text())
        .then((data) => {
          if (data === "success") {
            alert("Password Changed");
            navigation.navigate("Login");
          } else {
            alert("Password not changed");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Title}>Create new password</Text>
      <View style={styles.InputPassword}>
        <TextInput
          placeholder={"Enter new password"}
          autoFocus={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.error1}>
        <Text style={styles.error}>{error1}</Text>
      </View>
      <View style={styles.InputConfirmPassword}>
        <TextInput
          placeholder={"Confirm password"}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.error2}>
        <Text style={styles.error}>{error2}</Text>
      </View>

      <TouchableOpacity
        style={styles.Button}
        onPress={() => SubmitBtnHandler()}
      >
        <Text style={styles.ButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  InputPassword: {
    width: "85%",
    height: 60,
    alignSelf: "center",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 20,
    elevation: 12,
    position: "absolute",
    top: Dimensions.get("window").height * 0.3,
  },
  InputConfirmPassword: {
    width: "85%",
    height: 60,
    alignSelf: "center",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 20,
    elevation: 12,
    position: "absolute",
    top: Dimensions.get("window").height * 0.3,
    marginTop: 113,
  },

  Title: {
    fontSize: 25,
    fontFamily: "sans-serif-medium",
    fontWeight: "bold",
    position: "absolute",
    top: Dimensions.get("window").height * 0.11,
    textAlign: "center",
  },
  Button: {
    width: "55%",
    height: 40,
    backgroundColor: "#C83DFC",
    borderRadius: 12,
    elevation: 12,
    position: "absolute",
    top: Dimensions.get("window").height * 0.6 + 25,
  },
  ButtonText: {
    alignSelf: "center",
    fontSize: 17,
    fontFamily: "sans-serif-medium",
    color: "white",
    fontWeight: "bold",
    padding: 5,
  },
  error: {
    color: "red",
    fontSize: 12.5,
    fontFamily: "sans-serif-medium",
    position: "absolute",
    top: Dimensions.get("window").height * 0.4,
    alignSelf: "center",
  },
  error1: {
    position: "absolute",
    top: 0,
  },
  error2: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.2 - 35,
  },
});
