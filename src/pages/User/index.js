import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
    loading: true,
    refreshing: false,
    loadingMore: false,
  };

  onEndReachedCalledDuringMomentum = true;

  componentDidMount() {
    this.loadStars();
  }

  loadStars = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, page } = this.state;

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: page === 1 ? response.data : [...stars, ...response.data],
      loading: false,
      loadingMore: false,
      refreshing: false,
    });
  };

  handleLoadMore = () => {
    this.setState(
      prevState => ({
        page: prevState.page + 1,
        loadingMore: true,
      }),
      this.loadStars
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
      },
      this.loadStars
    );
  };

  renderItem = ({ item }) => (
    <Starred>
      <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
      <Info>
        <Title>{item.name}</Title>
        <Author>{item.owner.login}</Author>
      </Info>
    </Starred>
  );

  renderFooter = () => {
    const { loadingMore } = this.state;

    return loadingMore && <ActivityIndicator size="large" color="#999" />;
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing, loading, page } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading && page === 1 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator size="large" color="#999" />
          </View>
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (!this.onEndReachedCalledDuringMomentum) {
                this.handleLoadMore();
                this.onEndReachedCalledDuringMomentum = true;
              }
            }}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
          />
        )}
      </Container>
    );
  }
}
