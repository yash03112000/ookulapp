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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SecureStore from 'expo-secure-store';
import { useSelector, useDispatch } from 'react-redux';
import Pdf from 'react-native-pdf';

export default function PDFDisplay(props) {
	const [URI, setURI] = useState('');
	const [loading, setLoading] = useState(true);

	const checkFocused = useIsFocused();
	const uri = props.src;
	const lsnid = props.lsndet.ID;

	const navigation = useNavigation();

	useEffect(() => {
		check();
	}, [uri]);

	const check = async () => {
		if (props.pageScreen === 'OfflinePlayer') {
			const a = 'file:///data/user/0/com.ookulapp/files/' + lsnid + '.pdf';
			const file = await FileSystem.getInfoAsync(a, {});
			const status1 = file.exists;
			// setDownloadstatus(status1);
			if (status1) {
				setURI(a);
				setLoading(false);
			}
		} else {
			setURI(props.src);
			setLoading(false);
		}
	};

	const openPDF = () => {
		console.log('sss');
		navigation.navigate('PDFScreen', URI);
	};

	return loading ? (
		<View>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View style={styles.container}>
			<View>
				<Button onPress={openPDF} mode="contained">
					Open PDF
				</Button>
			</View>
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
	pdf: {
		height: YY,
		width: XX,
	},
});
