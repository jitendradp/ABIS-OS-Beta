# Prisma data model
This schema is used as the main means for structured data storage on the ABIS platform.  
It stores system- as well as user-data and has a few main concepts which will be explained in detail throughout this document.    
  
We start by explaining all major types and then try to put them in perspective by discussing the principles behind this design and its use cases.

## Types
* **User**  
A registered User. Represents a natural person. Stores personal details like the email-address, password hash, phone no., etc..  
This type must only be used internally. Users interact with other Users via their Profiles.
* **Session**  
When a User successfully logged on, a session will be created.  
This type contains the bearer- and csrf-token for that session. These must be used with every api call that requires authentication/authorization.  
A Session is always bound to a Profile. When the User switches the Profile, a new Session must be established.
* **Profile**  
Users can create multiple Profiles (and must at least have one). Profiles represent Users in Groups.   
A User could have e.g. a "private" and a "business" profile, both participating in different groups for different purposes.  
Profiles participate in Groups via a Membership.
* **Group**  
Groups are the main structural entity in the schema. They contain Entries (user- and system-generated).  
Further, all access rights are modelled in terms of Groups: _All members of a group can access all the Entries it contains._  
Groups can be of type PRIVATE (only the owner can see and access it and its contents), ONE_ONE_ONE (a Group with immutable Membership-list that contains only two profiles) or ROOM (regular public or private room).  
A lot of features will utilize hidden system-created or default Groups under the hood (contact list etc.). 
* **Membership**  
Every Group can have many members (and has always one - the creator of the group). Only Profiles can be members of Groups.  
A Membership can be in different states. That allows for a member approval process.  
New members can also be limited to see only Entries which have been created after their join date. 
* **Entry**  
Entries have a ID, can have a name and simply store JSON objects.  
Every user-interactable object (no matter if message or file) is, at its base, an Entry.  
Entries are broadly categorized into the following categories:
  * EMPTY: An Entry that has no contents (but might have a name and tags).
  * DATA_JSON: Contains an arbitrary json object.
  * DATA_TABLE: Contains metadata about a table (csv, excel, etc.) that is stored somewhere.
  * DATA_DOCUMENT: Contains metadata about an indexable document that is stored somewhere.
  * DATA_PICTURE: Contains metadata about a picture that is stored somewhere.
  * DATA_FILE : Contains metadata about an arbitrary file that is stored somewhere.
* **Tag**  
Every object (except: Sessions, Memberships and Tags) can be tagged. A Tag consist of a "type" and "value".  
Each profile with access to another object, can tag that object exactly once with any given "type" and "value" combination.    
Tags, alongside Groups, are the second structural entity that can be used to organize information in ABIS.  
They are used to link different objects together to e.g. form a message-thread. 
* **Location**  
Stands for a "place on earth". Can either be an address, geo-position or OSM node.  
Profiles, Groups and Entries can have a Location attached. Its also used on the Session.  
This should be used to prevent unwanted logins with fished credentials etc.

## Principles 
### Ownership 
Every object has an "owner" property that links to a profile. By default, the "owner" is equal to the "creator" but the ownership can be transferred later. 
   
The owner is the only one who is allowed to edit or delete the object. However, there are special cases for Entries and Groups:  
**Group:**  
* Members of a Group can add Entries to it.  
* Members of a Group can delete their own entries from a group.  
  
**Entry:**  
* Entries can be deleted by Group-owners.

Because Group-owners can delete Entries they don't own, it is encouraged to "draft" new Entries in a Profile-private Group and then only link them to the destination Group.  
This way, Users (at least theoretically) can stay in full control of their data.

###  Membership
Groups basically consist of Entries and Profiles that can access them. This access is granted with a Membership.  
Memberships don't have an owner and can be deleted by the "member" or the Group-owner (TODO: think about the consequences of an ownership-transfer).   
 
Memberships are formed when other members of a group invite someone to the Group. They are then the "creator" of that Membership. The first ACTIVE Membership in a Group, belongs always to the Group-owner.  
  
The membership can be granted conditionally, based on the preferences of the Group-owner.  
The owner can configure the group in a way that puts every new Membership to a PENDING state. Its then up to the Group-owner to change that status to ACTIVE.  
  
A special case of Membership is the PUBLIC Membership. It is granted automatically for public Groups. In that case, the Profile that becomes member, is the creator of the Membership (self-invite). 
The only ACTIVE Membership of a public Group ever will be the one of its owner. 

### EMPTY-Entries and Tags
A special case of an Entry is the EMPTY-Entry. It is used solely as metadata carrier and must not contain any content.  
The Entry's "type"-property must not be changed once the Entry was created. The metadata itself is made up from special Tags.  
  
This type is used to link other objects together and give them a structure. Examples are: Comments, Threads, etc.  

The Tags themselves are not subject of this document. However, there is an essential rule:  
* Link-Tags on EMPTY-Entries are always resolvable by everyone who can see the Entry if the link points to another Entry of type "DATA_*".
  
## Use cases
### Post to a public group
1) User logs in and chooses a Profile:  
   * Session with associated Profile is created
2) Profile finds a public group of interest and joins the Group:  
   * Membership with type PUBLIC is created by the Profile
3) Profile posts a message to the Group:  
   * A Message-Entry is created by a suitable app and stored to a PRIVATE group.  
   * Then an EMPTY-Entry with a Link-Tag that points to the message is created in the destination Group. 

TODO: Add more use cases.
