import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet, TextInput } from "react-native";
import React, {useState} from "react";
import { Button } from "../Button";
import { style } from "./style";


const Questionario = () => {
    const [chuva, setChuva] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [tempo, setTempo] = useState('');
    

    function handleSubmit (){
        console.log(chuva, temperatura, tempo);
    }

    return(
        <View style={style.painel}>
            
            <Text style={style.titolo}>Questionaria sobre a Aria de Risco</Text>
            <View style={style.aria_text}>
            <Text style={style.text_normal}>1. A chuva é frequente nesta área?</Text>
            <Picker
            style={style.checkbox}
            selectedValue={chuva}
            onValueChange={(itemValue)=> setChuva(itemValue)}
            >
                <Picker.Item label="Selecione" value = ""/>
                <Picker.Item label="Sim" value = "SIM"/>
                <Picker.Item label="Não" value = "NÃO"/>
            </Picker>
            </View>
            <View style={style.aria_text}>
            <Text style={style.text_normal}>2. A temperatura é muito alta nesta área?</Text>
            <Picker
            style={style.checkbox}
            selectedValue={temperatura}
            onValueChange={(itemValue)=> setTemperatura(itemValue)}
            >
                <Picker.Item label="Selecione" value = ""/>
                <Picker.Item label="Sim" value = "SIM"/>
                <Picker.Item label="Não" value = "NÃO"/>
            </Picker>
            </View>
            <View style={style.aria_text}>
            <Text style={style.text_normal}>3. Por quanto tempo você tem notado essa área afetada?</Text>
            <TextInput style={style.textbox} placeholder="Exemplo: 2 meses" value={tempo} onChangeText={setTempo}/>
            </View>
        </View>
    );
}

export default Questionario;
