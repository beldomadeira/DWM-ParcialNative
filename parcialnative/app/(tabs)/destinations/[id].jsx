import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const EditDestination = () => {
  const { id } = useLocalSearchParams(); // Obtiene el parámetro `id`
  const [destination, setDestination] = useState(null);
  const [isEditing, setIsEditing] = useState(true); // Estado para controlar si se está editando
  const [formulario, setFormulario] = useState({
    nombreDestino: "",
    descripcion: "",
    dificultad: "",
  });

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(
          `http://172.20.10.7:8000/destinations/${id}`
        );
        const data = await response.json();
        setDestination(data);
        setFormulario({
          name: data.name,
          description: data.description,
          difficulty: data.difficulty,
        });
      } catch (error) {
        console.error("Error fetching destination details:", error);
      }
    };
    fetchDestination();
  }, [id]);

  const handleChange = (field, value) => {
    setFormulario({ ...formulario, [field]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://172.20.10.7:8000/destinations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formulario.nombreDestino,
            description: formulario.descripcion,
            difficulty: formulario.dificultad,
          }),
        }
      );

      if (response.ok) {
        console.log("Destino actualizado exitosamente");
        const updatedDestination = await response.json();
        setDestination(updatedDestination);
        setIsEditing(false);
        router.push("../destinations");
      } else {
        console.error("Error al actualizar el destino:", response);
      }
    } catch (error) {
      console.error("Error al actualizar el destino:", error);
    }
  };

  if (!destination) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {!isEditing ? (
          <>
            {/* muestra la información del destino */}
            <Text style={styles.name}>{destination.name}</Text>

            <Text>Description: {destination.description}</Text>
            <Text>Difficulty: {destination.difficulty}</Text>

            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </>
        ) : (
          // formulario para editar el destino
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={formulario.name}
              placeholder="Destination Name"
              onChangeText={(text) => handleChange("name", text)}
            />
            <TextInput
              style={styles.input}
              value={formulario.description}
              placeholder="Description"
              onChangeText={(text) => handleChange("description", text)}
            />
            <TextInput
              style={styles.input}
              value={formulario.difficulty}
              placeholder="Difficulty"
              onChangeText={(text) => handleChange("difficulty", text)}
            />
            <TouchableOpacity onPress={handleSave} style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#FF5555",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
  },
  input: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
});

export default EditDestination;
