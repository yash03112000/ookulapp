import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
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

	return loading ? (
		<View style={container}>
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	) : (
		<View style={container}>
			{items.length == 0 ? (
				<Text>No Downloads</Text>
			) : (
				<ScrollView style={{}}>
					{items.map((lsn) => {
						// console.log(item);
						return (
							<TouchableOpacity
								style={styles.button}
								key={lsn.ID + Math.random()}
								onPress={() => {
									lsn['from'] = 'Downloads';
									navigation.navigate('CourseSingle', lsn);
								}}
							>
								<View>
									<Text>
										{lsn.post_title}
										{' #'}
										{lsn.ID}
									</Text>
								</View>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
