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
import { Button, Portal, Dialog } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

/**
 * @author
 * @function CourseSingle
 **/
export const LessonView = ({
	status,
	lsn,
	lessonClickedHandler,
	courseTitle,
	courseId,
	allowed,
}) => {
	const width = Dimensions.get('window').width;

	const [load, setLoad] = useState(true);
	const [doStatus, setDoStatus] = useState(false);
	const [videoDownloadView, setVideoDownloadView] = React.useState(false);
	const videoQualities2 = ['SD', 'Low'];
	const [download, setDownload] = useState({
		quality: '',
		on: false,
	});
	const [progressValue, setProgressValue] = useState(0);
	const [totalSize, setTotalSize] = useState(0);

	useEffect(() => {
		checkquality();

		return () => {
			// console.log('vlear');
		};
	}, [lsn]);

	// console.log(allowed);

	function formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	async function downloadHandler(index) {
		// setButtonTitle('Downloading');
		console.log('Downloading');
		// console.log(lsn);

		let link = '';
		let local = '';
		if (lsn['type'] === 'video') {
			if (index === 0) {
				link = lsn['video_download_sd_l'];
			} else {
				link = lsn['video_download_sd_m'];
			}
			local = '.mp4';
			setDownload((prev) => ({
				...prev,
				['quality']: videoQualities2[index],
				['on']: true,
			}));
		} else {
			link = lsn['doc'];
			local = '.pdf';
			setDownload((prev) => ({
				...prev,
				['on']: true,
			}));
		}

		const callback = (downloadProgress) => {
			setTotalSize(formatBytes(downloadProgress.totalBytesExpectedToWrite));

			var progress =
				downloadProgress.totalBytesWritten /
				downloadProgress.totalBytesExpectedToWrite;
			progress = progress.toFixed(2) * 100;
			setProgressValue(progress.toFixed(0));
		};

		const downloadResumable = FileSystem.createDownloadResumable(
			link,
			FileSystem.documentDirectory + lsn.ID + local,
			{},
			callback
		);

		try {
			const { uri } = await downloadResumable.downloadAsync();
			console.log('Finished downloading to ', uri);
			setDownload((prev) => ({ ...prev, ['on']: false }));
			var downlist = await SecureStore.getItemAsync('downlist');
			downlist = JSON.parse(downlist);
			data = lsn;
			data['courseTitle'] = courseTitle;
			data['courseId'] = courseId;
			console.log(data);
			if (downlist) {
				if (downlist.filter((e) => e.ID === data.ID).length > 0) {
					console.log('Already In downlist');
				} else {
					// console.log(data);
					downlist.push(data);
					await SecureStore.setItemAsync('downlist', JSON.stringify(downlist));
				}
			} else {
				// console.log(data);
				downlist = [];
				downlist.push(data);
				await SecureStore.setItemAsync('downlist', JSON.stringify(downlist));
			}
			setVideoDownloadView(false);
			setDoStatus(true);

			// setButtonTitle('Downloaded');
		} catch (e) {
			console.error(e);
		}
	}
	const checkquality = async () => {
		try {
			let local = '';
			if (lsn['type'] === 'video') {
				local = '.mp4';
			} else {
				local = '.pdf';
			}
			const a = 'file:///data/user/0/com.ookulapp/files/' + lsn.ID + local;
			// console.log(a);
			const file = await FileSystem.getInfoAsync(a, {});
			// console.log(file.exists);
			if (file.exists) setDoStatus(true);
			else {
				setDoStatus(false);
			}
			setLoad(false);
		} catch (e) {
			console.log(e);
		}
	};

	return load ? (
		<View>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View style={status === lsn.ID ? styles.buttonPlaying : styles.button}>
			<TouchableOpacity
				style={{ flex: 8 }}
				key={lsn.ID}
				onPress={() => lessonClickedHandler(lsn)}
			>
				<View>
					<Text>
						{lsn.post_title}
						{' #'}
						{lsn.ID}
					</Text>
				</View>
			</TouchableOpacity>
			{allowed && (
				<View style={{ flex: 1 }}>
					{doStatus ? (
						<Button onPress={() => {}}>
							<Ionicons name="checkmark-circle" size={25} color={'black'} />
						</Button>
					) : (
						<View>
							{download.on ? (
								<Button
									onPress={() => {
										setVideoDownloadView(true);
									}}
								>
									<MaterialCommunityIcons
										name="progress-download"
										size={25}
										color={'black'}
									/>
								</Button>
							) : (
								<Button
									onPress={() => {
										lsn.type === 'video'
											? setVideoDownloadView(true)
											: downloadHandler(0);
									}}
								>
									<Ionicons name="download-outline" size={25} color={'black'} />
								</Button>
							)}
						</View>
					)}
				</View>
			)}

			<Portal style={styles.portalPos}>
				<Dialog
					visible={videoDownloadView}
					onDismiss={() => setVideoDownloadView(false)}
				>
					<View>
						<Button onPress={() => setVideoDownloadView(false)}>
							<Text>Close</Text>
						</Button>
					</View>
					{download.on ? (
						<>
							<Dialog.Title style={{}}>
								Downloading {download.quality}
							</Dialog.Title>
							<Dialog.Content>
								<View style={styles.buttons}>
									<Text> Size: {totalSize} </Text>
									<Text>Progress: {progressValue} %</Text>
								</View>
							</Dialog.Content>
						</>
					) : (
						<>
							<Dialog.Title style={{}}>Qualities</Dialog.Title>
							<Dialog.Content>
								<View style={styles.buttons}>
									{videoQualities2.map((Quality, qIndex) => (
										<View style={styles.speedButtonsList} key={Quality}>
											<Button
												mode="contained"
												onPress={() => {
													downloadHandler(qIndex);
												}}
											>
												{Quality}
											</Button>
										</View>
									))}
								</View>
							</Dialog.Content>
						</>
					)}
				</Dialog>
			</Portal>
		</View>
	);
};

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
	buttons: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		// backgroundColor: "blue",
		height: 100,
	},
	speedButtonsList: {
		margin: 5,
	},
	speedButtons: {
		display: 'flex',
		// margin:10
	},
	videoSettingView: {
		position: 'absolute',
		// backgroundColor: 'blue',
		alignSelf: 'flex-end',
		bottom: 30,
		display: 'flex',
		flexDirection: 'row',
	},
	portalPos: {
		// position: "absolute",
		// marginTop: 100,
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
});
