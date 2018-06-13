var mongoose = require('./models/db').db();
var xseed = require('./models/xseed');

var bug = require('./test/bug');
bug.test(xseed);

var user1 = require('./test/user1');
user1.test(xseed);

var user2 = require('./test/user2');
user2.test(xseed);