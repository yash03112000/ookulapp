import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
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
import { SettingsScreen } from './screen/SettingsScreen';
import { ProfileScreen } from './screen/ProfileScreen';
import { CourseScreen } from './screen/CourseScreen';
import { CourseSingle } from './screen/CourseSingle';
import { CourseDetails } from './screen/CourseDetails';

import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import store from './reduxApp/store';
import {
	// emailIdUpdate,
	loginFailUpdate,
	loginSuccessUpdate,
} from './reducers/authSlice';
// import { jwtauthtoken } from "./config/devProduction";
import * as Linking from 'expo-linking';
import { Cart } from './screen/CartScreen';
import * as SecureStore from 'expo-secure-store';

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
				name="CourseSingle"
				component={CourseSingle}
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
		</Stack.Navigator>
	);
}

function SettingScreenComponents() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="SettingsScreen"
				component={SettingsScreen}
				// component={CourseSingle}
				// component={SingleCourseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ProfileScreen"
				component={ProfileScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

export const MyApp = () => {
	const dispatch = useDispatch();
	const isLoading = useSelector((state) => state.auth.loginLoading);
	const isLoggedIn = useSelector((state) => state.auth.loginSuccess);
	// const isLoggedIn = true
	// const isLoading = false
	// console.log("is logged in<<", isLoggedIn);

	const linking = {
		prefixes: [prefix],
		config: {
			screens: {
				HomeScreen,
				MyCoursesScreen,
				MyTestScreen,
				DownloadsScreen,
				SettingsScreen,
				SplashScreen,
				SignInScreen,
				SignUpScreen,
				CourseScreen,
			},
		},
	};

	useEffect(async () => {
		try {
			const jwtUserToken = await SecureStore.getItemAsync('token');
			if (jwtUserToken) {
				dispatch(loginSuccessUpdate());
			} else {
				dispatch(loginFailUpdate);
			}
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<NavigationContainer linking={linking}>
			{/* <NavigationContainer> */}
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
								} else if (route.name === 'Settings') {
									iconName = focused ? 'settings' : 'settings';
								}

								// You can return any component that you like here!
								return <Ionicons name={iconName} size={size} color={color} />;
							},
							tabBarActiveTintColor: 'tomato',
							tabBarInactiveTintColor: 'gray',
						})}
					>
						<Tab.Screen
							name="Home"
							options={{ title: 'OOkul', tabBarLabel: 'Home' }}
							component={HomeScreenComponents}
						/>
						<Tab.Screen
							name="My Courses"
							component={MyCoursesScreenComponents}
						/>
						<Tab.Screen name="My Test" component={MyTestScreen} />
						<Tab.Screen name="Downloads" component={DownloadsScreen} />
						<Tab.Screen name="Settings" component={SettingScreenComponents} />
					</Tab.Navigator>
				</>
			) : (
				<>
					{isLoading ? (
						<Stack.Navigator>
							<Stack.Screen
								name="SplashScreen"
								component={SplashScreen}
								options={{ headerShown: false }}
							/>
						</Stack.Navigator>
					) : (
						<Stack.Navigator>
							<Stack.Screen
								name="SignIn"
								component={SignInScreen}
								options={{ headerShown: false }}
							/>
							{/* <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
              /> */}
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
			</PaperProvider>
		</Provider>
	);
}
