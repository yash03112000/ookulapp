import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, List } from "react-native-paper";

/**
 * @author
 * @function CourseDetails
 **/
export const Enroll = ({ navigation, ID, wpCourseMeta }) => {
  const buyNowHandler = () => {
    navigation.navigate("Cart", { courseId: "courseId" });
  };

  return (
    <View>
      <View>
        
      </View>
    </View>
  );
};
