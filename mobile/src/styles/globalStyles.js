import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
   menuSection: {
    marginTop: 16,
  },
  menuButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '500',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#cc0000',
    borderColor: '#cc0000',
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#003366',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#004c99',
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aac4f4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },

    infoBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e6f0ff',
    borderWidth: 1,
    borderColor: '#c7d7ff',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#aac4f4',
    backgroundColor: 'white',
    marginRight: 6,
    marginBottom: 6,
  },
  chipSelected: {
    backgroundColor: '#cceeff',
  },
  chipText: {
    fontSize: 13,
    color: '#003366',
  },

});
