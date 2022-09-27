pl.c.authors.manage = {
  initialize: function () {
    Person.retrieveAll();
    pl.v.authors.manage.setupUserInterface();
  },
};
