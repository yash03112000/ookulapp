import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Pdf from 'react-native-pdf';

export const PDFScreen = (props) => {
	// console.log(props.route.params);
	const source = {
		uri: props.route.params,
		cache: true,
	};

	return (
		<View style={styles.container}>
			<Pdf
				source={source}
				onLoadComplete={(numberOfPages, filePath) => {
					console.log(`Number of pages: ${numberOfPages}`);
				}}
				onPageChanged={(page, numberOfPages) => {
					console.log(`Current page: ${page}`);
				}}
				onError={(error) => {
					console.log(error);
				}}
				onPressLink={(uri) => {
					console.log(`Link pressed: ${uri}`);
				}}
				style={styles.pdf}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 25,
	},
	pdf: {
		flex: 1,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
});
