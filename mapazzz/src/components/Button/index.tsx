import { TouchableOpacity , TouchableOpacityProps, Text, View} from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title: string
}

export function Button({title, ...rest}:Props)
{
    return(
    <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.5} style={styles.button} {...rest}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    </View>
    );
}