import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  View
} from "react-native";
import { styles } from "../Style/screenStyles/HomeScreenStyle";
import CustomAvatar from "../components/CustomAvatar";
import PercentageBar from "../components/ProgressBar";
import RandomPopup from "../components/eventsPopup/RandomPopup";
import { AuthContext } from "../context/auth";
import { getUserId } from "../context/axios";
import { UserContext } from "../context/user-context";
import data from "../data/userData.json";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  //const [userName, setUserName] = useState("Tom");
  const [currentUser, setCurrentUser] = useState();
  const [currentKey, setCurrentKey] = useState();
  const authContext = useContext(AuthContext);
  const userId = authContext.userId;
  const userContext = useContext(UserContext);
  const navigation = useNavigation();
  const user = userContext.userState
  React.useEffect(() => {
    async function loadUserName() {
      // load based on user Id
      if (userId) {
        // console.log("username: ", await AsyncStorage.getItem(userId));
        // setUserName(await AsyncStorage.getItem(userId));
        try {
          await getUserId(userId).then(({ key, current }) => {
            console.log("key current", key, current);
            setCurrentKey(key);
            userContext.updateUser(current);

          });

        } catch (err) {
          console.log(err.message);
        } finally {
          setIsLoading(false);
          userContext.loadUserDataFromStorage(userId);
          userContext.saveUserDataToStorage(userId);
        }

      }
    }
    loadUserName();
  }, [userId]);
  const [lifeStage, setLifeStage] = useState("Infant");

  let age = data.Info.age;
  const [ageLogs, setAgeLogs] = useState([
    {
      age: age,
      events: [`You are at the age of ${age}`],
    },
  ]);

  const [getAge, setAge] = useState(age);

  useEffect(() => {
    if (getAge <= 1) {
      setLifeStage("Infant");
    } else if (getAge <= 9) {
      setLifeStage("Kid");
    } else if (getAge <= 19) {
      setLifeStage("Teenager");
    } else setLifeStage("Adult");
  }, [getAge]);

  const [modalVisible, setModalVisible] = useState(false);
  function handleAgePress() {
    const newAge = getAge + 1;
    setAge(newAge);
    // Add a new object to the ageLogs array
    setAgeLogs((prevLogs) => [
      ...prevLogs,
      {
        age: newAge,
        events: [
          `You are at the age of ${newAge}`,
          `You are at the age of ${newAge}`,
        ],
      },
    ]);
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  const eventData = data.userAgeLogs;
  function renderItem({ item }) {
    return (
      <View style={styles.eventContainer}>
        <Text style={styles.ageText}> Age: {item.age} </Text>
        {item.events.map((event, id) => (
          <Text key={id} style={styles.eventText}>
            {event}
          </Text>
        ))}
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Level progress bar*/}
      <PercentageBar
        width={"100%"}
        height={12}
        backgroundColor={"#E0E9F2"}
        completedColor={"#EB9F4A"}
        percentage={data.Info.progress}
      />

      {/* Top container will contain avatar, age and balance*/}
      <View style={styles.topContainer}>
        <View style={styles.userInfo}>
          <View>
            <CustomAvatar width={54} height={54} />
            <View style={styles.level}>
              <Text>{getAge}</Text>
            </View>
          </View>
          <View style={styles.characterNameContainer}>
            <Text style={styles.stageStyle}> {lifeStage}</Text>
            <Text style={styles.username}>{user.userName}</Text>
            <Text style={styles.username}>{user.character.age}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.balance}>Balance:</Text>
          <Text style={styles.money}>${data.Info.money}</Text>
        </View>
      </View>

      {/* Container of user's events and different age */}
      <View style={styles.eventsContainer}>
        <FlatList
          data={ageLogs}
          renderItem={renderItem}
          keyExtractor={(item) => item.age}
        />
      </View>

      {/* Container of navigators and the status progress bar */}
      <View style={styles.underhalf}>
        <View style={styles.utility}>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <View style={styles.iconNavigateStyle}>
              <MaterialIcons
                name="work"
                size={24}
                color="black"
                onPress={() => {
                  navigation.navigate("Occupation");
                }}
              />
              <Text style={styles.navigateText}>Occupation</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate("Assets");
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <MaterialCommunityIcons name="sack" size={24} color="black" />
              <Text style={styles.navigateText}>Assets</Text>
            </View>
          </Pressable>
          <View style={styles.outterContainer}>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={handleAgePress}
            >
              <View style={styles.buttonContainer}>
                <Text style={styles.incrementAge}>+</Text>
                <Text style={styles.incrementAge}>Age</Text>
              </View>
            </Pressable>
            {/* random modal component */}
            <RandomPopup modalVisible={modalVisible} closeModal={closeModal} />
          </View>

          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={() => {
              navigation.navigate("Relationship");
            }}
          >
            <View style={styles.iconNavigateStyle}>
              <AntDesign name="heart" size={24} color="black" />
              <Text style={styles.navigateText}>Relationship</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={() => navigation.navigate("SchoolScreen")}
          >
            <View style={styles.iconNavigateStyle}>
              <Ionicons name="school" size={24} color="black" />
              <Text style={styles.navigateText}>Education</Text>
            </View>
          </Pressable>
        </View>

        <View
          style={
            Platform.OS === "ios"
              ? styles.allStatusContainer
              : [styles.allStatusContainer, { paddingBottom: 50 }]
          }
        >
          {
            console.log(typeof user?.status.health)
          }
          <View style={styles.statusContainer}>
            <Text style={styles.ageText}>Happiness:</Text>
            <PercentageBar
              height={15}
              backgroundColor="grey"
              completedColor="#009A34"
              percentage={parseInt(user?.status.happiness)}
              width={200}
            />
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.ageText}> Health:</Text>
            <PercentageBar
              height={15}
              backgroundColor="grey"
              completedColor="#EED817"
              percentage={parseInt(user?.status.health)}
              width={200}
            />
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.ageText}> Look:</Text>
            <PercentageBar
              height={15}
              backgroundColor="grey"
              completedColor="#FD7C1F"
              percentage={parseInt(user?.status.appearance)}
              width={200}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
