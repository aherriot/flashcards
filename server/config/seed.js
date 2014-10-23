/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Word = require('../api/word/word.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

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
      {user_id: test_user._id, english: 'mint', persian: 'نعناع', phonetic: 'nanaa', tags: ['noun','food','herb']},
      {user_id: test_user._id, english: 'apple', persian: 'سیب', phonetic: 'sib', tags: ['noun','food','fruit']},
      {user_id: test_user._id, english: 'pear', persian: 'گلابی', phonetic: 'golaabi', tags: ['noun','food','fruit']},
      {user_id: test_user._id, english: 'ice', persian: 'یخ', phonetic: 'yakh', tags: ['noun','food']},
      {user_id: test_user._id, english: 'juice', persian: 'آبمیوه', phonetic: 'aabmive', tags: ['noun','food','drink']},
      {user_id: test_user._id, english: 'beer', persian: 'آبجو', phonetic: 'aabjo', tags: ['noun','food','drink']},
      {user_id: test_user._id, english: 'wine', persian: 'شراب', phonetic: 'sharaab', tags: ['noun','food','drink']},
      {user_id: test_user._id, english: 'milk', persian: 'شیر', phonetic: 'shir', tags: ['noun','food','drink']}
    );
  });
}
