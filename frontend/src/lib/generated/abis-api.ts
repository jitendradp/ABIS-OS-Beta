import { GraphQLClient } from 'graphql-request';
import { print } from '../graphql';
import gql from 'graphql-tag';
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
};

export type Account = {
   __typename?: 'Account',
  id: Scalars['ID'],
  type: UserType,
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  location?: Maybe<Location>,
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

export type Address = Location & {
   __typename?: 'Address',
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name?: Maybe<Scalars['String']>,
  tags: Array<Tag>,
  tagAggregate: Array<TagAggregate>,
  line1: Scalars['String'],
  line2?: Maybe<Scalars['String']>,
  city: Scalars['String'],
  zipCode: Scalars['String'],
  country: Scalars['String'],
};

export type AddTagInput = {
  type: Scalars['String'],
  value: Scalars['String'],
};

export type Agent = {
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  timezone: Scalars['String'],
  location?: Maybe<Location>,
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

export type CreateLocationInput = {
  id?: Maybe<Scalars['ID']>,
  type: LocationType,
  name?: Maybe<Scalars['String']>,
  osmNodeId?: Maybe<Scalars['String']>,
  addressLine1?: Maybe<Scalars['String']>,
  addressLine2?: Maybe<Scalars['String']>,
  addressCity?: Maybe<Scalars['String']>,
  addressZipCode?: Maybe<Scalars['String']>,
  addressCountry?: Maybe<Scalars['String']>,
  geoPointLatitude?: Maybe<Scalars['Float']>,
  geoPointLongitude?: Maybe<Scalars['Float']>,
  geoPointRadiusMeter?: Maybe<Scalars['Float']>,
  tags: Array<AddTagInput>,
};

export type CreateProfileInput = {
  type: ProfileType,
  name: Scalars['String'],
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>,
  location?: Maybe<CreateLocationInput>,
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
  tags: Array<Tag>,
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

export type GeoPoint = Location & {
   __typename?: 'GeoPoint',
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name?: Maybe<Scalars['String']>,
  tags: Array<Tag>,
  tagAggregate: Array<TagAggregate>,
  geoPointLatitude: Scalars['Float'],
  geoPointLongitude: Scalars['Float'],
  geoPointRadiusMeter: Scalars['Float'],
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



export type Location = {
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name?: Maybe<Scalars['String']>,
  tags: Array<Tag>,
  tagAggregate: Array<TagAggregate>,
};

export enum LocationType {
  OpenStreetMap = 'OpenStreetMap',
  Address = 'Address',
  GeoPoint = 'GeoPoint'
}

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
  createSession: ActionResponse,
  verifySession: ActionResponse,
  createProfile?: Maybe<Profile>,
  updateProfile?: Maybe<Profile>,
  deleteProfile: ActionResponse,
  createStash?: Maybe<Stash>,
  updateStash?: Maybe<Stash>,
  deleteStash: ActionResponse,
  createChannel?: Maybe<Channel>,
  deleteChannel: ActionResponse,
  createRoom?: Maybe<Room>,
  updateRoom?: Maybe<Room>,
  deleteRoom: ActionResponse,
  createEntry?: Maybe<Entry>,
  updateEntry?: Maybe<Entry>,
  deleteEntry: ActionResponse,
  join?: Maybe<Membership>,
  leave: ActionResponse,
  invite: ActionResponse,
  kick: ActionResponse,
  addTag?: Maybe<Tag>,
  removeTag: ActionResponse,
  createLocation?: Maybe<Location>,
  updateLocation?: Maybe<Location>,
  deleteLocation: ActionResponse,
};


export type MutationCreateSessionArgs = {
  clientTime: Scalars['String']
};


export type MutationVerifySessionArgs = {
  csrfToken: Scalars['String']
};


export type MutationCreateProfileArgs = {
  csrfToken: Scalars['String'],
  createProfileInput: CreateProfileInput
};


export type MutationUpdateProfileArgs = {
  csrfToken: Scalars['String'],
  updateProfileInput: UpdateProfileInput
};


export type MutationDeleteProfileArgs = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};


export type MutationCreateStashArgs = {
  csrfToken: Scalars['String'],
  createStashInput: CreateStashInput
};


export type MutationUpdateStashArgs = {
  csrfToken: Scalars['String'],
  updateStashInput: UpdateStashInput
};


export type MutationDeleteStashArgs = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};


export type MutationCreateChannelArgs = {
  csrfToken: Scalars['String'],
  toAgentId: Scalars['ID']
};


export type MutationDeleteChannelArgs = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};


export type MutationCreateRoomArgs = {
  csrfToken: Scalars['String'],
  createRoomInput: CreateRoomInput
};


export type MutationUpdateRoomArgs = {
  csrfToken: Scalars['String'],
  updateRoomInput: UpdateRoomInput
};


export type MutationDeleteRoomArgs = {
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


export type MutationJoinArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['ID']
};


export type MutationLeaveArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['ID']
};


export type MutationInviteArgs = {
  csrfToken: Scalars['String'],
  agentId: Scalars['ID'],
  toGroupId: Scalars['ID']
};


export type MutationKickArgs = {
  csrfToken: Scalars['String'],
  agentId: Scalars['ID'],
  fromGroupId: Scalars['ID']
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


export type MutationCreateLocationArgs = {
  csrfToken: Scalars['String'],
  createLocationInput: CreateLocationInput
};


export type MutationUpdateLocationArgs = {
  csrfToken: Scalars['String'],
  updateLocationInput: UpdateLocationInput
};


export type MutationDeleteLocationArgs = {
  csrfToken: Scalars['String'],
  id: Scalars['ID']
};

export type NewEntry = {
   __typename?: 'NewEntry',
  entry?: Maybe<Entry>,
  containerId: Scalars['ID'],
};

export type OpenStreetMap = Location & {
   __typename?: 'OpenStreetMap',
  id: Scalars['ID'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
  name?: Maybe<Scalars['String']>,
  tags: Array<Tag>,
  tagAggregate: Array<TagAggregate>,
  osmNodeId: Scalars['String'],
};

export type Profile = Agent & {
   __typename?: 'Profile',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  timezone: Scalars['String'],
  location?: Maybe<Location>,
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
  tags: Array<Tag>,
  tagAggregate: Array<TagAggregate>,
};

export type Service = Agent & {
   __typename?: 'Service',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  timezone: Scalars['String'],
  location?: Maybe<Location>,
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
  tags: Array<Tag>,
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
  type: Scalars['String'],
  owner: Scalars['ID'],
  createdBy: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedBy?: Maybe<Scalars['ID']>,
  updatedAt?: Maybe<Scalars['DateTime']>,
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

export type UpdateLocationInput = {
  id: Scalars['ID'],
  type: LocationType,
  name?: Maybe<Scalars['String']>,
  osmNodeId?: Maybe<Scalars['String']>,
  addressLine1?: Maybe<Scalars['String']>,
  addressLine2?: Maybe<Scalars['String']>,
  addressCity?: Maybe<Scalars['String']>,
  addressZipCode?: Maybe<Scalars['String']>,
  addressCountry?: Maybe<Scalars['String']>,
  geoPointLatitude?: Maybe<Scalars['Float']>,
  geoPointLongitude?: Maybe<Scalars['Float']>,
  geoPointRadiusMeter?: Maybe<Scalars['Float']>,
};

export type UpdateProfileInput = {
  id: Scalars['ID'],
  type: ProfileType,
  name: Scalars['String'],
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>,
  location?: Maybe<CreateLocationInput>,
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
export const GetSystemServicesDocument = gql`
    query getSystemServices($csrfToken: String!) {
  getSystemServices(csrfToken: $csrfToken) {
    id
    name
  }
}
    `;
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
export function getSdk(client: GraphQLClient) {
  return {
    verifySession(variables: VerifySessionMutationVariables): Promise<VerifySessionMutation> {
      return client.request<VerifySessionMutation>(print(VerifySessionDocument), variables);
    },
    createSession(variables: CreateSessionMutationVariables): Promise<CreateSessionMutation> {
      return client.request<CreateSessionMutation>(print(CreateSessionDocument), variables);
    },
    createChannel(variables: CreateChannelMutationVariables): Promise<CreateChannelMutation> {
      return client.request<CreateChannelMutation>(print(CreateChannelDocument), variables);
    },
    createEntry(variables: CreateEntryMutationVariables): Promise<CreateEntryMutation> {
      return client.request<CreateEntryMutation>(print(CreateEntryDocument), variables);
    },
    contentEncodings(variables: ContentEncodingsQueryVariables): Promise<ContentEncodingsQuery> {
      return client.request<ContentEncodingsQuery>(print(ContentEncodingsDocument), variables);
    },
    getSystemServices(variables: GetSystemServicesQueryVariables): Promise<GetSystemServicesQuery> {
      return client.request<GetSystemServicesQuery>(print(GetSystemServicesDocument), variables);
    },
    myChannels(variables: MyChannelsQueryVariables): Promise<MyChannelsQuery> {
      return client.request<MyChannelsQuery>(print(MyChannelsDocument), variables);
    },
    myMemberships(variables: MyMembershipsQueryVariables): Promise<MyMembershipsQuery> {
      return client.request<MyMembershipsQuery>(print(MyMembershipsDocument), variables);
    },
    getEntries(variables: GetEntriesQueryVariables): Promise<GetEntriesQuery> {
      return client.request<GetEntriesQuery>(print(GetEntriesDocument), variables);
    },
    newChannel(variables: NewChannelSubscriptionVariables): Promise<NewChannelSubscription> {
      return client.request<NewChannelSubscription>(print(NewChannelDocument), variables);
    },
    newEntry(variables: NewEntrySubscriptionVariables): Promise<NewEntrySubscription> {
      return client.request<NewEntrySubscription>(print(NewEntryDocument), variables);
    }
  };
}