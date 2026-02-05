import { StyleSheet } from "react-native";
import { blob, text } from "stream/consumers";


export const style = StyleSheet.create(
    {
        painel:
        {
            width:"100%",
            height: 500,
            backgroundColor:"white",
            padding:20,
            borderRadius:10,
            justifyContent:"center",
            alignItems:"center",
            borderColor:"silver",
            borderWidth:1,
        },
        titolo:
        {
            fontSize:15,
            fontFamily:"Arial",
            textAlign:"center",
            marginBottom:30,
            margin:10,
        },
        checkbox:
        {
            borderRadius:5,
            padding:10,
            color:"black",
            borderColor:"silver",
            backgroundColor:"transparent",
        },
        textbox:
        {
            borderRadius:10,
            padding:30,
            margin:10,
            borderColor:"silver",
            borderLeftWidth:1,
            borderRightWidth:1,
            borderBottomWidth:1,
            borderTopWidth:1,
            marginBottom:20
        },
        aria_text:
        {
            width:300,
            padding:10,
        },
        text_normal:
        {
            marginBottom:10,
        }
    }
);