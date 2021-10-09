import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Overview extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Overview</Text>
      </View>
    );
  }
}

export default Overview;

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
