import {
  StyleSheet,
  Dimensions,
} from 'react-native';

var { height, width } = Dimensions.get('window'); // Device dimensions


// Styles for all components
export const styles = StyleSheet.create({
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
    maxHeight: height * 0.2,
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
