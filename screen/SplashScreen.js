import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

// import AsyncStorage from "@react-native-community/async-storage";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});
