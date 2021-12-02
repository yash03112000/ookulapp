import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, List } from "react-native-paper";

/**
 * @author
 * @function CourseDetails
 **/
export const CourseAccess = ({ navigation }) => {
  const buyNowHandler = () => {
    navigation.navigate("Cart", { courseId: "courseId" });
  };

  return (
    <View>
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            margin: 2,
            fontSize: 25,
          }}
        >
          <Text style={{ fontSize: 25 }}>Price:</Text>
          <Text
            style={{
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
            }}
          >
            {"\u20B9"}
            200
          </Text>
          <Text style={{ fontSize: 25 }}>{"\u20B9"}100</Text>
        </View>
        <Button onPress={buyNowHandler} mode="contained" style={{ padding: 5 }}>
          BUY NOW
        </Button>
        {/* <View
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            margin: 2,
          }}
        > */}
        {/* <View>
            <Button
              style={{ borderColor: "#2596be", borderWidth: 2, margin: 2 }}
              mode="outlined"
              icon="cart"
            >
              ADD to CART
            </Button>
          </View> */}
        {/* <View>
            <Button
              style={{
                borderColor: "#2596be",
                borderWidth: 2,
                margin: 2,
              }}
              mode="outlined"
            >
              ADD to WISHLIST
            </Button>
          </View> */}
        {/* </View> */}
      </View>
    </View>
  );
};
