import React from 'react';
import PropTypes from 'prop-types';

import { Starred, OwnerAvatar, Info, Title, Author } from './styles';

function Repository({ data, navigation }) {
  function handlePress(repository) {
    const repoInfo = {
      name: repository.name,
      url: repository.html_url,
    };

    navigation.navigate('Viewer', { repository: repoInfo });
  }

  return (
    <Starred onPress={() => handlePress(data)}>
      <OwnerAvatar source={{ uri: data.owner.avatar_url }} />
      <Info>
        <Title>{data.name}</Title>
        <Author>{data.owner.login}</Author>
      </Info>
    </Starred>
  );
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  data: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.shape({
      login: PropTypes.string,
      avatar_url: PropTypes.string,
    }),
  }).isRequired,
};

export default Repository;
