import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { BuyCart } from '../BuyCart';
import { Button } from 'react-native-paper';
import { isCourseEnrolled } from '../../axios/learnpress';

const { manifest } = Constants;

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const classes = StyleSheet.create({
	head: {
		// height: 400,
		width: 250,
		// backgroundColor: 'yellow',
		margin: 5,
		padding: 2,
		// boxShadow: '10px 10px 30px silver',
		elevation: 3,
		// shadowColor: 'black',
		borderColor: 'black',
	},
	imgdiv: {
		height: 150,
	},
	img: {
		height: '100%',
		width: '100%',
		resizeMode: 'center',
	},
	title: {
		fontSize: 15,
		color: 'black',
		fontWeight: 'bold',
		padding: 3,
	},
	subtitle: {
		fontSize: 10,
		color: 'black',
		fontWeight: 'normal',
		padding: 2,
	},
	condiv: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		// backgroundColor: 'blue',
		height: 150,
	},
	pricediv: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
});

export default function CourseCard({
	item: data,
	navigation,
	pageScreen,
	cart,
	token,
}) {
	// const router = useRouter();
	// console.log("data", data);

	const [loading, setLoading] = useState(true);
	// const [cart, setCart] = useState([]);
	const [enrolled, setEnrolled] = useState(false);

	// console.log(loading);

	useEffect(async () => {
		try {
			let flag = true;
			if (pageScreen !== 'CourseDetails') {
				if (flag) setLoading(false);
			} else {
				const isStudentEnrolled = await isCourseEnrolled(token, data.ID);
				if (flag) setEnrolled(isStudentEnrolled);
				if (flag) setLoading(false);
			}

			return () => {
				flag = false;
			};
		} catch (e) {
			console.log(e);
		}
	}, []);

	const enter = () => {
		console.log('start of single course screen', pageScreen);
		data['from'] = pageScreen;

		navigation.navigate('CourseDetails', data);
	};

	return (
		<>
			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<View>
					{pageScreen === 'CourseDetails' && (
						<View style={classes.head}>
							<TouchableHighlight
								style={classes.imgdiv}
								// onPress={() => router.replace(`/course/${data._id}`)}
								onPress={enter}
							>
								{data.mediaLink.wooGsLink == '' ? (
									<Image
										source={{
											uri: 'https://storage.googleapis.com/media.ookul.co/ookulco/2021/07/3557f685-course-featured-image-100x100.jpg',
										}}
										style={classes.img}
									/>
								) : (
									<Image
										source={{
											uri: data.mediaLink.originalLink,
										}}
										style={classes.img}
									/>
								)}
							</TouchableHighlight>
							<View style={classes.condiv}>
								<View>
									<Text style={classes.title}>{data.post_title}</Text>
								</View>
								<View
									style={{
										borderBottomColor: 'gray',
										borderBottomWidth: 1,
									}}
								>
									<Text style={classes.subtitle}>{data.short_description}</Text>
								</View>
								<View>
									<Text style={{ color: 'gray', padding: 3 }}>
										{'Number of Lesson/Notes: ' + data.wpCourseMeta.count_items}
									</Text>
								</View>
								<View
									style={{
										borderBottomColor: 'gray',
										borderBottomWidth: 1,
									}}
								>
									<Text style={{ color: 'gray', padding: 3 }}>
										{'Students Enrolled: ' + data.wpCourseMeta._lp_students}
									</Text>
								</View>
							</View>
							<BuyCart {...{ navigation, data, enrolled, cart, pageScreen }} />
						</View>
					)}
					{(pageScreen === 'CourseSingle' || pageScreen == 'Cart') && (
						<View
							style={{
								height: 120,
								width,
								padding: 2,
								margin: 2,
								// backgroundColor: 'white',
								// elevation: 3,
							}}
						>
							<TouchableHighlight
								// onPress={() => router.replace(`/course/${data._id}`)}
								onPress={enter}
							>
								<View
									style={{
										height: '100%',
										width: width,
										display: 'flex',
										flexDirection: 'row',
									}}
								>
									<View style={{ width: 0.35 * width }}>
										{data.mediaLink.wooGsLink == '' ? (
											<Image
												source={{
													uri: 'https://storage.googleapis.com/media.ookul.co/ookulco/2021/07/3557f685-course-featured-image-100x100.jpg',
												}}
												style={classes.img}
											/>
										) : (
											<Image
												source={{
													uri: data.mediaLink.originalLink,
												}}
												style={classes.img}
											/>
										)}
									</View>

									<View style={classes.condiv}>
										<View>
											<Text style={classes.title}>{data.post_title}</Text>
										</View>
										<View
											style={{
												borderBottomColor: 'gray',
												borderBottomWidth: 1,
											}}
										>
											<Text style={classes.subtitle}>
												{data.short_description}
											</Text>
										</View>
									</View>
								</View>
							</TouchableHighlight>
						</View>
					)}
				</View>
			)}
		</>
	);
}
