import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, ApolloProvider, ApolloProviderProps } from 'react-apollo';
import logo from './logo.svg';

const GQL_GET_GREETING = gql`
  {
    hello {
      greeting
    }
  }
`;

interface Props<TCache> {
  client: ApolloProviderProps<TCache>["client"];
}


class App<TCache> extends Component<Props<TCache>> {
  render() {
    return (
      <ApolloProvider client={this.props.client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <Query query={GQL_GET_GREETING}>
              {({ loading, error, data }: any) => {
                if (loading) return 'Загрузка...';
                if (error) return `Ошибка! ${error.message}`;

                return (
                  <h2>{data.hello.greeting}</h2>
                );
              }}
            </Query>
          </header>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
