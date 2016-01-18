'use strict';

import React from 'react-native';
import AuthService from './AuthService';

const {
  Text,
  StyleSheet,
  View,
  Component,
  ListView
} = React;

export default class Feed extends Component {
  constructor(props) {
    super(props);

    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(['A','B','C'])
    };
  }

  componentDidMount() {
    this.fetchFeed();
  }

  fetchFeed() {
    AuthService.getAuthInfo((err, authInfo) => {
      const url = 'https://api.github.com/users/'
        + authInfo.user.login
        + '/events';

      fetch(url, {
        headers: authInfo.header
      })
      .then((response) => response.json())
      .then((responseData) => {
        const feedItems = responseData.filter((ev) => {
          return ev.type == 'PushEvent';
        });

        this.setState({
          dataSource: this.state.dataSource
            .cloneWithRows(feedItems)
        });
      });
    });
  }

  renderRow(rowData) {
    return (
      <Text style={{color: '#333'}}>
        {rowData}
      </Text>
    );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'flex-start'
      }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      </View> 
    );
  }
};
