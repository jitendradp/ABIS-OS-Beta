import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Json: any,
};

export type Asset = {
   __typename?: 'Asset',
  id: Scalars['String'],
  name: Scalars['String'],
};

export type Exchange = {
   __typename?: 'Exchange',
  id: Scalars['String'],
  name: Scalars['String'],
  assets: Array<Asset>,
};

export type Group = {
   __typename?: 'Group',
  id: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  type: GroupType,
  tags?: Maybe<Scalars['String']>,
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  host: Profile,
  members?: Maybe<Array<Membership>>,
  is_hidden?: Maybe<Scalars['Boolean']>,
  is_public?: Maybe<Scalars['Boolean']>,
};

export enum GroupType {
  Workspace = 'WORKSPACE',
  Team = 'TEAM',
  Conversation = 'CONVERSATION',
  Thread = 'THREAD',
  Friends = 'FRIENDS'
}


export type Location = {
   __typename?: 'Location',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  latitude: Scalars['Float'],
  longitude: Scalars['Float'],
  radius?: Maybe<Scalars['Float']>,
};

export type Membership = {
   __typename?: 'Membership',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  member?: Maybe<Profile>,
  group?: Maybe<Group>,
};

export type Message = {
   __typename?: 'Message',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  sender?: Maybe<Profile>,
  subject?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['Json']>,
  tags?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  group?: Maybe<Group>,
};

export type Mutation = {
   __typename?: 'Mutation',
  signup?: Maybe<Scalars['String']>,
  verifyEmail?: Maybe<Scalars['String']>,
  createProfile?: Maybe<Scalars['String']>,
  updateProfile?: Maybe<Scalars['String']>,
  createWorkspace?: Maybe<Scalars['String']>,
  updateWorkspace?: Maybe<Scalars['String']>,
  addMember?: Maybe<Scalars['String']>,
  removeMember?: Maybe<Scalars['String']>,
  postMessage?: Maybe<Scalars['String']>,
  createPortfolio?: Maybe<Scalars['String']>,
  buy?: Maybe<Transaction>,
  sell?: Maybe<Transaction>,
  login?: Maybe<Scalars['String']>,
  logout?: Maybe<Scalars['Boolean']>,
  setSessionProfile?: Maybe<Scalars['String']>,
};


export type MutationSignupArgs = {
  name?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>
};


export type MutationVerifyEmailArgs = {
  code?: Maybe<Scalars['String']>
};


export type MutationCreateProfileArgs = {
  name?: Maybe<Scalars['String']>,
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>
};


export type MutationUpdateProfileArgs = {
  profileId?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>,
  status?: Maybe<Scalars['String']>
};


export type MutationCreateWorkspaceArgs = {
  hostProfileId?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  tags?: Maybe<Scalars['String']>
};


export type MutationUpdateWorkspaceArgs = {
  workspaceId?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  tags?: Maybe<Scalars['String']>,
  isHidden?: Maybe<Scalars['Boolean']>,
  isPublic?: Maybe<Scalars['Boolean']>
};


export type MutationAddMemberArgs = {
  groupId?: Maybe<Scalars['String']>,
  memberProfileId?: Maybe<Scalars['String']>
};


export type MutationRemoveMemberArgs = {
  groupId?: Maybe<Scalars['String']>,
  memberProfileId?: Maybe<Scalars['String']>
};


export type MutationPostMessageArgs = {
  groupId?: Maybe<Scalars['String']>,
  subject?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['String']>
};


export type MutationCreatePortfolioArgs = {
  name?: Maybe<Scalars['String']>
};


export type MutationBuyArgs = {
  exchangeId: Scalars['String'],
  assetId: Scalars['String'],
  amount: Scalars['Float']
};


export type MutationSellArgs = {
  exchangeId: Scalars['String'],
  assetId: Scalars['String'],
  amount: Scalars['Float']
};


export type MutationLoginArgs = {
  email?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>
};


export type MutationLogoutArgs = {
  token?: Maybe<Scalars['String']>
};


export type MutationSetSessionProfileArgs = {
  profileId?: Maybe<Scalars['String']>
};

export type Portfolio = {
   __typename?: 'Portfolio',
  id: Scalars['String'],
  owner: Profile,
  name: Scalars['String'],
  transactions: Array<Transaction>,
};

export type Profile = {
   __typename?: 'Profile',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  timezone?: Maybe<Scalars['String']>,
  status?: Maybe<Scalars['String']>,
  picture: Scalars['String'],
  memberships: Array<Membership>,
  location?: Maybe<Location>,
};

export type Query = {
   __typename?: 'Query',
  myWorkspaces: Array<Group>,
  myMemberships: Array<Membership>,
  getSessionProfile?: Maybe<Profile>,
  listProfiles: Array<Profile>,
  listWorkspaces: Array<Group>,
  listMemberships: Array<Membership>,
  listMembers: Array<Membership>,
  listMessages: Array<Message>,
  getProfile?: Maybe<Profile>,
  getWorkspace?: Maybe<Group>,
};


export type QueryMyWorkspacesArgs = {
  token?: Maybe<Scalars['String']>
};


export type QueryMyMembershipsArgs = {
  token?: Maybe<Scalars['String']>
};


export type QueryGetSessionProfileArgs = {
  token?: Maybe<Scalars['String']>
};


export type QueryListProfilesArgs = {
  token?: Maybe<Scalars['String']>
};


export type QueryListWorkspacesArgs = {
  profileId?: Maybe<Scalars['String']>
};


export type QueryListMembershipsArgs = {
  profileId?: Maybe<Scalars['String']>
};


export type QueryListMembersArgs = {
  groupId?: Maybe<Scalars['String']>
};


export type QueryListMessagesArgs = {
  groupId?: Maybe<Scalars['String']>,
  profileId?: Maybe<Scalars['String']>
};


export type QueryGetProfileArgs = {
  profileId?: Maybe<Scalars['String']>
};


export type QueryGetWorkspaceArgs = {
  workspaceId?: Maybe<Scalars['String']>
};

export type Transaction = {
   __typename?: 'Transaction',
  id: Scalars['String'],
  timestamp: Scalars['String'],
  profile: Profile,
  asset: Asset,
  direction: TransactionDirection,
  exchange: Exchange,
  amount: Scalars['Float'],
};

export enum TransactionDirection {
  Buy = 'BUY',
  Sell = 'SELL'
}



export function getSdk(client: GraphQLClient) {
  return {

  };
}