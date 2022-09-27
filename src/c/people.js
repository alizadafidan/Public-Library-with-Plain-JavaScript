pl.c.people.manage = {
  initialize: function () {
    Person.retrieveAll();
    pl.v.people.manage.setupUserInterface();
  },
};
