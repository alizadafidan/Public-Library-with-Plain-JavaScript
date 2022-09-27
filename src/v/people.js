pl.v.people.manage = {
  /**
   * Set up the author management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", pl.v.people.manage.exit);
    pl.v.people.manage.refreshUI();
  },
  /**
   * Exit the Manage Authors UI page
   * Save the current population of Person
   */
  exit: function () {
    Person.saveAll();
  },
  /**
   * Refresh the Manage Authors UI
   */
  refreshUI: function () {
    // show the manage book UI and hide the other UIs
    document.getElementById("Person-M").style.display = "block";
    document.getElementById("Person-R").style.display = "none";
    document.getElementById("Person-C").style.display = "none";
    document.getElementById("Person-U").style.display = "none";
    document.getElementById("Person-D").style.display = "none";
  },
};
/**********************************************
 * Use case List Authors
 **********************************************/
pl.v.people.retrieveAndListAll = {
  setupUserInterface: function () {
    const tableBodyEl = document.querySelector("section#Person-R>table>tbody");
    tableBodyEl.innerHTML = "";
    for (let key of Object.keys(Person.instances)) {
      const person = Person.instances[key];
      const row = tableBodyEl.insertRow(-1);
      let roles = [];
      row.insertCell(-1).textContent = person.personId;
      row.insertCell(-1).textContent = person.name;
      if (person.personId in Author.instances) roles.push("author");
      if (person.personId in Employee.instances) roles.push("employee");
      row.insertCell(-1).textContent = roles.toString();
    }
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-R").style.display = "block";
  },
};
/**********************************************
 * Use case Create Person
 **********************************************/
pl.v.people.create = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Person-C > form"),
      saveButton = formEl.commit;
    formEl.personId.addEventListener("input", function () {
      formEl.personId.setCustomValidity(
        Person.checkPersonIdAsId(formEl.personId.value).message
      );
    });
    /*SIMPLIFIED CODE: no responsive validation of name */
    saveButton.addEventListener("click", function (e) {
      const slots = {
        personId: formEl.personId.value,
        name: formEl.name.value,
      };
      // check all input fields and provide error messages in case of constraint violations
      formEl.personId.setCustomValidity(
        Person.checkPersonIdAsId(slots.personId).message
      );
      /*SIMPLIFIED CODE: no before-save validation of "name" and "biography" */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) Person.add(slots);
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-C").style.display = "block";
    formEl.reset();
  },
};
/**********************************************
 * Use case Update Person
 **********************************************/
pl.v.people.update = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Person-U > form"),
      saveButton = formEl.commit,
      selectPersonEl = formEl.selectPerson;
    // set up the author selection list
    util.fillSelectWithOptions(selectPersonEl, Person.instances, "personId", {
      displayProp: "name",
    });
    selectPersonEl.addEventListener(
      "change",
      pl.v.people.update.handlePersonSelectChangeEvent
    );
    // validate constraints on new user input
    /*
        Incomplete code: no responsive validation of "name"
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
      };
      /*
        Incomplete code: missing before-save validation of "name"
        */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) Person.update(slots);
    });
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle author selection events
   * when a author is selected, populate the form with the data of the selected author
   */
  handlePersonSelectChangeEvent: function () {
    const formEl = document.querySelector("section#Person-U > form");
    var key = "",
      pers = null;
    key = formEl.selectPerson.value;
    if (key !== "") {
      pers = Person.instances[key];
      formEl.personId.value = pers.personId;
      formEl.name.value = pers.name;
    } else {
      formEl.reset();
    }
  },
};
/**********************************************
 * Use case Delete Person
 **********************************************/
pl.v.people.destroy = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Person-D > form"),
      deleteButton = formEl.commit,
      selectPersonEl = formEl.selectPerson;
    // set up the person selection list
    util.fillSelectWithOptions(selectPersonEl, Person.instances, "personId", {
      displayProp: "name",
    });
    deleteButton.addEventListener("click", function () {
      var personIdRef = formEl.selectPerson.value;
      if (confirm("Do you really want to delete this person?")) {
        Person.destroy(personIdRef);
        formEl.selectPerson.remove(formEl.selectPerson.selectedIndex);
      }
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-D").style.display = "block";
  },
};
