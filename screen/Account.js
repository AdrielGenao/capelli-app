import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';

import capelliLogo from '../staticImages/CapelliLogo.png'; // Capelli logo png
import cart from '../staticImages/CartImage.png'; // Cart image for items in cart page
import account from '../staticImages/AccountImage.png'; // Account image for account page
import forwardArrow from '../staticImages/ForwardArrow.png'; // Forward arrow image for account page
import accountSelected from '../staticImages/AccountImageSelected.png'; // Image to show the current page - Account page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { getUser, logout} from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

export function Account({ navigation, route }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished

  useEffect(() => {
    // useEffect used to only get the currentUser, if it exists
    getUser(currentUserChange, userLoadingChange); // Called to get the current user that's logged in, if any user is logged in at all
  }, []);

  if (userLoading) {
    if (currentUser == null || currentUser == '') {
      // Checking to see if there is no user logged in
      navigation.replace('Login'); // Go to login page if no user is logged in
    }
    userLoadingChange(false); // Changing userLoading back to false after currentUser has loaded
  }

  // Function for creating a setting-change Pressable for scrollview
  function settingChangePressable(text, onpress) {
    return (
      <>
        <Pressable style={styles.accountChangePressable} onPress={onpress}>
          <Text style={{ fontSize: 21, fontWeight: 'bold' }}>{text}</Text>
          <Image
            source={forwardArrow}
            style={styles.accountChangePressableArrow}
          />
        </Pressable>
        {/*View for creating a space between scrollview pressables */}
        <View style={{ height: height * 0.02, width: '100%' }}></View>
      </>
    );
  }

  return (
    <>
      {/*Container for Account page*/}
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
        {currentUser == null || currentUser == '' ? ( // Show activity indicator while user is loading
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#05acbe" />
          </View>
        ) : (
          // If user does exist or is logged in - render the regular account page
          <View style={styles.body}>
            <Text style={styles.cartAccountTitle}>Account{'\n'}</Text>
            <ScrollView>
              {settingChangePressable('Edit Addresses', function () {
                navigation.navigate('SelectAddress', { checkout: false });
              })}
              {settingChangePressable('Edit Credentials', function () {
                navigation.navigate('SelectCredential');
              })}
              <Pressable // Logout button
                style={styles.submitButton}
                onPress={() => {
                  logout(currentUser, currentUserChange, userLoadingChange);
                  navigation.replace('Login');
                }}>
                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>LOGOUT</Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
}