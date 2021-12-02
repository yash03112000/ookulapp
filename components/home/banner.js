import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const classes = StyleSheet.create({
  head: {
    height: 300,
    // width: width,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#00313F",
    padding: 10,
  },
  header: {
    fontSize: 40,
    color: "white",
  },
  subtitle: {
    fontSize: 20,
    color: "white",
    width: "80%",
    paddingTop: 20,
  },
});

export const Banner = () => {
  return (
    <View style={classes.head}>
      <View>
        <Text style={classes.header}>Learn on your schedule</Text>
      </View>
      <View>
        <Text style={classes.subtitle}>
          Study any topic, anytime. Explore thousands of courses for the lowest
          price ever!
        </Text>
      </View>
    </View>
  );
};
