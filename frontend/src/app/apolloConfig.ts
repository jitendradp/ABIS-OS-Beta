import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
export class GraphQLConfigModule {
  constructor(apollo: Apollo, private httpClient: HttpClient) {
    const httpLink = new HttpLink(httpClient).create({
      uri: 'http://local.abis-cloud.com:4000'
    });

    const subscriptionLink = new WebSocketLink({
      uri: 'ws://local.abis-cloud.com:4000/',
      options: {
        reconnect: true,
        connectionParams: {
          authToken: localStorage.getItem('token') || null
        }
      }
    });

    const link = split(
      ({ query }) => {
        const { kind, operation } = <any>getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      subscriptionLink,
      httpLink
    );

    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
