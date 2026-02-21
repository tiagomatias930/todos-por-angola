import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  Surface,
  Divider,
  useTheme,
} from "react-native-paper";

const Questionario = () => {
  const theme = useTheme();
  const [chuva, setChuva] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [tempo, setTempo] = useState("");

  function handleSubmit() {
    console.log(chuva, temperatura, tempo);
  }

  return (
    <Surface style={styles.painel} elevation={1}>
      <Text variant="titleMedium" style={[styles.titulo, { color: theme.colors.onSurface }]}>
        Questionário sobre a Área de Risco
      </Text>
      <Divider style={styles.divider} />

      <View style={styles.questionBlock}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          1. A chuva é frequente nesta área?
        </Text>
        <View style={[styles.pickerWrapper, { borderColor: theme.colors.outlineVariant }]}>
          <Picker
            style={styles.picker}
            selectedValue={chuva}
            onValueChange={(itemValue) => setChuva(itemValue)}
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Sim" value="SIM" />
            <Picker.Item label="Não" value="NÃO" />
          </Picker>
        </View>
      </View>

      <View style={styles.questionBlock}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          2. A temperatura é muito alta nesta área?
        </Text>
        <View style={[styles.pickerWrapper, { borderColor: theme.colors.outlineVariant }]}>
          <Picker
            style={styles.picker}
            selectedValue={temperatura}
            onValueChange={(itemValue) => setTemperatura(itemValue)}
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Sim" value="SIM" />
            <Picker.Item label="Não" value="NÃO" />
          </Picker>
        </View>
      </View>

      <View style={styles.questionBlock}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          3. Por quanto tempo você tem notado essa área afetada?
        </Text>
        <TextInput
          mode="outlined"
          placeholder="Exemplo: 2 meses"
          value={tempo}
          onChangeText={setTempo}
          style={styles.textInput}
          outlineStyle={{ borderRadius: 14 }}
          theme={{ roundness: 14 }}
        />
      </View>
    </Surface>
  );
};

export default Questionario;

const styles = StyleSheet.create({
  painel: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
  },
  titulo: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  questionBlock: {
    marginBottom: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 8,
    overflow: "hidden",
  },
  picker: {
    color: "#1A1C1E",
    backgroundColor: "transparent",
  },
  textInput: {
    marginTop: 8,
    backgroundColor: "transparent",
  },
});
