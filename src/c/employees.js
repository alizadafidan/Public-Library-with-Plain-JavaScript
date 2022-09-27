pl.c.employees.manage = {
  initialize: function () {
    Person.retrieveAll();
    pl.v.employees.manage.setupUserInterface();
  },
};
