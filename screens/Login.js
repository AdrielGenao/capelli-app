import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';

import capelliLogo from '../staticImages/CapelliLogo.png'; // Capelli logo png
import cart from '../staticImages/CartImage.png'; // Cart image for items in cart page
import accountSelected from '../staticImages/AccountImageSelected.png'; // Image to show the current page - Account page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { login, storeUser } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

export function Login({ navigation, route }) {
  const [email, emailChange] = useState(''); // State for email
  const [username, usernameChange] = useState(''); // State for username
  const [password, passwordChange] = useState(''); // State for password
  const [submitPressed, submitChange] = useState(false); // State for checking if submit pressable was activated
  const [errorCheck, errorChange] = useState(false); // State for checking if there are any input errors
  const [loginResponse, loginChange] = useState(''); // State for containing the response from the post request to the login endpoint of the API. Will return either an error or the username of the logged in account
  const [submitting, submittingChange] = useState(false); // State for checking if the page is currently submitting information to async function

  if (loginResponse != 'User not found!' && loginResponse.length > 0) {
    // If loginResponse successfully has a username found in database
    storeUser(loginResponse); // Set current user to the one that has just logged in
    navigation.replace('Account'); // Navigate to Account page
  }

  // If user is not found - change submitting to false to stop the loading indicator on button
  if (loginResponse == 'User not found!' && submitting) {
    submittingChange(false);
  }

  // Function for rendering an input bar
  function inputBarRender(name, confirmation, placeholder, onChange, secure) {
    return (
      <>
        {/*View for creating a space between input components of login page */}
        <View style={{ height: height * 0.02, width: '100%' }}></View>
        {/* Email Input Bar + Label*/}
        <Text style={styles.inputLabel}>{name}: </Text>
        <TextInput
          style={styles.inputBar}
          onChangeText={onChange}
          placeholder={placeholder}
          clearButtonMode="while-editing"
          secureTextEntry={secure}
          returnKeyType="done"
        />
      </>
    );
  }

  function inputCheck() {
    // Function for sending input response back to front-end
    if (submitPressed) {
      // Responses for when submit button is pressed. These also change ErrorCheck to true as at least one error has occurred
      if (username.length == 0) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'No username provided!';
      } else if (password.length == 0) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'No password provided!';
      }
      if (errorCheck) {
        // If invalid reponse in inputs
        errorChange(false); // Change to false (as the user has now fixed all input errors by this point)
        submitChange(false); // Change submit to false to make user have to press submit again - code will run inputCheck() again, but now the data will send since all input data is correct
      } else if (!errorCheck) {
        loginChange(''); // Clear previous response
        // If no input errors occured
        login(username, password, loginChange); // Send input data
        submittingChange(true);
        submitChange(false);
      }
    }
  }

  return (
    <>
      {/*Container for Login page*/}
      <View style={styles.mainPage}>
        {/*View for title flexbox*/}
        <View style={styles.titleContainer}>
          <Pressable // Pressable for back button
            onPress={() => {
              navigation.popToTop();
            }}
            style={styles.backButton}>
            <Image source={xButton} style={styles.backButtonImage} />
          </Pressable>
          <Pressable // Pressable logo to return to home screen
            style={styles.capelliLogoPressable}
            onPress={() => {
              navigation.replace('Home');
            }}>
            <Image source={capelliLogo} style={styles.capelliLogoImage} />
          </Pressable>
          <Pressable // Pressable for shopping cart image
            onPress={() => {
              navigation.replace('CartPage');
            }}
            style={[styles.cartPressable, { marginTop: height * -0.14 }]}>
            <Image source={cart} style={styles.cartImage} />
          </Pressable>
          <Pressable // Pressable for account image - image is different color to show that user is currently on login page
            onPress={() => {}}
            style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
            <Image source={accountSelected} style={styles.accountImage} />
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.cartAccountTitle}>Login{'\n'}</Text>
          <Text style={{ fontSize: 21, fontWeight: 'bold', paddingLeft: 2 }}>
            Login to see and track your orders!
            {'\n'}
          </Text>
          {/* Cannot use KeyboardAvoidingView when using android */}
          {Platform.OS == 'ios' ? (
            <KeyboardAvoidingView // View used for moving the scrollview upward when keyboard is opened
              behavior="padding"
              keyboardVerticalOffset={height * 0.2}
              style={{ flex: 1 }}>
              <ScrollView>
                {inputBarRender(
                  'Username',
                  false,
                  'Enter your username here',
                  usernameChange,
                  false
                )}
                {inputBarRender(
                  'Password',
                  false,
                  'Enter your password here',
                  passwordChange,
                  true
                )}
                <Pressable // Pressable for going to signup page
                  style={{ paddingVertical: 15, width: width * 0.9 }}
                  onPress={() => {
                    navigation.navigate('SignUp');
                  }}>
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: 'bold',
                      paddingLeft: 2,
                      color: 'blue',
                    }}>
                    Press here to create an account!
                  </Text>
                </Pressable>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: 'bold',
                    paddingLeft: 2,
                    color: 'red',
                  }}>
                  {inputCheck()}
                  {loginResponse == 'User not found!'
                    ? 'User not found!'
                    : null}
                  {'\n'}
                </Text>
                <Pressable // Submit button
                  style={styles.submitButton}
                  onPress={() => submitChange(true)}
                  disabled={submitting}>
                  {submitting ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <ActivityIndicator size="large" color="#000000" />
                    </View>
                  ) : (
                    <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                      SUBMIT
                    </Text>
                  )}
                </Pressable>
                {/*View for creating a space between submit button and bottom of scrollview */}
                <View style={{ height: height * 0.04, width: '100%' }}></View>
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <ScrollView>
              {inputBarRender(
                'Username',
                false,
                'Enter your username here',
                usernameChange,
                false
              )}
              {inputBarRender(
                'Password',
                false,
                'Enter your password here',
                passwordChange,
                true
              )}
              <Pressable // Pressable for going to signup page
                style={{ paddingVertical: 15, width: width * 0.9 }}
                onPress={() => {
                  navigation.navigate('SignUp');
                }}>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: 'bold',
                    paddingLeft: 2,
                    color: 'blue',
                  }}>
                  Press here to create an account!
                </Text>
              </Pressable>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: 'bold',
                  paddingLeft: 2,
                  color: 'red',
                }}>
                {inputCheck()}
                {loginResponse == 'User not found!' ? 'User not found!' : null}
                {'\n'}
              </Text>
              <Pressable // Submit button
                style={styles.submitButton}
                onPress={() => submitChange(true)}
                disabled={submitting}>
                {submitting ? (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#000000" />
                  </View>
                ) : (
                  <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                    SUBMIT
                  </Text>
                )}
              </Pressable>
              {/*View for creating a space between submit button and bottom of scrollview */}
              <View style={{ height: height * 0.04, width: '100%' }}></View>
            </ScrollView>
          )}
        </View>
      </View>
    </>
  );
}
