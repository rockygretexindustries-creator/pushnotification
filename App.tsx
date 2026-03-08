import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { usePushNotifications } from "./usePushNotifications";

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, undefined, 2);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Push Notifications Demo</Text>
      <View style={styles.tokenContainer}>
        <Text style={styles.label}>Expo Push Token:</Text>
        <Text style={styles.token} selectable>
          {expoPushToken?.data ?? "Loading..."}
        </Text>
      </View>
      <View style={styles.notificationContainer}>
        <Text style={styles.label}>Last Notification:</Text>
        <Text style={styles.notification}>{data || "No notifications yet"}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tokenContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  token: {
    fontSize: 12,
    color: "#333",
  },
  notificationContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: "#e8f4f8",
    borderRadius: 8,
  },
  notification: {
    fontSize: 12,
    color: "#333",
  },
});
