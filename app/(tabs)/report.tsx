import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import newStyles from '@/app/uiStyles';
import { useFocusEffect } from 'expo-router';
import { storageUtils } from '@/utils/storage';
import { Activity, Pill, TrendingUp, Calendar } from 'lucide-react-native';

export default function ReportScreen() {
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const s = await storageUtils.getSymptoms();
      const m = await storageUtils.getMedicines();
      setSymptoms(s);
      setMedicines(m);
    } catch (err) {
      console.error('Failed to load report data', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Derived counts
  const todaySymptoms = storageUtils.getTodayItems(symptoms).length;
  const todayMedicines = storageUtils.getTodayItems(medicines).length;

  const weekSymptoms = storageUtils.getWeekItems(symptoms).length;
  const weekMedicines = storageUtils.getWeekItems(medicines).length;

  const mildCount = storageUtils.getWeekItems(symptoms).filter((s) => s.severity === 'Mild').length;
  const moderateCount = storageUtils.getWeekItems(symptoms).filter((s) => s.severity === 'Moderate').length;
  const severeCount = storageUtils.getWeekItems(symptoms).filter((s) => s.severity === 'Severe').length;

  const mildPct = weekSymptoms ? (mildCount / weekSymptoms) * 100 : 0;
  const moderatePct = weekSymptoms ? (moderateCount / weekSymptoms) * 100 : 0;
  const severePct = weekSymptoms ? (severeCount / weekSymptoms) * 100 : 0;

  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: newStyles.container.backgroundColor }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
      }>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Report</Text>
        <Text style={styles.headerSubtitle}>Track your health metrics</Text>
      </View>

      {/* TODAY SUMMARY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardSymptom]}>
            <Activity size={28} color="#FF6B6B" />
            <Text style={styles.statNumber}>{storageUtils.getTodayItems(symptoms).length}</Text>
            <Text style={styles.statLabel}>Symptoms</Text>
          </View>

          <View style={[styles.statCard, styles.statCardMedicine]}>
            <Pill size={28} color="#4ECDC4" />
            <Text style={styles.statNumber}>{storageUtils.getTodayItems(medicines).length}</Text>
            <Text style={styles.statLabel}>Medicines</Text>
          </View>
        </View>
      </View>

      {/* WEEK SUMMARY */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Calendar size={24} color="#007AFF" />
          <Text style={styles.sectionTitle}>Weekly Summary</Text>
        </View>

          <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Symptoms</Text>
            <Text style={styles.cardValue}>{storageUtils.getWeekItems(symptoms).length}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Medicines</Text>
            <Text style={styles.cardValue}>{storageUtils.getWeekItems(medicines).length}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Most Common Symptom</Text>
            <Text style={styles.cardValue}>{(() => {
              const counts: Record<string, number> = {};
              const list = storageUtils.getWeekItems(symptoms);
              list.forEach((s) => counts[s.name] = (counts[s.name] || 0) + 1);
              const items = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
              return items.length ? `${items[0][0]} (${items[0][1]}x)` : 'N/A';
            })()}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Most Used Medicine</Text>
            <Text style={styles.cardValue}>{(() => {
              const counts: Record<string, number> = {};
              const list = storageUtils.getWeekItems(medicines);
              list.forEach((m) => counts[m.name] = (counts[m.name] || 0) + 1);
              const items = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
              return items.length ? `${items[0][0]} (${items[0][1]}x)` : 'N/A';
            })()}</Text>
          </View>
        </View>
      </View>

      {/* SEVERITY BREAKDOWN */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={24} color="#007AFF" />
          <Text style={styles.sectionTitle}>Symptom Severity Breakdown</Text>
        </View>

        <View style={styles.card}>
          {/* Mild */}
          <View style={styles.severityRow}>
            <View style={styles.severityInfo}>
              <View style={[styles.severityDot, styles.severityMildDot]} />
              <Text style={styles.severityLabel}>Mild</Text>
            </View>

            <View style={styles.severityBar}>
              <View
                style={[
                  styles.severityBarFill,
                  styles.severityMildBar,
                  { width: `${mildPct}%` },
                ]}
              />
            </View>

            <Text style={styles.severityCount}>{(() => storageUtils.getWeekItems(symptoms).filter(s => s.severity === 'Mild').length)()}</Text>
          </View>

          {/* Moderate */}
          <View style={styles.severityRow}>
            <View style={styles.severityInfo}>
              <View style={[styles.severityDot, styles.severityModerateDot]} />
              <Text style={styles.severityLabel}>Moderate</Text>
            </View>

            <View style={styles.severityBar}>
              <View
                style={[
                  styles.severityBarFill,
                  styles.severityModerateBar,
                  { width: `${moderatePct}%` },
                ]}
              />
            </View>

            <Text style={styles.severityCount}>{(() => storageUtils.getWeekItems(symptoms).filter(s => s.severity === 'Moderate').length)()}</Text>
          </View>

          {/* Severe */}
          <View style={styles.severityRow}>
            <View style={styles.severityInfo}>
              <View style={[styles.severityDot, styles.severitySevereDot]} />
              <Text style={styles.severityLabel}>Severe</Text>
            </View>

            <View style={styles.severityBar}>
              <View
                style={[
                  styles.severityBarFill,
                  styles.severitySevereBar,
                  { width: `${severePct}%` },
                ]}
              />
            </View>

            <Text style={styles.severityCount}>{(() => storageUtils.getWeekItems(symptoms).filter(s => s.severity === 'Severe').length)()}</Text>
          </View>
        </View>
      </View>

      {/* EMPTY STATE */}
      {weekSymptoms === 0 && weekMedicines === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptyText}>
            Start logging your symptoms & medicines to see reports
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ================= STYLES (same as original) ================= //

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 10 },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 16, color: '#E8F4FF' },
  section: { padding: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1A1A1A' },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  statCardSymptom: { borderLeftWidth: 4, borderLeftColor: '#FF6B6B' },
  statCardMedicine: { borderLeftWidth: 4, borderLeftColor: '#4ECDC4' },
  statNumber: { fontSize: 32, fontWeight: '700', color: '#1A1A1A', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  cardLabel: { fontSize: 16, color: '#6C757D' },
  cardValue: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  severityInfo: { flexDirection: 'row', alignItems: 'center', width: 100, gap: 8 },
  severityDot: { width: 12, height: 12, borderRadius: 6 },
  severityMildDot: { backgroundColor: '#51CF66' },
  severityModerateDot: { backgroundColor: '#FFD43B' },
  severitySevereDot: { backgroundColor: '#FF6B6B' },
  severityLabel: { fontSize: 14, color: '#1A1A1A' },
  severityBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F3F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  severityBarFill: { height: '100%', borderRadius: 4 },
  severityMildBar: { backgroundColor: '#51CF66' },
  severityModerateBar: { backgroundColor: '#FFD43B' },
  severitySevereBar: { backgroundColor: '#FF6B6B' },
  severityCount: {
    width: 30,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptyState: {
    padding: 32,
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#8E8E93' },
});
