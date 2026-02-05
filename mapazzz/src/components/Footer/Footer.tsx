import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface FooterItemProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}

const FooterItem: React.FC<FooterItemProps> = ({
  title,
  icon,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.customButton,
        isActive ? styles.activeButton : styles.inactiveButton,
      ]}
      onPress={onPress}
    >
      {icon}
      <Text
        style={[
          styles.buttonText,
          isActive ? styles.activeButtonText : styles.inactiveButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default function Footer() {
  const pathname = usePathname();

  return (
    <View style={styles.footer}>
      <View style={styles.buttonWrapper}>
        <FooterItem
          title="MAPA"
          icon={
            <Ionicons
              name={pathname === "/" ? "map" : "map-outline"}
              size={24}
              color="black"
            />
          }
          isActive={pathname === "/"}
          onPress={() => router.push("/")}
        />
      </View>

      <TouchableOpacity onPress={() => {router.push("/Login")}}>
          <Image
            source={require("../../../assets/images/button_alert.png")}
            style={{
              width: screenWidth * 0.2,
              height: screenWidth * 0.2,
              top: -screenWidth * 0.1,
              borderRadius: 100,
              backgroundColor: "transparent",
            }}
          />
      </TouchableOpacity>

      <View style={styles.buttonWrapper}>
        <FooterItem
          title="APRENDER"
          icon={
            <Ionicons
              name={
                pathname === "/aprender"
                  ? "game-controller"
                  : "game-controller-outline"
              }
              size={24}
              color="black"
            />
          }
          isActive={pathname === "/aprender"}
          onPress={() => router.push("/Aprender/aprender")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    width: screenWidth,
    height: screenHeight * 0.1,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: "black",
    backgroundColor: "white",
  },
  buttonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.25,
    height: screenHeight * 0.25,
  },
  customButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonText: {
    fontSize: 10,
    color: "black",
  },
  inactiveButtonText: {
    fontWeight: "normal",
  },
  activeButtonText: {
    fontWeight: "bold",
  },
});
