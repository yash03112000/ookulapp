import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Portal, Dialog, Button } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';
import { DeviceMotion } from 'expo-sensors';
import { useIsFocused } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';

export default function LessonVideoPlayer(props) {
	const [activeVideoUri, setactiveVideoUri] = React.useState('');
	const [status, setStatus] = useState({});
	const [videoSettingView, setVideoSettingView] = React.useState(false);
	const [videoDownloadView, setVideoDownloadView] = React.useState(false);
	const [deviceOriantation, setDeviceOriantation] = React.useState();
	const [progressValue, setProgressValue] = useState(0);
	const [totalSize, setTotalSize] = useState(0);
	const [speedButtonColor, setspeedButtonColor] = React.useState([
		'gray',
		'gray',
		'',
		'gray',
		'gray',
		'gray',
		'gray',
		'gray',
	]);
	const [qualityButtonColor, setqualityButtonColor] = React.useState([
		'gray',
		'',
		'gray',
	]);
	const [download, setDownload] = useState({
		quality: '',
		on: false,
	});
	const [quality, setQuality] = useState(1);
	const [downloadstatus, setDownloadstatus] = useState({
		status1: false,
		status2: false,
	});

	const uris = props.uris.uris;
	const lsnid = props.lsnid;

	const video = useRef(null);
	// console.log(props);

	useEffect(() => {
		checkquality();
	}, [uris, quality]);
	useEffect(() => {
		checkdownload();
	}, [uris]);
	// console.log(uris[1])

	// console.log(activeVideoUri);

	const checkquality = async () => {
		const a =
			'file:///data/user/0/com.ookulapp/files/' +
			lsnid +
			'_' +
			videoQualities[quality] +
			'.mp4';
		// console.log(a);
		const file = await FileSystem.getInfoAsync(a, {});
		// console.log(file.exists);
		if (file.exists) setactiveVideoUri(a);
		else setactiveVideoUri(uris[1]);
		setDownload({ quality: '', on: false });
	};
	const checkdownload = async () => {
		const a =
			'file:///data/user/0/com.ookulapp/files/' +
			lsnid +
			'_' +
			videoQualities[1] +
			'.mp4';
		const b =
			'file:///data/user/0/com.ookulapp/files/' +
			lsnid +
			'_' +
			videoQualities[2] +
			'.mp4';
		// console.log(a);
		// console.log(a);
		const file = await FileSystem.getInfoAsync(a, {});
		const status1 = file.exists;
		const file2 = await FileSystem.getInfoAsync(b, {});
		const status2 = file2.exists;
		setDownloadstatus({ status1, status2 });
	};

	const checkFocused = useIsFocused();
	const orientationCalculation = (gamma, beta) => {
		let ABSOLUTE_GAMMA = Math.abs(gamma);
		let ABSOLUTE_BETA = Math.abs(beta);
		let isGammaNegative = Math.sign(gamma) == '-1';
		let orientation = 0;

		if (ABSOLUTE_GAMMA <= 0.04 && ABSOLUTE_BETA <= 0.24) {
			//Portrait mode, on a flat surface.
			orientation = 0;
		} else if (
			(ABSOLUTE_GAMMA <= 1.0 || ABSOLUTE_GAMMA >= 2.3) &&
			ABSOLUTE_BETA >= 0.5
		) {
			//General Portrait mode, accounting for forward and back tilt on the top of the phone.
			orientation = 0;
		} else {
			if (isGammaNegative) {
				//Landscape mode with the top of the phone to the left.
				orientation = -90;
			} else {
				//Landscape mode with the top of the phone to the right.
				orientation = 90;
			}
		}
		return orientation;
	};

	React.useEffect(async () => {
		if (!checkFocused) {
			video.current.pauseAsync();
		}
		const a = await DeviceMotion.isAvailableAsync();
		// console.log(a)
		function startListingOriantation() {
			DeviceMotion.addListener((motion1) => {
				// setDeviceOriantation(motion1.orientation);
				// console.log(motion1.orientation);
				if (motion1.rotation) {
					const orientation = orientationCalculation(
						Number(motion1.rotation.gamma).toFixed(2),
						Number(motion1.rotation.beta).toFixed(2)
					);
					console.log(orientation);
					setDeviceOriantation(orientation);
				}
			});
		}
		startListingOriantation();
		return function cleanup() {
			DeviceMotion.removeAllListeners();
			// console.log('reading stop at ', deviceOriantation, 'deg');
		};
	}, []);

	function formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	const videoSpeeds = [0.5, 0.7, 1, 1.2, 1.5, 1.7, 2, 2.5];
	const videoQualities = ['HD', 'SD', 'Low'];
	const videoQualities2 = ['SD', 'Low'];
	const iconcolor = 'white';
	const iconsize = 25;

	const screenChangeStatusHandler = (screendata) => {
		console.log(' screen', screendata.fullscreenUpdate);
		const screenState = screendata.fullscreenUpdate;
		if (screenState === Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT) {
			console.log('full Screen started');
		}
		if (screenState === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT) {
			console.log('full Screen done');
		}
		if (screenState === Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS) {
			console.log('full Screen exit-started');
		}
		if (screenState === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS) {
			console.log('full Screen exit-done');
		}
	};

	const changeQuality = async (qIndex) => {
		const videoPlayerStatus = await video.current.getStatusAsync();
		const videoTime = videoPlayerStatus.positionMillis;
		// setvideoCurrentPosition(videoPlayerStatus.positionMillis);

		console.log('video status positionMillis ', videoTime);
		setQuality(qIndex);

		// setactiveVideoUri(uris[qIndex]);
		if (qIndex === 0) {
			setqualityButtonColor(['', 'gray', 'gray']);
		} else if (qIndex === 1) {
			setqualityButtonColor(['gray', '', 'gray']);
		} else {
			setqualityButtonColor(['gray', 'gray', '']);
		}
		video.current.setPositionAsync(videoTime);
		video.current.playAsync();
		// console.log("<<<<<<<<<<<<<<<", activeVideoUri);
	};

	async function downloadVideo(index) {
		// setButtonTitle('Downloading');
		console.log('Downloading');
		console.log(lsnid);
		setDownload((prev) => ({
			...prev,
			['quality']: videoQualities2[index],
			['on']: true,
		}));

		const callback = (downloadProgress) => {
			setTotalSize(formatBytes(downloadProgress.totalBytesExpectedToWrite));

			var progress =
				downloadProgress.totalBytesWritten /
				downloadProgress.totalBytesExpectedToWrite;
			progress = progress.toFixed(2) * 100;
			setProgressValue(progress.toFixed(0));
		};

		const downloadResumable = FileSystem.createDownloadResumable(
			uris[2 + index],
			FileSystem.documentDirectory +
				lsnid +
				'_' +
				videoQualities2[index] +
				'.mp4',
			{},
			callback
		);

		try {
			const { uri } = await downloadResumable.downloadAsync();
			console.log('Finished downloading to ', uri);
			setDownload((prev) => ({ ...prev, ['on']: false }));
			setDownloadstatus((prev) => ({ ...prev, [`status${index + 1}`]: true }));

			// setButtonTitle('Downloaded');
		} catch (e) {
			console.error(e);
		}
	}

	const changeSpeedAndColorHandler = (bIndex, vs) => {
		video.current.playAsync();
		video.current.setRateAsync(vs, true);
		if (bIndex === 0) {
			setspeedButtonColor([
				'',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
			]);
		} else if (bIndex === 1) {
			setspeedButtonColor([
				'gray',
				'',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
			]);
		} else if (bIndex === 2) {
			setspeedButtonColor([
				'gray',
				'gray',
				'',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
			]);
		} else if (bIndex === 3) {
			setspeedButtonColor([
				'gray',
				'gray',
				'gray',
				'',
				'gray',
				'gray',
				'gray',
				'gray',
			]);
		} else if (bIndex === 4) {
			setspeedButtonColor([
				'gray',
				'gray',
				'gray',
				'gray',
				'',
				'gray',
				'gray',
				'gray',
			]);
		} else if (bIndex === 5) {
			setspeedButtonColor([
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'',
				'gray',
				'gray',
			]);
		} else if (bIndex === 6) {
			setspeedButtonColor([
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'',
				'gray',
			]);
		} else if (bIndex === 7) {
			setspeedButtonColor([
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'',
			]);
		} else {
			setspeedButtonColor([
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'gray',
				'',
			]);
		}
	};
	return (
		<View style={styles.container}>
			<Video
				ref={video}
				style={
					deviceOriantation === 0 ? styles.videoPotrate : styles.videoLandscape
				}
				source={{ uri: activeVideoUri }}
				useNativeControls
				resizeMode="contain"
				isLooping
				onPlaybackStatusUpdate={(status) => {
					setStatus(() => status);
				}}
				onFullscreenUpdate={(screendata) =>
					screenChangeStatusHandler(screendata)
				}
			/>

			<View style={styles.videoSettingView}>
				<Button
					onPress={() => {
						setVideoSettingView(true);
					}}
				>
					<Ionicons name="settings-outline" size={iconsize} color={iconcolor} />
				</Button>
				<Button
					onPress={() => {
						setVideoDownloadView(true);
					}}
				>
					<Ionicons name="download-outline" size={iconsize} color={iconcolor} />
				</Button>
			</View>

			<Portal style={styles.portalPos}>
				<Dialog
					visible={videoSettingView}
					onDismiss={() => setVideoSettingView(false)}
				>
					<View>
						<Button onPress={() => setVideoSettingView(false)}>
							<Text>Close</Text>
						</Button>
					</View>
					<Dialog.Title style={{ marginBottom: 0 }}>Speed</Dialog.Title>

					<Dialog.Content style={{ marginBottom: 0 }}>
						<View style={styles.buttons}>
							{videoSpeeds.map((vs, bIndex) => (
								<View style={styles.speedButtonsList} key={vs}>
									<Button
										title={vs.toString()}
										mode="contained"
										color={speedButtonColor[bIndex]}
										onPress={() => changeSpeedAndColorHandler(bIndex, vs)}
									>
										{vs}
									</Button>
								</View>
							))}
						</View>
					</Dialog.Content>

					<Dialog.Title style={{ marginBottom: 0 }}>Qualities</Dialog.Title>
					<Dialog.Content>
						<View style={styles.buttons}>
							{videoQualities.map((Quality, qIndex) => (
								<View style={styles.speedButtonsList} key={Quality}>
									<Button
										color={qualityButtonColor[qIndex]}
										title={Quality.toString()}
										mode="contained"
										onPress={() => {
											changeQuality(qIndex);
										}}
									>
										{Quality}
									</Button>
								</View>
							))}
						</View>
					</Dialog.Content>
				</Dialog>
			</Portal>

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
												color={
													downloadstatus[`status${qIndex + 1}`]
														? 'green'
														: 'red'
												}
												disabled={downloadstatus[`status${qIndex + 1}`]}
												title={Quality.toString()}
												mode="contained"
												onPress={() => {
													downloadVideo(qIndex);
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
}

const XX = Dimensions.get('window').width;
const YY = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		justifyContent: 'center',
		backgroundColor: 'black',
	},
	videoPotrate: {
		alignSelf: 'center',
		width: XX,
		height: 300,
		backgroundColor: 'red',
	},
	videoLandscape: {
		alignSelf: 'center',
		width: YY,
		height: 300,
		backgroundColor: 'green',
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
