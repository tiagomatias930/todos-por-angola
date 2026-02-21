import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, TouchableRipple, Surface, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

interface FooterItemProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}

const FooterItem: React.FC<FooterItemProps> = ({ title, icon, isActive, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor={theme.colors.primary + "20"}
      borderless
      style={[
        styles.footerItemTouch,
        isActive && { backgroundColor: theme.colors.primaryContainer },
      ]}
    >
      <View style={styles.footerItemContent}>
        {icon}
        <Text
          variant="labelSmall"
          style={[
            styles.footerLabel,
            {
              color: isActive ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant,
              fontWeight: isActive ? "700" : "500",
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableRipple>
  );
};

export default function Footer() {
  const theme = useTheme();
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "/Mapa";
  const isReportar = pathname.startsWith("/reportar");
  const isMaravilhas = pathname === "/maravilhas";

  return (
    <Surface style={styles.footer} elevation={4}>
      <FooterItem
        title="INÍCIO"
        icon={
          <Ionicons
            name={isHome ? "home" : "home-outline"}
            size={22}
            color={isHome ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
        }
        isActive={isHome}
        onPress={() => router.push("/")}
      />

      <TouchableRipple
        onPress={() => router.push("/reportar/infraestrutura")}
        borderless
        rippleColor={theme.colors.tertiary + "30"}
        style={styles.fabWrapper}
      >
        <Surface
          style={[
            styles.fab,
            { backgroundColor: isReportar ? theme.colors.primary : theme.colors.tertiary },
          ]}
          elevation={3}
        >
          <Ionicons name="megaphone" size={26} color="#fff" />
        </Surface>
      </TouchableRipple>

      <FooterItem
        title="MARAVILHAS"
        icon={
          <Ionicons
            name={isMaravilhas ? "diamond" : "diamond-outline"}
            size={22}
            color={isMaravilhas ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
        }
        isActive={isMaravilhas}
        onPress={() => router.push("/maravilhas" as any)}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    width: screenWidth,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerItemTouch: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minWidth: 72,
    alignItems: "center",
  },
  footerItemContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  footerLabel: {
    letterSpacing: 0.5,
  },
  fabWrapper: {
    borderRadius: 28,
    marginTop: -28,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
