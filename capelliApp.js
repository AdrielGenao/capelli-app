import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';

import capelliLogo from './staticImages/CapelliLogo.png'; // Capelli logo png
import lines from './staticImages/ThreeLines.png'; // Three lines png for navigation opener
import cart from './staticImages/CartImage.png'; // Cart image for items in cart page
import account from './staticImages/AccountImage.png'; // Account image for account page
import backArrow from './staticImages/BackArrow.png'; // Back arrow image for signup page
import forwardArrow from './staticImages/ForwardArrow.png'; // Forward arrow image for account page
import cartSelected from './staticImages/CartImageSelected.png'; // Image to show the current page - Cart page
import accountSelected from './staticImages/AccountImageSelected.png'; // Image to show the current page - Account page
import xButton from './staticImages/XButton.png'; // Image for x button to exit out of account and cart pages

var { height, width } = Dimensions.get('window'); // Device dimensions

var navData = [
  // Navigation button labels
  { label: 'Home' },
  { label: 'Clippers' },
  { label: 'Trimmers' },
  { label: 'Shavers' },
];

// Function to call Products endpoint to get product data (takes setState functions as parameters)
async function getProducts(loadingChanger, productsChanger) {
  try {
    const response = await fetch(
      'https://adrielcapelli.pythonanywhere.com/Products'
    );
    const json = await response.json();
    productsChanger(json.products); // Changes state variable to hold requested products
  } finally {
    loadingChanger(true); // Changes loading state to true
  }
}

// Function for sending post information to signup endpoint, and response is held in signUpResponse
async function signup(email, username, password, signupChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/signup',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    }
  );
  const json = await response.json();
  signupChange(json['response']);
}

// Function for sending post information to login endpoint, and response is held in loginResponse
async function login(username, password, loginChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/login',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }
  );
  const json = await response.json();
  loginChange(json['response']);
}

// Function for storing a user that has logged in or signed up
async function storeUser(username) {
  await AsyncStorage.setItem('@storage_Key', username);
}

// Function for getting the current logged in user (used by Login and Account components/pages)
async function getUser(userChange, loadingChange) {
  try {
    let response = await AsyncStorage.getItem('@storage_Key');
    userChange(response); // Change current user state to the currently logged in user
  } finally {
    loadingChange(true); // Changes loading state to true
  }
}

// Function for logging out of any user currently logged in
async function logout(userChange, loadingChange) {
  try {
    AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
  } finally {
    userChange(''); // Clear state for current user
    loadingChange(true); // Changes loading state to true
  }
}

// Function for sending newly added item to account cart
async function addToCart(
  username,
  productTitle,
  productImage,
  productPrice,
  quantity,
  addedToCartChange
) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/addToCart',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        productTitle: productTitle,
        productImage: productImage,
        productPrice: productPrice,
        quantity: quantity,
      }),
    }
  );
  const json = await response.json();
  addedToCartChange(true);
}

// Function for getting cart of currently logged in user
async function getCart(username, cartChange, loadingChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/getCart',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      }),
    }
  );
  const json = await response.json();
  cartChange(json['cart']);
  loadingChange(true);
}

// Function for changing an existing address of a user
async function changeAddress(
  username,
  index,
  addressOne,
  addressTwo,
  state,
  zipCode,
  addressesDoneChange
) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/changeAddress',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        addressOne: addressOne,
        addressTwo: addressTwo,
        state: state,
        zipCode: zipCode,
        index: index,
      }),
    }
  );
  const json = await response.json();
  addressesDoneChange(true);
}

// Function for deleting an address of a user
async function deleteAddress(username, index, addressDeleted) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/deleteAddress',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        index: index,
      }),
    }
  );
  const json = await response.json();
  addressDeleted(true);
}

// Function for adding a new address to the user's account
async function addAddress(
  username,
  addressOne,
  addressTwo,
  state,
  zipCode,
  addressesDoneChange
) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/addAddress',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        addressOne: addressOne,
        addressTwo: addressTwo,
        state: state,
        zipCode: zipCode,
      }),
    }
  );
  const json = await response.json();
  addressesDoneChange(true);
}

// Function for getting address of currently logged in user
async function getAddresses(username, addressChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/getAddresses',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      }),
    }
  );
  const json = await response.json();
  addressChange(json['addresses']);
}

// Function for changing qunatity of product in user's cart
async function changeProductQuantity(username, productTitle, amount) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/updateCartQuantity',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        productTitle: productTitle,
        quantity: amount,
      }),
    }
  );
  const json = await response.json();
}

// Function for changing qunatity of product in user's cart
async function deleteProduct(username, productTitle) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/deleteProduct',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        productTitle: productTitle,
      }),
    }
  );
  const json = await response.json();
}

// Function for getting email of current user
async function getEmail(username, emailLoadedChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/getEmail',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      }),
    }
  );
  const json = await response.json();
  emailLoadedChange(json['response']);
}

// Function for getting email of current user
async function changeCredential(
  currentUser,
  selected,
  newCredential,
  editResponseChange
) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/changeCredential',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentUser: currentUser,
        selected: selected,
        newCredential: newCredential,
      }),
    }
  );
  const json = await response.json();
  editResponseChange(json['response']);
}

// Product Page
function ProductPage({ navigation, route }) {
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

// Cart Page
function CartPage({ navigation, route }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished
  const [userLoaded, userLoadedChange] = useState(false); // State for checking if a user is loaded into the currentUser state
  const [cartResponse, cartResponseChange] = useState([]); // State for holding response from getCart endpoint
  const [cart, cartChange] = useState([]); // State for holding actual cart of products from user to display using FlatList
  const [cartLoading, cartLoadingChange] = useState(false); // State for checking if getCart async function has finished
  const [productDeleted, productDeletedChange] = useState(''); // State for checking if a product was deleted to refresh page

  useEffect(() => {
    // useEffect used to only get the currentUser, if it exists
    getUser(currentUserChange, userLoadingChange); // Called to get the current user that's logged in, if any user is logged in at all
  }, []);

  if (userLoading) {
    if (currentUser != null && currentUser != '') {
      getCart(currentUser, cartResponseChange, cartLoadingChange);
    }
    userLoadedChange(true); // Change userLoaded to true to show that a user is currently logged in. Used for displaying if a user is logged in or not for the frontend
    userLoadingChange(false); // Changing userLoading back to false after currentUser has loaded. Used to not repeat this if statement
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
        <Pressable
          onPress={(PressEvent) => {
            if (
              // This if statement is only for webview, as the clicking event differs from the onpress callback. The target [object HTMLInputElement] is the textInput element on the listing
              Platform.OS == 'web' &&
              PressEvent.target == '[object HTMLInputElement]'
            ) {
              return null;
            } else {
              navigation.navigate('ProductPage', {
                title: title,
                image: image,
                price: price,
              });
            }
          }}>
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
                style={{ paddingVertical: 5, maxWidth: '80%' }}
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
                  Remove Product
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
      {/*Container for Cart page*/}
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
          <Text style={styles.cartAccountTitle}>Cart{'\n'}</Text>
          {/* Cannot use KeyboardAvoidingView when using android */}
          {Platform.OS == 'ios' ? (
            <KeyboardAvoidingView // View used for moving the scrollview upward when keyboard is opened
              behavior="height"
              keyboardVerticalOffset={height * 0.215}
              style={{ flex: 1 }}>
              {(currentUser == null || currentUser == '') && userLoaded ? (
                <>
                  <Text
                    style={{
                      fontSize: 21,
                      fontWeight: 'bold',
                      paddingLeft: 2,
                    }}>
                    No User Logged in!
                    {'\n'}
                  </Text>
                  <Pressable // Login button
                    style={styles.submitButton}
                    onPress={() => {
                      logout(currentUserChange, userLoadingChange),
                        navigation.replace('Login');
                    }}>
                    <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                      LOGIN
                    </Text>
                  </Pressable>
                </>
              ) : cartResponse.length > 0 ? (
                cart.length > 0 ? (
                  <ScrollView>
                    {/* FlatList of product listings in user's cart once cart has loaded */}
                    <FlatList data={cart} renderItem={listingsRender} />
                    <Pressable // Checkout button
                      style={styles.submitButton}
                      onPress={() => {
                        navigation.replace('Checkout');
                      }}>
                      <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                        Checkout
                      </Text>
                    </Pressable>
                  </ScrollView>
                ) : (
                  <Text
                    style={{
                      fontSize: 21,
                      fontWeight: 'bold',
                      paddingLeft: 2,
                    }}>
                    {'\n'}
                    Nothing in Cart
                    {'\n'}
                  </Text>
                )
              ) : (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {/* Acitivty indicator while the cart response or cart creation is loading */}
                  <ActivityIndicator size="large" color="#05acbe" />
                </View>
              )}
            </KeyboardAvoidingView>
          ) : (currentUser == null || currentUser == '') && userLoaded ? (
            <>
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: 'bold',
                  paddingLeft: 2,
                }}>
                No User Logged in!
                {'\n'}
              </Text>
              <Pressable // Login button
                style={styles.submitButton}
                onPress={() => {
                  logout(currentUserChange, userLoadingChange),
                    navigation.replace('Login');
                }}>
                <Text style={{ fontSize: 21, fontWeight: 'bold' }}>LOGIN</Text>
              </Pressable>
            </>
          ) : cartResponse.length > 0 ? (
            cart.length > 0 ? (
              <ScrollView>
                {/* FlatList of product listings in user's cart once cart has loaded */}
                <FlatList data={cart} renderItem={listingsRender} />
                <Pressable // Checkout button
                  style={styles.submitButton}
                  onPress={() => {
                    navigation.replace('Checkout');
                  }}>
                  <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                    Checkout
                  </Text>
                </Pressable>
              </ScrollView>
            ) : (
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: 'bold',
                  paddingLeft: 2,
                }}>
                {'\n'}
                Nothing in Cart
                {'\n'}
              </Text>
            )
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

// Edit Address page
function EditAddress({ navigation, route }) {
  const [addressOne, addressOneChange] = useState(route.params.address1); // State that holds the 1st address line of the editing address
  const [addressTwo, addressTwoChange] = useState(route.params.address2); // State that holds the 2nd address line of the editing address
  const [state, stateChange] = useState(route.params.state); // State that holds the state of the editing address
  const [zipCode, zipCodeChange] = useState(route.params.zipCode); // State that holds the zip code of the editing address
  const [addressesDone, addressesDoneChange] = useState(false); // State that checks if changing address is completed
  const [savePressed, savePressedChange] = useState(false); // State that checks if user presses save button

  if (savePressed && addressesDone) {
    navigation.goBack();
  }

  return (
    <>
      {/*Container for Address Editing page*/}
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
          <Pressable // Pressable for account image - image is different color to show that user is currently on login page
            onPress={() => {}}
            style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
            <Image source={accountSelected} style={styles.accountImage} />
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.cartAccountTitle}>
            Change Address
            {'\n'}
          </Text>
          {/* Cannot use KeyboardAvoidingView when using android */}
          {Platform.OS == 'ios' ? (
            <KeyboardAvoidingView // View used for moving the scrollview upward when keyboard is opened
              behavior="height"
              keyboardVerticalOffset={height * 0.215}
              style={{ flex: 1 }}>
              <ScrollView>
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                  Address Line 1:
                </Text>
                <TextInput
                  style={styles.inputBar}
                  onChangeText={(text) => {
                    addressOneChange(text);
                  }}
                  clearButtonMode="while-editing"
                  returnKeyType="done"
                  defaultValue={addressOne}
                />
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                  Address Line 2:
                </Text>
                <TextInput
                  style={styles.inputBar}
                  clearButtonMode="while-editing"
                  onChangeText={(text) => {
                    addressTwoChange(text);
                  }}
                  returnKeyType="done"
                  defaultValue={addressTwo}
                />
                <Text
                  style={{ fontSize: 21, fontWeight: 'bold', paddingLeft: 2 }}>
                  State:
                </Text>
                <View style={styles.pickerViewStyle}>
                  <RNPickerSelect
                    style={styles.pickerStyle}
                    onValueChange={(value) => stateChange(value)}
                    value={state}
                    useNativeAndroidPickerStyle={false}
                    items={[
                      { label: 'AL', value: 'AL' },
                      { label: 'AK', value: 'AK' },
                      { label: 'AZ', value: 'AZ' },
                      { label: 'AR', value: 'AR' },
                      { label: 'CA', value: 'CA' },
                      { label: 'CO', value: 'CO' },
                      { label: 'CT', value: 'CT' },
                      { label: 'DE', value: 'DE' },
                      { label: 'FL', value: 'FL' },
                      { label: 'GA', value: 'GA' },
                      { label: 'HI', value: 'HI' },
                      { label: 'ID', value: 'ID' },
                      { label: 'IL', value: 'IL' },
                      { label: 'IN', value: 'IN' },
                      { label: 'IA', value: 'IA' },
                      { label: 'KS', value: 'KS' },
                      { label: 'KY', value: 'KY' },
                      { label: 'LA', value: 'LA' },
                      { label: 'ME', value: 'ME' },
                      { label: 'MD', value: 'MD' },
                      { label: 'MA', value: 'MA' },
                      { label: 'MI', value: 'MI' },
                      { label: 'MN', value: 'MN' },
                      { label: 'MS', value: 'MS' },
                      { label: 'MO', value: 'MO' },
                      { label: 'MT', value: 'MT' },
                      { label: 'NE', value: 'NE' },
                      { label: 'NV', value: 'NV' },
                      { label: 'NH', value: 'NH' },
                      { label: 'NJ', value: 'NJ' },
                      { label: 'NM', value: 'NM' },
                      { label: 'NY', value: 'NY' },
                      { label: 'NC', value: 'NC' },
                      { label: 'ND', value: 'ND' },
                      { label: 'OH', value: 'OH' },
                      { label: 'OK', value: 'OK' },
                      { label: 'OR', value: 'OR' },
                      { label: 'PA', value: 'PA' },
                      { label: 'RI', value: 'RI' },
                      { label: 'SC', value: 'SC' },
                      { label: 'SD', value: 'SD' },
                      { label: 'TN', value: 'TN' },
                      { label: 'TX', value: 'TX' },
                      { label: 'UT', value: 'UT' },
                      { label: 'VT', value: 'VT' },
                      { label: 'VA', value: 'VA' },
                      { label: 'WA', value: 'WA' },
                      { label: 'WV', value: 'WV' },
                      { label: 'WI', value: 'WI' },
                      { label: 'WY', value: 'WY' },
                    ]}
                  />
                </View>
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                  Zip Code:
                </Text>
                <TextInput
                  style={styles.inputBar}
                  clearButtonMode="while-editing"
                  onChangeText={(text) => {
                    zipCodeChange(text);
                  }}
                  returnKeyType="done"
                  defaultValue={zipCode}
                />
                {/*View for creating a space between zip code input and submit button*/}
                <View style={{ height: height * 0.02, width: '100%' }}></View>
                <Pressable // Save button
                  style={styles.submitButton}
                  disabled={savePressed}
                  onPress={() => {
                    changeAddress(
                      route.params.user,
                      route.params.index,
                      addressOne,
                      addressTwo,
                      state,
                      zipCode,
                      addressesDoneChange
                    );
                    savePressedChange(true);
                  }}>
                  {savePressed ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <ActivityIndicator size="large" color="#000000" />
                    </View>
                  ) : (
                    <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                      SAVE
                    </Text>
                  )}
                </Pressable>
                {/*View for creating a space between submit button and bottom of scrollview */}
                <View style={{ height: height * 0.04, width: '100%' }}></View>
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <ScrollView>
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                Address Line 1:
              </Text>
              <TextInput
                style={styles.inputBar}
                onChangeText={(text) => {
                  addressOneChange(text);
                }}
                clearButtonMode="while-editing"
                returnKeyType="done"
                defaultValue={addressOne}
              />
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                Address Line 2:
              </Text>
              <TextInput
                style={styles.inputBar}
                clearButtonMode="while-editing"
                onChangeText={(text) => {
                  addressTwoChange(text);
                }}
                returnKeyType="done"
                defaultValue={addressTwo}
              />
              <Text
                style={{ fontSize: 21, fontWeight: 'bold', paddingLeft: 2 }}>
                State:
              </Text>
              <View style={styles.pickerViewStyle}>
                <RNPickerSelect
                  style={styles.pickerStyle}
                  onValueChange={(value) => stateChange(value)}
                  value={state}
                  useNativeAndroidPickerStyle={false}
                  items={[
                    { label: 'AL', value: 'AL' },
                    { label: 'AK', value: 'AK' },
                    { label: 'AZ', value: 'AZ' },
                    { label: 'AR', value: 'AR' },
                    { label: 'CA', value: 'CA' },
                    { label: 'CO', value: 'CO' },
                    { label: 'CT', value: 'CT' },
                    { label: 'DE', value: 'DE' },
                    { label: 'FL', value: 'FL' },
                    { label: 'GA', value: 'GA' },
                    { label: 'HI', value: 'HI' },
                    { label: 'ID', value: 'ID' },
                    { label: 'IL', value: 'IL' },
                    { label: 'IN', value: 'IN' },
                    { label: 'IA', value: 'IA' },
                    { label: 'KS', value: 'KS' },
                    { label: 'KY', value: 'KY' },
                    { label: 'LA', value: 'LA' },
                    { label: 'ME', value: 'ME' },
                    { label: 'MD', value: 'MD' },
                    { label: 'MA', value: 'MA' },
                    { label: 'MI', value: 'MI' },
                    { label: 'MN', value: 'MN' },
                    { label: 'MS', value: 'MS' },
                    { label: 'MO', value: 'MO' },
                    { label: 'MT', value: 'MT' },
                    { label: 'NE', value: 'NE' },
                    { label: 'NV', value: 'NV' },
                    { label: 'NH', value: 'NH' },
                    { label: 'NJ', value: 'NJ' },
                    { label: 'NM', value: 'NM' },
                    { label: 'NY', value: 'NY' },
                    { label: 'NC', value: 'NC' },
                    { label: 'ND', value: 'ND' },
                    { label: 'OH', value: 'OH' },
                    { label: 'OK', value: 'OK' },
                    { label: 'OR', value: 'OR' },
                    { label: 'PA', value: 'PA' },
                    { label: 'RI', value: 'RI' },
                    { label: 'SC', value: 'SC' },
                    { label: 'SD', value: 'SD' },
                    { label: 'TN', value: 'TN' },
                    { label: 'TX', value: 'TX' },
                    { label: 'UT', value: 'UT' },
                    { label: 'VT', value: 'VT' },
                    { label: 'VA', value: 'VA' },
                    { label: 'WA', value: 'WA' },
                    { label: 'WV', value: 'WV' },
                    { label: 'WI', value: 'WI' },
                    { label: 'WY', value: 'WY' },
                  ]}
                />
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                Zip Code:
              </Text>
              <TextInput
                style={styles.inputBar}
                clearButtonMode="while-editing"
                onChangeText={(text) => {
                  zipCodeChange(text);
                }}
                returnKeyType="done"
                defaultValue={zipCode}
              />
              {/*View for creating a space between zip code input and submit button*/}
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Pressable // Save button
                disabled={savePressed}
                style={styles.submitButton}
                onPress={() => {
                  changeAddress(
                    route.params.user,
                    route.params.index,
                    addressOne,
                    addressTwo,
                    state,
                    zipCode,
                    addressesDoneChange
                  );
                  savePressedChange(true);
                }}>
                {savePressed ? (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#000000" />
                  </View>
                ) : (
                  <Text style={{ fontSize: 21, fontWeight: 'bold' }}>SAVE</Text>
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

// Add Address page
function AddAddress({ navigation, route }) {
  const [addressOne, addressOneChange] = useState(''); // State that holds the 1st address line of the editing address
  const [addressTwo, addressTwoChange] = useState(''); // State that holds the 2nd address line of the editing address
  const [state, stateChange] = useState('AL'); // State that holds the state of the editing address
  const [zipCode, zipCodeChange] = useState(''); // State that holds the zip code of the editing address
  const [addressesDone, addressesDoneChange] = useState(false); // State that checks if changing address is completed
  const [savePressed, savePressedChange] = useState(false); // State that checks if user presses save button

  if (savePressed && addressesDone) {
    navigation.goBack();
  }

  return (
    <>
      {/*Container for Address Editing page*/}
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
          <Pressable // Pressable for account image - image is different color to show that user is currently on login page
            onPress={() => {}}
            style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
            <Image source={accountSelected} style={styles.accountImage} />
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.cartAccountTitle}>
            Add Address
            {'\n'}
          </Text>
          {/* Cannot use KeyboardAvoidingView when using android */}
          {Platform.OS == 'ios' ? (
            <KeyboardAvoidingView // View used for moving the scrollview upward when keyboard is opened
              behavior="height"
              keyboardVerticalOffset={height * 0.215}
              style={{ flex: 1 }}>
              <ScrollView>
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                  Address Line 1:
                </Text>
                <TextInput
                  style={styles.inputBar}
                  onChangeText={(text) => {
                    addressOneChange(text);
                  }}
                  clearButtonMode="while-editing"
                  returnKeyType="done"
                  defaultValue={addressOne}
                />
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                  Address Line 2:
                </Text>
                <TextInput
                  style={styles.inputBar}
                  clearButtonMode="while-editing"
                  onChangeText={(text) => {
                    addressTwoChange(text);
                  }}
                  returnKeyType="done"
                  defaultValue={addressTwo}
                />
                <Text
                  style={{ fontSize: 21, fontWeight: 'bold', paddingLeft: 2 }}>
                  State:
                </Text>
                <View style={styles.pickerViewStyle}>
                  <RNPickerSelect
                    style={styles.pickerStyle}
                    onValueChange={(value) => stateChange(value)}
                    value={state}
                    useNativeAndroidPickerStyle={false}
                    items={[
                      { label: 'AL', value: 'AL' },
                      { label: 'AK', value: 'AK' },
                      { label: 'AZ', value: 'AZ' },
                      { label: 'AR', value: 'AR' },
                      { label: 'CA', value: 'CA' },
                      { label: 'CO', value: 'CO' },
                      { label: 'CT', value: 'CT' },
                      { label: 'DE', value: 'DE' },
                      { label: 'FL', value: 'FL' },
                      { label: 'GA', value: 'GA' },
                      { label: 'HI', value: 'HI' },
                      { label: 'ID', value: 'ID' },
                      { label: 'IL', value: 'IL' },
                      { label: 'IN', value: 'IN' },
                      { label: 'IA', value: 'IA' },
                      { label: 'KS', value: 'KS' },
                      { label: 'KY', value: 'KY' },
                      { label: 'LA', value: 'LA' },
                      { label: 'ME', value: 'ME' },
                      { label: 'MD', value: 'MD' },
                      { label: 'MA', value: 'MA' },
                      { label: 'MI', value: 'MI' },
                      { label: 'MN', value: 'MN' },
                      { label: 'MS', value: 'MS' },
                      { label: 'MO', value: 'MO' },
                      { label: 'MT', value: 'MT' },
                      { label: 'NE', value: 'NE' },
                      { label: 'NV', value: 'NV' },
                      { label: 'NH', value: 'NH' },
                      { label: 'NJ', value: 'NJ' },
                      { label: 'NM', value: 'NM' },
                      { label: 'NY', value: 'NY' },
                      { label: 'NC', value: 'NC' },
                      { label: 'ND', value: 'ND' },
                      { label: 'OH', value: 'OH' },
                      { label: 'OK', value: 'OK' },
                      { label: 'OR', value: 'OR' },
                      { label: 'PA', value: 'PA' },
                      { label: 'RI', value: 'RI' },
                      { label: 'SC', value: 'SC' },
                      { label: 'SD', value: 'SD' },
                      { label: 'TN', value: 'TN' },
                      { label: 'TX', value: 'TX' },
                      { label: 'UT', value: 'UT' },
                      { label: 'VT', value: 'VT' },
                      { label: 'VA', value: 'VA' },
                      { label: 'WA', value: 'WA' },
                      { label: 'WV', value: 'WV' },
                      { label: 'WI', value: 'WI' },
                      { label: 'WY', value: 'WY' },
                    ]}
                  />
                </View>
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                  Zip Code:
                </Text>
                <TextInput
                  style={styles.inputBar}
                  clearButtonMode="while-editing"
                  onChangeText={(text) => {
                    zipCodeChange(text);
                  }}
                  returnKeyType="done"
                  defaultValue={zipCode}
                />
                {/*View for creating a space between zip code input and submit button*/}
                <View style={{ height: height * 0.02, width: '100%' }}></View>
                <Pressable // Add button
                  style={styles.submitButton}
                  disabled={savePressed}
                  onPress={() => {
                    addAddress(
                      route.params.user,
                      addressOne,
                      addressTwo,
                      state,
                      zipCode,
                      addressesDoneChange
                    );
                    savePressedChange(true);
                  }}>
                  {savePressed ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <ActivityIndicator size="large" color="#000000" />
                    </View>
                  ) : (
                    <Text style={{ fontSize: 21, fontWeight: 'bold' }}>
                      ADD
                    </Text>
                  )}
                </Pressable>
                {/*View for creating a space between submit button and bottom of scrollview */}
                <View style={{ height: height * 0.04, width: '100%' }}></View>
              </ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <ScrollView>
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                Address Line 1:
              </Text>
              <TextInput
                style={styles.inputBar}
                onChangeText={(text) => {
                  addressOneChange(text);
                }}
                clearButtonMode="while-editing"
                returnKeyType="done"
                defaultValue={addressOne}
              />
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                Address Line 2:
              </Text>
              <TextInput
                style={styles.inputBar}
                clearButtonMode="while-editing"
                onChangeText={(text) => {
                  addressTwoChange(text);
                }}
                returnKeyType="done"
                defaultValue={addressTwo}
              />
              <Text
                style={{ fontSize: 21, fontWeight: 'bold', paddingLeft: 2 }}>
                State:
              </Text>
              <View style={styles.pickerViewStyle}>
                <RNPickerSelect
                  style={styles.pickerStyle}
                  onValueChange={(value) => stateChange(value)}
                  value={state}
                  useNativeAndroidPickerStyle={false}
                  items={[
                    { label: 'AL', value: 'AL' },
                    { label: 'AK', value: 'AK' },
                    { label: 'AZ', value: 'AZ' },
                    { label: 'AR', value: 'AR' },
                    { label: 'CA', value: 'CA' },
                    { label: 'CO', value: 'CO' },
                    { label: 'CT', value: 'CT' },
                    { label: 'DE', value: 'DE' },
                    { label: 'FL', value: 'FL' },
                    { label: 'GA', value: 'GA' },
                    { label: 'HI', value: 'HI' },
                    { label: 'ID', value: 'ID' },
                    { label: 'IL', value: 'IL' },
                    { label: 'IN', value: 'IN' },
                    { label: 'IA', value: 'IA' },
                    { label: 'KS', value: 'KS' },
                    { label: 'KY', value: 'KY' },
                    { label: 'LA', value: 'LA' },
                    { label: 'ME', value: 'ME' },
                    { label: 'MD', value: 'MD' },
                    { label: 'MA', value: 'MA' },
                    { label: 'MI', value: 'MI' },
                    { label: 'MN', value: 'MN' },
                    { label: 'MS', value: 'MS' },
                    { label: 'MO', value: 'MO' },
                    { label: 'MT', value: 'MT' },
                    { label: 'NE', value: 'NE' },
                    { label: 'NV', value: 'NV' },
                    { label: 'NH', value: 'NH' },
                    { label: 'NJ', value: 'NJ' },
                    { label: 'NM', value: 'NM' },
                    { label: 'NY', value: 'NY' },
                    { label: 'NC', value: 'NC' },
                    { label: 'ND', value: 'ND' },
                    { label: 'OH', value: 'OH' },
                    { label: 'OK', value: 'OK' },
                    { label: 'OR', value: 'OR' },
                    { label: 'PA', value: 'PA' },
                    { label: 'RI', value: 'RI' },
                    { label: 'SC', value: 'SC' },
                    { label: 'SD', value: 'SD' },
                    { label: 'TN', value: 'TN' },
                    { label: 'TX', value: 'TX' },
                    { label: 'UT', value: 'UT' },
                    { label: 'VT', value: 'VT' },
                    { label: 'VA', value: 'VA' },
                    { label: 'WA', value: 'WA' },
                    { label: 'WV', value: 'WV' },
                    { label: 'WI', value: 'WI' },
                    { label: 'WY', value: 'WY' },
                  ]}
                />
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 2 }}>
                Zip Code:
              </Text>
              <TextInput
                style={styles.inputBar}
                clearButtonMode="while-editing"
                onChangeText={(text) => {
                  zipCodeChange(text);
                }}
                returnKeyType="done"
                defaultValue={zipCode}
              />
              {/*View for creating a space between zip code input and submit button*/}
              <View style={{ height: height * 0.02, width: '100%' }}></View>
              <Pressable // Add button
                disabled={savePressed}
                style={styles.submitButton}
                onPress={() => {
                  addAddress(
                    route.params.user,
                    addressOne,
                    addressTwo,
                    state,
                    zipCode,
                    addressesDoneChange
                  );
                  savePressedChange(true);
                }}>
                {savePressed ? (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#000000" />
                  </View>
                ) : (
                  <Text style={{ fontSize: 21, fontWeight: 'bold' }}>ADD</Text>
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

// Select Address Page
function SelectAddress({ navigation }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished
  const [addressResponse, addressResponseChange] = useState(''); // State for holding response from getAddresses async function
  const [addresses, addressesChange] = useState([]); // State for storing the addresses of the user in an array
  const [addressesLoaded, addressesLoadedChange] = useState(false); // State for checking if addresses have finished loading
  const [addressDeleted, addressDeletedChange] = useState(false); // State for checking if address has finished deleting

  useEffect(() => {
    // useEffect used to get currentUser, and add function when page is focused
    getUser(currentUserChange, userLoadingChange); // Called to get the current user that's logged in, if any user is logged in at all
    navigation.addListener('focus', () => {
      // Called whenever this page is focused, to reload/reset all states to reload addresses to get accurate/up-to-date locations
      if (currentUser.length != 0) {
        userLoadingChange(true);
        addressesLoadedChange(false);
        addressesChange([]);
        addressResponseChange('');
      }
    });
  }, [navigation, currentUser]);

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
            navigation.navigate('EditAddress', {
              address1: addresses[index]['Address1'],
              address2: addresses[index]['Address2'],
              state: addresses[index]['State'],
              zipCode: addresses[index]['zipCode'],
              user: currentUser,
              index: index,
            });
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
            <Pressable // Pressable for deleting product from user's cart
              style={{ paddingVertical: 5, maxWidth: '65%' }}
              onPress={() => {
                deleteAddress(currentUser, index, addressDeletedChange);
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#05acbe',
                }}>
                Remove Address
              </Text>
            </Pressable>
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
                  NEW ADDRESS
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

// Edit Credential Page
function EditCredential({ navigation, route }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished
  const [currentEmail, currentEmailChange] = useState(''); // State for holding the current email of the user
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
    }
    userLoadingChange(false); // Changing userLoading back to false after currentUser has loaded
  }

  if (saving && editResponse.length != 0) {
    if (editResponse != 'Credential changed!') {
      savingChange(false);
    } else if (editResponse == 'Credential changed!') {
      if (route.params.selected == 'Username') {
        storeUser(newUsername);
        navigation.goBack();
      } else if (route.params.selected == 'Email') {
        navigation.goBack();
      } else if (route.params.selected == 'Password') {
        navigation.goBack();
      }
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
                ? '\nCurrent Username : ' + currentUser
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

// Select Credential Page
function SelectCredential({ navigation }) {
  const [currentUser, currentUserChange] = useState(''); // State for holding the current user
  const [userLoading, userLoadingChange] = useState(false); // State for checking if current user async function has finished

  useEffect(() => {
    // useEffect used to only get the currentUser, if it exists
    getUser(currentUserChange, userLoadingChange); // Called to get the current user that's logged in, if any user is logged in at all
  }, []);

  if (userLoading) {
    userLoadingChange(false); // Changing userLoading back to false after currentUser has loaded
  }

  // Function for creating a credential-select Pressable for scrollview
  function credentialSelectPressable(text, onpress) {
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
            <Text style={styles.cartAccountTitle}>Select Credential{'\n'}</Text>
            <ScrollView>
              {credentialSelectPressable('Edit Email', function () {
                navigation.navigate('EditCredential', { selected: 'Email' });
              })}
              {credentialSelectPressable('Edit Username', function () {
                navigation.navigate('EditCredential', { selected: 'Username' });
              })}
              {credentialSelectPressable('Edit Password', function () {
                navigation.navigate('EditCredential', { selected: 'Password' });
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
}

// Account/Logged-In Page
function Account({ navigation, route }) {
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
                navigation.navigate('SelectAddress');
              })}
              {settingChangePressable('Edit Credentials', function () {
                navigation.navigate('SelectCredential');
              })}
              <Pressable // Logout button
                style={styles.submitButton}
                onPress={() => {
                  logout(currentUserChange, userLoadingChange);
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

// Sign Up Page
function SignUp({ navigation, route }) {
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

  if (signUpResponse == 'User created!') {
    // If user has been created on backend
    storeUser(username); // Store the current user to the async storage
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

// Login Page
function Login({ navigation, route }) {
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

// Search Response and Categories Page
function SearchAndCategories({ navigation, route }) {
  const [navigationView, navigationChange] = useState(false); // State for checking if navigation-opening button (three lined) is pressed
  const [navigationFromPage, navigationFromPageChange] = useState(
    route.params.nav
  ); // State for seeing if navigation list was used in previous page
  const [loading, loadingChange] = useState(false); // State for checking if products have loaded into products State variable
  const [productsReturn, productsReturnChange] = useState([]); // State for retrieving the fetched/called database values
  const [productsArray, productsArraychange] = useState([]); // State that actually holds product data from database, using the fetched array (productsReturn)
  const [search, searchChange] = useState(route.params.title); // State for search query

  useEffect(() => {
    // useEffect used to only call getProducts function once: when page is rendered
    getProducts(loadingChange, productsReturnChange); // Called to get products from database, and saves it to products State variable
  }, []);

  if (loading) {
    // Method for putting database products into an array of dictionaries (if statement makes sure it loads only after get request is complete)
    for (var i = 0; i < productsReturn.length; i++) {
      var productRow = {};
      productRow['type'] = productsReturn[i][0];
      productRow['title'] = productsReturn[i][1];
      productRow['image'] = productsReturn[i][2];
      productRow['category'] = productsReturn[i][3];
      productRow['price'] = productsReturn[i][4];
      productsArray.push(productRow);
    }
    loadingChange(false);
  }

  function navigationButton(label) {
    // Function for rendering buttons for navigation list
    if (label == 'Home') {
      // Button for going to home page
      return (
        <>
          <Pressable
            onPress={() => navigation.replace('Home', { nav: true })}
            style={styles.navigationButton}>
            <Text style={styles.navigationButtonText}> {label} </Text>
          </Pressable>
          {/* View that acts as a space separator - similar to that on the listings */}
          <View style={{ height: height * 0.01 }}></View>
        </>
      );
    } else if (label != 'Home') {
      // Button for Going to other Category page
      if (route.params.title == label) {
        // If on current page - will just close the navigation list
        return (
          <>
            <Pressable
              onPress={() => {
                exit();
                navigationChange(!navigationView);
              }}
              style={[styles.navigationButton, { backgroundColor: '#05acbe' }]}>
              <Text
                style={[styles.navigationButtonText, { fontWeight: 'bold' }]}>
                {' '}
                {label}{' '}
              </Text>
            </Pressable>
            {/* View that acts as a space separator - similar to that on the listings */}
            <View style={{ height: height * 0.01 }}></View>
          </>
        );
      }
      if (route.params.title != label) {
        // If not on current page - will go to selected category page
        return (
          <>
            <Pressable
              onPress={() =>
                navigation.replace('SearchAndCategories', {
                  title: label,
                  nav: true,
                })
              }
              style={styles.navigationButton}>
              <Text style={styles.navigationButtonText}> {label} </Text>
            </Pressable>
            {/* View that acts as a space separator - similar to that on the listings */}
            <View style={{ height: height * 0.01 }}></View>
          </>
        );
      }
    }
  }

  const navigationButtonRender = (
    { item } // Actual rendering of navigation buttons by calling function
  ) => navigationButton(item.label);

  // Function for rendering listings based on the search query to look for matches in categories or title of products
  function listings(type, title, image, category, price) {
    let searchQuery = route.params.title.toLowerCase(); // Search query turned into lower case
    let searchArray = searchQuery.split(' '); // Array of strings from search query split by spaces
    let searchQueryIncludes = false; // Boolean used to check if product titles or categories include words of the search query
    let titleCheck = title.toLowerCase(); // Converting title to lower case to look for matches
    let categoryCheck = category.toLowerCase(); // Converting categories to lower case to look for matches

    for (let x = 0; x < searchArray.length; x++) {
      // For loop to check if any of the search query words are included in the title or category of each listing
      if (
        titleCheck.includes(searchArray[x]) ||
        categoryCheck.includes(searchArray[x]) // If search query word is in title or category
      ) {
        searchQueryIncludes = true; // Set bool to true
      }
    }
    if (type == 'product' && searchQueryIncludes) {
      // Listing rendering based on categories/search query
      return (
        <>
          {/*Pressable Container to make the listing a pressable to go to its product page*/}
          <Pressable
            onPress={() => {
              navigation.setOptions({ animation: 'slide_from_bottom' });
              navigation.navigate('ProductPage', {
                title: title,
                image: image,
                price: price,
              });
            }}>
            {/*Full Container of product listing*/}
            <View style={styles.listing}>
              {/*Image for listing*/}
              <Image
                style={styles.productListingImage}
                source={{ uri: image }}
              />
              {/*View for text of listing*/}
              <View style={styles.productText}>
                {/*Actual text*/}
                <Text style={styles.productTextTitle}>{title}</Text>
                <Text style={styles.productTextTitle}>${price}</Text>
              </View>
            </View>
          </Pressable>
          {/*View for creating a space between components of body page */}
          <View style={{ height: height * 0.01, width: '100%' }}></View>
        </>
      );
    }
  }
  {
    /*Actual rendering of home page listings by calling on function*/
  }
  const listingsRender = ({ item }) =>
    listings(item.type, item.title, item.image, item.category, item.price);

  const navAnimation = useRef(
    new Animated.Value(navigationFromPage ? 0 : -190)
  ).current; // Animation for navigation list (uses its margin left value for appearance)

  const enter = () => {
    // Entering animation
    Animated.timing(navAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const exit = () => {
    // Exiting animation
    Animated.timing(navAnimation, {
      toValue: -190,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      {/*Animated View for pop-up button list*/}
      <Animated.View
        style={[styles.navigationListContainer, { marginLeft: navAnimation }]}>
        {/* Space between top of phone and actual navigation list */}
        <View style={{ height: height * 0.05 }}></View>
        <FlatList // FlatList for list of buttons to select from
          data={navData}
          renderItem={navigationButtonRender}
        />
      </Animated.View>
      {/*View for all components on Search/Categories page*/}
      <View
        opacity={navigationView ? 0.25 : null} // Changes opacity based on if navigation list is open
        style={styles.allViews}>
        {navigationView ? (
          <Pressable // Creates pressable when navigation list is open that acts as an opaque "canceler" to close navigation list, and starts the exit animation for the nav list
            onPress={() => {
              exit();
              navigationChange(!navigationView);
            }}
            style={styles.allViewsPressable}
            opacity={1}></Pressable>
        ) : null}
        {/*Container for Search/Category page*/}
        <View style={styles.mainPage}>
          {/*View for title flexbox*/}
          <View style={styles.titleContainer}>
            <Pressable // Pressable for navigation opener
              onPress={() => {
                enter(); // Start animation for nav list appearance
                navigationFromPageChange(false); // Set to false to change margin for nav list to be correct
                navigationChange(!navigationView); // Changes state variable of if the three-lined button is pressed or not
              }}
              style={styles.openNavigationButton}>
              <Image source={lines} style={styles.openNavigationButtonImage} />
            </Pressable>
            <Pressable // Pressable logo to return to home screen
              style={styles.capelliLogoPressable}
              onPress={() => {
                navigation.setOptions({ animation: 'none' });
                navigation.replace('Home');
              }}>
              <Image source={capelliLogo} style={styles.capelliLogoImage} />
            </Pressable>
            <Pressable // Pressable for shopping cart image
              onPress={() => {
                navigation.setOptions({ animation: 'slide_from_bottom' });
                navigation.navigate('CartPage');
              }}
              style={[styles.cartPressable, { marginTop: height * -0.14 }]}>
              <Image source={cart} style={styles.cartImage} />
            </Pressable>
            <Pressable // Pressable for account image
              onPress={() => {
                navigation.setOptions({ animation: 'slide_from_bottom' });
                navigation.navigate('Account');
              }}
              style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
              <Image source={account} style={styles.accountImage} />
            </Pressable>
          </View>
          {/* View/Container for Search Bar */}
          <View style={{ height: 50, paddingBottom: 5 }}>
            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              onChangeText={searchChange}
              placeholder="Search for a product here!"
              returnKeyType="search"
              value={search}
              onSubmitEditing={() =>
                navigation.replace('SearchAndCategories', {
                  title: search,
                  nav: false,
                })
              }
              clearButtonMode="while-editing"
            />
          </View>
          {/*View for body flexbox*/}
          <View style={styles.body}>
            {productsArray.length == 0 ? ( // Display AcitivtyIndicator while productsArray state is rendering/loading
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#05acbe" />
              </View>
            ) : (
              // Flatlist for rendering product listings
              <FlatList data={productsArray} renderItem={listingsRender} />
            )}
          </View>
        </View>
      </View>
      {/* If statement for making sure nav list exit animation is played AFTER product info is loaded to keep animation clean */}
      {navigationFromPage && productsArray.length != 0 ? exit() : null}
    </>
  );
}

// Home Page
function Home({ navigation, route }) {
  const [navigationView, navigationChange] = useState(false); // State for checking if navigation-opening button (three lined) is pressed
  const [navigationFromPage, navigationFromPageChange] = useState(
    route.params.nav
  ); // State for seeing if navigation list was used in previous page
  const [loading, loadingChange] = useState(false); // State for checking if products have loaded into products State variable
  const [currentUser, currentUserChange] = useState(''); // State for checking if there is a user logged in
  const [productsReturn, productsReturnChange] = useState([]); // State for retrieving the fetched/called database values
  const [productsArray, productsArraychange] = useState([]); // State that actually holds product data from database, using the fetched array (productsReturn)
  const [search, searchChange] = useState(''); // State for search query

  useEffect(() => {
    // useEffect used to only call getProducts function once: when page is rendered
    getProducts(loadingChange, productsReturnChange); // Called to get products from database, and saves it to products State variable
  }, []);
  if (loading) {
    // Method for putting database products into an array of dictionaries (if statement makes sure it loads only after get request is complete)
    for (var i = 0; i < productsReturn.length; i++) {
      var productRow = {};
      productRow['type'] = productsReturn[i][0];
      productRow['title'] = productsReturn[i][1];
      productRow['image'] = productsReturn[i][2];
      productRow['category'] = productsReturn[i][3];
      productRow['price'] = productsReturn[i][4];
      productsArray.push(productRow);
    }
    productsArray.splice(0, 0, {
      // Banner addition to productsArray
      type: 'banner',
      title: 'banner1',
      image: 'https://i.imgur.com/Ysr5EP8.jpg',
    });
    loadingChange(false); // Changes loading state back to false
  }

  function navigationButton(label) {
    // Function for rendering buttons for navigation list
    if (label == 'Home') {
      // Button for going to home page (is highlighted to show that user is currently on home page)
      return (
        <>
          <Pressable
            onPress={() => (exit(), navigationChange(!navigationView))}
            style={[styles.navigationButton, { backgroundColor: '#05acbe' }]}>
            <Text style={[styles.navigationButtonText, { fontWeight: 'bold' }]}>
              {' '}
              {label}{' '}
            </Text>
          </Pressable>
          {/* View that acts as a space separator - similar to that on the listings */}
          <View style={{ height: height * 0.01 }}></View>
        </>
      );
    } else if (label != 'Home') {
      // Button for going to other page
      return (
        <>
          <Pressable
            onPress={() =>
              navigation.replace('SearchAndCategories', {
                title: label,
                nav: true,
              })
            }
            style={styles.navigationButton}>
            <Text style={styles.navigationButtonText}> {label} </Text>
          </Pressable>
          <View style={{ height: height * 0.005 }}></View>
        </>
      );
    }
  }

  const navigationButtonRender = (
    { item } // Actual rendering of navigation buttons by calling function
  ) => navigationButton(item.label);

  function bodyPage(type, title, image, price) {
    // Function for rendering body of home page
    if (type == 'banner') {
      // Banner rendering
      return (
        <>
          <Image style={styles.banners} source={{ uri: image }} />
          {/*View for creating a space between components of body page */}
          <View style={{ height: height * 0.01, width: '100%' }}></View>
        </>
      );
    }
    if (type == 'product') {
      // Products render
      return (
        <>
          {/*Pressable Container to make the listing a pressable to go to its product page*/}
          <Pressable
            onPress={() => {
              navigation.setOptions({ animation: 'slide_from_bottom' });
              navigation.navigate('ProductPage', {
                title: title,
                image: image,
                price: price,
              });
            }}>
            {/*Full Container of product listing*/}
            <View style={styles.listing}>
              {/*Image for listing*/}
              <Image
                style={styles.productListingImage}
                source={{ uri: image }}
              />
              {/*View for text of listing*/}
              <View style={styles.productText}>
                {/*Actual text*/}
                <Text style={styles.productTextTitle}>{title}</Text>
                <Text style={styles.productTextTitle}>${price}</Text>
              </View>
            </View>
          </Pressable>
          {/*View for creating a space between components of body page */}
          <View style={{ height: height * 0.01, width: '100%' }}></View>
        </>
      );
    }
  }

  // Actual rendering of home page listings by calling on function
  const bodyPageRender = ({ item }) =>
    bodyPage(item.type, item.title, item.image, item.price);

  const navAnimation = useRef(
    new Animated.Value(navigationFromPage ? 0 : -190)
  ).current; // Animation for navigation list (uses its margin left value for appearance)

  const enter = () => {
    // Entering animation
    Animated.timing(navAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const exit = () => {
    // Exiting animation
    Animated.timing(navAnimation, {
      toValue: -190,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      {/*Animated View for pop-up button list*/}
      <Animated.View
        style={[styles.navigationListContainer, { marginLeft: navAnimation }]}>
        {/* Space between top of phone and actual navigation list */}
        <View style={{ height: height * 0.05 }}></View>
        <FlatList // FlatList for list of buttons to select from
          data={navData}
          renderItem={navigationButtonRender}
        />
      </Animated.View>
      {/*View for all components of the page*/}
      <View
        opacity={navigationView ? 0.25 : null} // Changes opacity based on if navigation list is open
        style={styles.allViews}>
        {navigationView ? (
          <Pressable // Creates pressable when navigation list is open that acts as an opaque "canceler" to close navigation list, and starts the exit animation for the nav list
            onPress={() => {
              exit();
              navigationChange(!navigationView);
            }}
            style={styles.allViewsPressable}
            opacity={1}></Pressable>
        ) : null}
        {/*Container for main home page*/}
        <View style={styles.mainPage}>
          {/*View for title flexbox*/}
          <View style={styles.titleContainer}>
            <Pressable // Pressable for navigation opener
              onPress={() => {
                enter(); // Start animation for nav list appearance
                navigationFromPageChange(false); // Set to false to change margin for nav list to be correct
                navigationChange(!navigationView); // Changes state variable of if the three-lined button is pressed or not
              }}
              style={styles.openNavigationButton}>
              <Image source={lines} style={styles.openNavigationButtonImage} />
            </Pressable>
            <Pressable style={styles.capelliLogoPressable}>
              <Image source={capelliLogo} style={styles.capelliLogoImage} />
            </Pressable>
            <Pressable // Pressable for shopping cart image
              onPress={() => {
                navigation.setOptions({ animation: 'slide_from_bottom' });
                navigation.navigate('CartPage');
              }}
              style={[styles.cartPressable, { marginTop: height * -0.14 }]}>
              <Image source={cart} style={styles.cartImage} />
            </Pressable>
            <Pressable // Pressable for account image
              onPress={() => {
                navigation.setOptions({ animation: 'slide_from_bottom' });
                navigation.navigate('Account');
              }}
              style={[styles.accountPressable, { marginTop: height * -0.06 }]}>
              <Image source={account} style={styles.accountImage} />
            </Pressable>
          </View>
          {/* View/Container for Search Bar */}
          <View style={{ height: 50, paddingBottom: 5 }}>
            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              onChangeText={searchChange}
              placeholder="Search for a product here!"
              onSubmitEditing={() => {
                if (search.length != 0) {
                  navigation.replace('SearchAndCategories', {
                    title: search,
                    nav: false,
                  });
                }
              }}
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </View>
          {/* View for body flexbox */}
          <View style={styles.body}>
            {productsArray.length == 0 ? ( // Display AcitivtyIndicator while productsArray state is rendering/loading
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#05acbe" />
              </View>
            ) : (
              // FlatList of banner and product listings
              <FlatList data={productsArray} renderItem={bodyPageRender} />
            )}
          </View>
        </View>
      </View>
      {/* If statement for making sure nav list exit animation is played AFTER product info is loaded to keep animation clean */}
      {navigationFromPage && productsArray.length != 0 ? exit() : null}
    </>
  );
}

// Complete app that calls on different pages to render (React Navigation)
export default function App() {
  const Stack = createNativeStackNavigator(); // Navigator Stack
  return (
    // Container to hold all navigators/stacks
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{ nav: false }}
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="SearchAndCategories"
          component={SearchAndCategories}
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="ProductPage"
          component={ProductPage}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="CartPage"
          component={CartPage}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="SelectAddress"
          component={SelectAddress}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="SelectCredential"
          component={SelectCredential}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="EditCredential"
          component={EditCredential}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="EditAddress"
          component={EditAddress}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="AddAddress"
          component={AddAddress}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles for all components
const styles = StyleSheet.create({
  // All View FlexBox/Container - Used for home and SearchAndCategories page for navigation list
  allViews: {
    flexDirection: 'row',
    height: height,
    width: width,
  },
  // Main home page style for all components of the page
  mainPage: {
    flexDirection: 'column',
    flex: 1,
  },
  // Style for creating the allView into a opaque pressable
  allViewsPressable: {
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 1,
  },
  // Style for List of Navigation Buttons
  navigationListContainer: {
    flexDirection: 'column',
    width: width * 0.45,
    height: height,
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'white',
  },
  // Style for each of the navigation buttons
  navigationButton: {
    width: '92.5%',
    height: height * 0.075,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  // Style for the text of the navigation button
  navigationButtonText: {
    textAlign: 'center',
    fontSize: 15,
  },
  // Title flexbox container (Logo and button for list)
  titleContainer: {
    flexDirection: 'column',
    flex: 0.75,
    width: '100%',
    paddingBottom: 10,
  },
  // Controls location and size of the navigation-opening button (the pressable)
  openNavigationButton: {
    width: width * 0.095,
    height: height * 0.05,
    marginTop: height * 0.05,
    marginLeft: width * 0.05,
  },
  // Style for Image of button to show the list of navigation buttons
  openNavigationButtonImage: {
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
  },
  // Style for back button in product pages
  backButton: {
    width: width * 0.1,
    height: height * 0.055,
    marginTop: height * 0.045,
    marginLeft: width * 0.04,
  },
  // Style for image of back button in product pages
  backButtonImage: {
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
  },
  // Pressable
  capelliLogoPressable: {
    marginTop: height * -0.055,
    width: width * 0.37,
    height: height * 0.135,
    alignSelf: 'center',
  },
  // Style of capelli logo
  capelliLogoImage: {
    resizeMode: 'stretch',
    width: width * 0.37,
    height: height * 0.135,
    alignSelf: 'center',
  },
  // Style of cart pressable
  cartPressable: {
    resizeMode: 'stretch',
    width: width * 0.115,
    height: height * 0.065,
    alignSelf: 'flex-end',
    marginRight: width * 0.02,
  },
  // Style for image cart
  cartImage: {
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
  },
  // Style of cart pressable
  accountPressable: {
    resizeMode: 'stretch',
    width: width * 0.1,
    height: height * 0.055,
    alignSelf: 'flex-end',
    marginRight: width * 0.19,
  },
  // Style for image cart
  accountImage: {
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
  },
  // TextInput/SearchBar Style
  searchBar: {
    alignSelf: 'center',
    width: '99%',
    height: '100%',
    borderWidth: 2,
    fontSize: 21,
    borderRadius: 5,
    paddingLeft: 5,
  },
  // Body flexbox container (container for everything below title container)
  body: {
    flex: 3,
    flexDirection: 'column',
  },
  // Style for banners
  banners: {
    flex: 1,
    width: '100%',
    height: height * 0.4,
    resizeMode: 'stretch',
  },
  // Container for a product listing
  listing: {
    flexDirection: 'row',
    width: width,
    height: height * 0.21,
    borderWidth: 2,
    borderRadius: 12.5,
  },
  // Style for the image of the product listing
  productListingImage: {
    flex: 0.75,
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 25,
  },
  // Style for the text of the product listing
  productText: {
    flex: 1,
    padding: 6,
  },
  // Product title text style for listing
  productTextTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Style for the image of the product page
  productPageImage: {
    width: width,
    height: height * 0.45,
    resizeMode: 'stretch',
    borderRadius: 20,
  },
  // Title text style for Product page
  productTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: width * 0.03,
    padding: 5,
  },
  // Title text style for cart + account page
  cartAccountTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: height * -0.03,
  },
  // Account Input Lable for text input box
  inputLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 2,
  },
  // Input Bar below input label
  inputBar: {
    width: '99%',
    height: 45,
    borderWidth: 2,
    fontSize: 25,
    borderRadius: 5,
    padding: 2,
    alignSelf: 'center',
  },
  // Submit button for account sign-up + login
  submitButton: {
    width: '45%',
    height: height * 0.06,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05acbe',
    borderRadius: 7.5,
  },
  // Add to cart pressable
  addToCartButton: {
    width: '70%',
    height: height * 0.06,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#05acbe',
    borderRadius: 7.5,
  },
  // Quantity text input for cart page listings
  cartQuantityInput: {
    marginTop: height * -0.004,
    width: '25%',
    height: '100%',
    fontSize: 22,
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 2,
  },
  // Quantity text input for product page listings
  productQuantityInput: {
    width: '12.5%',
    height: '100%',
    fontSize: 22,
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 2,
  },
  // Account setting-change pressable
  accountChangePressable: {
    borderWidth: 2,
    paddingLeft: 2,
    borderRadius: 5,
    flexDirection: 'row',
    paddingVertical: height * 0.02,
    justifyContent: 'space-between',
  },
  // Forward arrow style for account change pressable
  accountChangePressableArrow: {
    width: '7.5%',
    height: '100%',
    resizeMode: 'stretch',
    alignSelf: 'flex-end',
  },
  // Pressable for address change
  addressChangePressable: {
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'row',
    paddingVertical: height * 0.01,
    paddingLeft: 2,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  // Forward arrow style for address change pressable
  addressChangePressableArrow: {
    width: '100%',
    height: '50%',
    resizeMode: 'stretch',
    alignSelf: 'flex-end',
    marginBottom: '7.5%',
  },
  // View style for Picker for address change page
  pickerViewStyle: {
    paddingLeft: 2,
    height: height * 0.055,
    flexDirection: 'column',
    width: '25%',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  pickerStyle: {
    inputIOS: {
      fontSize: 22,
      color: 'black',
      borderWidth: 2,
      borderRadius: 5,
      height: '100%',
      padding: 2,
    },
    inputAndroid: {
      fontSize: 22,
      borderWidth: 2,
      color: 'black',
      borderRadius: 5,
      height: '100%',
      padding: 2,
    },
  },
});
