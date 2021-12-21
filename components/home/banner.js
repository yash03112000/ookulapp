import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import axiosInstance from '../../axios/orgin';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const classes = StyleSheet.create({
	head: {
		height: 300,
		// width: width,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: '#00313F',
		padding: 10,
	},
	header: {
		fontSize: 40,
		color: 'white',
	},
	subtitle: {
		fontSize: 20,
		color: 'white',
		width: '80%',
		paddingTop: 20,
	},
});

export const Banner = () => {
	const [data, setData] = React.useState({});

	React.useEffect(async () => {
		const res = await axiosInstance.get('/home/header');
		// console.log(res.data);
		setData(res.data);
	}, []);
	return (
		<View style={classes.head}>
			<View>
				<Text style={classes.header}>{data.title}</Text>
			</View>
			<View>
				<Text style={classes.subtitle}>{data.subTilte}</Text>
			</View>
		</View>
	);
};
