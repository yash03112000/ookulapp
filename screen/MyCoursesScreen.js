import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	View,
	StyleSheet,
	Text,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import { getCourseList, getStudentCourseList } from '../axios/learnpress';
import axiosInstance from '../axios/orgin';

import { Banner } from '../components/home/banner';
import CourseCard from '../components/home/courseCard';
import LessonVideoPlayer from '../components/lessonVideoPlayer';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export const MyCoursesScreen = ({ item: data, navigation }) => {
	const [courses, setCourses] = useState([]);
	const [load, setLoad] = useState(true);
	const pageScreen = 'CourseSingle';
	const reload = useSelector((state) => state.auth.reload);

	// const isFocused = useIsFocused();

	// console.log("navigation", navigation);

	useEffect(() => {
		initial();
	}, [reload]);

	function removeDuplicatesBy(keyFn, array) {
		var mySet = new Set();
		return array.filter(function (x) {
			var key = keyFn(x),
				isNew = !mySet.has(key);
			if (isNew) mySet.add(key);
			return isNew;
		});
	}

	const initial = async () => {
		setLoad(true);
		const jwtUserToken = await SecureStore.getItemAsync('token');
		// console.log("jwtUserToken", jwtUserToken);
		// const listOfCourses = await getCourseList(jwtUserToken);
		const listOfCourses = await getStudentCourseList(jwtUserToken);

		// console.log('listOfCourses', listOfCourses);

		if (listOfCourses) {
			// console.log(listOfCourses.length);
			// var a = [...new Set(listOfCourses)];
			var a = removeDuplicatesBy((x) => x.ID, listOfCourses);
			// console.log(a.length);
			setCourses(a);
			// setStatus(true);
			setLoad(false);
		} else {
			// setStatus(false);
			setLoad(false);
		}
	};

	return (
		<View style={classes.main}>
			{/* <Banner /> */}
			<View style={classes.heading}>
				<Text style={classes.headtext}>Courses</Text>
				{load ? (
					<View style={[classes.container, classes.horizontal]}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				) : (
					<View>
						<FlatList
							style={{ paddingBottom: 25, paddingTop: 5 }}
							// horizontal
							// showsVerticalScrollIndicator
							data={courses}
							keyExtractor={(item) => item.ID.toString()}
							renderItem={({ item }) => (
								<CourseCard {...{ item, navigation, pageScreen }} />
							)}
						/>
					</View>
				)}
			</View>
		</View>
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
