import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Placeholder data for contacts
const contacts = [
  { id: '1', name: 'Alice', type: 'Friends' },
  { id: '2', name: 'Bob', type: 'Friends' },
  { id: '3', name: 'Charlie', type: 'Family' },
  { id: '4', name: 'Dave', type: 'Group' },
];

// Logo Component
const HeaderLogo = () => (
  <Image source={require('./assets/images/sqe_logo.jpeg')} style={{ width: 30, height: 30 }} />
);

// Section Description Component
const SectionDescription = ({ description }) => (
  <View style={styles.descriptionContainer}>
    <Text style={styles.descriptionText}>{description}</Text>
  </View>
);

// Search Bar Component
const SearchBar = ({ onChange }) => (
  <TextInput
    style={styles.searchBar}
    placeholder="Search Contacts"
    onChangeText={onChange}
  />
);

// Contact List Component
const ContactList = ({ type, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredContacts = contacts.filter(
    (contact) => contact.type === type && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.contactListContainer}>
      <SearchBar onChange={setSearchQuery} />
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => navigation.navigate('ContactDetails', { contact: item })}
          >
            <Text style={styles.contactName}>{item.name}</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => console.log('Delete contact:', item.id)}
            >
              <Ionicons name="close-circle" size={24} color="#dc3545" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <AddContactModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        contactType={type}
      />
    </View>
  );
};

const FriendsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <SectionDescription description="Add your close friends." />
    <ContactList type="Friends" navigation={navigation} />
  </View>
);

const FamilyScreen = ({ navigation }) => (
  <View style={styles.container}>
    <SectionDescription description="Add your Family, those closest to you." />
    <ContactList type="Family" navigation={navigation} />
  </View>
);

const GroupScreen = ({ navigation }) => (
  <View style={styles.container}>
    <SectionDescription description="Add other groups you contact with." />
    <ContactList type="Group" navigation={navigation} />
    <TouchableOpacity style={styles.addGroupButton}>
      <Text style={styles.addGroupText}>+ Create Group Chat</Text>
    </TouchableOpacity>
  </View>
);

const ChatScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Chat Interface</Text>
  </View>
);

const LoginScreen = ({ navigation }) => (
  <View style={styles.loginContainer}>
    <Image source={require('./assets/images/sqe_logo.jpeg')} style={styles.logo} />
    <TextInput placeholder="Username" style={styles.input} />
    <TextInput placeholder="Password" secureTextEntry style={styles.input} />
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Messenger')}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  </View>
);

// Update the LogoutButton component
const LogoutButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 15 }}>
    <Ionicons name="arrow-back-outline" size={24} color="#fff" />
  </TouchableOpacity>
);

const MessengerTabs = ({ navigation }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: '#007aff' },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'lightgray',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Friends') {
          iconName = 'people-outline';
        } else if (route.name === 'Family') {
          iconName = 'home-outline';
        } else if (route.name === 'Group') {
          iconName = 'chatbubble-ellipses-outline';
        }
        return (
          <Ionicons
            name={iconName}
            size={focused ? size + 4 : size} // Increase size when focused
            color={color}
            style={focused ? styles.focusedIcon : null} // Add visual effect for focus
          />
        );
      },
    })}
  >
    <Tab.Screen name="Friends" component={FriendsScreen} />
    <Tab.Screen name="Family" component={FamilyScreen} />
    <Tab.Screen name="Group" component={GroupScreen} />
  </Tab.Navigator>
);

// Add new contact modal component
const AddContactModal = ({ visible, onClose, contactType }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sqid, setSqid] = useState('');

  const handleSubmit = () => {
    // Here you would typically handle adding the contact to your data
    console.log('New contact:', { firstName, lastName, sqid, type: contactType });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Contact</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="SQID"
            value={sqid}
            onChangeText={setSqid}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Update the ContactDetailsScreen component
const ContactDetailsScreen = ({ route }) => {
  const { contact } = route.params;
  return (
    <View style={styles.container}>
      <View style={styles.contactDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>First Name</Text>
          <Text style={styles.detailValue}>{contact.firstName || 'Not set'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Name</Text>
          <Text style={styles.detailValue}>{contact.lastName || 'Not set'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>SQE Username</Text>
          <Text style={styles.detailValue}>{contact.username || 'Not set'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>SQID</Text>
          <Text style={styles.detailValue}>{contact.sqid || 'Not set'}</Text>
        </View>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Messenger"
          component={MessengerTabs}
          options={({ navigation }) => ({
            headerTitle: () => <HeaderLogo />,
            headerStyle: { backgroundColor: '#007aff' },
            headerLeft: () => (
              <LogoutButton onPress={() => navigation.navigate('Login')} />
            ),
          })}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerStyle: { backgroundColor: '#007aff' },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="ContactDetails"
          component={ContactDetailsScreen}
          options={{
            headerStyle: { backgroundColor: '#007aff' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007aff',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
  },
  contactListContainer: {
    flex: 1,
  },
  contactItem: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  contactName: {
    fontSize: 16,
    color: '#333',
  },
  addGroupButton: {
    backgroundColor: '#007aff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addGroupText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007aff',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactDetails: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
});
