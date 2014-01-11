NOT_LOGGED_IN = 0;
LOGGED_IN = 1;

angular.module('democracy-app', [])

.factory('ParseInitializer', function() {
  Parse.initialize("amtD1gwFz83IOqSdVF6I2oaxZeqRJRE57nyj3dKY", 
                   "24l3K1yDJpxkiYF4ZjUCtereM2jx9lET9LtKCvB4");
})

.factory('LoginService', function($rootScope, ParseInitializer) {
  var obj = {}
  obj.setLoginState = function(newState, message, messageClass) {
    obj.state = newState;
    obj.message = message;
    if (messageClass === undefined) {
      obj.messageClass = '';
    } else {
      obj.messageClass = messageClass;
    }
  };

  if (Parse.User.current()) {
    obj.state = LOGGED_IN;
  } else {
    obj.state = NOT_LOGGED_IN;
  }
  obj.message = '';
  obj.messageClass = '';

  return obj;
})

.controller('MainController', function($scope, LoginService) {
  $scope.loginService = LoginService;
})

.controller('LoginController', function($scope, LoginService) {
  if (Parse.User.current()) {
    $scope.mdLoginState = LOGGED_IN;
  } else {
    $scope.mdLoginState = NOT_LOGGED_IN;
  }
  $scope.login = function() {
    Parse.User.logIn($scope.username, $scope.password, {
      success: function(user) {
        LoginService.setLoginState(LOGGED_IN, "Inloggad.", "alert-success");
        $scope.$apply();
      },
      error: function(user, error) {
        LoginService.setLoginState(NOT_LOGGED_IN, "Inloggning misslyckades.", "alert-danger");
        $scope.$apply();
      }
    });
  };
  $scope.signUp = function() {
    Parse.User.signUp($scope.username, $scope.password, { ACL: new Parse.ACL() }, {
      success: function(user) {
        LoginService.setLoginState(LOGGED_IN, "Registrerad och inloggad.", "alert-success");
        $scope.$apply();
      },
      error: function(user, error) {
        LoginService.setLoginState(NOT_LOGGED_IN, "Registrering misslyckades.", "alert-danger");
        $scope.$apply();
      }
    })
  };
  $scope.logout = function() {
    Parse.User.logOut();
    LoginService.setLoginState(NOT_LOGGED_IN, "Du har nu blivit utloggad.", "alert-success");
  }
})

.controller('AddController', function($scope) {
  //var Tag = Parse.Object.extend("Tag");
  var query = new Parse.Query("Tag");
  query.find().then(function(tags) {
    $scope.tags = _.map(tags, function(tag) {
      return tag.get("name");
    });
    $scope.$apply();
  });
});

/*
Parse.$ = jQuery;

// Initialize Parse with your Parse application javascript keys
Parse.initialize("p7Nu6RZkIlnGUfofyOvms99yDnehPjzHg18OuFra", 
                 "A4aLf9YRKErwAeX444zdMTXHE1dUj5AAvBfHDTeL");

// This is the transient application state, not persisted on Parse
var AppState = Parse.Object.extend("AppState", {
  defaults: {
  }
});

var LogInView = Parse.View.extend({
  events: {
    "submit form.login-form": "logIn",
    "submit form.signup-form": "signUp"
  },

  el: ".content",
  
  initialize: function() {
    _.bindAll(this, "logIn", "signUp");
    this.render();
  },

  logIn: function(e) {
    var self = this;
    var username = this.$("#login-username").val();
    var password = this.$("#login-password").val();
    
    Parse.User.logIn(username, password, {
      success: function(user) {
        new ManageTodosView();
        self.undelegateEvents();
        delete self;
      },

      error: function(user, error) {
        self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
        this.$(".login-form button").removeAttr("disabled");
      }
    });

    this.$(".login-form button").attr("disabled", "disabled");

    return false;
  },

  signUp: function(e) {
    var self = this;
    var username = this.$("#signup-username").val();
    var password = this.$("#signup-password").val();
    
    Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
      success: function(user) {
        new ManageTodosView();
        self.undelegateEvents();
        delete self;
      },

      error: function(user, error) {
        self.$(".signup-form .error").html(error.message).show();
        this.$(".signup-form button").removeAttr("disabled");
      }
    });

    this.$(".signup-form button").attr("disabled", "disabled");

    return false;
  },

  render: function() {
    this.$el.html(_.template($("#login-template").html()));
    this.delegateEvents();
  }
});


// The main view that lets a user manage their todo items
var ManageTodosView = Parse.View.extend({
  el: ".content",

  // At initialization we bind to the relevant events on the `Todos`
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting todos that might be saved to Parse.
  initialize: function() {
    this.render();
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    this.$el.html(_.template($("#manage-todos-template").html()));
    this.delegateEvents();
  },
});


// The main view for the app
var AppView = Parse.View.extend({
  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: $("#demokratiapp"),

  initialize: function() {
    this.render();
  },

  render: function() {
    if (Parse.User.current()) {
      new ManageTodosView();
    } else {
      new LogInView();
    }
  }
});

var AppRouter = Parse.Router.extend({
/*  routes: {
    "all": "all",
    "active": "active",
    "completed": "completed"
  },

  initialize: function(options) {
  },

  all: function() {
    state.set({ filter: "all" });
  },

  active: function() {
    state.set({ filter: "active" });
  },

  completed: function() {
    state.set({ filter: "completed" });
  }*./
});

var state = new AppState;

new AppRouter;
new AppView;
//Parse.history.start();
*/