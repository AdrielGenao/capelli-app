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
import backArrow from '../staticImages/BackArrow.png'; // Back arrow image for signup page
import forwardArrow from '../staticImages/ForwardArrow.png'; // Forward arrow image for account page
import accountSelected from '../staticImages/AccountImageSelected.png'; // Image to show the current page - Account page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { signup, storeUser } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

export function SignUp({ navigation, route }) {
  const [email, emailChange] = useState(''); // State for email
  const [confEmail, confEmailChange] = useState(''); // State for confirm email
  const [username, usernameChange] = useState(''); // State for username
  const [password, passwordChange] = useState(''); // State for password
  const [confPassword, confPasswordChange] = useState(''); // State for confirm password
  const [submitPressed, submitChange] = useState(false); // State for checking if submit pressable was activated
  const [errorCheck, errorChange] = useState(false); // State for checking if there are any input errors
  const [changingScreens, changingScreensChange] = useState(false); // State for checking if screen is navigating to account page
  const [signUpResponse, signUpChange] = useState(''); // State for containing the response from the post request to the signup endpoint of the API

  // Function for rendering an input bar
  function inputBarRender(
    name,
    confirmation,
    placeholder,
    onChange,
    secure,
    maximum
  ) {
    // If the input bar is not a confirmation input (either an email or password)
    if (!confirmation) {
      return (
        <>
          {/*View for creating a space between input components of account sign-up page */}
          <View style={{ height: height * 0.02, width: '100%' }}></View>
          {/* Input Bar + Label*/}
          <Text style={styles.inputLabel}>{name}: </Text>
          <TextInput
            style={styles.inputBar}
            onChangeText={onChange}
            placeholder={placeholder}
            clearButtonMode="while-editing"
            secureTextEntry={secure}
            maxLength={maximum}
            returnKeyType="done"
          />
        </>
      );
    }
    // Else if the input bar is of confirmation input
    else if (confirmation) {
      return (
        <>
          {/*View for creating a space between input components of account sign-up page */}
          <View style={{ height: height * 0.02, width: '100%' }}></View>
          {/* Email Input Bar + Label*/}
          <Text style={styles.inputLabel}>Confirm {name}: </Text>
          <TextInput
            style={styles.inputBar}
            onChangeText={onChange}
            placeholder={placeholder}
            clearButtonMode="while-editing"
            secureTextEntry={secure}
            maxLength={maximum}
            returnKeyType="done"
          />
        </>
      );
    }
  }

  if (signUpResponse.length == 32) {
    // Checking if signUpResponse contains the 32-long token/string
    storeUser(signUpResponse); // Store the current user to the async storage
    navigation.replace('Account'); // Navigate to account page as a new user has been created/logged into
    changingScreensChange(true); // Set state to true to cover signup page while app is changing to account page
    signUpChange(''); // Change signUpResponse to be empty to prevent infinite loop of renders
  }

  function inputCheck() {
    // Function for sending input response back to front-end
    if (submitPressed) {
      // Responses for when submit button is pressed. These also change ErrorCheck to true as at least one error has occurred
      if (email.length == 0) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'No email provided!';
      } else if (confEmail.length == 0) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'No confirmation email provided!';
      } else if (username.length == 0) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'No username provided!';
      } else if (password.length == 0) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'No password provided!';
      } else if (confPassword.length == 0) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'No confirmation password provided!';
      } else if (confEmail.length > 0 && confEmail != email) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'Emails do not match!';
      } else if (confPassword.length > 0 && confPassword != password) {
        if (errorCheck != true) {
          errorChange(true);
        }
        return 'Password do not match!';
      }

      if (errorCheck) {
        // If invalid reponse in inputs
        errorChange(false); // Change to false (as the user has now fixed all input errors by this point)
        submitChange(false); // Change submit to false to make user have to press submit again - code will run inputCheck() again, but now the data will send since all input data is correct
      } else if (!errorCheck) {
        // If no input errors occured
        signup(email, username, password, signUpChange); // Send input data
        submitChange(false);
      }
    } else if (!submitPressed) {
      if (confEmail.length > 0 && confEmail != email) {
        return 'Emails do not match!';
      } else if (confPassword.length > 0 && confPassword != password) {
        return 'Password do not match!';
      }
    }
  }

  return (
    <>
      {/*Container for Account page*/}
      <View style={styles.mainPage}>
        {/*View for title flexbox*/}
        <View style={styles.titleContainer}>
          <Pressable // Pressable for back button
            onPress={() => {
              navigation.replace('Login');
            }}
            style={styles.backButton}>
            <Image source={backArrow} style={styles.backButtonImage} />
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
          <Pressable // Pressable for account image - image is different color to show that user is currently on account page
            onPress={() => {}}
            style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
            <Image source={accountSelected} style={styles.accountImage} />
          </Pressable>
        </View>
        {changingScreens ? null : ( // Return null while changing to account screen/page to not confuse the user
          <View style={styles.body}>
            <Text style={styles.cartAccountTitle}>Sign Up{'\n'}</Text>
            <Text style={{ fontSize: 21, fontWeight: 'bold', paddingLeft: 2 }}>
              Signup to see and track your orders!
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
                    'Email',
                    false,
                    'Enter your email here',
                    emailChange,
                    false
                  )}
                  {inputBarRender(
                    'Email',
                    true,
                    'Confirm your email here',
                    confEmailChange,
                    false
                  )}
                  {inputBarRender(
                    'Username',
                    false,
                    'Maximum 15 Characters',
                    usernameChange,
                    false,
                    15
                  )}
                  {inputBarRender(
                    'Password',
                    false,
                    'Maximum 15 Characters',
                    passwordChange,
                    true,
                    15
                  )}
                  {inputBarRender(
                    'Password',
                    true,
                    'Maximum 15 Characters',
                    confPasswordChange,
                    true,
                    15
                  )}
                  <Pressable // Pressable for going to login page
                    style={{ paddingVertical: 15, width: width * 0.9 }}
                    onPress={() => {
                      navigation.replace('Login');
                    }}>
                    <Text
                      style={{
                        fontSize: 19,
                        fontWeight: 'bold',
                        paddingLeft: 2,
                        color: 'blue',
                      }}>
                      Press here to login!
                    </Text>
                  </Pressable>
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: 'bold',
                      paddingLeft: 2,
                      color: 'red',
                    }}>
                    {'\n'}
                    {inputCheck()}
                    {'\n'}
                    {signUpResponse}
                    {'\n'}
                  </Text>
                  <Pressable // Submit button
                    style={styles.submitButton}
                    onPress={() => submitChange(true)}>
                    <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                      SUBMIT
                    </Text>
                  </Pressable>
                  {/*View for creating a space between submit button and bottom of scrollview */}
                  <View style={{ height: height * 0.04, width: '100%' }}></View>
                </ScrollView>
              </KeyboardAvoidingView>
            ) : (
              <ScrollView>
                {inputBarRender(
                  'Email',
                  false,
                  'Enter your email here',
                  emailChange,
                  false
                )}
                {inputBarRender(
                  'Email',
                  true,
                  'Confirm your email here',
                  confEmailChange,
                  false
                )}
                {inputBarRender(
                  'Username',
                  false,
                  'Maximum 15 Characters',
                  usernameChange,
                  false,
                  15
                )}
                {inputBarRender(
                  'Password',
                  false,
                  'Maximum 15 Characters',
                  passwordChange,
                  true,
                  15
                )}
                {inputBarRender(
                  'Password',
                  true,
                  'Maximum 15 Characters',
                  confPasswordChange,
                  true,
                  15
                )}
                <Pressable // Pressable for going to login page
                  style={{ paddingVertical: 15, width: width * 0.9 }}
                  onPress={() => {
                    navigation.replace('Login');
                  }}>
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: 'bold',
                      paddingLeft: 2,
                      color: 'blue',
                    }}>
                    Press here to login!
                  </Text>
                </Pressable>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: 'bold',
                    paddingLeft: 2,
                    color: 'red',
                  }}>
                  {'\n'}
                  {inputCheck()}
                  {'\n'}
                  {signUpResponse}
                  {'\n'}
                </Text>
                <Pressable // Submit button
                  style={styles.submitButton}
                  onPress={() => submitChange(true)}>
                  <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                    SUBMIT
                  </Text>
                </Pressable>
                {/*View for creating a space between submit button and bottom of scrollview */}
                <View style={{ height: height * 0.04, width: '100%' }}></View>
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </>
  );
}