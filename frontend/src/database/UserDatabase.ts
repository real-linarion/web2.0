import PouchDB from 'pouchdb-browser';
import find from 'pouchdb-find';
import { UserDBTypeMapper } from './UserDBTypeMapper';
import { DbEntryMethaData } from './types/internal/DbEntryMethaData';
import { FindResults } from './types/internal/FindResults';
import { UserDataDB } from './types/internal/UserDataDB';
import { FriendDB } from './types/internal/FriendDB';
import { UserData } from './types/public/UserData';
import { Friend } from './types/public/Friend';

PouchDB.plugin(find);

/**
 * Wrapper Class for the UserDb
 *
 * @class
 */
export class UserDatabase {
  private db: PouchDB.Database<{}>;

  constructor() {
    this.db = new PouchDB('Web20DB_USER_DB');
  }

  /**
   * Saves the given userData in the database
   *
   * @param userData Userdata to be saved in the database
   * @returns {Promise<DbEntryMethaData>} Promise with the status of the database action
   */
  saveNewUserData(userData: UserData): Promise<DbEntryMethaData> {
    const userDataDB: UserDataDB = {
      type: 'userData',
      userID: userData.userID,
      userName: userData.userName,
      lastOnline: userData.lastOnline,
      publicKey: userData.publicKey,
      privateKey: userData.privateKey,
    };

    return this.db.post(userDataDB);
  }

  /**
   * Updates all properties the userdata in the database with the properties
   * of the given userData object
   *
   * @param userData Userdata to be updated in the database
   * @returns
   */
  updateUserData(userData: UserData): Promise<DbEntryMethaData> {
    return this.db.get<UserDataDB>(userData._id!).then((userDataDB: UserDataDB) => {
      userDataDB.userID = userData.userID;
      userDataDB.lastOnline = userData.lastOnline;
      userDataDB.privateKey = userData.privateKey;
      userDataDB.publicKey = userData.publicKey;
      userDataDB.userName = userData.userName;

      return this.db.put(userDataDB);
    });
  }

  /**
   * Returns the stored userData from the database.
   * If no userData were stored null is returned instead
   *
   * @returns {Promise<DbEntryMethaData | null}
   */
  getUserData(): Promise<UserData | null> {
    return this.db
      .find({ selector: { type: 'userData' } })
      .then(function onSuccess(findResult: FindResults) {
        if (findResult.docs.length == 0) {
          return null;
        } else {
          return UserDBTypeMapper.mapToUserData(findResult.docs[0]);
        }
      });
  }

  /**
   * Deletes the userdata with the given databaseId
   *
   * @param id DatabaseId of the userData to be deleted
   * @returns {Promise<DbEntryMethaData>} Promise with the result of the database action
   */
  deleteUserData(id: string): Promise<DbEntryMethaData> {
    return this.db.get<UserDataDB>(id).then((userDataDB: UserDataDB) => {
      return this.db.remove({ _id: userDataDB._id!, _rev: userDataDB._rev! });
    });
  }

  /**
   * Stores the given friend object in the Database.
   *
   * @param friend Friend object to be stored in the database
   * @returns {Promise<DbEntryMethaData>} Promise with the result of the database action
   */
  addFriend(friend: Friend): Promise<DbEntryMethaData> {
    const friendDB: FriendDB = {
      type: 'friend',
      userId: friend.userId,
      userName: friend.userName,
      lastOnline: friend.lastOnline,
    };

    return this.db.post(friendDB);
  }

  /**
   * Updates all properties the friend object in the database with the properties
   * of the given friend object
   *
   * @param friend Friend object to be updated
   * @returns {Promise<DbEntryMethaData>} Promise with the result of the database action
   */
  updateFriend(friend: Friend): Promise<DbEntryMethaData> {
    return this.db.get<FriendDB>(friend._id!).then((friendDB: FriendDB) => {
      friendDB.lastOnline = friend.lastOnline;
      friendDB.userId = friend.userId;
      friendDB.userName = friend.userName;

      return this.db.put(friendDB);
    });
  }

  /**
   * Returns the Friend Object with the given Id
   *
   * @param _id Id in the database NOT the userID
   * @returns {Promise<Friend>} Promise with either the friend object or an error object
   */
  getFriend(_id: string): Promise<Friend> {
    return this.db.get<FriendDB>(_id).then(function onSuccess(friendDB: FriendDB) {
      return UserDBTypeMapper.mapToFriend(friendDB);
    });
  }

  /**
   * Returns a list of all friends in the database
   * Returns null if no friends are in the database.
   *
   * @returns {Promise<Array<Friend> | null>}
   */
  getAllFriends(): Promise<Array<Friend> | null> {
    return this.db
      .find({ selector: { type: 'friend' } })
      .then(function onSuccess(findResults: FindResults) {
        if (findResults.docs.length == 0) {
          return null;
        } else {
          return UserDBTypeMapper.mapFriendsDBToFriends(findResults.docs);
        }
      });
  }

  /**
   * Deletes the friend with the given Id.
   *
   * @param id DatabaseId of the friend to be deleted
   * @returns {Promise<Friend>} Promise with either the friend object or an error object
   */
  deleteFriend(id: string): Promise<DbEntryMethaData> {
    return this.db.get<FriendDB>(id).then((friendDB: FriendDB) => {
      return this.db.remove({ _id: friendDB._id!, _rev: friendDB._rev! });
    });
  }

  /**
   * Deletes the whole database
   *
   * @returns {Promise<void>} Promise with the result of the database deletion
   */
  deleteDB(): Promise<void> {
    return this.db.destroy();
  }
}
