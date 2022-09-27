/**
 * Main namespace and subnamespace definitions
 * @namespace pl for "public library"
 */
var pl = {
  m: {},
  v: { books: {}, authors: {}, employees: {}, people: {} },
  c: { books: {}, authors: {}, employees: {}, people: {} },
};
pl.c.app = {
  initialize: function () {},
  generateTestData: function () {
    try {
      Book.instances["0553345842"] = new Book({
        isbn: "0553345842",
        title: "The Mind's I",
        year: 1982,
      });
      Book.instances["1463794762"] = new Book({
        isbn: "1463794762",
        title: "The Critique of Pure Reason",
        year: 2011,
      });
      Book.instances["0631232826"] = new Book({
        isbn: "0631232826",
        title: "Kant",
        year: 2001,
        category: BookCategoryEL.TEXTBOOK,
        subjectArea: "Philosophy",
      });
      Book.instances["0300029829"] = new Book({
        isbn: "0300029829",
        title: "Kant's Life and Thoughts",
        year: 1983,
        category: BookCategoryEL.BIOGRAPHY,
        about: "Immanuel Kant",
      });
      Book.saveAll();
      Employee.instances["1001"] = new Employee({
        personId: 1001,
        name: "Harry Wagner",
        empNo: 21035,
      });
      Employee.instances["1002"] = new Employee({
        personId: 1002,
        name: "Peter Boss",
        empNo: 23107,
        category: EmployeeCategoryEL.MANAGER,
        department: "Marketing",
      });
      Employee.saveAll();
      Author.instances["1001"] = new Author({
        personId: 1001,
        name: "Harry Wagner",
        biography: "Born in Boston, MA, in 1956, ...",
      });
      Author.instances["1077"] = new Author({
        personId: 1077,
        name: "Immanuel Kant",
        biography: "Immanuel Kant (1724-1804) was a German philosopher ...",
      });
      Author.saveAll();
      Person.instances["1003"] = new Person({
        personId: 1003,
        name: "Tom Daniels",
      });
      Person.saveAll();
    } catch (e) {
      console.log(e.constructor.name + ": " + e.message);
    }
  },
  clearData: function () {
    try {
      [Employee, Author, Person, Book].forEach((Class) => {
        Class.instances = {};
      });
      /*
      Employee.instances = {};
      Author.instances = {};
      Person.instances = {};
      Book.instances = {};
*/
      localStorage["employees"] =
        localStorage["authors"] =
        localStorage["people"] =
          "{}";
      localStorage["books"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log(e.constructor.name + ": " + e.message);
    }
  },
};
