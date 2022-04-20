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
import RNPickerSelect from 'react-native-picker-select';

import capelliLogo from '../staticImages/CapelliLogo.png'; // Capelli logo png
import cart from '../staticImages/CartImage.png'; // Cart image for items in cart page
import accountSelected from '../staticImages/AccountImageSelected.png'; // Image to show the current page - Account page
import xButton from '../staticImages/XButton.png'; // Image for x button to exit out of account and cart pages
import { addAddress } from '../APIFunctions.js';  // Importing API/Async communication functions
import { styles } from '../styles.js';   // Importing StyleSheet

var { height, width } = Dimensions.get('window'); // Device dimensions

export function AddAddress({ navigation, route }) {
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