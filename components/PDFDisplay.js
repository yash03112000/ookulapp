import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	ActivityIndicator,
} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { Portal, Dialog, Button } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SecureStore from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';

export default function PDFDisplay(props) {
	const [URI, setURI] = useState('');
	const [progressValue, setProgressValue] = useState(0);
	const [totalSize, setTotalSize] = useState(0);
	const [download, setDownload] = useState({
		on: false,
	});
	const [videoDownloadView, setVideoDownloadView] = React.useState(false);
	const [loading, setLoading] = useState(true);
	const [downloadstatus, setDownloadstatus] = useState({
		status1: false,
	});
	const netStatus = useSelector((state) => state.auth.netStatus);

	const checkFocused = useIsFocused();
	const uri = props.src;
	const lsnid = props.lsndet.ID;

	useEffect(() => {
		checkdownload();
	}, [uri]);

	const checkdownload = async () => {
		const a = 'file:///data/user/0/com.ookulapp/files/' + lsnid + '.pdf';
		const file = await FileSystem.getInfoAsync(a, {});
		const status1 = file.exists;
		setDownloadstatus({ status1 });
		if (status1) setURI(a);
		else setURI(uri);
		setLoading(false);
	};

	function formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	async function downloadPDF() {
		// setButtonTitle('Downloading');
		setVideoDownloadView(true);
		console.log('Downloading');
		console.log(lsnid);
		setDownload((prev) => ({
			...prev,
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
			uri,
			FileSystem.documentDirectory + lsnid + '.pdf',
			{},
			callback
		);

		try {
			const { uri } = await downloadResumable.downloadAsync();
			console.log('Finished downloading to ', uri);
			setDownload((prev) => ({ ...prev, ['on']: false }));
			setDownloadstatus((prev) => ({ ...prev, [`status1`]: true }));
			var downlist = await SecureStore.getItemAsync('downlist');
			downlist = JSON.parse(downlist);
			data = props.lsndet;
			data['courseTitle'] = props.courseTitle;
			data['courseId'] = props.courseId;
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

			// setButtonTitle('Downloaded');
		} catch (e) {
			console.error(e);
		}
	}

	// console.log(activeVideoUri);
	return loading ? (
		<View>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View style={styles.container}>
			{downloadstatus.status1 ? (
				<View>
					<Button onPress={openPDF}>Open PDF</Button>
				</View>
			) : (
				<View>
					<Button onPress={downloadPDF} mode="contained" style={{ padding: 5 }}>
						Download PDF
					</Button>
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
							<>
								<Dialog.Title style={{}}>Downloading PDF</Dialog.Title>
								<Dialog.Content>
									<View style={styles.buttons}>
										<Text> Size: {totalSize} </Text>
										<Text>Progress: {progressValue} %</Text>
									</View>
								</Dialog.Content>
							</>
						</Dialog>
					</Portal>
				</View>
			)}
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
		// backgroundColor: 'red',
	},
	videoLandscape: {
		alignSelf: 'center',
		width: YY,
		height: 300,
		// backgroundColor: 'green',
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
