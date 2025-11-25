import React, { JSX, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import newStyles from '@/app/uiStyles';
import { ChevronDown } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { storageUtils, Symptom as SymptomType } from '@/utils/storage';

const SEVERITY_OPTIONS = ['Mild', 'Moderate', 'Severe'] as const;
type Severity = typeof SEVERITY_OPTIONS[number];

type Symptom = SymptomType;

export default function SymptomsScreen(): JSX.Element {
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState<Severity>('Mild');
  const [description, setDescription] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [showSeverityPicker, setShowSeverityPicker] = useState(false);

  const loadSymptoms = async () => {
    try {
      const data = await storageUtils.getSymptoms();
      setSymptoms(data);
    } catch (err) {
      console.error('loadSymptoms failed', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSymptoms();
    }, [])
  );

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a symptom name');
      return;
    }

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: name.trim(),
      severity,
      description: description.trim(),
      date: new Date().toISOString(),
    };

    try {
      await storageUtils.saveSymptom({ name: newSymptom.name, severity: newSymptom.severity, description: newSymptom.description, date: newSymptom.date });
      await loadSymptoms();
    } catch (err) {
      console.error('saveSymptom failed', err);
      Alert.alert('Error', 'Failed to save symptom');
    }
    setName('');
    setDescription('');
    setSeverity('Mild');
    Alert.alert('Success', 'Symptom logged');
  };

  const getSeverityStyle = (s: Severity) => {
    if (s === 'Mild') return styles.severityMild;
    if (s === 'Moderate') return styles.severityModerate;
    return styles.severitySevere;
  };

  return (
    <View style={newStyles.container}>
      <ScrollView style={styles.scrollView}>
        {/* FORM */}
        <View style={newStyles.card}>
          <Text style={newStyles.title}>Log New Symptom</Text>

          <View style={newStyles.inputGroup}>
            <Text style={newStyles.label}>Symptom Name</Text>
            <TextInput
              style={newStyles.input}
              placeholder="e.g., Headache"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={newStyles.inputGroup}>
            <Text style={newStyles.label}>Severity</Text>
            <TouchableOpacity
              style={{ ...newStyles.input, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              onPress={() => setShowSeverityPicker(true)}
            >
              <Text style={styles.pickerButtonText}>{severity}</Text>
              <ChevronDown size={20} color="#6C757D" />
            </TouchableOpacity>
          </View>

          <View style={newStyles.inputGroup}>
            <Text style={newStyles.label}>Description (Optional)</Text>
            <TextInput
              style={[newStyles.input, { height: 100 }]}
              placeholder="Optional details"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={newStyles.button} onPress={handleSubmit}>
            <Text style={newStyles.buttonText}>Log Symptom</Text>
          </TouchableOpacity>
        </View>

        {/* HISTORY */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Symptom History</Text>

          {symptoms.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No symptoms logged yet</Text>
            </View>
          ) : (
            symptoms.map((symptom) => (
              <View key={symptom.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyName}>{symptom.name}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      getSeverityStyle(symptom.severity),
                    ]}
                  >
                    <Text style={styles.severityText}>{symptom.severity}</Text>
                  </View>
                </View>

                {symptom.description ? (
                  <Text style={styles.historyDescription}>
                    {symptom.description}
                  </Text>
                ) : null}

                <Text style={styles.historyDate}>
                  {new Date(symptom.date).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* SEVERITY MODAL */}
      <Modal
        visible={showSeverityPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSeverityPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Severity</Text>

            {SEVERITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  severity === option && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setSeverity(option);
                  setShowSeverityPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    severity === option && styles.modalOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowSeverityPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  formContainer: { backgroundColor: '#FFF', margin: 16, padding: 20, borderRadius: 16 },
  formTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, fontSize: 16 },
  textArea: { height: 100 },
  pickerButton: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerButtonText: { fontSize: 16, color: '#1A1A1A' },
  submitButton: { backgroundColor: '#007AFF', padding: 14, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  historyContainer: { padding: 16 },
  historyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  emptyState: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, alignItems: 'center' },
  emptyText: { color: '#8E8E93' },
  historyCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 8 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyName: { fontSize: 16, fontWeight: '600' },
  severityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  severityMild: { backgroundColor: '#D4EDDA' },
  severityModerate: { backgroundColor: '#FFF3CD' },
  severitySevere: { backgroundColor: '#F8D7DA' },
  severityText: { fontSize: 12, fontWeight: '600' },
  historyDescription: { marginTop: 6, color: '#6C757D' },
  historyDate: { marginTop: 6, color: '#ADB5BD', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  modalOption: { padding: 12, backgroundColor: '#F8F9FA', borderRadius: 12, marginBottom: 8 },
  modalOptionSelected: { backgroundColor: '#007AFF' },
  modalOptionText: { textAlign: 'center' },
  modalOptionTextSelected: { color: '#FFF', fontWeight: '600' },
  modalCancel: { padding: 12 },
  modalCancelText: { color: '#007AFF', textAlign: 'center', fontWeight: '600' },
});
