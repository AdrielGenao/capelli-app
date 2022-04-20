import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductPage } from './screens/ProductPage.js';  // Product Page
import { CartPage } from './screens/CartPage.js';  // Cart Page
import { CheckoutPage } from './screens/CheckoutPage.js' // Checkout Page
import { EditAddress } from './screens/EditAddress.js'  // Edit Address Page
import { AddAddress } from './screens/AddAddress.js'  // Add Address Page
import { SelectAddress } from './screens/SelectAddress.js'  // Select Address Page
import { EditCredential } from './screens/EditCredential.js'  // Edit Credential Page
import { SelectCredential } from './screens/SelectCredential.js'  // Select Credential Page
import { Account } from './screens/Account.js'  // Account Page
import { SignUp } from './screens/Signup.js'  // Signup Page
import { Login } from './screens/Login.js'  // Login Page
import { SearchAndCategories } from './screens/SearchAndCategories.js'  // Search and Categories Page
import { Home } from './screens/Home.js'  // Home Page

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
          options={{ animation: 'default' }}
        />
        <Stack.Screen
          name="SelectCredential"
          component={SelectCredential}
          options={{ animation: 'default' }}
        />
        <Stack.Screen
          name="EditCredential"
          component={EditCredential}
          options={{ animation: 'default' }}
        />
        <Stack.Screen
          name="EditAddress"
          component={EditAddress}
          options={{ animation: 'default' }}
        />
        <Stack.Screen
          name="AddAddress"
          component={AddAddress}
          options={{ animation: 'default' }}
        />
        <Stack.Screen
          name="CheckoutPage"
          component={CheckoutPage}
          options={{ animation: 'default' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

