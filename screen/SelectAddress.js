import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import capelliLogo from '../staticImages/CapelliLogo.png'; // Capelli logo png
import cart from '../staticImages/CartImage.png'; // Cart image for items in cart page
import forwardArrow from '../staticImages/ForwardArrow.png'; // Forward arrow image for account page
import accountSelected from '../staticImages/AccountImageSelected.png'; // Image to show the current page - Account page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { getUser, getAddresses, deleteAddress } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

export function SelectAddress({ navigation, route }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished
  const [addressResponse, addressResponseChange] = useState(''); // State for holding response from getAddresses async function
  const [addresses, addressesChange] = useState([]); // State for storing the addresses of the user in an array
  const [addressesLoaded, addressesLoadedChange] = useState(false); // State for checking if addresses have finished loading
  const [addressDeleted, addressDeletedChange] = useState(false); // State for checking if address has finished deleting

  useEffect(() => {
    // useEffect used to get currentUser
    getUser(currentUserChange, userLoadingChange); // Called to get the current user that's logged in, if any user is logged in at all
  }, []);

  // Called whenever this page is focused, to reload/reset all states to reload addresses to get accurate/up-to-date locations
  navigation.addListener('focus', () => {
    if (currentUser.length != 0) {
      userLoadingChange(true);
      addressesLoadedChange(false);
      addressesChange([]);
      addressResponseChange('');
    }
  });

  // Get addresses once user has been loaded
  if (userLoading) {
    getAddresses(currentUser, addressResponseChange);
    userLoadingChange(false); // Changing userLoading back to false after currentUser has loaded
  }

  // Load response from getAddresses call into addresses state
  if (
    !addressesLoaded &&
    addressResponse != 'No Addresses' &&
    addressResponse.length != 0
  ) {
    for (let i = 0; i < addressResponse.length; i++) {
      let addressesListRow = addressResponse[i].split('~');
      let addressesDictRow = {};
      addressesDictRow['Address1'] = addressesListRow[0];
      addressesDictRow['Address2'] = addressesListRow[1];
      addressesDictRow['State'] = addressesListRow[2];
      addressesDictRow['zipCode'] = addressesListRow[3];
      addresses.push(addressesDictRow);
    }
    addressesLoadedChange(true); // Change to true to render pressables
  }

  // If an address has been deleted - reset states to reload addresses to be accurate
  if (addressDeleted) {
    userLoadingChange(true);
    addressesLoadedChange(false);
    addressesChange([]);
    addressResponseChange('');
    addressDeletedChange(false);
  }

  // Function for creating rendering addresses
  function renderAddresses(index) {
    return (
      <>
        <Pressable
          style={styles.addressChangePressable}
          onPress={() => {
            {
              route.params.checkout
                ? navigation.navigate('CheckoutPage', {
                    index: index,
                  })
                : navigation.navigate('EditAddress', {
                    address1: addresses[index]['Address1'],
                    address2: addresses[index]['Address2'],
                    state: addresses[index]['State'],
                    zipCode: addresses[index]['zipCode'],
                    user: currentUser,
                    index: index,
                  });
            }
          }}>
          <View style={{ flexDirection: 'column', flex: 4.5 }}>
            <Text
              numberOfLines={3}
              style={{ fontSize: 19, fontWeight: 'bold' }}>
              {addresses[index]['Address1']}
              {'\n'}
              {addresses[index]['Address2']}
              {'\n'}
              {addresses[index]['State']} {addresses[index]['zipCode']}
            </Text>
            <Pressable // Pressable for deleting product from user's cart, or editing address when coming from checkout page
              style={{
                paddingVertical: 5,
                maxWidth: route.params.checkout ? '15%' : '27.5%',
              }}
              onPress={() => {
                {
                  route.params.checkout
                    ? navigation.navigate('EditAddress', {
                        address1: addresses[index]['Address1'],
                        address2: addresses[index]['Address2'],
                        state: addresses[index]['State'],
                        zipCode: addresses[index]['zipCode'],
                        user: currentUser,
                        index: index,
                      })
                    : deleteAddress(currentUser, index, addressDeletedChange);
                }
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#05acbe',
                }}>
                {route.params.checkout ? 'Edit' : 'Remove'}
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 0.5,
              justifyContent: 'center',
            }}>
            {!route.params.checkout ? (
              <Image
                source={forwardArrow}
                style={styles.addressChangePressableArrow}
              />
            ) : null}
          </View>
        </Pressable>
        {/*View for creating a space between scrollview pressables */}
        <View style={{ height: height * 0.02, width: '100%' }}></View>
      </>
    );
  }

  // Function for calling the renderAddresses function, used by the actual JSX return
  function renderAddressesCall() {
    let returnJSX = [];
    for (let i = 0; i < addresses.length; i++) {
      returnJSX.push(renderAddresses(i));
    }
    return returnJSX;
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
        {!addressesLoaded && addressResponse != 'No Addresses' ? ( // Show activity indicator while addresses are loading
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#05acbe" />
          </View>
        ) : (
          // If user does exist or is logged in - render the regular account page
          <View style={styles.body}>
            <Text style={styles.cartAccountTitle}>Addresses{'\n'}</Text>
            <ScrollView>
              {addressResponse != 'No Addresses' ? (
                renderAddressesCall()
              ) : (
                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: 'bold',
                    paddingLeft: 2,
                  }}>
                  {'\n'}
                  No Addresses
                  {'\n'}
                </Text>
              )}
              {/*View for creating a space between address pressables and submit button*/}
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Pressable // New Address button
                style={[styles.submitButton, { width: '50%' }]}
                onPress={() => {
                  navigation.navigate('AddAddress', { user: currentUser });
                }}>
                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                  New Address
                </Text>
              </Pressable>
              {/*View for creating a space between button and bottom of scrollview */}
              <View style={{ height: height * 0.04, width: '100%' }}></View>
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
}