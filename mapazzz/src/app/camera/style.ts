import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
      },
      message: {
        textAlign: 'center',
        paddingBottom: 10,
      },
      camera: {
        flex: 1,
        width:100,
        height:100,
      },
      buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
      },
      button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
      },
      imagem:
    {
        width:"90%",
        height:200,
        margin:10,
        borderRadius:5,
    },
    painel:
    {
        alignItems:"center",
        justifyContent:"center",
    },
  });