/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Word = require('../api/word/word.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function(test) {
      console.log('finished populating users');

      User.findOne({email: 'test@test.com'}, function(err, test_user) {
        if(test_user)
          createWords(test_user);
      });
    }
  );

});

function createWords(test_user) {
  Word.find({}).remove(function() {
    Word.create(
      {userID: test_user._id, english: 'mint', persian: 'نعناع', phonetic: 'nanaa', tags: ['noun','food','herb']},
      {userID: test_user._id, english: 'apple', persian: 'سیب', phonetic: 'sib', tags: ['noun','food','fruit']},
      {userID: test_user._id, english: 'pear', persian: 'گلابی', phonetic: 'golaabi', tags: ['noun','food','fruit']},
      {userID: test_user._id, english: 'ice', persian: 'یخ', phonetic: 'yakh', tags: ['noun','food']},
      {userID: test_user._id, english: 'juice', persian: 'آبمیوه', phonetic: 'aabmive', tags: ['noun','food','drink']},
      {userID: test_user._id, english: 'beer', persian: 'آبجو', phonetic: 'aabjo', tags: ['noun','food','drink']},
      {userID: test_user._id, english: 'wine', persian: 'شراب', phonetic: 'sharaab', tags: ['noun','food','drink']},
      {userID: test_user._id, english: 'milk', persian: 'شیر', phonetic: 'shir', tags: ['noun','food','drink']},
      {userID: test_user._id, english: 'This cat is looking at the fish', persian: 'این گربه دارد به ماهی نگاه میکند', phonetic: 'in gorbe daarad be maahi negaah mikonad', tags: ['phrase']},
      {userID: test_user._id, english: 'I do not like slimy food', persian: 'من غذای لیز دوست ندارم', phonetic: 'man ghazaaye liz doost nadaram', tags: ['phrase']},
      {userID: test_user._id, english: 'This family is eating breakfast inside the home', persian: 'این خانواده دارند داخل خانه صبحانه می خورند', phonetic: 'in khaanevaade daarand daakhel khaane sobhaane mikhorand', tags: ['phrase']}
    );
  });
}
