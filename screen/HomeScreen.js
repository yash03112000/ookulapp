import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	View,
	StyleSheet,
	Text,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import { getCourseList } from '../axios/learnpress';
import axiosInstance from '../axios/orgin';

import { Banner } from '../components/home/banner';
import CourseCard from '../components/home/courseCard';
import * as SecureStore from 'expo-secure-store';
// import { isCourseEnrolled } from '../axios/learnpress';
import LessonVideoPlayer from '../components/lessonVideoPlayer';
import { useIsFocused } from '@react-navigation/native';

export const HomeScreen = ({ item: data, navigation }) => {
	const [courses, setCourses] = useState([]);
	const [load, setLoad] = useState(true);
	const [cart, setCart] = useState([]);
	const [token, setToken] = useState('');
	const pageScreen = 'CourseDetails';
	const isFocused = useIsFocused();
	// console.log("navigation", navigation);

	useEffect(() => {
		if (isFocused) initial();
	}, [isFocused]);

	const initial = async () => {
		setLoad(true);
		const listOfCourses = await getCourseList();
		const jwtUserToken = await SecureStore.getItemAsync('token');
		var cart0 = await SecureStore.getItemAsync('cart');
		// console.log(cart);
		cart0 = await JSON.parse(cart0);
		setCart(cart0);
		setToken(jwtUserToken);
		// console.log(listOfCourses, listOfCourses);
		if (listOfCourses) {
			setCourses(listOfCourses);
			// setStatus(true);
			setLoad(false);
		} else {
			// setStatus(false);
			setLoad(false);
		}
	};

	return (
		<ScrollView style={classes.main}>
			<Banner />
			<View style={classes.heading}>
				<Text style={classes.headtext}>Out Top Courses</Text>
				{load ? (
					<View style={[classes.container, classes.horizontal]}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				) : (
					<View>
						<FlatList
							style={{ paddingBottom: 25, paddingTop: 5 }}
							horizontal
							// showsVerticalScrollIndicator
							data={courses}
							keyExtractor={(item) => item.ID.toString()}
							renderItem={({ item }) => (
								<View>
									{item.wpCourseMeta._lp_sale_price.toString() !== '0' && (
										<CourseCard
											{...{ item, navigation, pageScreen, cart, token }}
										/>
									)}
								</View>
							)}
						/>
					</View>
				)}
			</View>

			<View style={classes.heading}>
				<Text style={classes.headtext}>Free Courses</Text>
				{load ? (
					<View style={[classes.container, classes.horizontal]}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				) : (
					<View>
						<FlatList
							style={{ paddingBottom: 25, paddingTop: 5 }}
							horizontal
							// showsVerticalScrollIndicator
							data={courses}
							keyExtractor={(item) => item.ID.toString()}
							renderItem={({ item }) => (
								<View>
									{item.wpCourseMeta._lp_sale_price.toString() === '0' && (
										<CourseCard
											{...{ item, navigation, pageScreen, cart, token }}
										/>
									)}
								</View>
							)}
						/>
					</View>
				)}
			</View>

			<View style={classes.heading}>
				<Text style={classes.headtext}>Shantanu Sir's Courses</Text>
				{load ? (
					<View style={[classes.container, classes.horizontal]}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				) : (
					<View>
						<FlatList
							style={{ paddingBottom: 25, paddingTop: 5 }}
							horizontal
							// showsVerticalScrollIndicator
							data={courses}
							keyExtractor={(item) => item.ID.toString()}
							renderItem={({ item }) => (
								<View>
									{item.post_author.toString() === '789' &&
										item.wpCourseMeta._lp_sale_price.toString() !== '0' && (
											<CourseCard
												{...{ item, navigation, pageScreen, cart, token }}
											/>
										)}
								</View>
							)}
						/>
					</View>
				)}
			</View>
		</ScrollView>
	);
};

const classes = StyleSheet.create({
	main: {
		display: 'flex',
		flexDirection: 'column',
	},
	heading: {
		padding: 10,
		marginBottom: 10,
	},
	headtext: {
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 20,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10,
	},
});
