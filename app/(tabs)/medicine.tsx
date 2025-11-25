import { useState, useCallback } from "react";
import { useFocusEffect } from 'expo-router';
import { storageUtils, Medicine as MedicineType } from '@/utils/storage';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import newStyles from '@/app/uiStyles';

type Medicine = MedicineType;

export default function MedicineScreen() {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const loadMedicines = async () => {
    try {
      const data = await storageUtils.getMedicines();
      setMedicines(data);
    } catch (err) {
      console.error('loadMedicines failed', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMedicines();
    }, [])
  );

  // get current HH:MM time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const handleSubmit = async () => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!name.trim()) {
      Alert.alert("Error", "Please enter medicine name");
      return;
    }
    if (!dosage.trim()) {
      Alert.alert("Error", "Please enter dosage");
      return;
    }
    if (!time.trim()) {
      Alert.alert("Error", "Please enter time");
      return;
    }
    if (!timePattern.test(time)) {
      Alert.alert("Error", "Please enter a valid time (HH:MM 24h)");
      return;
    }

    const newItem: Omit<Medicine, 'id'> & { date?: string } = {
      name,
      dosage,
      time,
      date: new Date().toISOString(),
    };

    try {
      await storageUtils.saveMedicine(newItem as any);
      await loadMedicines();
    } catch (err) {
      console.error('saveMedicine failed', err);
      Alert.alert('Error', 'Failed to save medicine');
    }

    // clear input fields
    setName("");
    setDosage("");
    setTime("");

    Alert.alert("Success", "Medicine added");
  };

  return (
    <View style={newStyles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={newStyles.card}>
          <Text style={newStyles.title}>Log Medicine</Text>

          <View style={newStyles.inputGroup}>
            <Text style={newStyles.label}>Medicine Name</Text>
            <TextInput
              style={newStyles.input}
              placeholder="e.g., Aspirin"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={newStyles.inputGroup}>
            <Text style={newStyles.label}>Dosage</Text>
            <TextInput
              style={newStyles.input}
              placeholder="e.g., 500mg"
              value={dosage}
              onChangeText={setDosage}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={newStyles.inputGroup}>
            <Text style={newStyles.label}>Time Taken</Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={[newStyles.input, styles.timeInput]}
                placeholder="HH:MM (24h)"
                value={time}
                onChangeText={setTime}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={{ ...newStyles.button, paddingHorizontal: 20 }}
                onPress={() => setTime(getCurrentTime())}
              >
                <Text style={newStyles.buttonText}>Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={newStyles.button} onPress={handleSubmit}>
            <Text style={newStyles.buttonText}>Log Medicine</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Medicine History</Text>

          {medicines.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No medicines logged yet</Text>
            </View>
          ) : (
            medicines.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyName}>{item.name}</Text>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>

                <Text style={styles.dosageText}>Dosage: {item.dosage}</Text>
                <Text style={styles.historyDate}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollView: { flex: 1 },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    elevation: 2,
  },
  formTitle: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  timeInputContainer: { flexDirection: "row", gap: 12 },
  timeInput: { flex: 1 },
  nowButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nowButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
  historyContainer: { padding: 16 },
  historyTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#8E8E93" },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  historyName: { fontSize: 18, fontWeight: "600" },
  timeBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: { fontSize: 12, fontWeight: "600", color: "#1976D2" },
  dosageText: { fontSize: 14, color: "#6C757D", marginBottom: 4 },
  historyDate: { fontSize: 12, color: "#ADB5BD" },
});
