import { UserDataDB } from './types/internal/UserDataDB';
import { FriendDB } from './types/internal/FriendDB';
import { UserData } from './types/public/UserData';
import { Friend } from './types/public/Friend';

export class UserDBTypeMapper {
  static mapToUserData(userDataDB: UserDataDB): UserData {
    return {
      _id: userDataDB._id,
      userID: userDataDB.userID,
      userName: userDataDB.userName,
      lastOnline: userDataDB.lastOnline,
      privateKey: userDataDB.privateKey,
      publicKey: userDataDB.publicKey,
    };
  }

  static mapToFriend(friendDB: FriendDB): Friend {
    return {
      _id: friendDB._id,
      userId: friendDB.userId,
      userName: friendDB.userName,
      lastOnline: friendDB.lastOnline,
    };
  }
}