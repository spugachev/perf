import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import logo from './logo.svg';
import './App.css';

const GQL_GET_GREETING = gql`
  {
    hello {
      greeting
    }
  }
`;

class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
