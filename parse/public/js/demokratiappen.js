angular.module('democracy-app', [])

.controller('MainController', function() {
  
})

.controller('LoginController', function($scope) {
  $scope.login = function() {
    alert("You were logged in");
  };
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