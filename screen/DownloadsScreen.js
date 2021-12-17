import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

/**
 * @author
 * @function DownloadsScreen
 **/

export const DownloadsScreen = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	// console.log(isFocused);

	useEffect(async () => {
		try {
			var downlist = await SecureStore.getItemAsync('downlist');
			downlist = JSON.parse(downlist);
			if (downlist) setItems(downlist);
			setLoading(false);
		} catch (e) {
			console.log(e);
		}
	}, [isFocused]);
	const { container } = styles;

	const deletefun = async (lsn) => {
		try {
			let link = '';
			if (lsn.type === 'video') {
				link = 'file:///data/user/0/com.ookulapp/files/' + lsn.ID + '.mp4';
			} else {
				link = 'file:///data/user/0/com.ookulapp/files/' + lsn.ID + '.pdf';
			}
			await FileSystem.deleteAsync(link);
			var downlist = await SecureStore.getItemAsync('downlist');
			downlist = JSON.parse(downlist);
			data = lsn;
			var a = downlist.filter((e) => e.ID !== data.ID);
			// console.log(data);
			// if (downlist) {
			// 	if (downlist.filter((e) => e.ID === data.ID).length > 0) {
			// 		console.log('Already In downlist');
			// 	} else {
			// 		// console.log(data);
			// 		downlist.push(data);
			// 		await SecureStore.setItemAsync('downlist', JSON.stringify(downlist));
			// 	}
			// }
			await SecureStore.setItemAsync('downlist', JSON.stringify(a));
			setItems(a);
		} catch (e) {
			console.log(e);
		}
	};

	return loading ? (
		<View style={container}>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View style={{}}>
			{items.length == 0 ? (
				<Text>No Downloads</Text>
			) : (
				<ScrollView style={{}}>
					{items.map((lsn) => {
						// console.log(item);
						return (
							<View key={lsn.ID} style={styles.button}>
								<TouchableOpacity
									onPress={() => {
										lsn['from'] = 'Downloads';
										navigation.navigate('OfflinePlayer', lsn);
									}}
									style={{ flex: 8 }}
								>
									<View>
										<Text>
											{lsn.post_title}
											{' #'}
											{lsn.ID}
										</Text>
									</View>
								</TouchableOpacity>
								<View style={{ flex: 1 }}>
									<Button onPress={() => deletefun(lsn)}>
										<Ionicons
											name="close-circle-outline"
											size={25}
											color={'black'}
										/>
									</Button>
								</View>
							</View>
						);
					})}
				</ScrollView>
			)}
		</View>
	);
};

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		// flexDirection: 'row',
		// justifyContent: 'center',
		// alignItems: 'center',
	},
	button: {
		// alignItems: "center",
		backgroundColor: '#DDDDDD',
		padding: 10,
		textAlign: 'left',
		marginTop: 1,
		marginBottom: 1,
		flexDirection: 'row',
		width: width,
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
