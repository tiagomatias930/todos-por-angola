import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; 

const PlaceholderImage = require('@/assets/images/background-image.png');
const ImageTop = require('@/assets/images/emoji1.png');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={ImageTop} style={styles.imageTop} />
        <Image source={PlaceholderImage} style={styles.imagePlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#238b45',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },

  imageContainer: {
    alignItems: 'center',
  },

  imageTop: {
    width: 200,
    height: 160,
    borderRadius: 9,
  },
  
  imagePlaceholder: {
    width: 100,
    height: 100 ,
    borderRadius: 9,
  },
});
