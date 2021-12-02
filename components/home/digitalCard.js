import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


/**
* @author
* @function DigitalCard
**/
export const DigitalCard = (props) => {

const { container } = styles
 return(
  <View style={container}>
    <Text>DigitalCard</Text>
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