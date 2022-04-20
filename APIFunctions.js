import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to call Products endpoint to get product data (takes setState functions as parameters)
export async function getProducts(loadingChanger, productsChanger) {
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
export async function signup(email, username, password, signupChange) {
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
export async function login(username, password, loginChange) {
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

// Function for storing a user's token that has logged in or signed up
export async function storeUser(token) {
  await AsyncStorage.setItem('@storage_Key', token);
}

// Function for getting the currently logged in user (used by Login and Account components/pages)
export async function getUser(userChange, loadingChange) {
  try {
    let response = await AsyncStorage.getItem('@storage_Key');
    userChange(response); // Change current user state to the currently logged in user
  } finally {
    loadingChange(true); // Changes loading state to true
  }
}

// Function for logging out of any user currently logged in
export async function logout(currentUser, userChange, loadingChange) {
  AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
  const response = await fetch(
  'https://adrielcapelli.pythonanywhere.com/logout',
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: currentUser,
    }),
  }
);
  const json = await response.json();
  userChange(''); // Clear state for current user
  loadingChange(true); // Changes loading state to true
}

// Function for sending newly added item to account cart
export async function addToCart(
  token,
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
        token: token,
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
export async function getCart(token, cartChange, loadingChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/getCart',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );
  const json = await response.json();
  cartChange(json['cart']);
  loadingChange(true);
}

// Function for changing an existing address of a user
export async function changeAddress(
  token,
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
        token: token,
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
export async function deleteAddress(token, index, addressDeleted) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/deleteAddress',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        index: index,
      }),
    }
  );
  const json = await response.json();
  addressDeleted(true);
}

// Function for adding a New Address to the user's account
export async function addAddress(
  token,
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
        token: token,
        addressOne: addressOne,
        addressTwo: addressTwo,
        state: state,
        zipCode: zipCode,
      }),
    }
  );
  const json = await response.json();
  console.log(json);
  addressesDoneChange(true);
}

// Function for getting address of currently logged in user
export async function getAddresses(token, addressChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/getAddresses',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );
  const json = await response.json();
  addressChange(json['addresses']);
}

// Function for changing qunatity of product in user's cart
export async function changeProductQuantity(token, productTitle, amount) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/updateCartQuantity',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        productTitle: productTitle,
        quantity: amount,
      }),
    }
  );
  const json = await response.json();
}

// Function for changing qunatity of product in user's cart
export async function deleteProduct(token, productTitle) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/deleteProduct',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        productTitle: productTitle,
      }),
    }
  );
  const json = await response.json();
}

// Function for getting email of current user
export async function getEmail(token, emailLoadedChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/getEmail',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );
  const json = await response.json();
  emailLoadedChange(json['response']);
}

// Function for getting username of current user
export async function getUsername(token, currentUsernameChange) {
  const response = await fetch(
    'https://adrielcapelli.pythonanywhere.com/getUsername',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    }
  );
  const json = await response.json();
  currentUsernameChange(json['response']);
}

// Function for getting email of current user
export async function changeCredential(
  token,
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
        token: token,
        selected: selected,
        newCredential: newCredential,
      }),
    }
  );
  const json = await response.json();
  editResponseChange(json['response']);
}