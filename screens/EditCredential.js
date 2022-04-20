import React, { useState, useEffect } from 'react';
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
import forwardArrow from '../staticImages/ForwardArrow.png'; // Forward arrow image for account page
import accountSelected from '../staticImages/AccountImageSelected.png'; // Image to show the current page - Account page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { getUser,changeCredential, getUsername, getEmail } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

// Edit Credential Page
export function EditCredential({ navigation, route }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished
  const [currentEmail, currentEmailChange] = useState(''); // State for holding the current email of the user
  const [currentUsername, currentUsernameChange] = useState(''); // State for holding the current email of the user
  const [newUsername, newUsernameChange] = useState(''); // State for holding the new username for the user
  const [newEmail, newEmailChange] = useState(''); // State for holding the new email for the user
  const [confirmEmail, confirmEmailChange] = useState(''); // State for holding the confirm email for the user
  const [newPassword, newPasswordChange] = useState(''); // State for holding the new password for the user
  const [confirmPassword, confirmPasswordChange] = useState(''); // State for holding the confirm password for the user
  const [editResponse, editResponseChange] = useState(''); // State for holding the response from the change async function
  const [error, errorChange] = useState(''); // State for holding an error when entering new credential
  const [submitPressed, submitPressedChange] = useState(false); // Checks if the user pressed the submit button
  const [saving, savingChange] = useState(false); // State for showing the activit indicator while credential is saving

  useEffect(() => {
    // useEffect used to only get the currentUser, if it exists
    getUser(currentUserChange, userLoadingChange); // Called to get the current user that's logged in, if any user is logged in at all
  }, []);

  if (userLoading) {
    if (route.params.selected == 'Email') {
      getEmail(currentUser, currentEmailChange);
    } else if (route.params.selected == 'Username') {
      getUsername(currentUser, currentUsernameChange);
    }
    userLoadingChange(false); // Changing userLoading back to false after currentUser has loaded
  }

  if (saving && editResponse.length != 0) {
    if (editResponse != 'Credential changed!') {
      savingChange(false);
    } else if (editResponse == 'Credential changed!') {
      navigation.goBack();
    }
  }

  // Input Error Checking
  if (submitPressed && currentUser.length != 0) {
    // Username input checking
    if (route.params.selected == 'Username') {
      if (newUsername.length == 0) {
        errorChange('No Username provided!');
      } else {
        errorChange('');
        changeCredential(
          currentUser,
          route.params.selected,
          newUsername,
          editResponseChange
        );
        savingChange(true);
      }
    }
    // Email input checking
    else if (route.params.selected == 'Email') {
      if (newEmail.length == 0) {
        errorChange('No Email provided!');
      } else if (newEmail != confirmEmail) {
        errorChange('Emails do not match!');
      } else {
        errorChange('');
        changeCredential(
          currentUser,
          route.params.selected,
          newEmail,
          editResponseChange
        );
        savingChange(true);
      }
    }
    // Password input checking
    else if (route.params.selected == 'Password') {
      if (newPassword.length == 0) {
        errorChange('No Password provided!');
      } else if (newPassword != confirmPassword) {
        errorChange('Passwords do not match!');
      } else {
        errorChange('');
        changeCredential(
          currentUser,
          route.params.selected,
          newPassword,
          editResponseChange
        );
        savingChange(true);
      }
    }
    submitPressedChange(false);
  }

  return (
    <>
      {/*Container for Credential Editing page*/}
      <View style={styles.mainPage}>
        {/*View for title flexbox*/}
        <View style={styles.titleContainer}>
          <Pressable // Pressable for back button
            onPress={() => {
              navigation.goBack();
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
          <Pressable // Pressable for account image - image is different color to show that user is currently on account page
            onPress={() => {}}
            style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
            <Image source={accountSelected} style={styles.accountImage} />
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.cartAccountTitle}>
            Change {route.params.selected}
            {'\n'}
          </Text>
          <Text
            style={{
              fontSize: 21,
              fontWeight: 'bold',
              paddingLeft: 2,
            }}>
            {currentUser.length != 0
              ? route.params.selected == 'Username'
                ? '\nCurrent Username : ' +
                  (currentUsername.length != 0 ? currentUsername : 'Loading...')
                : route.params.selected == 'Email'
                ? '\nCurrent Email: ' +
                  (currentEmail.length != 0 ? currentEmail : 'Loading...')
                : null
              : 'Loading...'}
            {'\n'}
          </Text>
          {/* Username Render */}
          {route.params.selected == 'Username' ? (
            <>
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Text style={styles.inputLabel}>New Username: </Text>
              <TextInput
                style={styles.inputBar}
                onChangeText={newUsernameChange}
                placeholder={'Maximum 15 Characters'}
                clearButtonMode="while-editing"
                maxLength={15}
                returnKeyType="done"
              />
            </>
          ) : null}
          {/* Email Render */}
          {route.params.selected == 'Email' ? (
            <>
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Text style={styles.inputLabel}>New Email: </Text>
              <TextInput
                style={styles.inputBar}
                onChangeText={newEmailChange}
                placeholder={'Enter email here'}
                clearButtonMode="while-editing"
                returnKeyType="done"
              />
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Text style={styles.inputLabel}>Confirm New Email: </Text>
              <TextInput
                style={styles.inputBar}
                onChangeText={confirmEmailChange}
                placeholder={'Confirm email here'}
                clearButtonMode="while-editing"
                returnKeyType="done"
              />
            </>
          ) : null}
          {/* Password Render */}
          {route.params.selected == 'Password' ? (
            <>
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Text style={styles.inputLabel}>New Password: </Text>
              <TextInput
                style={styles.inputBar}
                onChangeText={newPasswordChange}
                secure={true}
                placeholder={'Enter Password here'}
                clearButtonMode="while-editing"
                returnKeyType="done"
              />
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Text style={styles.inputLabel}>Confirm New Password: </Text>
              <TextInput
                style={styles.inputBar}
                onChangeText={confirmPasswordChange}
                secure={true}
                placeholder={'Confirm Password here'}
                clearButtonMode="while-editing"
                returnKeyType="done"
              />
            </>
          ) : null}
          <Text
            style={{
              fontSize: 19,
              fontWeight: 'bold',
              paddingLeft: 2,
              color: 'red',
            }}>
            {'\n'}
            {error}
            {'\n'}
          </Text>
          <Text
            style={{
              fontSize: 19,
              fontWeight: 'bold',
              paddingLeft: 2,
            }}>
            {editResponse}
            {'\n'}
          </Text>
          <Pressable // Save button
            disabled={submitPressed || saving}
            style={styles.submitButton}
            onPress={() => {
              submitPressedChange(true);
            }}>
            {submitPressed || saving ? (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#000000" />
              </View>
            ) : (
              <Text style={{ fontSize: 21, fontWeight: 'bold' }}>SAVE</Text>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}