import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    stars: [],
    page: 1,
    loading: false,
  };

  componentDidMount() {
    this.loadStars();
  }

  loadStars = async () => {
    const { loading } = this.state;

    if (loading) return;

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const { page, stars } = this.state;

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      page: page + 1,
    });
  };

  renderFooter = () => {
    const { loading } = this.state;

    return loading && <ActivityIndicator color="#999" />;
  };

  render() {
    const { navigation } = this.props;
    const { stars } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
          onEndReached={this.loadStars}
          onEndReachedThreshold={0.2}
          ListFooterComponent={this.renderFooter}
        />
      </Container>
    );
  }
}
