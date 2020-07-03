'use strict'
const User = require('./model/user');

class SampleUser {
  constructor() {
    this.users = [
      {
        userName: 'テスト1号',
        email: 'test@test1',
        password: 'test',
        address: 'ADDRESS',
        privateKey: 'PRIVATEKEY'
      },
      {
        userName: 'テスト2号',
        email: 'test@test2',
        password: 'test',
        address: 'ADDRESS',
        privateKey: 'PRIVATEKEY'
      },
      {
        userName: 'テスト3号',
        email: 'test@test3',
        password: 'test',
        address: 'ADDRESS',
        privateKey: 'PRIVATEKEY'
      }
    ]
  }

  async initDb() {
    await this.cleanDb();
    this.pushUsertoDb();
  }

  async cleanDb() {
    await User.deleteMany({});
  }

  pushUsertoDb() {
    this.users.forEach((user) => {
      const newUser = new User(user);
      newUser.save();
    })
  }
}

module.exports = SampleUser;