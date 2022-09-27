/**
 * Enumeration type
 * @global
 */
BookCategoryEL = new Enumeration(["Textbook", "Biography"]);
/**
 * Constructor function for the class Book
 * including the incomplete disjoint segmentation {TextBook, Biography}
 * @class
 */
class Book {
  // using a single record parameter with ES6 function parameter destructuring
  constructor({ isbn, title, year, category, subjectArea, about }) {
    this.isbn = isbn;
    this.title = title;
    this.year = year;
    // optional properties
    if (category) this.category = category;
    if (subjectArea) this.subjectArea = subjectArea;
    if (about) this.about = about;
  }
  get isbn() {
    return this._isbn;
  }
  static checkIsbn(isbn) {
    if (isbn === undefined || isbn === "") return new NoConstraintViolation();
    else if (typeof isbn !== "string" || isbn.trim() === "") {
      return new RangeConstraintViolation(
        "The ISBN must be a non-empty string!"
      );
    } else if (!/\b\d{9}(\d|X)\b/.test(isbn)) {
      return new PatternConstraintViolation(
        "The ISBN must be " +
          "a 10-digit string or a 9-digit string followed by 'X'!"
      );
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkIsbnAsId(isbn) {
    var validationResult = Book.checkIsbn(isbn);
    if (validationResult instanceof NoConstraintViolation) {
      if (isbn === undefined) {
        validationResult = new MandatoryValueConstraintViolation(
          "A value for the ISBN must be provided!"
        );
      } else if (isbn in Book.instances) {
        validationResult = new UniquenessConstraintViolation(
          "There is already a book record with this ISBN!"
        );
      } else {
        validationResult = new NoConstraintViolation();
      }
    }
    return validationResult;
  }
  set isbn(isbn) {
    var validationResult = Book.checkIsbnAsId(isbn);
    if (validationResult instanceof NoConstraintViolation) {
      this._isbn = isbn;
    } else {
      throw validationResult;
    }
  }
  get title() {
    return this._title;
  }
  /*SIMPLIFIED CODE: no validation */
  set title(t) {
    this._title = t;
  }
  get year() {
    return this._year;
  }
  /*SIMPLIFIED CODE: no validation */
  set year(v) {
    this._year = v;
  }
  get category() {
    return this._category;
  }
  static checkCategory(c) {
    if (c === undefined || c === "") {
      return new NoConstraintViolation(); // category is optional
    } else if (
      !util.isIntegerOrIntegerString(c) ||
      parseInt(c) < 1 ||
      parseInt(c) > BookCategoryEL.MAX
    ) {
      return new RangeConstraintViolation("Invalid value for category: " + c);
    } else {
      return new NoConstraintViolation();
    }
  }
  set category(c) {
    var validationResult = null;
    if (this.category) {
      // already set/assigned
      validationResult = new FrozenValueConstraintViolation(
        "The category cannot be changed!"
      );
    } else {
      validationResult = Book.checkCategory(c);
    }
    if (validationResult instanceof NoConstraintViolation) {
      this._category = parseInt(c);
    } else {
      throw validationResult;
    }
  }
  get subjectArea() {
    return this._subjectArea;
  }
  static checkSubjectArea(sA, cat) {
    cat = parseInt(cat);
    if (cat === BookCategoryEL.TEXTBOOK && !sA) {
      return new MandatoryValueConstraintViolation(
        "A subject area must be provided for a textbook!"
      );
    } else if (cat !== BookCategoryEL.TEXTBOOK && sA) {
      return new ConstraintViolation(
        "A subject area must not " +
          "be provided if the book is not a textbook!"
      );
    } else if (sA && (typeof sA !== "string" || sA.trim() === "")) {
      return new RangeConstraintViolation(
        "The subject area must be a non-empty string!"
      );
    } else {
      return new NoConstraintViolation();
    }
  }
  set subjectArea(v) {
    var validationResult = Book.checkSubjectArea(v, this.category);
    if (validationResult instanceof NoConstraintViolation) {
      this._subjectArea = v;
    } else {
      throw validationResult;
    }
  }
  get about() {
    return this._about;
  }
  static checkAbout(a, cat) {
    cat = parseInt(cat);
    if (cat === undefined) cat = BookCategoryEL.BIOGRAPHY;
    if (cat === BookCategoryEL.BIOGRAPHY && !a) {
      return new MandatoryValueConstraintViolation(
        "A biography book record must have an 'about' field!"
      );
    } else if (cat !== BookCategoryEL.BIOGRAPHY && a) {
      return new ConstraintViolation(
        "An 'about' field value must not " +
          "be provided if the book is not a biography!"
      );
    } else if (a && (typeof a !== "string" || a.trim() === "")) {
      return new RangeConstraintViolation(
        "The 'about' field value must be a non-empty string!"
      );
    } else {
      return new NoConstraintViolation();
    }
  }
  set about(v) {
    var validationResult = Book.checkAbout(v, this.category);
    if (validationResult instanceof NoConstraintViolation) {
      this._about = v;
    } else {
      throw validationResult;
    }
  }
  /*********************************************************
   ***  Other Instance-Level Methods  ***********************
   **********************************************************/
  toString() {
    var bookStr =
      `Book{ ISBN: ${this.isbn}, title: ${this.title},` + `year: ${this.year}`;
    switch (this.category) {
      case BookCategoryEL.TEXTBOOK:
        bookStr += `, textbook subject area: ${this.subjectArea}`;
        break;
      case BookCategoryEL.BIOGRAPHY:
        bookStr += `, biography about: ${this.about}`;
        break;
    }
    return bookStr + "}";
  }
  /* Convert object to row/record */
  toRecord() {
    var rec = {};
    for (let p of Object.keys(this)) {
      // remove underscore prefix
      if (p.charAt(0) === "_") rec[p.substr(1)] = this[p];
    }
    return rec;
  }
}
// ***********************************************
// *** Class-level ("static") properties *********
// ***********************************************
Book.instances = {};

// *****************************************************
// *** Class-level ("static") methods ***
// *****************************************************
/**
 * Create a new Book record
 * @method
 * @static
 * @param {{isbn: string, title: string, year: number, category: ?number, subjectArea: ?string, about: ?string}} slots - A record of parameters.
 */
Book.add = function (slots) {
  var book = null;
  try {
    book = new Book(slots);
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    book = null;
  }
  if (book) {
    Book.instances[book.isbn] = book;
    console.log(book.toString() + " created!");
  }
};
/**
 * Update an existing Book record
 * where the slots argument contains the slots to be updated and performing
 * the updates with setters makes sure that the new values are validated
 * @method
 * @static
 * @param {{isbn: string, title: string, year: number, category: ?number, subjectArea: ?string, about: ?string}} slots - A record of parameters.
 */
Book.update = function ({ isbn, title, year, category, subjectArea, about }) {
  const book = Book.instances[isbn],
    objectBeforeUpdate = util.cloneObject(book);
  var noConstraintViolated = true,
    updatedProperties = [];
  try {
    if (title !== undefined && book.title !== title) {
      book.title = title;
      updatedProperties.push("title");
    }
    if (year !== undefined && book.year !== year) {
      book.year = year;
      updatedProperties.push("year");
    }
    if (category && book.category !== category) {
      book.category = category;
      updatedProperties.push("category");
    } else if (category === "" && "category" in book) {
      // since the book category represents a subkind, it cannot be unset
      throw FrozenValueConstraintViolation(
        "The book category cannot be unset!"
      );
    }
    if (subjectArea !== undefined && book.subjectArea !== subjectArea) {
      book.subjectArea = subjectArea;
      updatedProperties.push("subjectArea");
    }
    if (about !== undefined && book.about !== about) {
      book.about = about;
      updatedProperties.push("about");
    }
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    noConstraintViolated = false;
    // restore object to its previous state (before updating)
    Book.instances[isbn] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      let ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log(
        `Propert${ending} ${updatedProperties.toString()} modified for book ${isbn}`
      );
    } else {
      console.log(
        "No property value changed for book " + book.toString() + " !"
      );
    }
  }
};
/**
 * Delete an existing Book record
 * @method
 * @static
 * @param {string} isbn - The ISBN of a book.
 */
Book.destroy = function (isbn) {
  if (Book.instances[isbn]) {
    console.log(Book.instances[isbn].toString() + " deleted!");
    delete Book.instances[isbn];
  } else {
    console.log("There is no book with ISBN " + isbn + " in the database!");
  }
};
/**
 * Load all book table records and convert them to objects
 * Precondition: publishers and people must be loaded first
 * @method
 * @static
 */
Book.retrieveAll = function () {
  var bookKey = "",
    bookKeys = [],
    books = {},
    book = null,
    i = 0;
  try {
    if (!localStorage["books"]) {
      localStorage.setItem("books", "{}");
    } else {
      books = JSON.parse(localStorage["books"]);
      console.log(Object.keys(books).length + " books loaded.");
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  bookKeys = Object.keys(books);
  for (let i = 0; i < bookKeys.length; i++) {
    bookKey = bookKeys[i]; // ISBN
    book = Book.convertRec2Obj(books[bookKey]);
    Book.instances[bookKey] = book;
  }
};
/**
 * Convert book record to book object
 * @method
 * @static
 * @param {{isbn: string, title: string, year: number, category: ?number, subjectArea: ?string, about: ?string}} slots - A record of parameters.
 * @returns {object}
 */
Book.convertRec2Obj = function (bookRow) {
  var book = null;
  try {
    book = new Book(bookRow);
  } catch (e) {
    console.log(
      e.constructor.name + " while deserializing a book record: " + e.message
    );
  }
  return book;
};
/**
 * Save all Book objects as records
 * @method
 * @static
 */
Book.saveAll = function () {
  var key = "",
    books = {},
    book = null,
    i = 0;
  var keys = Object.keys(Book.instances);
  // convert the map of book objects (Book.instances)
  // to the map of corresponding records (books)
  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    book = Book.instances[key];
    books[key] = book.toRecord();
  }
  try {
    localStorage["books"] = JSON.stringify(books);
    console.log(keys.length + " books saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
