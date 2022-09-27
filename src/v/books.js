
/**
 * event handler for book category selection events
 * used both in create and update
 */
pl.v.books.handleCategorySelectChangeEvent = function (e) {
  var formEl = e.currentTarget.form,
    categoryIndexStr = formEl.category.value; // the array index of BookCategoryEL.labels
  if (categoryIndexStr) {
    pl.v.app.displaySegmentFields(
      formEl,
      BookCategoryEL.labels,
      parseInt(categoryIndexStr) + 1
    );
  } else {
    pl.v.app.undisplayAllSegmentFields(formEl, BookCategoryEL.labels);
  }
};

pl.v.books.manage = {
  /**
   * Set up the book data management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", pl.v.books.manage.exit);
    pl.v.books.manage.refreshUI();
  },
  /**
   * exit the Manage Books UI page
   */
  exit: function () {
    Book.saveAll();
  },
  /**
   * refresh the Manage Books UI
   */
  refreshUI: function () {
    // show the manage book UI and hide the other UIs
    document.getElementById("Book-M").style.display = "block";
    document.getElementById("Book-R").style.display = "none";
    document.getElementById("Book-C").style.display = "none";
    document.getElementById("Book-U").style.display = "none";
    document.getElementById("Book-D").style.display = "none";
  },
};
/**********************************************
 * Use case List Books
 **********************************************/
pl.v.books.retrieveAndListAll = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("section#Book-R>table>tbody");
    var i = 0,
      row = null,
      book = null,
      keys = Object.keys(Book.instances);
    tableBodyEl.innerHTML = ""; // drop old contents
    for (let i = 0; i < keys.length; i++) {
      book = Book.instances[keys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = book.isbn;
      row.insertCell(-1).textContent = book.title;
      row.insertCell(-1).textContent = book.year;
      if (book.category) {
        switch (book.category) {
          case BookCategoryEL.TEXTBOOK:
            row.insertCell(-1).textContent = book.subjectArea + " textbook";
            break;
          case BookCategoryEL.BIOGRAPHY:
            row.insertCell(-1).textContent = "Biography about " + book.about;
            break;
        }
      }
    }
    document.getElementById("Book-M").style.display = "none";
    document.getElementById("Book-R").style.display = "block";
  },
};
/**********************************************
 * Use case Create Book
 **********************************************/
pl.v.books.create = {
  setupUserInterface: function () {
    var formEl = document.querySelector("section#Book-C>form"),
      categorySelectEl = formEl.category,
      submitButton = formEl.commit;
    pl.v.app.undisplayAllSegmentFields(formEl, BookCategoryEL.labels);
    // responsive validation of form fields
    formEl.isbn.addEventListener("input", function () {
      formEl.isbn.setCustomValidity(
        Book.checkIsbnAsId(formEl.isbn.value).message
      );
    });
    /* Incomplete code: no responsive validation of "title" and "year" */
    // responsive validation of form fields for segment properties
    formEl.subjectArea.addEventListener("input", function () {
      formEl.subjectArea.setCustomValidity(
        Book.checkSubjectArea(
          formEl.subjectArea.value,
          parseInt(formEl.category.value) + 1
        ).message
      );
    });
    formEl.about.addEventListener("input", function () {
      formEl.about.setCustomValidity(
        Book.checkAbout(formEl.about.value, parseInt(formEl.category.value) + 1)
          .message
      );
    });
    // set up the book category selection list
    util.fillSelectWithOptions(categorySelectEl, BookCategoryEL.labels);
    categorySelectEl.addEventListener(
      "change",
      pl.v.books.handleCategorySelectChangeEvent
    );
    // define event handler for submitButton click events
    submitButton.addEventListener("click", this.handleSubmitButtonClickEvent);
    // define event handler for neutralizing the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    // replace the manageBooks form with the createBook form
    document.getElementById("Book-M").style.display = "none";
    document.getElementById("Book-C").style.display = "block";
    formEl.reset();
  },
  handleSubmitButtonClickEvent: function () {
    var formEl = document.querySelector("section#Book-C>form"),
      categoryStr = formEl.category.value;
    var slots = {
      isbn: formEl.isbn.value,
      title: formEl.title.value,
      year: formEl.year.value,
    };
    if (categoryStr) {
      slots.category = parseInt(categoryStr) + 1;
      switch (slots.category) {
        case BookCategoryEL.TEXTBOOK:
          slots.subjectArea = formEl.subjectArea.value;
          formEl.subjectArea.setCustomValidity(
            Book.checkSubjectArea(formEl.subjectArea.value, slots.category)
              .message
          );
          break;
        case BookCategoryEL.BIOGRAPHY:
          slots.about = formEl.about.value;
          formEl.about.setCustomValidity(
            Book.checkAbout(formEl.about.value, slots.category).message
          );
          break;
      }
    }
    // check all input fields and provide error messages
    // in case of constraint violations
    formEl.isbn.setCustomValidity(Book.checkIsbnAsId(slots.isbn).message);
    /* Incomplete code: no on-submit validation of "title" and "year" */
    // save the input data only if all of the form fields are valid
    if (formEl.checkValidity()) {
      Book.add(slots);
      // un-render all segment/category-specific fields
      pl.v.app.undisplayAllSegmentFields(formEl, BookCategoryEL.labels);
    }
  },
};
/**********************************************
 * Use case Update Book
 **********************************************/
pl.v.books.update = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Book-U > form"),
      selectBookEl = formEl.selectBook,
      selectCategoryEl = formEl.category,
      saveButton = formEl.commit;
    pl.v.app.undisplayAllSegmentFields(formEl, BookCategoryEL.labels);
    // set up the book selection list
    util.fillSelectWithOptions(selectBookEl, Book.instances, "isbn", {
      displayProp: "title",
    });
    selectBookEl.addEventListener("change", this.handleBookSelectChangeEvent);
    /* Incomplete code: no responsive validation of "title" and "year" */
    // responsive validation of form fields for segment properties
    formEl.subjectArea.addEventListener("input", function () {
      formEl.subjectArea.setCustomValidity(
        Book.checkSubjectArea(
          formEl.subjectArea.value,
          parseInt(formEl.category.value) + 1
        ).message
      );
    });
    formEl.about.addEventListener("input", function () {
      formEl.about.setCustomValidity(
        Book.checkAbout(formEl.about.value, parseInt(formEl.category.value) + 1)
          .message
      );
    });
    // set up the book category selection list
    util.fillSelectWithOptions(selectCategoryEl, BookCategoryEL.labels);
    selectCategoryEl.addEventListener(
      "change",
      pl.v.books.handleCategorySelectChangeEvent
    );
    // define event handler for submitButton click events
    saveButton.addEventListener("click", this.handleSubmitButtonClickEvent);
    // define event handler for neutralizing the submit event and reseting the form
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Book-M").style.display = "none";
    document.getElementById("Book-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle book selection events
   * when a book is selected, populate the form with the data of the selected book
   */
  handleBookSelectChangeEvent: function () {
    const formEl = document.querySelector("section#Book-U > form");
    var key = formEl.selectBook.value,
      book = null;
    if (key !== "") {
      book = Book.instances[key];
      formEl.isbn.value = book.isbn;
      formEl.title.value = book.title;
      formEl.year.value = book.year;
      if (book.category) {
        formEl.category.selectedIndex = book.category;
        formEl.category.disabled = "disabled";
        pl.v.app.displaySegmentFields(
          formEl,
          BookCategoryEL.labels,
          book.category
        );
        switch (book.category) {
          case BookCategoryEL.TEXTBOOK:
            formEl.subjectArea.value = book.subjectArea;
            formEl.about.value = "";
            break;
          case BookCategoryEL.BIOGRAPHY:
            formEl.about.value = book.about;
            formEl.subjectArea.value = "";
            break;
        }
      } else {
        // no book.category
        formEl.category.value = "";
        formEl.category.disabled = "";
        formEl.subjectArea.value = "";
        formEl.about.value = "";
        pl.v.app.undisplayAllSegmentFields(formEl, BookCategoryEL.labels);
      }
    } else {
      formEl.reset();
    }
  },
  /**
   * handle form submission events
   */
  handleSubmitButtonClickEvent: function () {
    const formEl = document.querySelector("section#Book-U > form"),
      categoryStr = formEl.category.value;
    var slots = {
      isbn: formEl.isbn.value,
      title: formEl.title.value,
      year: formEl.year.value,
    };
    if (categoryStr) {
      slots.category = parseInt(categoryStr) + 1;
      switch (slots.category) {
        case BookCategoryEL.TEXTBOOK:
          slots.subjectArea = formEl.subjectArea.value;
          formEl.subjectArea.setCustomValidity(
            Book.checkSubjectArea(slots.subjectArea, slots.category).message
          );
          break;
        case BookCategoryEL.BIOGRAPHY:
          slots.about = formEl.about.value;
          formEl.about.setCustomValidity(
            Book.checkAbout(slots.about, slots.category).message
          );
          break;
      }
    }
    // check all input fields and provide error messages in case of constraint violations
    formEl.isbn.setCustomValidity(Book.checkIsbn(slots.isbn).message);
    /* Incomplete code: no on-submit validation of "title" and "year" */
    // commit the update only if all of the form fields values are valid
    if (formEl.checkValidity()) {
      Book.update(slots);
      pl.v.app.undisplayAllSegmentFields(formEl, BookCategoryEL.labels);
    }
  },
};
/**********************************************
 * Use case Delete Book
 **********************************************/
pl.v.books.destroy = {
  /**
   * initialize the books.destroy form
   */
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Book-D > form"),
      selectBookEl = formEl.selectBook,
      deleteButton = formEl.commit;
    // set up the book selection list
    util.fillSelectWithOptions(selectBookEl, Book.instances, "isbn", {
      displayProp: "title",
    });
    deleteButton.addEventListener("click", function () {
      if (formEl.selectBook.value) {
        if (confirm("Do you really want to delete this book?")) {
          Book.destroy(formEl.selectBook.value);
          // remove deleted book from select options
          formEl.selectBook.remove(formEl.selectBook.selectedIndex);
        }
      }
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Book-M").style.display = "none";
    document.getElementById("Book-D").style.display = "block";
    formEl.reset();
  },
};
