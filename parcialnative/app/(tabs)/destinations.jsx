import { navigate } from "expo-router/build/global-state/routing";
import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import "expo-router/entry";

const { width } = Dimensions.get("window"); // para obtener el ancho del dispositivo

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [favoriteDestinations, setFavoriteDestinations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("http://172.20.10.7:8000/destinations");
        const data = await response.json();
        console.log(data);
        setDestinations(data || []);
        let favoritos = [];
        destinations.forEach((element) => {
          if (element.isFavorite) favoritos.push(element);
        });
        setFavoriteDestinations(favoritos);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  const handleRefresh = async () => {
    const response = await fetch("http://172.20.10.7:8000/destinations");
    const data = await response.json();
    setDestinations(data);
  };

  const handleAddFavorite = (id) => async () => {
    try {
      const response = await fetch(
        `http://172.20.10.7:8000/destinations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFavorite: true,
          }),
        }
      );
      if (response.ok) {
        console.log("Destino agregado a favoritos exitosamente");
        handleRefresh();
      } else {
        console.error("Error al actualizar el destino:", response);
      }
    } catch (error) {
      console.error("Error al actualizar el destino:", error);
    }
  };

  const handleRemoveFavorite = (id) => async () => {
    try {
      const response = await fetch(
        `http://172.20.10.7:8000/destinations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFavorite: false,
          }),
        }
      );
      if (response.ok) {
        console.log("Destino eliminado de favoritos exitosamente");
        handleRefresh();
      } else {
        console.error("Error al actualizar el destino:", response);
      }
    } catch (error) {
      console.error("Error al actualizar el destino:", error);
    }
  };

  const handleDetails = (id) => () => {
    console.log("id", id);
    router.push(`(tabs)/destinations/${id}`);
  };

  const handleDelete = (id) => async () => {
    try {
      const response = await fetch(
        `http://172.20.10.7:8000/destinations/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Destino eliminado exitosamente");
        handleRefresh();
      } else {
        console.error("Error al eliminar el destino:", response);
      }
    } catch (error) {
      console.error("Error al eliminar el destino:", error);
    }
  };

  const handleAddDestination = () => {
    router.push({
      pathname: "(tabs)/adddestination",
      params: { onRefresh: handleRefresh },
    });
  };

  return (
    <View>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <SafeAreaView>
          <TouchableOpacity
            onPress={handleAddDestination}
            style={styles.fakebutton}
          >
            <Text>Add Destination</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh} style={styles.fakebutton}>
            <Text>Update</Text>
          </TouchableOpacity>
          {/* Renderiza los destinos */}
          {destinations.map((destination, index) => (
            <View key={index} style={styles.planet}>
              <TouchableOpacity onPress={handleDetails(destination.id)}>
                <Text style={styles.name}>{destination.name}</Text>
                {destination.difficulty == "hard" && (
                  <View style={styles.hard}>
                    <Text>Difficulty: hard</Text>
                  </View>
                )}
                {destination.difficulty == "medium" && (
                  <View style={styles.medium}>
                    <Text>Difficulty: medium</Text>
                  </View>
                )}
                {destination.difficulty == "easy" && (
                  <View style={styles.easy}>
                    <Text>Difficulty: easy</Text>
                  </View>
                )}
              </TouchableOpacity>
              {destination.isFavorite ? (
                <TouchableOpacity
                  onPress={handleRemoveFavorite(destination.id)}
                >
                  <AntDesign name="heart" size={24} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleAddFavorite(destination.id)}>
                  <AntDesign name="hearto" size={24} color="black" />
                </TouchableOpacity>
              )}

              <View>
                <TouchableOpacity onPress={handleDelete(destination.id)}>
                  <Text style={{ color: "red" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    alignSelf: "center",
  },
  hard: {
    backgroundColor: "purple",
  },
  easy: {
    backgroundColor: "green",
  },
  medium: {
    backgroundColor: "yellow",
  },
  planet: {
    width: width * 0.85, // 85% del ancho del dispositivo
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
  },
  fakebutton: {
    padding: 10,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Destinations;
