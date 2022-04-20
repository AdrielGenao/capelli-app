import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
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
import cart from '../staticImages/CartImage.png'; // Cart image for items in cart page
import account from '../staticImages/AccountImage.png'; // Account image for account page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { getUser, addToCart } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

export function ProductPage({ navigation, route }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoaded, userLoadedChange] = useState(false); // State for checking if current user async function has finished, and a user has been checked for
  const [addedToCart, addedToCartChange] = useState(false); // State for checking that the product has been added to the user's cart
  const [addToCartPressed, addToCartPressedChange] = useState(false); // State for checking if the add to cart button has been pressed
  const [quantity, quantityChange] = useState(0); // State for quantity

  useEffect(() => {
    // useEffect used to only get the currentUser, if it exists
    getUser(currentUserChange, userLoadedChange); // Called to get the current user that's logged in, if any user is logged in at all
  }, []);

  return (
    <>
      {/*Container for Product page*/}
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
              navigation.navigate('CartPage');
            }}
            style={[styles.cartPressable, { marginTop: height * -0.14 }]}>
            <Image source={cart} style={styles.cartImage} />
          </Pressable>
          <Pressable // Pressable for account image
            onPress={() => {
              navigation.navigate('Account');
            }}
            style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
            <Image source={account} style={styles.accountImage} />
          </Pressable>
        </View>
        {/*View for body flexbox*/}
        <View style={styles.body}>
          {/* Cannot use KeyboardAvoidingView when using android */}
          {Platform.OS == 'ios' ? (
            <KeyboardAvoidingView // View used for moving the scrollview upward when keyboard is opened
              behavior="height"
              keyboardVerticalOffset={height * 0.215}
              style={{ flex: 1 }}>
              <ScrollView>
                {/* Image of the product */}
                <Image
                  style={styles.productPageImage}
                  source={{ uri: route.params.image }}
                />
                {/* Title text for Product page */}
                <Text style={styles.productTitleText}>
                  {route.params.title}
                </Text>
                <Text style={styles.productTitleText}>
                  ${route.params.price}
                </Text>
                {/* View for Quantity Section for Product Page*/}
                <View
                  style={{
                    paddingLeft: 5,
                    marginLeft: width * 0.03,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                    }}>
                    Quantity:{'  '}
                  </Text>
                  <TextInput
                    style={styles.productQuantityInput}
                    onChangeText={quantityChange}
                    returnKeyType="done"
                    keyboardType="number-pad"
                    placeholder="Qty"
                    maxLength={2}
                    defaultValue="1"
                  />
                </View>
                {/*View for creating a space quantity and Add to Cart button */}
                <View style={{ height: height * 0.02, width: '100%' }}></View>
                <Pressable // Add to cart button
                  style={styles.addToCartButton}
                  onPress={() =>
                    addedToCart
                      ? navigation.navigate('CartPage')
                      : (currentUser == null || currentUser == '') && userLoaded
                      ? navigation.navigate('Login')
                      : (addToCart(
                          currentUser,
                          route.params.title,
                          route.params.image,
                          route.params.price,
                          quantity == null || quantity == '' ? 1 : quantity, // Empty quantity defaults to using 1 as quantity for product
                          addedToCartChange
                        ),
                        addToCartPressedChange(true))
                  }>
                  <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                    {addToCartPressed ? (
                      addedToCart ? (
                        'View in Cart'
                      ) : (
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          {/* Acitivty indicator while the cart response or cart creation is loading */}
                          <ActivityIndicator size="large" color="#000000" />
                        </View>
                      )
                    ) : (
                      'Add to cart'
                    )}
                  </Text>
                </Pressable>
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <ScrollView>
              {/* Image of the product */}
              <Image
                style={styles.productPageImage}
                source={{ uri: route.params.image }}
              />
              {/* Title text for Product page */}
              <Text style={styles.productTitleText}>{route.params.title}</Text>
              <Text style={styles.productTitleText}>${route.params.price}</Text>
              {/* View for Quantity Section for Product Page*/}
              <View
                style={{
                  paddingLeft: 5,
                  marginLeft: width * 0.03,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                  }}>
                  Quantity:{'  '}
                </Text>
                <TextInput
                  style={styles.productQuantityInput}
                  onChangeText={quantityChange}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  placeholder="Qty"
                  maxLength={2}
                  defaultValue="1"
                />
              </View>
              {/*View for creating a space quantity and Add to Cart button */}
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Pressable // Add to cart button
                style={styles.addToCartButton}
                onPress={() =>
                  addedToCart
                    ? navigation.navigate('CartPage')
                    : (currentUser == null || currentUser == '') && userLoaded
                    ? navigation.navigate('Login')
                    : (addToCart(
                        currentUser,
                        route.params.title,
                        route.params.image,
                        route.params.price,
                        quantity == null || quantity == '' ? 1 : quantity, // Empty quantity defaults to using 1 as quantity for product
                        addedToCartChange
                      ),
                      addToCartPressedChange(true))
                }>
                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                  {addToCartPressed ? (
                    addedToCart ? (
                      'View in Cart'
                    ) : (
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        {/* Acitivty indicator while the cart response or cart creation is loading */}
                        <ActivityIndicator size="large" color="#000000" />
                      </View>
                    )
                  ) : (
                    'Add to cart'
                  )}
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </View>
    </>
  );
}