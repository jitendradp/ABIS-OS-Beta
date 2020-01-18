import gql from 'graphql-tag';
import {Injectable} from '@angular/core';
import * as Apollo from 'apollo-angular';
import {
  MutationOptionsAlone,
  QueryOptionsAlone,
  SubscriptionOptionsAlone,
  WatchQueryOptionsAlone
} from 'apollo-angular/types';

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


export type AccountInformation = {
  __typename?: 'AccountInformation',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
};

export type Group = {
  __typename?: 'Group',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  type: GroupType,
  tags?: Maybe<Array<Tag>>,
  creator: Profile,
  members?: Maybe<Array<Membership>>,
  is_hidden?: Maybe<Scalars['Boolean']>,
  is_public?: Maybe<Scalars['Boolean']>,
};

export enum GroupType {
  Room = 'ROOM',
  Channel = 'CHANNEL',
  Thread = 'THREAD',
  Friends = 'FRIENDS'
}


export type Location = {
  __typename?: 'Location',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  creator: Profile,
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
  creator: Profile,
  member: Profile,
  group: Group,
};

export type Message = {
  __typename?: 'Message',
  id: Scalars['String'],
  type: MessageType,
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  creator: Profile,
  subject?: Maybe<Scalars['String']>,
  content?: Maybe<Scalars['Json']>,
  tags?: Maybe<Array<Tag>>,
  group: Group,
};

export enum MessageType {
  Notification = 'NOTIFICATION',
  DirectMessage = 'DIRECT_MESSAGE',
  Comment = 'COMMENT',
  Post = 'POST'
}

export type Mutation = {
  __typename?: 'Mutation',
  signup?: Maybe<Scalars['String']>,
  verifyEmail?: Maybe<Scalars['String']>,
  verifySession?: Maybe<Scalars['Boolean']>,
  createProfile?: Maybe<Scalars['String']>,
  updateProfile?: Maybe<Scalars['String']>,
  createGroup?: Maybe<Scalars['String']>,
  updateGroup?: Maybe<Scalars['String']>,
  addMember?: Maybe<Scalars['String']>,
  removeMember?: Maybe<Scalars['String']>,
  postMessage?: Maybe<Scalars['String']>,
  login?: Maybe<Scalars['String']>,
  logout?: Maybe<Scalars['Boolean']>,
  setSessionProfile?: Maybe<Scalars['String']>,
};


export type MutationSignupArgs = {
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String']
};


export type MutationVerifyEmailArgs = {
  code: Scalars['String']
};


export type MutationVerifySessionArgs = {
  csrfToken: Scalars['String']
};


export type MutationCreateProfileArgs = {
  csrfToken: Scalars['String'],
  type: ProfileType,
  name: Scalars['String'],
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>
};


export type MutationUpdateProfileArgs = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String'],
  type: ProfileType,
  name: Scalars['String'],
  picture?: Maybe<Scalars['String']>,
  timezone?: Maybe<Scalars['String']>,
  status?: Maybe<Scalars['String']>
};


export type MutationCreateGroupArgs = {
  csrfToken: Scalars['String'],
  hostProfileId: Scalars['String'],
  type: GroupType,
  name: Scalars['String'],
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  tags?: Maybe<Scalars['String']>
};


export type MutationUpdateGroupArgs = {
  csrfToken: Scalars['String'],
  workspaceId: Scalars['String'],
  type: GroupType,
  name: Scalars['String'],
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  logo?: Maybe<Scalars['String']>,
  tags?: Maybe<Scalars['String']>,
  isHidden?: Maybe<Scalars['Boolean']>,
  isPublic?: Maybe<Scalars['Boolean']>
};


export type MutationAddMemberArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  memberProfileId: Scalars['String']
};


export type MutationRemoveMemberArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  memberProfileId: Scalars['String']
};


export type MutationPostMessageArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  subject: Scalars['String'],
  content: Scalars['String']
};


export type MutationLoginArgs = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type MutationLogoutArgs = {
  csrfToken: Scalars['String']
};


export type MutationSetSessionProfileArgs = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String']
};

export type Profile = {
  __typename?: 'Profile',
  id: Scalars['String'],
  createdAt: Scalars['String'],
  updatedAt?: Maybe<Scalars['String']>,
  type: ProfileType,
  name: Scalars['String'],
  timezone?: Maybe<Scalars['String']>,
  status?: Maybe<Scalars['String']>,
  picture: Scalars['String'],
  memberships?: Maybe<Array<Membership>>,
  location?: Maybe<Location>,
};

export enum ProfileType {
  Work = 'Work',
  Private = 'Private'
}

export type Query = {
  __typename?: 'Query',
  myGroups: Array<Group>,
  myMemberships: Array<Membership>,
  getSessionProfile?: Maybe<Profile>,
  getAccountInformation?: Maybe<AccountInformation>,
  listProfiles: Array<Profile>,
  listGroups: Array<Group>,
  listMemberships: Array<Membership>,
  listMembers: Array<Membership>,
  listMessages: Array<Message>,
  getProfile?: Maybe<Profile>,
  getGroup?: Maybe<Group>,
};


export type QueryMyGroupsArgs = {
  csrfToken: Scalars['String']
};


export type QueryMyMembershipsArgs = {
  csrfToken: Scalars['String']
};


export type QueryGetSessionProfileArgs = {
  csrfToken: Scalars['String']
};


export type QueryGetAccountInformationArgs = {
  csrfToken: Scalars['String']
};


export type QueryListProfilesArgs = {
  csrfToken: Scalars['String']
};


export type QueryListGroupsArgs = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String']
};


export type QueryListMembershipsArgs = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String']
};


export type QueryListMembersArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String']
};


export type QueryListMessagesArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  profileId: Scalars['String'],
  begin?: Maybe<Scalars['String']>,
  end?: Maybe<Scalars['String']>
};


export type QueryGetProfileArgs = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String']
};


export type QueryGetGroupArgs = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String']
};

export type Tag = {
  __typename?: 'Tag',
  id: Scalars['ID'],
  createdAt: Scalars['String'],
  creator: Profile,
  name: Scalars['String'],
  parent?: Maybe<Tag>,
};

export type SignupMutationVariables = {
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
  password: Scalars['String']
};


export type SignupMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'signup'>
  );

export type VerifyEmailMutationVariables = {
  code: Scalars['String']
};


export type VerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyEmail'>
  );

export type LoginMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
  );

export type LogoutMutationVariables = {
  csrfToken: Scalars['String']
};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
  );

export type SetSessionProfileMutationVariables = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String']
};


export type SetSessionProfileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setSessionProfile'>
  );

export type VerifySessionMutationVariables = {
  csrfToken: Scalars['String']
};


export type VerifySessionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifySession'>
  );

export type CreateGroupMutationVariables = {
  csrfToken: Scalars['String'],
  hostProfileId: Scalars['String'],
  type: GroupType,
  name: Scalars['String'],
  title: Scalars['String'],
  description: Scalars['String'],
  logo: Scalars['String'],
  tags: Scalars['String']
};


export type CreateGroupMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createGroup'>
  );

export type UpdateGroupMutationVariables = {
  csrfToken: Scalars['String'],
  workspaceId: Scalars['String'],
  type: GroupType,
  name: Scalars['String'],
  title: Scalars['String'],
  description: Scalars['String'],
  logo: Scalars['String'],
  tags: Scalars['String'],
  isHidden: Scalars['Boolean'],
  isPublic: Scalars['Boolean']
};


export type UpdateGroupMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateGroup'>
  );

export type AddMemberMutationVariables = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  memberProfileId: Scalars['String']
};


export type AddMemberMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addMember'>
  );

export type RemoveMemberMutationVariables = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  memberProfileId: Scalars['String']
};


export type RemoveMemberMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeMember'>
  );

export type PostMessageMutationVariables = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  subject: Scalars['String'],
  content: Scalars['String']
};


export type PostMessageMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'postMessage'>
  );

export type CreateProfileMutationVariables = {
  csrfToken: Scalars['String'],
  type: ProfileType,
  name: Scalars['String'],
  picture: Scalars['String'],
  timezone: Scalars['String']
};


export type CreateProfileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createProfile'>
  );

export type UpdateProfileMutationVariables = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String'],
  type: ProfileType,
  name: Scalars['String'],
  picture: Scalars['String'],
  timezone: Scalars['String'],
  status: Scalars['String']
};


export type UpdateProfileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateProfile'>
  );

export type GetAccountInformationQueryVariables = {
  csrfToken: Scalars['String']
};


export type GetAccountInformationQuery = (
  { __typename?: 'Query' }
  & {
  getAccountInformation: Maybe<(
    { __typename?: 'AccountInformation' }
    & Pick<AccountInformation, 'id' | 'createdAt' | 'firstName' | 'lastName'>
    )>
}
  );

export type GetSessionProfileQueryVariables = {
  csrfToken: Scalars['String']
};


export type GetSessionProfileQuery = (
  { __typename?: 'Query' }
  & {
  getSessionProfile: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id'>
    )>
}
  );

export type ListProfilesQueryVariables = {
  csrfToken: Scalars['String']
};


export type ListProfilesQuery = (
  { __typename?: 'Query' }
  & {
  listProfiles: Array<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'createdAt' | 'name' | 'timezone' | 'status' | 'picture'>
    & {
    location: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'name' | 'latitude' | 'longitude' | 'radius'>
      )>
  }
    )>
}
  );

export type ListGroupsQueryVariables = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String']
};


export type ListGroupsQuery = (
  { __typename?: 'Query' }
  & {
  listGroups: Array<(
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name' | 'title' | 'description' | 'logo' | 'type' | 'createdAt' | 'is_hidden' | 'is_public'>
    & {
    creator: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'name' | 'picture' | 'status'>
      & {
      location: Maybe<(
        { __typename?: 'Location' }
        & Pick<Location, 'id' | 'name' | 'latitude' | 'longitude' | 'radius'>
        )>
    }
      )
  }
    )>
}
  );

export type ListMembersQueryVariables = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String']
};


export type ListMembersQuery = (
  { __typename?: 'Query' }
  & {
  listMembers: Array<(
    { __typename?: 'Membership' }
    & Pick<Membership, 'id' | 'createdAt'>
    & {
    member: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'name' | 'timezone' | 'status' | 'picture'>
      & {
      location: Maybe<(
        { __typename?: 'Location' }
        & Pick<Location, 'id' | 'name' | 'latitude' | 'longitude' | 'radius'>
        )>
    }
      )
  }
    )>
}
  );

export type ListMessagesQueryVariables = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String'],
  profileId: Scalars['String'],
  begin?: Maybe<Scalars['String']>,
  end?: Maybe<Scalars['String']>
};


export type ListMessagesQuery = (
  { __typename?: 'Query' }
  & {
  listMessages: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'createdAt' | 'updatedAt' | 'subject' | 'content' | 'type'>
    & {
    creator: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'name' | 'picture'>
      ), tags: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'name'>
      )>>
  }
    )>
}
  );

export type GetGroupQueryVariables = {
  csrfToken: Scalars['String'],
  groupId: Scalars['String']
};


export type GetGroupQuery = (
  { __typename?: 'Query' }
  & {
  getGroup: Maybe<(
    { __typename?: 'Group' }
    & Pick<Group, 'id' | 'name' | 'title' | 'description' | 'logo' | 'type' | 'createdAt' | 'updatedAt' | 'is_public'>
    & {
    tags: Maybe<Array<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'id' | 'name'>
      )>>, creator: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'name' | 'status' | 'picture'>
      & {
      location: Maybe<(
        { __typename?: 'Location' }
        & Pick<Location, 'id' | 'name' | 'latitude' | 'longitude' | 'radius'>
        )>
    }
      ), members: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'id' | 'createdAt'>
      & {
      member: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'name' | 'status' | 'picture'>
        & {
        location: Maybe<(
          { __typename?: 'Location' }
          & Pick<Location, 'id' | 'name' | 'latitude' | 'longitude' | 'radius'>
          )>
      }
        )
    }
      )>>
  }
    )>
}
  );

export type GetProfileQueryVariables = {
  csrfToken: Scalars['String'],
  profileId: Scalars['String']
};


export type GetProfileQuery = (
  { __typename?: 'Query' }
  & {
  getProfile: Maybe<(
    { __typename?: 'Profile' }
    & Pick<Profile, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'timezone' | 'status' | 'picture'>
    & {
    memberships: Maybe<Array<(
      { __typename?: 'Membership' }
      & Pick<Membership, 'id' | 'createdAt'>
      & {
      group: (
        { __typename?: 'Group' }
        & Pick<Group, 'id' | 'name' | 'title' | 'description' | 'logo' | 'type' | 'createdAt'>
        & {
        tags: Maybe<Array<(
          { __typename?: 'Tag' }
          & Pick<Tag, 'id' | 'name'>
          )>>, creator: (
          { __typename?: 'Profile' }
          & Pick<Profile, 'id' | 'name' | 'status' | 'picture'>
          & {
          location: Maybe<(
            { __typename?: 'Location' }
            & Pick<Location, 'id' | 'name' | 'latitude' | 'longitude' | 'radius'>
            )>
        }
          )
      }
        )
    }
      )>>, location: Maybe<(
      { __typename?: 'Location' }
      & Pick<Location, 'id' | 'name' | 'latitude' | 'longitude' | 'radius'>
      )>
  }
    )>
}
  );

export const SignupDocument = gql`
    mutation signup($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class SignupGQL extends Apollo.Mutation<SignupMutation, SignupMutationVariables> {
  document = SignupDocument;

}

export const VerifyEmailDocument = gql`
    mutation verifyEmail($code: String!) {
  verifyEmail(code: $code)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailGQL extends Apollo.Mutation<VerifyEmailMutation, VerifyEmailMutationVariables> {
  document = VerifyEmailDocument;

}

export const LoginDocument = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
  document = LoginDocument;

}

export const LogoutDocument = gql`
    mutation logout($csrfToken: String!) {
  logout(csrfToken: $csrfToken)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class LogoutGQL extends Apollo.Mutation<LogoutMutation, LogoutMutationVariables> {
  document = LogoutDocument;

}

export const SetSessionProfileDocument = gql`
    mutation setSessionProfile($csrfToken: String!, $profileId: String!) {
  setSessionProfile(csrfToken: $csrfToken, profileId: $profileId)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class SetSessionProfileGQL extends Apollo.Mutation<SetSessionProfileMutation, SetSessionProfileMutationVariables> {
  document = SetSessionProfileDocument;

}

export const VerifySessionDocument = gql`
    mutation verifySession($csrfToken: String!) {
  verifySession(csrfToken: $csrfToken)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class VerifySessionGQL extends Apollo.Mutation<VerifySessionMutation, VerifySessionMutationVariables> {
  document = VerifySessionDocument;

}

export const CreateGroupDocument = gql`
    mutation createGroup($csrfToken: String!, $hostProfileId: String!, $type: GroupType!, $name: String!, $title: String!, $description: String!, $logo: String!, $tags: String!) {
  createGroup(csrfToken: $csrfToken, hostProfileId: $hostProfileId, type: $type, name: $name, title: $title, description: $description, logo: $logo, tags: $tags)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class CreateGroupGQL extends Apollo.Mutation<CreateGroupMutation, CreateGroupMutationVariables> {
  document = CreateGroupDocument;

}

export const UpdateGroupDocument = gql`
    mutation updateGroup($csrfToken: String!, $workspaceId: String!, $type: GroupType!, $name: String!, $title: String!, $description: String!, $logo: String!, $tags: String!, $isHidden: Boolean!, $isPublic: Boolean!) {
  updateGroup(csrfToken: $csrfToken, workspaceId: $workspaceId, type: $type, name: $name, title: $title, description: $description, logo: $logo, tags: $tags, isHidden: $isHidden, isPublic: $isPublic)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class UpdateGroupGQL extends Apollo.Mutation<UpdateGroupMutation, UpdateGroupMutationVariables> {
  document = UpdateGroupDocument;

}

export const AddMemberDocument = gql`
    mutation addMember($csrfToken: String!, $groupId: String!, $memberProfileId: String!) {
  addMember(csrfToken: $csrfToken, groupId: $groupId, memberProfileId: $memberProfileId)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class AddMemberGQL extends Apollo.Mutation<AddMemberMutation, AddMemberMutationVariables> {
  document = AddMemberDocument;

}

export const RemoveMemberDocument = gql`
    mutation removeMember($csrfToken: String!, $groupId: String!, $memberProfileId: String!) {
  removeMember(csrfToken: $csrfToken, groupId: $groupId, memberProfileId: $memberProfileId)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class RemoveMemberGQL extends Apollo.Mutation<RemoveMemberMutation, RemoveMemberMutationVariables> {
  document = RemoveMemberDocument;

}

export const PostMessageDocument = gql`
    mutation postMessage($csrfToken: String!, $groupId: String!, $subject: String!, $content: String!) {
  postMessage(csrfToken: $csrfToken, groupId: $groupId, subject: $subject, content: $content)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class PostMessageGQL extends Apollo.Mutation<PostMessageMutation, PostMessageMutationVariables> {
  document = PostMessageDocument;

}

export const CreateProfileDocument = gql`
    mutation createProfile($csrfToken: String!, $type: ProfileType!, $name: String!, $picture: String!, $timezone: String!) {
  createProfile(csrfToken: $csrfToken, type: $type, name: $name, picture: $picture, timezone: $timezone)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class CreateProfileGQL extends Apollo.Mutation<CreateProfileMutation, CreateProfileMutationVariables> {
  document = CreateProfileDocument;

}

export const UpdateProfileDocument = gql`
    mutation updateProfile($csrfToken: String!, $profileId: String!, $type: ProfileType!, $name: String!, $picture: String!, $timezone: String!, $status: String!) {
  updateProfile(csrfToken: $csrfToken, profileId: $profileId, type: $type, name: $name, picture: $picture, timezone: $timezone, status: $status)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileGQL extends Apollo.Mutation<UpdateProfileMutation, UpdateProfileMutationVariables> {
  document = UpdateProfileDocument;

}

export const GetAccountInformationDocument = gql`
    query getAccountInformation($csrfToken: String!) {
  getAccountInformation(csrfToken: $csrfToken) {
    id
    createdAt
    firstName
    lastName
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class GetAccountInformationGQL extends Apollo.Query<GetAccountInformationQuery, GetAccountInformationQueryVariables> {
  document = GetAccountInformationDocument;

}

export const GetSessionProfileDocument = gql`
    query getSessionProfile($csrfToken: String!) {
  getSessionProfile(csrfToken: $csrfToken) {
    id
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class GetSessionProfileGQL extends Apollo.Query<GetSessionProfileQuery, GetSessionProfileQueryVariables> {
  document = GetSessionProfileDocument;

}

export const ListProfilesDocument = gql`
    query listProfiles($csrfToken: String!) {
  listProfiles(csrfToken: $csrfToken) {
    id
    createdAt
    name
    timezone
    status
    picture
    location {
      id
      name
      latitude
      longitude
      radius
    }
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class ListProfilesGQL extends Apollo.Query<ListProfilesQuery, ListProfilesQueryVariables> {
  document = ListProfilesDocument;

}

export const ListGroupsDocument = gql`
    query listGroups($csrfToken: String!, $profileId: String!) {
  listGroups(csrfToken: $csrfToken, profileId: $profileId) {
    id
    name
    creator {
      id
      name
      picture
      status
      location {
        id
        name
        latitude
        longitude
        radius
      }
    }
    title
    description
    logo
    type
    createdAt
    creator {
      id
      name
      picture
      status
      location {
        id
        name
        latitude
        longitude
        radius
      }
    }
    is_hidden
    is_public
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class ListGroupsGQL extends Apollo.Query<ListGroupsQuery, ListGroupsQueryVariables> {
  document = ListGroupsDocument;

}

export const ListMembersDocument = gql`
    query listMembers($csrfToken: String!, $groupId: String!) {
  listMembers(csrfToken: $csrfToken, groupId: $groupId) {
    id
    createdAt
    member {
      id
      name
      timezone
      status
      picture
      location {
        id
        name
        latitude
        longitude
        radius
      }
    }
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class ListMembersGQL extends Apollo.Query<ListMembersQuery, ListMembersQueryVariables> {
  document = ListMembersDocument;

}

export const ListMessagesDocument = gql`
    query listMessages($csrfToken: String!, $groupId: String!, $profileId: String!, $begin: String, $end: String) {
  listMessages(csrfToken: $csrfToken, groupId: $groupId, profileId: $profileId, begin: $begin, end: $end) {
    id
    createdAt
    updatedAt
    creator {
      id
      name
      picture
    }
    subject
    content
    tags {
      id
      name
    }
    type
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class ListMessagesGQL extends Apollo.Query<ListMessagesQuery, ListMessagesQueryVariables> {
  document = ListMessagesDocument;

}

export const GetGroupDocument = gql`
    query getGroup($csrfToken: String!, $groupId: String!) {
  getGroup(csrfToken: $csrfToken, groupId: $groupId) {
    id
    name
    title
    description
    logo
    type
    tags {
      id
      name
    }
    createdAt
    updatedAt
    creator {
      id
      name
      status
      picture
      location {
        id
        name
        latitude
        longitude
        radius
      }
    }
    members {
      id
      createdAt
      member {
        id
        name
        status
        picture
        location {
          id
          name
          latitude
          longitude
          radius
        }
      }
    }
    is_public
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class GetGroupGQL extends Apollo.Query<GetGroupQuery, GetGroupQueryVariables> {
  document = GetGroupDocument;

}

export const GetProfileDocument = gql`
    query getProfile($csrfToken: String!, $profileId: String!) {
  getProfile(csrfToken: $csrfToken, profileId: $profileId) {
    id
    createdAt
    updatedAt
    name
    timezone
    status
    picture
    memberships {
      id
      createdAt
      group {
        id
        name
        title
        description
        logo
        type
        tags {
          id
          name
        }
        createdAt
        creator {
          id
          name
          status
          picture
          location {
            id
            name
            latitude
            longitude
            radius
          }
        }
      }
    }
    location {
      id
      name
      latitude
      longitude
      radius
    }
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class GetProfileGQL extends Apollo.Query<GetProfileQuery, GetProfileQueryVariables> {
  document = GetProfileDocument;

}
