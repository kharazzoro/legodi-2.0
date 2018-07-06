import React from 'react'
import {
  Text,
  View,
  Picker,
  StyleSheet
} from 'react-native'

export default class SettingsScreen extends React.Component {
  state = {
    language: 'Select Language'
  }

  static navigationOptions = {
    title: 'Glasgow welcome back',
    headerStyle: { backgroundColor: '#0f352f' },
    headerTitleStyle: { color: '#e6bc44' }
  };

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.language}>{this.state.language}</Text>
        <Picker
          selectedValue={this.state.language}
          style={{ height: 50, width: 100 }}
          onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
          <Picker.Item label='English' value='English' />
          <Picker.Item label='Arabic' value='Arabic' />
          <Picker.Item label='Russian' value='Russian' />
        </Picker>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  language: {
    fontSize: 20
  }
})
