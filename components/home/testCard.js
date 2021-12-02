import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


/**
* @author
* @function TestCard
**/
export const TestCard = (props) => {

const { container } = styles
 return(
  <View style={container}>
    <Text>TestCard</Text>
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