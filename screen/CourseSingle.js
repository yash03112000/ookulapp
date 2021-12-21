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
import { getLessonList, getSectionList } from '../axios/learnpress';
import axiosInstance from '../axios/orgin';
import LessonVideoPlayer from '../components/lessonVideoPlayer';
import { useSelector, useDispatch } from 'react-redux';
import PDFDisplay from '../components/PDFDisplay';
import { Button } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';
import { SectionView } from '../components/SectionView';

/**
 * @author
 * @function CourseSingle
 **/
export const CourseSingle = (props) => {
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
	// console.log(courseId);
	// console.log(courseItitle);
	//   const courseId = 26535;
	//   const courseItitle = "Course Title";

	const [loading, setloading] = useState(true);
	const [sections, setsections] = useState([]);
	const [lessonsOfSection, setlessonsOfSection] = useState({});
	const [lessonPlayingStatus, setlessonPlayingStatus] = useState('');
	const [activeUris, setactiveUris] = useState();
	const [lsndet, setlsndet] = useState({});
	const netStatus = useSelector((state) => state.auth.netStatus);

	useEffect(() => {
		initialRunFunction(courseId);
		return () => {
			cleanupFunction();
		};
	}, [courseId]);
	// console.log(activeUris);

	const initialRunFunction = async (courseId) => {
		console.log('Message from initialRunFunction');
		const sectionsArray = await getSectionList(courseId);
		setsections(sectionsArray);

		for (const [sIndex, section] of sectionsArray.entries()) {
			const lessonsArray = await getLessonList(section.section_id);
			// // console.log('lessonsArray', lessonsArray[0]);
			setlessonsOfSection((oldV) => ({
				...oldV,
				[section.section_id]: lessonsArray,
			}));

			console.log(sIndex);
			console.log(sectionsArray.length);
			console.log(!(props.route.params.from === 'Downloads'));

			if (sIndex === 0 && !(props.route.params.from == 'Downloads')) {
				console.log('runned');
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
			} else if (sIndex == sectionsArray.length - 1) {
				console.log('aa');
				if (props.route.params.from == 'Downloads') {
					lessonClickedHandler(props.route.params);
				}
				setloading(false);
			}
		}
	};

	const cleanupFunction = () => {
		setloading(true);
		console.log('Message from clianup Function');
	};

	const lessonClickedHandler = (lsn) => {
		const lsnID = lsn.ID;
		console.log('clicked');
		setlessonPlayingStatus(lsnID);
		console.log('changing uris');
		setlsndet(lsn);

		setactiveUris([
			lsn.video_hd || '',
			lsn.video_sd_h || '',
			lsn.video_sd_l || '',
			lsn.video_download_sd_m || '',
			lsn.video_download_sd_l || '',
			lsn.type || '',
			lsn.doc || '',
		]);
	};
	const width = Dimensions.get('window').width;

	//   const { container } = styles;
	// console.log(activeUris);
	return (
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
							downloadQuality={downloadQuality}
							pageScreen="CourseSingle"
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
									pageScreen="CourseSingle"
								/>
							) : (
								<Text>Document will be added soon</Text>
							)}
						</View>
					)}

					<Text style={styles.courseTitle}>{courseItitle}</Text>
				</View>
			)}
			{netStatus ? (
				<View style={styles.totalLessonContainer}>
					<ScrollView>
						<View>
							{loading ? (
								<ActivityIndicator size="large" color="#0000ff" />
							) : (
								<View style={styles.sectionContainer}>
									{0 ? (
										<View>
											<Text>dfghjk</Text>
										</View>
									) : (
										<View>
											{sections.map((sec) => (
												<View key={sec.section_id.toString()}>
													<Text style={styles.sectionTitle}>
														{' '}
														{sec.section_name}
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
															allowed={true}
														/>
													</View>
												</View>
											))}
										</View>
									)}
								</View>
							)}
						</View>
					</ScrollView>
				</View>
			) : (
				<>
					<Text>Feature Not Available in Offline Mode</Text>
				</>
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
		// flex: 5,
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
		// flex: 5,
	},
});
