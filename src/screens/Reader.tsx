import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackScreenProps } from '../../types';

class Reader extends Component<RootStackScreenProps<'Reader'>, IReaderState> {
  // TODO: fetch the page images from the link and render.
  render() {
    const { route } = this.props; 
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{route.params.chapterUrl}</Text>
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

interface IReaderState {
  // here
}
