import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Divider } from "react-native-paper";
import * as Google from "expo-google-app-auth";
// import * as Facebook from "expo-facebook";
import { GOOGLE_CLIENT_ID } from "../config/devProduction";
import axiosInstance from "../axios/orgin";
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from "react-redux";
import { loginSuccessUpdate } from "../reducers/authSlice";
// import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession from 'expo-auth-session';
// import * as Google from 'expo-auth-session/providers/google';
// const useProxy = false;
// const redirectUri = AuthSession.makeRedirectUri({
//   useProxy,
// });
// WebBrowser.maybeCompleteAuthSession();
/**
 * @author
 * @function LoignGoogle
 **/
export const SignInScreen = (props) => {
  const dispatch = useDispatch();
  const tokenFromServer = (access_token) => {
    // console.log("hello form start of tokenfrom server", access_token);
    axiosInstance
      .post("/user/googlelogin/android", { access_token })
      .then(async (userDataFromBackEnd) => {
        const jwtUserToken = await SecureStore.setItemAsync(
          "token",
          userDataFromBackEnd.data.jwtToken
        );
        dispatch(loginSuccessUpdate());
        console.log(
          "userDataFromBackEnd.data.isUserInDB<<",
          userDataFromBackEnd.data.isUserInDB,
          userDataFromBackEnd.data.jwtToken
        );
        // console.log("jwt token received from backend", UserDataFromBackEnd.data);
      });
  };
  // const facebook = async () => {
  //   console.log("facebook button clicked");
  //   try {
  //     await Facebook.initializeAsync({
  //       appId: "560468131564472",
  //     });
  //     const { type, token, expirationDate, permissions, declinedPermissions } =
  //       await Facebook.logInWithReadPermissionsAsync({
  //         permissions: ["public_profile"],
  //       });
  //     if (type === "success") {
  //       // Get the user's name using Facebook's Graph API
  //       const response = await fetch(
  //         `https://graph.facebook.com/me?access_token=${token}`
  //       );
  //       Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
  //     } else {
  //       // type === 'cancel'
  //     }
  //   } catch ({ message }) {
  //     alert(`Facebook Login Error: ${message}`);
  //   }
  // };

  const google = async () => {
    try {
      console.log(GOOGLE_CLIENT_ID)
      const { type, accessToken, user } = await Google.logInAsync({
        // androidClientId: GOOGLE_CLIENT_ID,
        clientId: GOOGLE_CLIENT_ID
      });
      if (type === "success") {
        // console.log("AccessToken", type, accessToken, user);
        const token = await tokenFromServer(accessToken);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const google = async () => {
  //   try {
  //     console.log(GOOGLE_CLIENT_ID)
  //     const [request, response, promptAsync] = Google.useAuthRequest({
  //       expoClientId:
  //         GOOGLE_CLIENT_ID,
  //       // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
  //       androidClientId:
  //         GOOGLE_CLIENT_ID,
  //       webClientId:
  //         GOOGLE_CLIENT_ID,
  //     });
  //     // if (type === "success") {
  //     //   // console.log("AccessToken", type, accessToken, user);
  //     //   const token = await tokenFromServer(accessToken);
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.msg}>Welcome to OOkul</Text>
      <Text style={styles.header}>Select to Login</Text>
      <Divider />
      <View style={styles.btnbox}>
        {/* <Button
          mode="contained"
          style={styles.fb}
          icon="facebook"
          onPress={facebook}
        >
          SignIn with FaceBook
        </Button> */}
        <Button
          mode="contained"
          color="black"
          style={styles.google}
          icon="google"
          onPress={google}
        >
          SignIn with Google
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    marginTop: 100,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  msg: {
    color: "#0088cc",
    fontWeight: "bold",
    fontSize: 35,
    marginBottom: "20%",
  },
  header: {
    color: "black",
    fontWeight: "bold",
    fontSize: 10,
    // flex:1
  },
  fb: {
    backgroundColor: "#1A538A",
    width: 250,
    color: "white",
    marginBottom: 5,
  },
  google: {
    backgroundColor: "#3F7EE8",
    width: 250,
    color: "black",
  },
  submit: {
    backgroundColor: "#A436F1",
    width: 250,
    color: "black",
    marginTop: 20,
  },
  main: {
    // backgroundColor:'green',
    width: 250,
  },
  btnbox: {
    display: "flex",
    flexDirection: "column",
    margin: 5,
    // backgroundColor:'green',
    // flex:1
    // marginTop:20,
    // marginBottom:10
  },
});
