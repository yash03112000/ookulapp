import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


/**
* @author
* @function CourseScreen
**/
export const CourseScreen = (props) => {

const { container } = styles
 return(
  <View style={container}>
    <Text>CourseScreen</Text>
  </View>
  )
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
  }
})