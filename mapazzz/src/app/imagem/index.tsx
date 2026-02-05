import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button"; // Importando o componente de botão
import { styles } from "./styles"; // Importando os estilos do arquivo style.ts
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  imagem: string;
};

const CameraComponente = () => { // Pegando a URI da foto tirada

  const rotacamera = useRouter();

  // useEffect(() => {
  //   console.log("Imagem recebida:", imagem); // Verificando a URI
  // }, [imagem]);

  // if (imagem) {
  //   console.log("Imagem está disponível:", imagem);
  // } else {
  //   console.log("Imagem não está disponível.");
  // }

  return (
    <SafeAreaView style={styles.painel}>
      <View style={styles.imagem}>
        {imagem ? (
          <Image source={{ uri: imagem }} style={{ width: 300, height: 300 }} />
        ) : (
          <Text>Sem imagem disponível</Text>
        )}
      </View>
      <Button title="Tirar foto" onPress={() => rotacamera.push("/camera")} />
    </SafeAreaView>
  );
};

export default CameraComponente;
