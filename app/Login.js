'use strict';

import React from 'react-native';
import buffer from 'buffer';
import AuthService from './AuthService';

const {
	Text,
	StyleSheet,
	View,
	Image,
	TextInput,
	TouchableHighlight,
	Component,
	ActivityIndicatorIOS
} = React;

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showProgress: false,
			success: false
		}
	}

	render() {

		let errorCtrl = <View />;

		if (!this.state.success && this.state.badCredentials) {
			errorCtrl = <Text style={styles.error}>
				That username and password combination did not work.
			</Text>;
		}

		if (!this.state.success && this.state.unknownError) {
			errorCtrl = <Text style={styles.error}>
				We experienced an unexpected issue.
			</Text>;
		}

		return (
			<View style={styles.container}>
				<Image style={styles.logo}
					source={require('image!Octocat')} />
				<Text style={styles.heading}>
					Github Browser
				</Text>

				<TextInput style={styles.input}
					onChangeText={(text) => this.setState({ username: text })}
					placeholder='Github Username' />

				<TextInput style={styles.input}
					onChangeText={(text) => this.setState({ password: text })}
					placeholder='Github Password'
					secureTextEntry={true} />

				<TouchableHighlight
					onPress={this.onLoginPressed.bind(this)}
					style={styles.button}>
					<Text style={styles.buttonText}>
						Log in
					</Text>
				</TouchableHighlight>

				{errorCtrl}

				<ActivityIndicatorIOS
				  animating={this.state.showProgress}
				  size={'large'}
				  style={styles.loader} />
			</View>
		);
	}

	onLoginPressed() {
		this.setState({ showProgress: true });

		AuthService.login({
			username: this.state.username,
			password: this.state.password
		}, (results) => {
			this.setState(Object.assign({
				showProgress: false
			}, results));

			if (results.success && this.props.onLogin) {
				this.props.onLogin();
			}
			
		});
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F5FCFF',
		flex: 1,
		paddingTop: 40,
		alignItems: 'center',
		padding: 10
	},
	logo: {
		width: 68,
		height: 55
	},
	heading: {
		fontSize: 30,
		marginTop: 10
	},
	input: {
		height: 50,
		marginTop: 10,
		padding: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC'
	},
	button: {
		height: 50,
		backgroundColor: '#48BBEC',
		alignSelf: 'stretch',
		marginTop: 10,
		justifyContent: 'center'
	},
	buttonText: {
		fontSize: 22,
		color: '#FFF',
		alignSelf: 'center'
	},
	loader: {
		marginTop: 20
	},
	error: {
		color: 'red',
		paddingTop: 10
	}
});

export default Login;