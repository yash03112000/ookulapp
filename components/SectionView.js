import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';

import { LessonView } from './LessonView';

export const SectionView = ({
	sectionId,
	lessonClickedHandler,
	courseTitle,
	courseId,
	lessonsOfSection,
	lessonPlayingStatus,
}) => {
	const listOfLesson = lessonsOfSection[sectionId];
	// const renders = React.useRef(0);

	// useEffect(() => {
	// 	console.log('runned');

	// 	return () => {
	// 		console.log('clear');
	// 	};
	// }, []);
	// console.log(lessonPlayingStatus);
	return listOfLesson.map((lsn) => (
		<View key={lsn.ID}>
			<LessonView
				lsn={lsn}
				lessonClickedHandler={lessonClickedHandler}
				courseTitle={courseTitle}
				courseId={courseId}
				status={lessonPlayingStatus}
			/>
			{/* <Text>{renders.current++}</Text>
				<Button onPress={() => lessonClickedHandler(lsn)}>Click Me</Button> */}
		</View>
	));
};

const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	main: {
		// display: "flex",
		flexDirection: 'column',
		marginTop: -25,
	},
	courseTitle: {
		fontSize: 20,
		backgroundColor: 'orange',
		height: 60,
	},
	totalLessonContainer: {
		height: height - 440,
	},
	lessonContainer: {
		// marginTop:5,
		marginBottom: 3,
	},
	sectionContainer: {
		// marginTop:5,
		marginBottom: 10,
	},
	sectionTitle: {
		backgroundColor: 'gray',
		padding: 5,
		fontSize: 15,
	},
	button: {
		// alignItems: "center",
		backgroundColor: '#DDDDDD',
		padding: 10,
		textAlign: 'left',
		marginTop: 1,
		marginBottom: 1,
		display: 'flex',
		flexDirection: 'row',
	},
	buttonPlaying: {
		// alignItems: "center",
		backgroundColor: '#AADDDD',
		padding: 10,
		textAlign: 'left',
		marginTop: 1,
		marginBottom: 1,
		display: 'flex',
		flexDirection: 'row',
	},
});
