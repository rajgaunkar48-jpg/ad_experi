import { StyleSheet } from 'react-native';

export const newStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6EFFD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  alreadySignedInText: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  inputGroup: {
    marginTop: 15,
  },
  label: {
    color: '#374151',
    fontSize: 15,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    color: '#1F2937',
  },
  button: {
    marginTop: 25,
    backgroundColor: '#4C6EF5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4C6EF5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    color: '#6B7280',
    fontSize: 15,
  },
  link: {
    color: '#4C6EF5',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default newStyles;