var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
	, LDAPStrategy =   require('passport-ldapauth').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles;

var users = [
    {
        id:         1,
        username:   "user",
        password:   "123",
        role:   userRoles.user
    },
    {
        id:         2,
        username:   "admin",
        password:   "123",
        role:   userRoles.admin
    }
];

module.exports = {
    addUser: function(username, password, role, callback) {
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

        // Clean up when 500 users reached
        if(users.length > 500) {
            users = users.slice(0, 2);
        }

        var user = {
            id:         _.max(users, function(user) { return user.id; }).id + 1,
            username:   username,
            password:   password,
            role:       role
        };
        users.push(user);
        callback(null, user);
    },

    findOrCreateOauthUser: function(provider, providerId) {
        var user = module.exports.findByProviderId(provider, providerId);
        if(!user) {
            user = {
                id: _.max(users, function(user) { return user.id; }).id + 1,
                username: provider + '_user',
                role: userRoles.user,
                provider: provider
            };
            user[provider] = providerId;
            users.push(user);
        }

        return user;
    },

    findAll: function() {
        return _.map(users, function(user) { return _.clone(user); });
    },
    findByUniversalId: function(universalId) {
		console.log(universalId);
        return _.clone(_.find(users, function(user) { return user.universalId === universalId }));
    },

    findByUid: function(uid) {
        return _.clone(_.find(users, function(user) { return user.uid === uid; }));
    },
    findOrCreateLdapUser: function(userblob) {
        var user = module.exports.findByUniversalId(userblob.universalId);
        if(!user) {
            user = {
                id: _.max(users, function(user) { return user.id; }).id + 1,
				username: userblob.uid,
				fullname: userblob.cn,
				mail: userblob.mail,
				accessLevel: userblob.accessLevel,
				role:   userRoles.admin,
				universalId: userblob.universalId
            };
            users.push(user);
        }

        return user;
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    findByProviderId: function(provider, id) {
        return _.find(users, function(user) { return user[provider] === id; });
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    ldapStrategy : function() {
        return new LDAPStrategy({
            // CONFIGURE A LDAP SERVER TO GET THIS TO WORK
			server: {
				/*url: 'ldaps://192.168.2.16:389/O=cco.servername.com',
				adminDn: 'ou=ccoentities,o=cco.servername.com',
				adminPassword: '',
				searchBase: 'ou=ccoentities,o=cco.servername.com',
				searchFilter: '(&(accessLevel=4)(uid={{username}}))'*/				
				
				url: 'ldap://localhost:10389/o=mycompany',
				adminDn: 'ou=production, o=mycompany',
				adminPassword: '',
				searchBase: 'ou=production,o=mycompany',
				searchFilter: '(objectclass=*)'
            }
          },
		  function(user, done) {
            var user = module.exports.findOrCreateLdapUser(user);
			return done(null, user);
		  }
        );
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {

            var user = module.exports.findByUsername(username);

            if(!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else if(user.password != password) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else {
                return done(null, user);
            }

        }
    ),
    serializeUser: function(user, done) {
        done(null, user.id);
    },

    deserializeUser: function(id, done) {
        var user = module.exports.findById(id);

        if(user)    { done(null, user); }
        else        { done(null, false); }
    }
};
