import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: any,
  Integer: any,
  Json: any,
  Upload: any,
};



export type Account = {
   __typename?: 'Account',
  id: Scalars['ID'],
  type: UserType,
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  timezone: Scalars['String'],
  email: Scalars['String'],
  personFirstName?: Maybe<Scalars['String']>,
  personLastName?: Maybe<Scalars['String']>,
  personPhone?: Maybe<Scalars['String']>,
  personMobilePhone?: Maybe<Scalars['String']>,
  organizationName?: Maybe<Scalars['String']>,
};

export type ActionResponse = {
   __typename?: 'ActionResponse',
  success: Scalars['Boolean'],
  code?: Maybe<Scalars['String']>,
  message?: Maybe<Scalars['String']>,
  data?: Maybe<Scalars['String']>,
};

export type AddTagInput = {
  isPrivate: Scalars['Boolean'],
  type: Scalars['String'],
  value: Scalars['String'],
};

export type Agent = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  timezone: Scalars['String'],
};

export type Channel = Group & {
   __typename?: 'Channel',
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  entryCount?: Maybe<Scalars['Integer']>,
  receiver: Agent,
  reverse?: Maybe<Channel>,
};

export type ContentEncoding = {
   __typename?: 'ContentEncoding',
  id: Scalars['ID'],
  type: EncodingType,
  maintainer: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  charset: Scalars['String'],
  language?: Maybe<Scalars['String']>,
  data?: Maybe<Scalars['String']>,
};

export type CreateEntryInput = {
  roomId: Scalars['ID'],
  type: EntryType,
  name?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['Json']>,
  contentEncoding?: Maybe<Scalars['ID']>,
};

export type CreateProfileInput = {
  type: ProfileType,
  name: Scalars['String'],
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>,
};

export type CreateRoomInput = {
  name: Scalars['String'],
  isPublic: Scalars['Boolean'],
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  banner?: Maybe<Scalars['String']>,
};

export type CreateStashInput = {
  name: Scalars['String'],
};


export enum EncodingType {
  Custom = 'Custom',
  Base64 = 'Base64',
  Microformat = 'Microformat',
  TableSchema = 'TableSchema',
  JsonSchema = 'JsonSchema',
  XmlSchema = 'XmlSchema',
  GqlSchema = 'GqlSchema',
  RdfSchema = 'RdfSchema',
  Owl = 'Owl'
}

export type Entry = {
   __typename?: 'Entry',
  id: Scalars['ID'],
  type: EntryType,
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['Json']>,
  contentEncoding?: Maybe<ContentEncoding>,
  tagAggregate: Array<TagAggregate>,
};

export enum EntryType {
  Empty = 'Empty',
  Json = 'Json',
  Table = 'Table',
  Document = 'Document',
  Picture = 'Picture',
  File = 'File',
  Thing = 'Thing'
}

export type File = {
   __typename?: 'File',
  id: Scalars['ID'],
  path: Scalars['String'],
  filename: Scalars['String'],
  mimetype: Scalars['String'],
  encoding: Scalars['String'],
};

export type Group = {
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  entryCount?: Maybe<Scalars['Integer']>,
};

export enum GroupType {
  Channel = 'Channel',
  Room = 'Room'
}

export type Inbox = {
   __typename?: 'Inbox',
  id: Scalars['ID'],
};



export type Membership = {
   __typename?: 'Membership',
  id: Scalars['ID'],
  type: MembershipType,
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  groupType?: Maybe<GroupType>,
  group?: Maybe<Group>,
  member: Agent,
  showHistory: Scalars['Boolean'],
};

export enum MembershipType {
  Invite = 'Invite',
  Single = 'Single',
  Multi = 'Multi'
}

export type Mutation = {
   __typename?: 'Mutation',
  singleUpload: File,
  multipleUpload: Array<File>,
  createSession: ActionResponse,
  verifySession: ActionResponse,
  createChannel?: Maybe<Channel>,
  deleteChannel: ActionResponse,
  createEntry?: Maybe<Entry>,
  updateEntry?: Maybe<Entry>,
  deleteEntry: ActionResponse,
  addTag?: Maybe<Tag>,
  removeTag: ActionResponse,
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload']
};


export type MutationMultipleUploadArgs = {
  files: Array<Scalars['Upload']>
};


export type MutationCreateSessionArgs = {
  clientTime: Scalars['String']
};


export type MutationVerifySessionArgs = {
  csrfToken: Scalars['String']
};


export type MutationCreateChannelArgs = {
  csrfToken: Scalars['String'],
  toAgentId: Scalars['ID']
};


export type MutationDeleteChannelArgs = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};


export type MutationCreateEntryArgs = {
  csrfToken: Scalars['String'],
  createEntryInput: CreateEntryInput
};


export type MutationUpdateEntryArgs = {
  csrfToken: Scalars['String'],
  updateEntryInput: UpdateEntryInput
};


export type MutationDeleteEntryArgs = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};


export type MutationAddTagArgs = {
  csrfToken: Scalars['String'],
  to: Scalars['ID'],
  addTagInput: AddTagInput
};


export type MutationRemoveTagArgs = {
  csrfToken: Scalars['String'],
  tagId: Scalars['ID']
};

export type NewEntry = {
   __typename?: 'NewEntry',
  entry?: Maybe<Entry>,
  containerId: Scalars['ID'],
};

export type Profile = Agent & {
   __typename?: 'Profile',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  timezone: Scalars['String'],
  profileType: ProfileType,
  avatar: Scalars['String'],
  status: ProfileStatus,
  banner?: Maybe<Scalars['String']>,
  slogan?: Maybe<Scalars['String']>,
  jobTitle?: Maybe<Scalars['String']>,
};

export enum ProfileStatus {
  Offline = 'Offline',
  DoNotDisturb = 'DoNotDisturb',
  Away = 'Away',
  Available = 'Available'
}

export enum ProfileType {
  Business = 'Business',
  Private = 'Private'
}

export type Query = {
   __typename?: 'Query',
  uploads?: Maybe<Array<Maybe<File>>>,
  contentEncodings: Array<ContentEncoding>,
  getSystemServices: Array<Service>,
  myAccount: Account,
  myProfiles: Array<Maybe<Profile>>,
  myServices: Array<Maybe<Service>>,
  myStashes: Array<Stash>,
  myChannels: Array<Channel>,
  myRooms: Array<Room>,
  myMemberships: Array<Membership>,
  findRooms: Array<Room>,
  findMemberships: Array<Membership>,
  getEntries: Array<Entry>,
};


export type QueryContentEncodingsArgs = {
  csrfToken: Scalars['String']
};


export type QueryGetSystemServicesArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyAccountArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyProfilesArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyServicesArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyStashesArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyChannelsArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyRoomsArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyMembershipsArgs = {
  csrfToken: Scalars['String'],
  groupType?: Maybe<GroupType>,
  isPublic?: Maybe<Scalars['Boolean']>
};


export type QueryFindRoomsArgs = {
  csrfToken: Scalars['String'],
  searchText?: Maybe<Scalars['String']>
};


export type QueryFindMembershipsArgs = {
  csrfToken: Scalars['String'],
  roomId: Scalars['ID'],
  searchText?: Maybe<Scalars['String']>
};


export type QueryGetEntriesArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['ID'],
  from?: Maybe<Scalars['DateTime']>,
  to?: Maybe<Scalars['DateTime']>
};

export type Room = Group & {
   __typename?: 'Room',
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  entryCount?: Maybe<Scalars['Integer']>,
  isPrivate: Scalars['Boolean'],
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  banner?: Maybe<Scalars['String']>,
  inbox: Inbox,
  memberCount?: Maybe<Scalars['Integer']>,
  memberships: Array<Membership>,
  tagAggregate: Array<TagAggregate>,
};

export type Service = Agent & {
   __typename?: 'Service',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  timezone: Scalars['String'],
  status: ServiceStatus,
  description?: Maybe<Scalars['String']>,
};

export enum ServiceStatus {
  Running = 'Running',
  Suspended = 'Suspended',
  Failed = 'Failed',
  Succeeded = 'Succeeded'
}

export type SignupInput = {
  type: UserType,
  timezone: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String'],
  personFirstName?: Maybe<Scalars['String']>,
  personLastName?: Maybe<Scalars['String']>,
  personPhone?: Maybe<Scalars['String']>,
  personMobilePhone?: Maybe<Scalars['String']>,
  organizationName?: Maybe<Scalars['String']>,
};

export type Stash = Group & {
   __typename?: 'Stash',
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  entryCount?: Maybe<Scalars['Integer']>,
};

export type Subscription = {
   __typename?: 'Subscription',
  newEntry?: Maybe<NewEntry>,
  newChannel?: Maybe<Channel>,
  newRoom?: Maybe<Room>,
};


export type SubscriptionNewEntryArgs = {
  csrfToken: Scalars['String']
};


export type SubscriptionNewChannelArgs = {
  csrfToken: Scalars['String']
};


export type SubscriptionNewRoomArgs = {
  csrfToken: Scalars['String']
};

export type Tag = {
   __typename?: 'Tag',
  id: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  owner: Scalars['ID'],
  tagType: Scalars['String'],
  forType: Scalars['String'],
  forId: Scalars['ID'],
  value: Scalars['String'],
};

export type TagAggregate = {
   __typename?: 'TagAggregate',
  type: Scalars['String'],
  count: Scalars['Integer'],
};

export type UpdateEntryInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['Json']>,
  contentEncoding?: Maybe<Scalars['ID']>,
};

export type UpdateProfileInput = {
  id: Scalars['ID'],
  type: ProfileType,
  name: Scalars['String'],
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>,
  status: ProfileStatus,
};

export type UpdateRoomInput = {
  id: Scalars['ID'],
  name: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  banner?: Maybe<Scalars['String']>,
};

export type UpdateStashInput = {
  id: Scalars['ID'],
  name: Scalars['String'],
};


export enum UserType {
  Person = 'Person',
  Organization = 'Organization'
}

export type VerifySessionMutationVariables = {
  csrfToken: Scalars['String']
};


export type VerifySessionMutation = (
  { __typename?: 'Mutation' }
  & { verifySession: (
    { __typename?: 'ActionResponse' }
    & Pick<ActionResponse, 'success' | 'code' | 'message' | 'data'>
  ) }
);

export type CreateSessionMutationVariables = {
  clientTime: Scalars['String']
};


export type CreateSessionMutation = (
  { __typename?: 'Mutation' }
  & { createSession: (
    { __typename?: 'ActionResponse' }
    & Pick<ActionResponse, 'success' | 'code' | 'message' | 'data'>
  ) }
);

export type CreateChannelMutationVariables = {
  csrfToken: Scalars['String'],
  toAgentId: Scalars['ID']
};


export type CreateChannelMutation = (
  { __typename?: 'Mutation' }
  & { createChannel: Maybe<(
    { __typename?: 'Channel' }
    & Pick<Channel, 'id' | 'name' | 'createdAt'>
    & { receiver: (
      { __typename?: 'Service' }
      & Pick<Service, 'id' | 'name'>
    ) | (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'name'>
    ), reverse: Maybe<(
      { __typename?: 'Channel' }
      & Pick<Channel, 'id'>
    )> }
  )> }
);

export type DeleteChannelMutationVariables = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};


export type DeleteChannelMutation = (
  { __typename?: 'Mutation' }
  & { deleteChannel: (
    { __typename?: 'ActionResponse' }
    & Pick<ActionResponse, 'success' | 'code' | 'message' | 'data'>
  ) }
);

export type CreateEntryMutationVariables = {
  csrfToken: Scalars['String'],
  createEntryInput: CreateEntryInput
};


export type CreateEntryMutation = (
  { __typename?: 'Mutation' }
  & { createEntry: Maybe<(
    { __typename?: 'Entry' }
    & Pick<Entry, 'type' | 'id' | 'createdAt' | 'createdBy' | 'owner' | 'name' | 'content'>
    & { contentEncoding: Maybe<(
      { __typename?: 'ContentEncoding' }
      & Pick<ContentEncoding, 'id'>
    )> }
  )> }
);

export type DeleteEntryMutationVariables = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};


export type DeleteEntryMutation = (
  { __typename?: 'Mutation' }
  & { deleteEntry: (
    { __typename?: 'ActionResponse' }
    & Pick<ActionResponse, 'success' | 'code' | 'message' | 'data'>
  ) }
);

export type AddTagMutationVariables = {
  csrfToken: Scalars['String'],
  to: Scalars['ID'],
  addTagInput: AddTagInput
};


export type AddTagMutation = (
  { __typename?: 'Mutation' }
  & { addTag: Maybe<(
    { __typename?: 'Tag' }
    & Pick<Tag, 'id' | 'value'>
  )> }
);

export type ContentEncodingsQueryVariables = {
  csrfToken: Scalars['String']
};


export type ContentEncodingsQuery = (
  { __typename?: 'Query' }
  & { contentEncodings: Array<(
    { __typename?: 'ContentEncoding' }
    & Pick<ContentEncoding, 'id' | 'type' | 'name' | 'maintainer' | 'charset' | 'data'>
  )> }
);

export type GetSystemServicesQueryVariables = {
  csrfToken: Scalars['String']
};


export type GetSystemServicesQuery = (
  { __typename?: 'Query' }
  & { getSystemServices: Array<(
    { __typename?: 'Service' }
    & Pick<Service, 'id' | 'name'>
  )> }
);

export type MyAccountQueryVariables = {
  csrfToken: Scalars['String']
};


export type MyAccountQuery = (
  { __typename?: 'Query' }
  & { myAccount: (
    { __typename?: 'Account' }
    & Pick<Account, 'id' | 'createdAt' | 'timezone' | 'email' | 'personFirstName' | 'personLastName' | 'personPhone' | 'personMobilePhone' | 'organizationName'>
  ) }
);

export type MyProfilesQueryVariables = {
  csrfToken: Scalars['String']
};


export type MyProfilesQuery = (
  { __typename?: 'Query' }
  & { myProfiles: Array<Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'profileType' | 'createdAt' | 'updatedAt' | 'name' | 'status' | 'timezone' | 'avatar' | 'banner' | 'slogan' | 'jobTitle'>
  )>> }
);

export type MyServicesQueryVariables = {
  csrfToken: Scalars['String']
};


export type MyServicesQuery = (
  { __typename?: 'Query' }
  & { myServices: Array<Maybe<(
    { __typename?: 'Service' }
    & Pick<Service, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'timezone' | 'status' | 'description'>
  )>> }
);

export type MyStashesQueryVariables = {
  csrfToken: Scalars['String']
};


export type MyStashesQuery = (
  { __typename?: 'Query' }
  & { myStashes: Array<(
    { __typename?: 'Stash' }
    & Pick<Stash, 'id' | 'owner' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'name' | 'entryCount'>
  )> }
);

export type MyChannelsQueryVariables = {
  csrfToken: Scalars['String']
};


export type MyChannelsQuery = (
  { __typename?: 'Query' }
  & { myChannels: Array<(
    { __typename?: 'Channel' }
    & Pick<Channel, 'id' | 'owner' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'name' | 'entryCount'>
    & { receiver: (
      { __typename?: 'Service' }
      & Pick<Service, 'id'>
    ) | (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id'>
    ), reverse: Maybe<(
      { __typename?: 'Channel' }
      & Pick<Channel, 'id'>
    )> }
  )> }
);

export type MyRoomsQueryVariables = {
  csrfToken: Scalars['String']
};


export type MyRoomsQuery = (
  { __typename?: 'Query' }
  & { myRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'owner' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'name' | 'entryCount' | 'isPrivate' | 'title' | 'description' | 'logo' | 'banner'>
    & { inbox: (
      { __typename?: 'Inbox' }
      & Pick<Inbox, 'id'>
    ), memberships: Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'createdAt' | 'createdBy'>
      & { member: (
        { __typename?: 'Service' }
        & Pick<Service, 'id' | 'name'>
      ) | (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'name'>
      ) }
    )>, tagAggregate: Array<(
      { __typename?: 'TagAggregate' }
      & Pick<TagAggregate, 'type' | 'count'>
    )> }
  )> }
);

export type MyMembershipsQueryVariables = {
  csrfToken: Scalars['String'],
  groupType?: Maybe<GroupType>,
  isPublic?: Maybe<Scalars['Boolean']>
};


export type MyMembershipsQuery = (
  { __typename?: 'Query' }
  & { myMemberships: Array<(
    { __typename?: 'Membership' }
    & Pick<Membership, 'id' | 'type' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'groupType' | 'showHistory'>
    & { group: Maybe<(
      { __typename?: 'Stash' }
      & Pick<Stash, 'id' | 'name'>
    ) | (
      { __typename?: 'Channel' }
      & Pick<Channel, 'id' | 'name'>
    ) | (
      { __typename?: 'Room' }
      & Pick<Room, 'id' | 'name'>
    )> }
  )> }
);

export type FindRoomsQueryVariables = {
  csrfToken: Scalars['String'],
  searchText?: Maybe<Scalars['String']>
};


export type FindRoomsQuery = (
  { __typename?: 'Query' }
  & { findRooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'owner' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'name' | 'title' | 'description' | 'logo' | 'banner'>
  )> }
);

export type FindMembershipsQueryVariables = {
  csrfToken: Scalars['String'],
  roomId: Scalars['ID'],
  searchText?: Maybe<Scalars['String']>
};


export type FindMembershipsQuery = (
  { __typename?: 'Query' }
  & { findMemberships: Array<(
    { __typename?: 'Membership' }
    & Pick<Membership, 'id' | 'type' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'groupType' | 'showHistory'>
    & { group: Maybe<(
      { __typename?: 'Stash' }
      & Pick<Stash, 'id' | 'name'>
    ) | (
      { __typename?: 'Channel' }
      & Pick<Channel, 'id' | 'name'>
    ) | (
      { __typename?: 'Room' }
      & Pick<Room, 'id' | 'name'>
    )>, member: (
      { __typename?: 'Service' }
      & Pick<Service, 'id' | 'name'>
    ) | (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'name'>
    ) }
  )> }
);

export type GetEntriesQueryVariables = {
  csrfToken: Scalars['String'],
  groupId: Scalars['ID'],
  from?: Maybe<Scalars['DateTime']>,
  to?: Maybe<Scalars['DateTime']>
};


export type GetEntriesQuery = (
  { __typename?: 'Query' }
  & { getEntries: Array<(
    { __typename?: 'Entry' }
    & Pick<Entry, 'id' | 'type' | 'owner' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt' | 'name' | 'content'>
    & { contentEncoding: Maybe<(
      { __typename?: 'ContentEncoding' }
      & Pick<ContentEncoding, 'id' | 'name' | 'charset' | 'data'>
    )>, tagAggregate: Array<(
      { __typename?: 'TagAggregate' }
      & Pick<TagAggregate, 'type' | 'count'>
    )> }
  )> }
);

export type NewEntrySubscriptionVariables = {
  csrfToken: Scalars['String']
};


export type NewEntrySubscription = (
  { __typename?: 'Subscription' }
  & { newEntry: Maybe<(
    { __typename?: 'NewEntry' }
    & Pick<NewEntry, 'containerId'>
    & { entry: Maybe<(
      { __typename?: 'Entry' }
      & Pick<Entry, 'id' | 'createdAt' | 'createdBy' | 'content' | 'type' | 'name'>
      & { contentEncoding: Maybe<(
        { __typename?: 'ContentEncoding' }
        & Pick<ContentEncoding, 'id'>
      )> }
    )> }
  )> }
);

export type NewChannelSubscriptionVariables = {
  csrfToken: Scalars['String']
};


export type NewChannelSubscription = (
  { __typename?: 'Subscription' }
  & { newChannel: Maybe<(
    { __typename?: 'Channel' }
    & Pick<Channel, 'id' | 'createdAt' | 'createdBy' | 'owner'>
    & { receiver: (
      { __typename?: 'Service' }
      & Pick<Service, 'id'>
    ) | (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id'>
    ) }
  )> }
);

export type NewRoomSubscriptionVariables = {
  csrfToken: Scalars['String']
};


export type NewRoomSubscription = (
  { __typename?: 'Subscription' }
  & { newRoom: Maybe<(
    { __typename?: 'Room' }
    & Pick<Room, 'id' | 'createdAt' | 'createdBy' | 'owner' | 'logo' | 'name' | 'title' | 'description' | 'banner'>
  )> }
);

export const VerifySessionDocument = gql`
    mutation verifySession($csrfToken: String!) {
  verifySession(csrfToken: $csrfToken) {
    success
    code
    message
    data
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifySessionGQL extends Apollo.Mutation<VerifySessionMutation, VerifySessionMutationVariables> {
    document = VerifySessionDocument;
    
  }
export const CreateSessionDocument = gql`
    mutation createSession($clientTime: String!) {
  createSession(clientTime: $clientTime) {
    success
    code
    message
    data
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateSessionGQL extends Apollo.Mutation<CreateSessionMutation, CreateSessionMutationVariables> {
    document = CreateSessionDocument;
    
  }
export const CreateChannelDocument = gql`
    mutation createChannel($csrfToken: String!, $toAgentId: ID!) {
  createChannel(csrfToken: $csrfToken, toAgentId: $toAgentId) {
    id
    name
    createdAt
    receiver {
      id
      name
    }
    reverse {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateChannelGQL extends Apollo.Mutation<CreateChannelMutation, CreateChannelMutationVariables> {
    document = CreateChannelDocument;
    
  }
export const DeleteChannelDocument = gql`
    mutation deleteChannel($csrfToken: String!, $id: ID!) {
  deleteChannel(csrfToken: $csrfToken, id: $id) {
    success
    code
    message
    data
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteChannelGQL extends Apollo.Mutation<DeleteChannelMutation, DeleteChannelMutationVariables> {
    document = DeleteChannelDocument;
    
  }
export const CreateEntryDocument = gql`
    mutation createEntry($csrfToken: String!, $createEntryInput: CreateEntryInput!) {
  createEntry(csrfToken: $csrfToken, createEntryInput: $createEntryInput) {
    type
    id
    createdAt
    createdBy
    owner
    name
    contentEncoding {
      id
    }
    content
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEntryGQL extends Apollo.Mutation<CreateEntryMutation, CreateEntryMutationVariables> {
    document = CreateEntryDocument;
    
  }
export const DeleteEntryDocument = gql`
    mutation deleteEntry($csrfToken: String!, $id: ID!) {
  deleteEntry(csrfToken: $csrfToken, id: $id) {
    success
    code
    message
    data
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteEntryGQL extends Apollo.Mutation<DeleteEntryMutation, DeleteEntryMutationVariables> {
    document = DeleteEntryDocument;
    
  }
export const AddTagDocument = gql`
    mutation addTag($csrfToken: String!, $to: ID!, $addTagInput: AddTagInput!) {
  addTag(csrfToken: $csrfToken, to: $to, addTagInput: $addTagInput) {
    id
    value
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddTagGQL extends Apollo.Mutation<AddTagMutation, AddTagMutationVariables> {
    document = AddTagDocument;
    
  }
export const ContentEncodingsDocument = gql`
    query contentEncodings($csrfToken: String!) {
  contentEncodings(csrfToken: $csrfToken) {
    id
    type
    name
    maintainer
    charset
    data
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ContentEncodingsGQL extends Apollo.Query<ContentEncodingsQuery, ContentEncodingsQueryVariables> {
    document = ContentEncodingsDocument;
    
  }
export const GetSystemServicesDocument = gql`
    query getSystemServices($csrfToken: String!) {
  getSystemServices(csrfToken: $csrfToken) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSystemServicesGQL extends Apollo.Query<GetSystemServicesQuery, GetSystemServicesQueryVariables> {
    document = GetSystemServicesDocument;
    
  }
export const MyAccountDocument = gql`
    query myAccount($csrfToken: String!) {
  myAccount(csrfToken: $csrfToken) {
    id
    createdAt
    timezone
    email
    personFirstName
    personLastName
    personPhone
    personMobilePhone
    organizationName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyAccountGQL extends Apollo.Query<MyAccountQuery, MyAccountQueryVariables> {
    document = MyAccountDocument;
    
  }
export const MyProfilesDocument = gql`
    query myProfiles($csrfToken: String!) {
  myProfiles(csrfToken: $csrfToken) {
    id
    profileType
    createdAt
    updatedAt
    name
    status
    timezone
    avatar
    banner
    slogan
    jobTitle
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyProfilesGQL extends Apollo.Query<MyProfilesQuery, MyProfilesQueryVariables> {
    document = MyProfilesDocument;
    
  }
export const MyServicesDocument = gql`
    query myServices($csrfToken: String!) {
  myServices(csrfToken: $csrfToken) {
    id
    createdAt
    updatedAt
    name
    timezone
    status
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyServicesGQL extends Apollo.Query<MyServicesQuery, MyServicesQueryVariables> {
    document = MyServicesDocument;
    
  }
export const MyStashesDocument = gql`
    query myStashes($csrfToken: String!) {
  myStashes(csrfToken: $csrfToken) {
    id
    owner
    createdBy
    createdAt
    updatedBy
    updatedAt
    name
    entryCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyStashesGQL extends Apollo.Query<MyStashesQuery, MyStashesQueryVariables> {
    document = MyStashesDocument;
    
  }
export const MyChannelsDocument = gql`
    query myChannels($csrfToken: String!) {
  myChannels(csrfToken: $csrfToken) {
    id
    owner
    createdBy
    createdAt
    updatedBy
    updatedAt
    name
    entryCount
    receiver {
      id
    }
    reverse {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyChannelsGQL extends Apollo.Query<MyChannelsQuery, MyChannelsQueryVariables> {
    document = MyChannelsDocument;
    
  }
export const MyRoomsDocument = gql`
    query myRooms($csrfToken: String!) {
  myRooms(csrfToken: $csrfToken) {
    id
    owner
    createdBy
    createdAt
    updatedBy
    updatedAt
    name
    entryCount
    isPrivate
    title
    description
    logo
    banner
    inbox {
      id
    }
    memberships {
      createdAt
      createdBy
      member {
        id
        name
      }
    }
    tagAggregate {
      type
      count
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyRoomsGQL extends Apollo.Query<MyRoomsQuery, MyRoomsQueryVariables> {
    document = MyRoomsDocument;
    
  }
export const MyMembershipsDocument = gql`
    query myMemberships($csrfToken: String!, $groupType: GroupType, $isPublic: Boolean) {
  myMemberships(csrfToken: $csrfToken, groupType: $groupType, isPublic: $isPublic) {
    id
    type
    createdBy
    createdAt
    updatedBy
    updatedAt
    groupType
    group {
      id
      name
    }
    showHistory
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyMembershipsGQL extends Apollo.Query<MyMembershipsQuery, MyMembershipsQueryVariables> {
    document = MyMembershipsDocument;
    
  }
export const FindRoomsDocument = gql`
    query findRooms($csrfToken: String!, $searchText: String) {
  findRooms(csrfToken: $csrfToken, searchText: $searchText) {
    id
    owner
    createdBy
    createdAt
    updatedBy
    updatedAt
    name
    title
    description
    logo
    banner
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindRoomsGQL extends Apollo.Query<FindRoomsQuery, FindRoomsQueryVariables> {
    document = FindRoomsDocument;
    
  }
export const FindMembershipsDocument = gql`
    query findMemberships($csrfToken: String!, $roomId: ID!, $searchText: String) {
  findMemberships(csrfToken: $csrfToken, roomId: $roomId, searchText: $searchText) {
    id
    type
    createdBy
    createdAt
    updatedBy
    updatedAt
    groupType
    group {
      id
      name
    }
    member {
      id
      name
    }
    showHistory
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FindMembershipsGQL extends Apollo.Query<FindMembershipsQuery, FindMembershipsQueryVariables> {
    document = FindMembershipsDocument;
    
  }
export const GetEntriesDocument = gql`
    query getEntries($csrfToken: String!, $groupId: ID!, $from: DateTime, $to: DateTime) {
  getEntries(csrfToken: $csrfToken, groupId: $groupId, from: $from, to: $to) {
    id
    type
    owner
    createdBy
    createdAt
    updatedBy
    updatedAt
    name
    content
    contentEncoding {
      id
      name
      charset
      data
    }
    tagAggregate {
      type
      count
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetEntriesGQL extends Apollo.Query<GetEntriesQuery, GetEntriesQueryVariables> {
    document = GetEntriesDocument;
    
  }
export const NewEntryDocument = gql`
    subscription newEntry($csrfToken: String!) {
  newEntry(csrfToken: $csrfToken) {
    containerId
    entry {
      id
      createdAt
      createdBy
      contentEncoding {
        id
      }
      content
      type
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NewEntryGQL extends Apollo.Subscription<NewEntrySubscription, NewEntrySubscriptionVariables> {
    document = NewEntryDocument;
    
  }
export const NewChannelDocument = gql`
    subscription newChannel($csrfToken: String!) {
  newChannel(csrfToken: $csrfToken) {
    id
    createdAt
    createdBy
    owner
    receiver {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NewChannelGQL extends Apollo.Subscription<NewChannelSubscription, NewChannelSubscriptionVariables> {
    document = NewChannelDocument;
    
  }
export const NewRoomDocument = gql`
    subscription newRoom($csrfToken: String!) {
  newRoom(csrfToken: $csrfToken) {
    id
    createdAt
    createdBy
    owner
    logo
    name
    title
    description
    banner
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NewRoomGQL extends Apollo.Subscription<NewRoomSubscription, NewRoomSubscriptionVariables> {
    document = NewRoomDocument;
    
  }