
pl.v.authors.manage = {
  /**
   * Set up the author management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", pl.v.authors.manage.exit);
    pl.v.authors.manage.refreshUI();
  },
  /**
   * Exit the Manage Authors UI page
   * Save the current population of Author and generate the population of Person
   * from Employee and Author
   */
  exit: function () {
    Author.saveAll();
  },
  /**
   * Refresh the Manage Authors UI
   */
  refreshUI: function () {
    // show the manage book UI and hide the other UIs
    document.getElementById("Author-M").style.display = "block";
    document.getElementById("Author-R").style.display = "none";
    document.getElementById("Author-C").style.display = "none";
    document.getElementById("Author-U").style.display = "none";
    document.getElementById("Author-D").style.display = "none";
  },
};
/**********************************************
 * Use case List Authors
 **********************************************/
pl.v.authors.retrieveAndListAll = {
  setupUserInterface: function () {
    const tableBodyEl = document.querySelector("section#Author-R>table>tbody");
    tableBodyEl.innerHTML = "";
    for (let key of Object.keys(Author.instances)) {
      const author = Author.instances[key];
      const row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = author.personId;
      row.insertCell(-1).textContent = author.name;
      row.insertCell(-1).textContent = author.biography;
    }
    document.getElementById("Author-M").style.display = "none";
    document.getElementById("Author-R").style.display = "block";
  },
};
/**********************************************
 * Use case Create Author
 **********************************************/
pl.v.authors.create = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Author-C > form"),
      saveButton = formEl.commit;
    formEl.personId.addEventListener("input", function () {
      formEl.personId.setCustomValidity(
        Person.checkPersonIdAsId(formEl.personId.value, Author).message
      );
    });
    /*SIMPLIFIED CODE: no responsive validation of name and biography */
    saveButton.addEventListener("click", function (e) {
      const slots = {
        personId: formEl.personId.value,
        name: formEl.name.value,
        biography: formEl.biography.value,
      };
      // check all input fields and provide error messages in case of constraint violations
      formEl.personId.setCustomValidity(
        Person.checkPersonIdAsId(slots.personId).message,
        Author
      );
      /*SIMPLIFIED CODE: no before-save validation of "name" and "biography" */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) Author.add(slots);
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Author-M").style.display = "none";
    document.getElementById("Author-C").style.display = "block";
    formEl.reset();
  },
};
/**********************************************
 * Use case Update Author
 **********************************************/
pl.v.authors.update = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Author-U > form"),
      saveButton = formEl.commit,
      selectAuthorEl = formEl.selectAuthor;
    // set up the author selection list
    util.fillSelectWithOptions(selectAuthorEl, Author.instances, "personId", {
      displayProp: "name",
    });
    selectAuthorEl.addEventListener(
      "change",
      pl.v.authors.update.handleAuthorSelectChangeEvent
    );
    // validate constraints on new user input
    /*
        Incomplete code: no responsive validation of "name" and "biography"
      */
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    // when the update button is clicked and no constraint is violated,
    // update the author record
    saveButton.addEventListener("click", function (e) {
      var slots = {
        personId: formEl.personId.value,
        name: formEl.name.value,
        biography: formEl.biography.value,
      };
      /*
        Incomplete code: missing before-save validation of "name" and "biography"
        */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) Author.update(slots);
    });
    document.getElementById("Author-M").style.display = "none";
    document.getElementById("Author-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle author selection events
   * when a author is selected, populate the form with the data of the selected author
   */
  handleAuthorSelectChangeEvent: function () {
    const formEl = document.querySelector("section#Author-U > form");
    var key = "",
      auth = null;
    key = formEl.selectAuthor.value;
    if (key !== "") {
      auth = Author.instances[key];
      formEl.personId.value = auth.personId;
      formEl.name.value = auth.name;
      formEl.biography.value = auth.biography;
    } else {
      formEl.reset();
    }
  },
};
/**********************************************
 * Use case Delete Author
 **********************************************/
pl.v.authors.destroy = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Author-D > form"),
      deleteButton = formEl.commit,
      selectAuthorEl = formEl.selectAuthor;
    // set up the author selection list
    util.fillSelectWithOptions(selectAuthorEl, Author.instances, "personId", {
      displayProp: "name",
    });
    deleteButton.addEventListener("click", function () {
      var personIdRef = formEl.selectAuthor.value;
      if (confirm("Do you really want to delete this author?")) {
        Author.destroy(personIdRef);
        formEl.selectAuthor.remove(formEl.selectAuthor.selectedIndex);
      }
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Author-M").style.display = "none";
    document.getElementById("Author-D").style.display = "block";
  },
};
