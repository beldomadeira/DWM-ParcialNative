import { navigate } from "expo-router/build/global-state/routing";
import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import "expo-router/entry";
import Checkbox from "expo-checkbox";

const addDestination = () => {
  const router = useRouter();
  const [formulario, setFormulario] = useState({
    nombreDestino: "",
    descripcion: "",
    dificultad: "",
  });
  const handleChange = (name, value) => {
    console.log("here");
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://172.20.10.7:8000/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formulario.nombreDestino,
          description: formulario.descripcion,
          difficulty: formulario.dificultad,
        }),
      });
      if (response.ok) {
        console.log("Destino registrado exitosamente");
        router.push("(tabs)/destinations");
      } else {
        console.error("Error en el registro del destino:", response);
      }
    } catch (error) {
      console.error("Error en el registro del destino:", error);
    }
  };

  console.log(formulario);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Add a new destination</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Destination name"
              placeholderTextColor={"#333"}
              onChangeText={(text) => handleChange("nombreDestino", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={"#333"}
              onChangeText={(text) => handleChange("descripcion", text)}
            />
            <Text>Difficulty: </Text>
            <Text>Easy: </Text>
            <Checkbox
              style={styles.c}
              placeholderTextColor={"#333"}
              placeholder="Difficulty"
              value={formulario.dificultad === "easy"}
              onValueChange={() =>
                handleChange(
                  "dificultad",
                  formulario.dificultad === "easy" ? "" : "easy"
                )
              }
            />
            <Text>Medium: </Text>
            <Checkbox
              style={styles.c}
              placeholderTextColor={"#333"}
              placeholder="Difficulty"
              value={formulario.dificultad === "medium"}
              onValueChange={() =>
                handleChange(
                  "dificultad",
                  formulario.dificultad === "medium" ? "" : "medium"
                )
              }
            />
            <Text>Hard: </Text>
            <Checkbox
              style={styles.c}
              placeholderTextColor={"#333"}
              placeholder="Difficulty"
              value={formulario.dificultad === "hard"}
              onValueChange={() =>
                handleChange(
                  "dificultad",
                  formulario.dificultad === "hard" ? "" : "hard"
                )
              }
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add destination</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 350,
    padding: 12,
    marginVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#dbdbdb",
    fontSize: 14,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default addDestination;
