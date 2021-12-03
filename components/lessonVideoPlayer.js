import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Portal, Dialog, Button } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';
import { DeviceMotion } from 'expo-sensors';
import { useIsFocused } from '@react-navigation/native';

export default function LessonVideoPlayer(props) {
	const [activeVideoUri, setactiveVideoUri] = React.useState('');
	// const [videoCurrentPosition, setvideoCurrentPosition] = React.useState();
	// console.log("props.uris", props.uris);

	const uris = props.uris.uris;

	const video = useRef(null);

	useEffect(() => {
		// console.log("<<<<<<<<<<<<<<<", uris);
		setactiveVideoUri(uris[1]);
	}, [uris]);
	// console.log(uris[1])

	const [status, setStatus] = useState({});
	const [videoSettingView, setVideoSettingView] = React.useState(false);
	const [videoDownloadView, setVideoDownloadView] = React.useState(false);
	const [deviceOriantation, setDeviceOriantation] = React.useState();
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
	const checkFocused = useIsFocused();

	React.useEffect(async () => {
		if (!checkFocused) {
			video.current.pauseAsync();
		}
		const a = await DeviceMotion.isAvailableAsync();
		// console.log(a)
		function startListingOriantation() {
			DeviceMotion.addListener((motion1) => {
				setDeviceOriantation(motion1.orientation);
				// console.log(motion1.orientation);
			});
		}
		startListingOriantation();
		return function cleanup() {
			DeviceMotion.removeAllListeners();
			// console.log("reading stop at ", deviceOriantation, "deg");
		};
	});

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

		setactiveVideoUri(uris[qIndex]);
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
	const downloadVideo = async (qIndex) => {
		const videoPlayerStatus = await video.current.getStatusAsync();
		const videoTime = videoPlayerStatus.positionMillis;
		// setvideoCurrentPosition(videoPlayerStatus.positionMillis);

		console.log('video status positionMillis ', videoTime);

		setactiveVideoUri(uris[qIndex]);
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
					<Dialog.Title style={{}}>Qualities</Dialog.Title>
					<Dialog.Content>
						<View style={styles.buttons}>
							{videoQualities2.map((Quality, qIndex) => (
								<View style={styles.speedButtonsList} key={Quality}>
									<Button
										color={qualityButtonColor[qIndex]}
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
	},
	videoLandscape: {
		alignSelf: 'center',
		width: YY,
		height: 300,
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
