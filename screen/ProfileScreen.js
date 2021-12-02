import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Text, View, Button } from "react-native";
import * as SecureStore from 'expo-secure-store';

import { loginOutUpdate } from "../reducers/authSlice";
/**
 * @author
 * @function SettingsScreen
 **/
export const SettingsScreen = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    SecureStore.deleteItemAsync("token");
    dispatch(loginOutUpdate());
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SettingsScreen!</Text>
      <Button title="Sign out" onPress={logoutHandler} />
    </View>
  );
};
