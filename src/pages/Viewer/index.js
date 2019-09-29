import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default class Viewer extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('repository').name,
    };
  };

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');

    return <WebView source={{ uri: repository.url }} style={{ flex: 1 }} />;
  }
}
