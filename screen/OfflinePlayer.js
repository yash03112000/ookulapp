import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { getLessonList, getSectionList } from '../axios/learnpress';
import axiosInstance from '../axios/orgin';
import LessonVideoPlayer from '../components/lessonVideoPlayer';
import { useSelector, useDispatch } from 'react-redux';
import PDFDisplay from '../components/PDFDisplay';

/**
 * @author
 * @function CourseSingle
 **/
export const OfflinePlayer = (props) => {
	var courseId = props.route.params.ID;
	var courseItitle = props.route.params.post_title || 'Course Title';
	var downloadQuality = '';
	// console.log(props.route.params);

	if (props.route.params.from == 'Downloads') {
		// console.log('ajeeeb');
		courseId = props.route.params.courseId;
		courseItitle = props.route.params.courseTitle || 'Course Title';
		downloadQuality = props.route.params.downloadQuality;
	} else {
		courseId = props.route.params.ID;
		courseItitle = props.route.params.post_title || 'Course Title';
	}

	const [loading, setloading] = useState(true);
	const [sections, setsections] = useState([]);
	const [lessonsOfSection, setlessonsOfSection] = useState({});
	const [lessonPlayingStatus, setlessonPlayingStatus] = useState({});
	const [activeUris, setactiveUris] = useState();
	const [lsndet, setlsndet] = useState({});
	const netStatus = useSelector((state) => state.auth.netStatus);

	useEffect(() => {
		initialRunFunction(courseId);
		return () => {
			cleanupFunction();
		};
	}, [courseId]);

	const initialRunFunction = async (courseId) => {
		console.log('Message from initialRunFunction');
		// const sectionsArray = await getSectionList(courseId);
		// setsections(sectionsArray);
		lessonClickedHandler(props.route.params);
	};

	const cleanupFunction = () => {
		setloading(true);
		console.log('Message from clianup Function');
	};

	const lessonClickedHandler = (lsn) => {
		const lsnID = lsn.ID;
		console.log('changing uris');
		setlsndet(lsn);
		setloading(false);
	};

	//   const { container } = styles;
	console.log(activeUris);
	return (
		<View style={styles.main}>
			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<View>
					{lsndet['type'] === 'video' ? (
						<LessonVideoPlayer
							uris={{
								uris: activeUris,
							}}
							lsndet={lsndet}
							courseTitle={courseItitle}
							courseId={courseId}
							downloadQuality={downloadQuality}
							pageScreen="OfflinePlayer"
						/>
					) : (
						<View
							style={{
								height: 300,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							{lsndet['doc'] !== '' ? (
								<PDFDisplay
									src={lsndet['doc']}
									lsndet={lsndet}
									courseTitle={courseItitle}
									courseId={courseId}
									pageScreen="OfflinePlayer"
								/>
							) : (
								<Text>Document will be added soon</Text>
							)}
						</View>
					)}

					<Text style={styles.courseTitle}>{courseItitle}</Text>
				</View>
			)}
		</View>
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
	},
	buttonPlaying: {
		// alignItems: "center",
		backgroundColor: '#AADDDD',
		padding: 10,
		textAlign: 'left',
		marginTop: 1,
		marginBottom: 1,
	},
});
