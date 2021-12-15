import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SplashScreen from './screen/SplashScreen';
import { SignInScreen } from './screen/SignInScreen';
import { SignUpScreen } from './screen/SignUpScreen';
import { HomeScreen } from './screen/HomeScreen';
import { MyCoursesScreen } from './screen/MyCoursesScreen';
import { MyTestScreen } from './screen/MyTestScreen';
import { DownloadsScreen } from './screen/DownloadsScreen';
import { ProfileScreen } from './screen/ProfileScreen';
import { CheckoutScreen } from './screen/CheckoutScreen';
import { CourseScreen } from './screen/CourseScreen';
import { CourseSingle } from './screen/CourseSingle';
import { CourseDetails } from './screen/CourseDetails';
import { PDFScreen } from './screen/PDFScreen.js';
import { EditProfileScreen } from './screen/EditProfileScreen';
import { Provider } from 'react-redux';
import { Provider as PaperProvider, Badge } from 'react-native-paper';
import { OfflinePlayer } from './screen/OfflinePlayer';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import store from './reduxApp/store';
import {
	// emailIdUpdate,
	loginFailUpdate,
	loginSuccessUpdate,
	netUpdate,
	loginLoadingUpdate,
	cartUpdate,
} from './reducers/authSlice';
// import { jwtauthtoken } from "./config/devProduction";
import * as Linking from 'expo-linking';
import { Cart } from './screen/CartScreen';
import * as SecureStore from 'expo-secure-store';
import * as Network from 'expo-network';
import { TouchableOpacity } from 'react-native';

const prefix = Linking.makeUrl('/');

function HomeScreenComponents() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="HomeScreen"
				component={HomeScreen}
				// component={CourseSingle}
				// component={SingleCourseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="CourseDetails"
				component={CourseDetails}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Cart"
				component={Cart}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="PDFScreen"
				component={PDFScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

function MyCoursesScreenComponents() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="MyCourses"
				component={MyCoursesScreen}
				// component={CourseSingle}
				// component={SingleCourseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="CourseSingle"
				component={CourseSingle}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="PDFScreen"
				component={PDFScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

function ProfileScreenComponents() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="ProfileScreen"
				component={ProfileScreen}
				// component={CourseSingle}
				// component={SingleCourseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="CheckoutScreen"
				component={CheckoutScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="EditProfileScreen"
				component={EditProfileScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

function DownloadScreenComponents() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="DownloadScreen"
				component={DownloadsScreen}
				// component={CourseSingle}
				// component={SingleCourseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="OfflinePlayer"
				component={OfflinePlayer}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="PDFScreen"
				component={PDFScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

export const MyApp = () => {
	const dispatch = useDispatch();
	const isLoading = useSelector((state) => state.auth.loginLoading);
	const isLoggedIn = useSelector((state) => state.auth.loginSuccess);
	const netStatus = useSelector((state) => state.auth.netStatus);
	const cartCount = useSelector((state) => state.auth.cartCount);

	const linking = {
		prefixes: [prefix],
		config: {
			screens: {
				HomeScreen,
				MyCoursesScreen,
				MyTestScreen,
				DownloadsScreen,
				ProfileScreen,
				SplashScreen,
				SignInScreen,
				SignUpScreen,
				CourseScreen,
				CheckoutScreen,
				PDFScreen,
				CourseSingle,
			},
		},
	};
	// console.log(isLoading);

	useEffect(async () => {
		try {
			dispatch(loginLoadingUpdate());
			var cart = await SecureStore.getItemAsync('cart');
			cart = JSON.parse(cart);
			if (!cart) cart = [];
			dispatch(cartUpdate(cart.length));
			const status = await Network.getNetworkStateAsync();
			// alert(status.isConnected);
			if (status.isConnected) {
				// dispatch(netUpdate(true));
				const jwtUserToken = await SecureStore.getItemAsync('token');
				if (jwtUserToken) {
					dispatch(loginSuccessUpdate());
				} else {
					dispatch(loginFailUpdate());
				}
			} else {
				dispatch(netUpdate(false));
			}
		} catch (error) {
			console.log(error);
			dispatch(netUpdate(false));
		}
	}, []);

	return (
		<NavigationContainer linking={linking}>
			{isLoading ? (
				<Stack.Navigator>
					<Stack.Screen
						name="SplashScreen"
						component={SplashScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			) : (
				<>
					{netStatus ? (
						<>
							{isLoggedIn ? (
								<>
									<Tab.Navigator
										screenOptions={({ route }) => ({
											tabBarIcon: ({ focused, color, size }) => {
												let iconName;
												if (route.name === 'Home') {
													iconName = focused ? 'home' : 'home';
												} else if (route.name === 'My Courses') {
													iconName = focused ? 'book' : 'book';
												} else if (route.name === 'My Test') {
													iconName = focused ? 'pencil' : 'pencil';
												} else if (route.name === 'Downloads') {
													iconName = focused ? 'download' : 'download';
												} else if (route.name === 'Profile') {
													iconName = focused
														? 'md-person-sharp'
														: 'md-person-sharp';
												}

												// You can return any component that you like here!
												return (
													<Ionicons name={iconName} size={size} color={color} />
												);
											},
											tabBarActiveTintColor: 'tomato',
											tabBarInactiveTintColor: 'gray',
										})}
									>
										<Tab.Screen
											name="Home"
											options={({ navigation }) => ({
												title: 'OOkul',
												tabBarLabel: 'Home',
												headerRight: () => (
													<TouchableOpacity
														onPress={() => {
															navigation.navigate('Cart');
														}}
														style={{
															margin: 10,
															width: 37,
														}}
													>
														<Ionicons
															name="cart"
															// style={{ backgroundColor: 'blue' }}
															size={35}
															color="black"
														/>
														<Badge
															style={{
																backgroundColor: 'blue',
																position: 'absolute',
															}}
															size={18}
														>
															{cartCount}
														</Badge>
													</TouchableOpacity>
												),
											})}
											component={HomeScreenComponents}
										/>
										<Tab.Screen
											name="My Courses"
											component={MyCoursesScreenComponents}
										/>
										{/* <Tab.Screen name="My Test" component={MyTestScreen} /> */}
										<Tab.Screen
											name="Downloads"
											component={DownloadScreenComponents}
										/>
										<Tab.Screen
											name="Profile"
											component={ProfileScreenComponents}
										/>
									</Tab.Navigator>
								</>
							) : (
								<Stack.Navigator>
									<Stack.Screen
										name="SignIn"
										component={SignInScreen}
										options={{ headerShown: false }}
									/>
								</Stack.Navigator>
							)}
						</>
					) : (
						<Stack.Navigator>
							<Stack.Screen
								name="Dowloads"
								component={DownloadsScreen}
								options={{ headerShown: true }}
							/>
							<Stack.Screen
								name="OfflinePlayer"
								component={OfflinePlayer}
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="PDFScreen"
								component={PDFScreen}
								options={{ headerShown: false }}
							/>
						</Stack.Navigator>
					)}
				</>
			)}
		</NavigationContainer>
	);
};

export default function App({ navigation }) {
	return (
		<Provider store={store}>
			<PaperProvider>
				<MyApp />
				<StatusBar style="dark" backgroundColor="#5c02ab" />
			</PaperProvider>
		</Provider>
	);
}
