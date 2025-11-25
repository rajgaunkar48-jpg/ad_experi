import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Plus, Activity, Pill } from 'lucide-react-native';
import { storageUtils, Symptom, Medicine } from '@/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [todaySymptoms, setTodaySymptoms] = useState<Symptom[]>([]);
  const [todayMedicines, setTodayMedicines] = useState<Medicine[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (): Promise<void> => {
    try {
      const symptoms = await storageUtils.getSymptoms();
      const medicines = await storageUtils.getMedicines();
      setTodaySymptoms(storageUtils.getTodayItems(symptoms));
      setTodayMedicines(storageUtils.getTodayItems(medicines));
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getSeverityStyle = (sev: Symptom['severity']) => {
    switch (sev) {
      case 'Mild':
        return styles.severityMild;
      case 'Moderate':
        return styles.severityModerate;
      case 'Severe':
        return styles.severitySevere;
      default:
        return undefined;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Day!</Text>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Activity size={32} color="#FF6B6B" />
          <Text style={styles.summaryNumber}>{todaySymptoms.length}</Text>
          <Text style={styles.summaryLabel}>Symptoms Today</Text>
        </View>
        <View style={styles.summaryCard}>
          <Pill size={32} color="#4ECDC4" />
          <Text style={styles.summaryNumber}>{todayMedicines.length}</Text>
          <Text style={styles.summaryLabel}>Medicines Taken</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Symptoms</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/symptoms')}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {todaySymptoms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No symptoms logged today</Text>
          </View>
        ) : (
          todaySymptoms.map((symptom: Symptom) => (
            <View key={symptom.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{symptom.name}</Text>
                <View style={[styles.severityBadge, getSeverityStyle(symptom.severity)]}>
                  <Text style={styles.severityText}>{symptom.severity}</Text>
                </View>
              </View>
              {symptom.description ? (
                <Text style={styles.itemDescription}>
                  {symptom.description}
                </Text>
              ) : null}
              <Text style={styles.itemTime}>
                {new Date(symptom.date).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Medicines</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/medicine')}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {todayMedicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medicines logged today</Text>
          </View>
        ) : (
          todayMedicines.map((medicine: Medicine) => (
            <View key={medicine.id} style={styles.itemCard}>
              <Text style={styles.itemName}>{medicine.name}</Text>
              <Text style={styles.medicineDetails}>
                {medicine.dosage} at {medicine.time}
              </Text>
              <Text style={styles.itemTime}>
                {new Date(medicine.date).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#E8F4FF',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityMild: {
    backgroundColor: '#D4EDDA',
  },
  severityModerate: {
    backgroundColor: '#FFF3CD',
  },
  severitySevere: {
    backgroundColor: '#F8D7DA',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  itemTime: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  medicineDetails: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
});
