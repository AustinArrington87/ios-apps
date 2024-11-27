import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Type Definitions
type Contact = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  sqid: string;
  type: 'Friends' | 'Family' | 'Group';
};

type RootStackParamList = {
  Login: undefined;
  Messenger: undefined;
  Chat: undefined;
  ContactDetails: { contact: Contact };
};

type TabParamList = {
  Friends: undefined;
  Family: undefined;
  Group: undefined;
};

// Navigation Type Definitions
const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Sample Data
const contacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', firstName: 'Alice', lastName: 'Johnson', username: 'alice.j', sqid: 'SQ001', type: 'Friends' },
  { id: '2', name: 'Bob Smith', firstName: 'Bob', lastName: 'Smith', username: 'bob.smith', sqid: 'SQ002', type: 'Friends' },
  { id: '3', name: 'Charlie Brown', firstName: 'Charlie', lastName: 'Brown', username: 'charlie.b', sqid: 'SQ003', type: 'Family' },
  { id: '4', name: 'Dave Wilson', firstName: 'Dave', lastName: 'Wilson', username: 'dave.w', sqid: 'SQ004', type: 'Group' },
];

// Component Props Types
type HeaderLogoProps = {};
type SectionDescriptionProps = {
  description: string;
};
type SearchBarProps = {
  onChange: (text: string) => void;
};
type ContactListProps = {
  type: Contact['type'];
  navigation: any; // Replace with proper navigation type if needed
};
type AddContactModalProps = {
  visible: boolean;
  onClose: () => void;
  contactType: Contact['type'];
};
type CreateGroupModalProps = {
  visible: boolean;
  onClose: () => void;
};

// Components
const HeaderLogo: React.FC<HeaderLogoProps> = () => (
  <Image source={require('./assets/images/sqe_logo.jpeg')} style={{ width: 30, height: 30 }} />
);

const SectionDescription: React.FC<SectionDescriptionProps> = ({ description }) => (
  <View style={styles.descriptionContainer}>
    <Text style={styles.descriptionText}>{description}</Text>
  </View>
);

const SearchBar: React.FC<SearchBarProps> = ({ onChange }) => (
  <TextInput
    style={styles.searchBar}
    placeholder="Search Contacts"
    onChangeText={onChange}
  />
);

const ContactList: React.FC<ContactListProps> = ({ type, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter(
    (contact) => contact.type === type && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedContact) {
      console.log('Deleting contact:', selectedContact.id);
      // API call would go here
    }
    setDeleteModalVisible(false);
    setSelectedContact(null);
  };

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
              onPress={() => handleDelete(item)}
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

      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Contact</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete {selectedContact?.name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#dc3545' }]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AddContactModal: React.FC<AddContactModalProps> = ({ visible, onClose, contactType }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [sqid, setSqid] = useState('');

  const handleSubmit = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      username,
      sqid,
      type: contactType
    };
    console.log('New contact:', newContact);
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
            placeholder="SQE Username"
            value={username}
            onChangeText={setUsername}
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
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ visible, onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const handleSelectContact = (contact: Contact) => {
    if (selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleCreateGroup = () => {
    console.log('Creating group:', {
      name: groupName,
      members: selectedContacts
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <Text style={styles.modalTitle}>Create Group Chat</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <Text style={styles.modalSubtitle}>Select Members:</Text>
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 200 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.selectableContact,
                  selectedContacts.find(c => c.id === item.id) && styles.selectedContact
                ]}
                onPress={() => handleSelectContact(item)}
              >
                <Text style={styles.selectableContactText}>{item.name}</Text>
                {selectedContacts.find(c => c.id === item.id) && (
                  <Ionicons name="checkmark-circle" size={24} color="#007aff" />
                )}
              </TouchableOpacity>
            )}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleCreateGroup}
            >
              <Text style={styles.modalButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ContactDetailsScreen: React.FC<{ route: { params: { contact: Contact } } }> = ({ route }) => {
  const { contact } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(contact.firstName);
  const [lastName, setLastName] = useState(contact.lastName);

  const handleSave = () => {
    console.log('Saving updates:', { firstName, lastName });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contactDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>First Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={firstName}
              onChangeText={setFirstName}
            />
          ) : (
            <Text style={styles.detailValue}>{firstName}</Text>
          )}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={lastName}
              onChangeText={setLastName}
            />
          ) : (
            <Text style={styles.detailValue}>{lastName}</Text>
          )}
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>SQE Username</Text>
          <Text style={styles.detailValue}>{contact.username}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>SQID</Text>
          <Text style={styles.detailValue}>{contact.sqid}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.editButton, isEditing && styles.saveButton]}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save Changes' : 'Edit Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendsScreen: React.FC = ({ navigation }) => (
  <View style={styles.container}>
    <SectionDescription description="Add your close friends." />
    <ContactList type="Friends" navigation={navigation} />
  </View>
);

const FamilyScreen: React.FC = ({ navigation }) => (
  <View style={styles.container}>
    <SectionDescription description="Add your Family, those closest to you." />
    <ContactList type="Family" navigation={navigation} />
  </View>
);

const GroupScreen: React.FC = ({ navigation }) => {
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <SectionDescription description="Add other groups you contact with." />
      <ContactList type="Group" navigation={navigation} />
      <TouchableOpacity 
        style={styles.addGroupButton}
        onPress={() => setCreateGroupModalVisible(true)}
      >
        <Text style={styles.addGroupText}>+ Create Group Chat</Text>
      </TouchableOpacity>
      <CreateGroupModal
        visible={createGroupModalVisible}
        onClose={() => setCreateGroupModalVisible(false)}
      />
    </View>
  );
};

const ChatScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Chat Interface</Text>
  </View>
);

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View style={styles.loginContainer}>
    <Image source={require('./assets/images/sqe_logo.jpeg')} style={styles.logo} />
    <TextInput placeholder="Username" style={styles.input} />
    <TextInput placeholder="Password" secureTextEntry style={styles.input} />
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Messenger')}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
  </View>
);

const LogoutButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ marginLeft: 15 }}>
    <Ionicons name="arrow-back-outline" size={24} color="#fff" />
  </TouchableOpacity>
);

const MessengerTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: '#007aff' },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'lightgray',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = '';
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
            size={focused ? size + 4 : size}
            color={color}
            style={focused ? styles.focusedIcon : null}
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

export default function App(): JSX.Element {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 16,
    color: '#333',
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
    padding: 5,
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
  modalText: {
    fontSize: 16,
    marginBottom: 20,
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
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: '60%',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  editButtonText: {
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
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
  selectableContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedContact: {
    backgroundColor: '#e6f3ff',
  },
  selectableContactText: {
    fontSize: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  focusedIcon: {
    transform: [{ scale: 1.1 }],
  },
});
