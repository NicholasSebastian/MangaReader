import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Reader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Reader</Text>
      </View>
    );
  }
}

export default Reader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
