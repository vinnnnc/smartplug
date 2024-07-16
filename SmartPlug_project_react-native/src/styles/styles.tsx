import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#EEE',
  },
  listContainer: {
    // alignItems: 'baseline',
    // justifyContent: 'center',
    flex: 1,

    alignSelf: 'stretch',
    // alignContent: 'center',
  },
  text: {
    fontSize: 15,
    marginLeft: 70,
    marginTop: 15,
    position: 'absolute',
  },
  icon: {
    backgroundColor: '#EEE',
    borderRadius: 90,
    padding: 10,
    alignSelf: 'center',
  },
  modalSelection: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'flex-start',
    // backgroundColor: 'gray',
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },
  modalButton: {
    borderRadius: 10,
    padding: 15,
    margin: 5,
    borderColor: '#DDD',
    borderWidth: 3,
    flex: 1,
    maxHeight: 50,
    maxWidth: 180,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonEnabled: {
    opacity: 1,
  },
  input: {
    height: 50,
    // marginLeft: 15,
    margin: 10,
    // marginRight: 15,
    borderRadius: 10,
    borderWidth: 3,
    padding: 10,
    borderColor: '#888',
    backgroundColor: '#EEE',
  },
  buttonDefault: {
    backgroundColor: '#2196F3',
  },
  addContent: {
    backgroundColor: 'white',
    paddingBottom: 10,
    justifyContent: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  deviceContent: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    margin: 20,
  },
  contentText: {
    alignSelf: 'center',
    margin: 10,
  },
  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  buttonStyle: {
    height: 100,
    width: 90,
    backgroundColor: '#555',
    borderRadius: 90,
    bottom: 10,
  },
  item: {
    backgroundColor: '#DDD',
    padding: 10,
    margin: 8,
    alignItems: 'center',
    borderRadius: 5,
    height: 150,
    // width: 150,
    // maxWidth: 180,
    flex: 1,
  },
  offline: {
    opacity: 0.5,
  },
  online: {
    opacity: 1,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  onButton: {
    color: '#2196F3',
    marginLeft: 8,
  },
  offButton: {
    color: '#DDD',
    marginLeft: 8,
  },
  toggleButton: {
    backgroundColor: '#AAA',
    borderRadius: 40,
    padding: 3,
  },
  modal: {
    backgroundColor: 'white',
    padding: 10,
    // justifyContent: 'flex-start',
    borderRadius: 17,
  },
  modalView: {
    flex: 1,
    position: 'absolute',
    verticalAlign: 'bottom',
  },
  dayPicker: {
    flexDirection: 'row', // Update to horizontal layout
    justifyContent: 'center', // Center the toggle buttons horizontally
  },
  dayToggle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  selectedToggleButton: {
    backgroundColor: 'gray',
  },
  dayText: {
    fontSize: 16,
    color: 'black',
  },
  selectedDayText: {
    color: 'white',
  },
});
