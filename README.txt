=> There are 2 folders models and test.
====> models folder contains db.js and xseed.js
====> test folder contains bug.js and user1.js and user2.js

=> index.js file connects everything

=> models/db.js file connects mongodb using mongoose
=> models/xseed.js file read type strings and generate mongoose models
=> Only String, Int, Date, Boolean, ObjectId, Array and Embedded types are used in model generation

=> test/bug.js, test/user1.js, test/user2.js are test cases.

=> mongoose version 5.1.4
=> node version v8.9.4
=> npm version 5.6.0
=> mongodb server version 3.6
