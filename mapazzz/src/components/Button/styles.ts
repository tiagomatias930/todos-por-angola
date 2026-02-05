import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    buttonContainer: {
      width: 300,
      height: 68,
      marginHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
    },
  
    button: {
      borderRadius: 19,
      width: '50%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row', 
      backgroundColor: '#ffff',
    },
  
    buttonIcon: {
      width: 20, 
      height: 20, 
      marginRight: 8, 
    },
    
    buttonLabel: {
      color: '#fff',
      fontSize: 16,
    },
    
    text:
    {
        fontSize: 20,
      fontFamily: 'inter',
      color: '#238B45',
    },
    footerContainer: {
        flex: 1 / 2,
        alignItems: 'center',
      },
    
  });