import React, { useRef, useState, useEffect } from 'react';
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
  ActivityIndicator,
  Platform,
} from 'react-native';

import capelliLogo from '../staticImages/CapelliLogo.png'; // Capelli logo png
import lines from '../staticImages/ThreeLines.png'; // Three lines png for navigation opener
import cart from '../staticImages/CartImage.png'; // Cart image for items in cart page
import account from '../staticImages/AccountImage.png'; // Account image for account page
import { getProducts } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

var navData = [
  // Navigation button labels
  { label: 'Home' },
  { label: 'Clippers' },
  { label: 'Trimmers' },
  { label: 'Shavers' },
];

export function Home({ navigation, route }) {
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