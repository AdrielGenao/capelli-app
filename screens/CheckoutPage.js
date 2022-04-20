import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';

import capelliLogo from '../staticImages/CapelliLogo.png'; // Capelli logo png
import account from '../staticImages/AccountImage.png'; // Account image for account page
import forwardArrow from '../staticImages/ForwardArrow.png'; // Forward arrow image for account page
import cartSelected from '../staticImages/CartImageSelected.png'; // Image to show the current page - Cart page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { getUser, getCart, changeProductQuantity, getAddresses, deleteProduct } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

export function CheckoutPage({ navigation, route }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished
  const [userLoaded, userLoadedChange] = useState(false); // State for checking if a user is loaded into the currentUser state
  const [cartResponse, cartResponseChange] = useState([]); // State for holding response from getCart endpoint
  const [cart, cartChange] = useState([]); // State for holding actual cart of products from user to display using FlatList
  const [cartLoading, cartLoadingChange] = useState(false); // State for checking if getCart async function has finished
  const [productDeleted, productDeletedChange] = useState(''); // State for checking if a product was deleted to refresh page
  const [addressResponse, addressResponseChange] = useState(''); // State for holding response from getAddresses async function
  const [addresses, addressesChange] = useState([]); // State for storing the addresses of the user in an array
  const [addressesLoaded, addressesLoadedChange] = useState(false); // State for checking if addresses have finished loading

  useEffect(() => {
    // useEffect used to only get the currentUser, if it exists
    getUser(currentUserChange, userLoadingChange); // Called to get the current user that's logged in, if any user is logged in at all
  }, []);

  navigation.addListener('focus', () => {
    // Called whenever this page is focused, to reload/reset all states to reload addresses to get accurate/up-to-date locations
    if (currentUser.length != 0) {
      addressesChange([]);
      addressesLoadedChange(false);
      addressResponseChange('');
      getAddresses(currentUser, addressResponseChange);
    }
  });

  if (userLoading) {
    if (currentUser != null && currentUser != '') {
      getCart(currentUser, cartResponseChange, cartLoadingChange);
    }
    getAddresses(currentUser, addressResponseChange);
    userLoadedChange(true); // Change userLoaded to true to show that a user is currently logged in. Used for displaying if a user is logged in or not for the frontend
    userLoadingChange(false); // Changing userLoading back to false after currentUser has loaded. Used to not repeat this if statement
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

  // Function for changing the quantity of the product in the database whenever user changes quantity in textInput
  function changeQuantity(amount, productTitle) {
    if (amount == '' || amount == null) {
      amount = '1';
    }
    for (let i = 0; i < cart.length; i++) {
      // Updating quantity in cart State
      if (productTitle == cart[i]['title']) {
        cart[i]['quantity'] = amount;
      }
    }
    changeProductQuantity(currentUser, productTitle, amount);
  }

  // Function for getting the quantity of the item in the cart with title passed in as parameter
  function checkQuantity(title) {
    for (let i = 0; i < cart.length; i++) {
      if (title == cart[i]['title']) {
        return cart[i]['quantity'].toString();
      }
    }
    return '1'; // Return 1 as default quantity
  }

  if (cartLoading) {
    if (cartResponse[0] != 'No Cart' && cartResponse[0] != '') {
      // Loop for making array of dictionaries for each product in user's cart
      for (var i = 0; i < cartResponse.length; i++) {
        var cartRow = cartResponse[i].split('~');
        var productRow = {};
        productRow['title'] = cartRow[0];
        productRow['image'] = cartRow[1];
        productRow['price'] = parseFloat(cartRow[2]);
        productRow['quantity'] = parseInt(cartRow[3]);
        cart.push(productRow);
      }
      cartLoadingChange(false);
    }
  }

  function listings(title, image, price) {
    // Function for rendering listings of products in user's cart
    return (
      <>
        {/*Pressable Container to make the listing a pressable to go to its product page*/}
        <Pressable>
          {/*Full Container of product listing*/}
          <View style={styles.listing}>
            {/*Image for listing*/}
            <Image style={styles.productListingImage} source={{ uri: image }} />
            {/*View for text of listing*/}
            <View style={styles.productText}>
              {/*Actual text*/}
              <Text numberOfLines={2} style={styles.productTextTitle}>
                {title}
              </Text>
              <Text style={styles.productTextTitle}>${price}</Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.productTextTitle}>Quantity: </Text>
                <TextInput
                  style={styles.cartQuantityInput}
                  onChangeText={(text) => changeQuantity(text, title)}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  placeholder="Qty"
                  maxLength={2}
                  defaultValue={checkQuantity(title)}
                />
              </View>
              <Pressable // Pressable for deleting product from user's cart
                style={{ paddingVertical: 5, maxWidth: '42.5%' }}
                onPress={() => {
                  deleteProduct(currentUser, title); // Function to remove product from uer's cart in database
                  for (let i = 0; i < cart.length; i++) {
                    if (cart[i]['title'] == title) {
                      cart.splice(i, 1); // Remove element from cart State
                    }
                  }
                  productDeletedChange(title); // Change productDeleted state to rerender Cart Page
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: 'bold',
                    color: '#05acbe',
                  }}>
                  Remove
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
        {/*View for creating a space between components of body page */}
        <View style={{ height: height * 0.01, width: '100%' }}></View>
      </>
    );
  }

  // Actual rendering of product listings
  const listingsRender = ({ item }) =>
    listings(item.title, item.image, item.price);

  return (
    <>
      {/*Container for Checkout page*/}
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
          <Pressable // Pressable for shopping cart image - image is different color to show that user is currently on cart page
            onPress={() => {}}
            style={[styles.cartPressable, { marginTop: height * -0.14 }]}>
            <Image source={cartSelected} style={styles.cartImage} />
          </Pressable>
          <Pressable // Pressable for account image
            onPress={() => {
              navigation.replace('Account');
            }}
            style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
            <Image source={account} style={styles.accountImage} />
          </Pressable>
        </View>
        {/*View for body flexbox*/}
        <View style={styles.body}>
          <Text style={styles.cartAccountTitle}>Checkout{'\n'}</Text>
          {/* Cannot use KeyboardAvoidingView when using android */}
          {Platform.OS == 'ios' ? (
            <KeyboardAvoidingView // View used for moving the scrollview upward when keyboard is opened
              behavior="height"
              keyboardVerticalOffset={height * 0.215}
              style={{ flex: 1 }}>
              {cartResponse.length > 0 ? (
                <ScrollView>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: 'bold',
                      paddingLeft: 2,
                      alignSelf: 'center',
                    }}>
                    Cart
                    {'\n'}
                  </Text>
                  {/* FlatList of product listings in user's cart once cart has loaded */}
                  <FlatList data={cart} renderItem={listingsRender} />
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: 'bold',
                      paddingLeft: 2,
                      alignSelf: 'center',
                    }}>
                    Shipping Address
                    {'\n'}
                  </Text>
                  {addressResponse.length != 0 &&
                  route.params.index + 1 <= addresses.length ? (
                    <Pressable
                      style={styles.addressChangePressable}
                      onPress={() => {
                        {
                          addressResponse == 'No Addresses'
                            ? navigation.navigate('AddAddress', {
                                user: currentUser,
                              })
                            : navigation.navigate('SelectAddress', {
                                checkout: true,
                              });
                        }
                      }}>
                      <View style={{ flexDirection: 'column', flex: 4.5 }}>
                        {addressResponse == 'No Addresses' ? (
                          <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
                            Add Address{'\n\n'}
                          </Text>
                        ) : (
                          <Text
                            numberOfLines={3}
                            style={{ fontSize: 19, fontWeight: 'bold' }}>
                            {addresses[route.params.index]['Address1']}
                            {'\n'}
                            {addresses[route.params.index]['Address2']}
                            {'\n'}
                            {addresses[route.params.index]['State']}{' '}
                            {addresses[route.params.index]['zipCode']}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          flex: 0.5,
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={forwardArrow}
                          style={styles.addressChangePressableArrow}
                        />
                      </View>
                    </Pressable>
                  ) : (
                    <Pressable style={styles.addressChangePressable}>
                      <View style={{ flexDirection: 'column', flex: 4.5 }}>
                        <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
                          Loading...{'\n\n'}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          flex: 0.5,
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={forwardArrow}
                          style={styles.addressChangePressableArrow}
                        />
                      </View>
                    </Pressable>
                  )}
                  <Pressable // Submit Order button
                    style={styles.submitButton}
                    onPress={() => {
                      navigation.replace('Checkout');
                    }}>
                    <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                      Submit Order
                    </Text>
                  </Pressable>
                  {/*View for creating a space between submit button and bottom of scrollview */}
                  <View style={{ height: height * 0.04, width: '100%' }}></View>
                </ScrollView>
              ) : (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {/* Acitivty indicator while the cart response or cart creation is loading */}
                  <ActivityIndicator size="large" color="#05acbe" />
                </View>
              )}
            </KeyboardAvoidingView>
          ) : cartResponse.length > 0 ? (
            <ScrollView>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  paddingLeft: 2,
                  alignSelf: 'center',
                }}>
                Cart
                {'\n'}
              </Text>
              {/* FlatList of product listings in user's cart once cart has loaded */}
              <FlatList data={cart} renderItem={listingsRender} />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  paddingLeft: 2,
                  alignSelf: 'center',
                }}>
                Shipping Address
                {'\n'}
              </Text>
              {addressResponse.length != 0 &&
              route.params.index + 1 <= addresses.length ? (
                <Pressable
                  style={styles.addressChangePressable}
                  onPress={() => {
                    {
                      addressResponse == 'No Addresses'
                        ? navigation.navigate('AddAddress', {
                            user: currentUser,
                          })
                        : navigation.navigate('SelectAddress', {
                            checkout: true,
                          });
                    }
                  }}>
                  <View style={{ flexDirection: 'column', flex: 4.5 }}>
                    {addressResponse == 'No Addresses' ? (
                      <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
                        Add Address{'\n\n'}
                      </Text>
                    ) : (
                      <Text
                        numberOfLines={3}
                        style={{ fontSize: 19, fontWeight: 'bold' }}>
                        {addresses[route.params.index]['Address1']}
                        {'\n'}
                        {addresses[route.params.index]['Address2']}
                        {'\n'}
                        {addresses[route.params.index]['State']}{' '}
                        {addresses[route.params.index]['zipCode']}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 0.5,
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={forwardArrow}
                      style={styles.addressChangePressableArrow}
                    />
                  </View>
                </Pressable>
              ) : (
                <Pressable style={styles.addressChangePressable}>
                  <View style={{ flexDirection: 'column', flex: 4.5 }}>
                    <Text style={{ fontSize: 19, fontWeight: 'bold' }}>
                      Loading...{'\n\n'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 0.5,
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={forwardArrow}
                      style={styles.addressChangePressableArrow}
                    />
                  </View>
                </Pressable>
              )}
              <Pressable // Submit Order button
                style={styles.submitButton}
                onPress={() => {}}>
                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                  Submit Order
                </Text>
              </Pressable>
              {/*View for creating a space between submit button and bottom of scrollview */}
              <View style={{ height: height * 0.04, width: '100%' }}></View>
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {/* Acitivty indicator while the cart response or cart creation is loading */}
              <ActivityIndicator size="large" color="#05acbe" />
            </View>
          )}
        </View>
      </View>
    </>
  );
}