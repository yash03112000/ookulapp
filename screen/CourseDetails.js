import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import {
	getCourse,
	getLessonList,
	getSectionList,
	getStudentCourseList,
	isCourseEnrolled,
} from '../axios/learnpress';
import axiosInstance from '../axios/orgin';
import { CourseAccess } from '../components/CourseAccess';
import LessonVideoPlayer from '../components/lessonVideoPlayer';
import PDFDisplay from '../components/PDFDisplay';
import { SectionView } from '../components/SectionView';

/**
 * @author
 * @function CourseSingle
 **/
export const CourseDetails = (props) => {
	// console.log("props", props);
	const courseId = props.route.params.ID;
	const courseItitle = props.route.params.post_title || 'Course Title';
	//   const courseId = 26535;
	//   const courseItitle = "Course Title";

	const [loading, setloading] = useState(true);
	const [sections, setsections] = useState([]);
	const [lessonsOfSection, setlessonsOfSection] = useState({});
	const [lessonPlayingStatus, setlessonPlayingStatus] = useState('');
	const [activeUris, setactiveUris] = useState();
	const [courseAccessAlert, setcourseAccessAlert] = useState(false);
	const [boughtByUser, setboughtByUser] = useState(false);
	const [lsndet, setlsndet] = useState({});
	const [course, setCourse] = useState({});

	const lessonRef = useRef(null);

	useEffect(() => {
		initialRunFunction(courseId);
		return () => {
			cleanupFunction();
		};
	}, [courseId]);

	const initialRunFunction = async (courseId) => {
		// console.log("Message from initialRunFunction");

		try {
			const jwtUserToken = await SecureStore.getItemAsync('token');
			const isStudentEnrolled = await isCourseEnrolled(jwtUserToken, courseId);
			const course = await getCourse(courseId);
			// console.log(course);
			setboughtByUser(isStudentEnrolled);
			setCourse(course);

			// setcourseAccessAlert(isCourseEnrolled);

			console.log('isStudentEnrolled', isStudentEnrolled);

			const sectionsArray = await getSectionList(courseId);
			setsections(sectionsArray);
			for (const [sIndex, section] of sectionsArray.entries()) {
				//   console.log("section", section)activeUr;
				const lessonsArray = await getLessonList(section.section_id);
				//   console.log("lessonsArray", lessonsArray);
				setlessonsOfSection((oldV) => ({
					...oldV,
					[section.section_id]: lessonsArray,
				}));
				if (sIndex === 0) {
					console.log(sIndex);
					setlsndet(lessonsArray[0]);

					setactiveUris([
						lessonsArray[0].video_hd || '',
						lessonsArray[0].video_sd_h || '',
						lessonsArray[0].video_sd_l || '',
						lessonsArray[0].video_download_sd_m || '',
						lessonsArray[0].video_download_sd_l || '',
						lessonsArray[0].type || '',
						lessonsArray[0].doc || '',
					]);
					setlessonPlayingStatus(lessonsArray[0].ID);
				}
				if (sIndex === sectionsArray.length - 1) {
					console.log('umm');
					console.log(lessonsArray[0]);
					setloading(false);
				}
			}
		} catch (e) {
			console.log('ummm');
			console.log(e);
			// console.log(loading);
			// console.log(activeUris);
		}
	};
	// console.log(activeUris);
	// console.log(loading);
	console.log(lessonPlayingStatus);

	const cleanupFunction = () => {
		console.log('Message from clianup Function');
		setloading(true);
	};

	const lessonClickedHandler = (lsn) => {
		const lsnID = lsn.ID;
		console.log('clicked');
		if (boughtByUser) {
			setlessonPlayingStatus(lsnID);
			console.log('changing uris');
			setlsndet(lsn);

			console.log('boughtByUser', boughtByUser);
			setactiveUris([
				lsn.video_hd || '',
				lsn.video_sd_h || '',
				lsn.video_sd_l || '',
				lsn.video_download_sd_m || '',
				lsn.video_download_sd_l || '',
				lsn.type || '',
				lsn.doc || '',
			]);
		} else {
			setcourseAccessAlert(true);
		}
	};

	return (
		<ScrollView ref={lessonRef} style={styles.totalLessonContainer}>
			<View style={styles.main}>
				{loading ? (
					<ActivityIndicator size="large" color="#0000ff" />
				) : (
					<View>
						{activeUris[5] === 'video' ? (
							<LessonVideoPlayer
								uris={{
									uris: activeUris,
								}}
								lsndet={lsndet}
								courseTitle={courseItitle}
								courseId={courseId}
								pageScreen="CourseDetails"
							/>
						) : (
							<View
								style={{
									height: 300,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								{activeUris[6] !== '' ? (
									<PDFDisplay
										src={activeUris[6]}
										lsndet={lsndet}
										courseTitle={courseItitle}
										courseId={courseId}
										pageScreen="CourseDetails"
									/>
								) : (
									<Text>Document will be added soon</Text>
								)}
							</View>
						)}

						<Text style={styles.courseTitle}>{courseItitle}</Text>
					</View>
				)}
				<View>
					{loading ? (
						<ActivityIndicator size="large" color="#0000ff" />
					) : (
						<View style={styles.sectionContainer}>
							{!boughtByUser ? (
								<View>
									<CourseAccess {...{ navigation: props.navigation, course }} />
								</View>
							) : (
								<View></View>
							)}
							<View>
								{sections.map((sec) => (
									<View key={sec.section_id.toString()}>
										<Text style={styles.sectionTitle}>
											{' '}
											{sec.section_name} {' #'}
											{sec.section_id.toString()}
										</Text>
										<View>
											<SectionView
												sectionId={sec.section_id}
												lessonClickedHandler={lessonClickedHandler}
												key={sec.section_id}
												courseTitle={courseItitle}
												courseId={courseId}
												lessonsOfSection={lessonsOfSection}
												lessonPlayingStatus={lessonPlayingStatus}
											/>
										</View>
									</View>
								))}
							</View>
						</View>
					)}
				</View>
			</View>

			<Portal>
				<Dialog
					visible={courseAccessAlert}
					onDismiss={() => setcourseAccessAlert(false)}
				>
					<View>
						<Button onPress={() => setcourseAccessAlert(false)}>
							<Text>Close</Text>
						</Button>
					</View>
					<Dialog.Title>
						<Text>Please buy and enroll the course to watch this lesson</Text>
					</Dialog.Title>
					<Dialog.Content>
						<CourseAccess {...{ navigation: props.navigation, course }} />
					</Dialog.Content>
				</Dialog>
			</Portal>
		</ScrollView>
	);
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
