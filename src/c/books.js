pl.c.books.manage = {
  initialize: function () {
    Book.retrieveAll();
    pl.v.books.manage.setupUserInterface();
  },
};
