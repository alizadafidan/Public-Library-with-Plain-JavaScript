/**
 * event handler for employee category selection events
 * used both in create and update
 */
pl.v.employees.handleCategorySelectChangeEvent = function (e) {
  var formEl = e.currentTarget.form,
    categoryIndexStr = formEl.selectCategory.value, // the array index of EmployeeCategoryEL.labels
    category = 0;
  if (categoryIndexStr) {
    // convert array index to enum index
    category = parseInt(categoryIndexStr) + 1;
    switch (category) {
      case EmployeeCategoryEL.MANAGER:
        formEl.department.addEventListener("input", function () {
          formEl.department.setCustomValidity(
            Employee.checkDepartment(formEl.department.value, category).message
          );
        });
        break;
    }
    pl.v.app.displaySegmentFields(formEl, EmployeeCategoryEL.labels, category);
  } else {
    pl.v.app.undisplayAllSegmentFields(formEl, EmployeeCategoryEL.labels);
  }
};
pl.v.employees.manage = {
  /**
   * Set up the employee management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", pl.v.employees.manage.exit);
    pl.v.employees.manage.refreshUI();
  },
  /**
   * Exit the Manage Employees UI page
   * Save the current population of Employee and generate the population of Person
   * from Employee and Employee
   */
  exit: function () {
    Employee.saveAll();
    Person.saveAll();
  },
  /**
   * Refresh the Manage Employees UI
   */
  refreshUI: function () {
    // show the manage employee UI and hide the other UIs
    document.getElementById("Employee-M").style.display = "block";
    document.getElementById("Employee-R").style.display = "none";
    document.getElementById("Employee-C").style.display = "none";
    document.getElementById("Employee-U").style.display = "none";
    document.getElementById("Employee-D").style.display = "none";
  },
};
/**********************************************
 * Use case List Employees
 **********************************************/
pl.v.employees.retrieveAndListAll = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("section#Employee-R>table>tbody");
    var keys = Object.keys(Employee.instances);
    var row = null,
      employee = null,
      i = 0;
    tableBodyEl.innerHTML = "";
    for (let i = 0; i < keys.length; i++) {
      employee = Employee.instances[keys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = employee.personId;
      row.insertCell(-1).textContent = employee.name;
      row.insertCell(-1).textContent = employee.empNo;
      if (employee.category) {
        switch (employee.category) {
          case EmployeeCategoryEL.MANAGER:
            row.insertCell(-1).textContent =
              "Manager of " + employee.department + " department";
            break;
        }
      }
    }
    document.getElementById("Employee-M").style.display = "none";
    document.getElementById("Employee-R").style.display = "block";
  },
};
/**********************************************
 * Use case Create Employee
 **********************************************/
pl.v.employees.create = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Employee-C > form"),
      selectCategoryEl = formEl.selectCategory,
      saveButton = formEl.commit;
    // hide the EmployeeCategoryEL.MANAGER segment field "department"
    pl.v.app.undisplayAllSegmentFields(formEl, EmployeeCategoryEL.labels);
    // define event listener for responsive vaildation
    formEl.personId.addEventListener("input", function () {
      formEl.personId.setCustomValidity(
        Person.checkPersonIdAsId(formEl.personId.value, Employee).message
      );
    });
    // define event listener for pre-filling superclass attributes
    formEl.personId.addEventListener("change", function () {
      const persId = formEl.personId.value;
      if (persId in Person.instances) {
        formEl.name.value = Person.instances[persId].name;
        // set focus to next field
        formEl.empNo.focus();
      }
    });
    /* Incomplete code: no responsive validation of "name" and "empNo" */
    // set up the employee category selection list
    util.fillSelectWithOptions(selectCategoryEl, EmployeeCategoryEL.labels);
    selectCategoryEl.addEventListener(
      "change",
      pl.v.employees.handleCategorySelectChangeEvent
    );
    // set up the submit button
    saveButton.addEventListener("click", function (e) {
      const categoryStr = formEl.selectCategory.value;
      var slots = {
        personId: formEl.personId.value,
        name: formEl.name.value,
        empNo: formEl.empNo.value,
      };
      if (categoryStr) {
        // convert array index to enum index
        slots.category = parseInt(categoryStr) + 1;
        switch (slots.category) {
          case EmployeeCategoryEL.MANAGER:
            slots.department = formEl.department.value;
            formEl.department.setCustomValidity(
              Employee.checkDepartment(formEl.department.value, slots.category)
                .message
            );
            break;
        }
      }
      // check all input fields and provide error messages in case of constraint violations
      formEl.personId.setCustomValidity(
        Person.checkPersonIdAsId(slots.personId, Employee).message
      );
      /* Incomplete code: no validation of "name" and "empNo" */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) {
        Employee.add(slots);
        formEl.reset();
      }
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Employee-M").style.display = "none";
    document.getElementById("Employee-C").style.display = "block";
    formEl.reset();
  },
};
/**********************************************
 * Use case Update Employee
 **********************************************/
pl.v.employees.update = {
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Employee-U > form"),
      saveButton = formEl.commit,
      selectCategoryEl = formEl.selectCategory,
      selectEmployeeEl = formEl.selectEmployee;
    // set up the employee selection list
    util.fillSelectWithOptions(
      selectEmployeeEl,
      Employee.instances,
      "personId",
      { displayProp: "name" }
    );
    selectEmployeeEl.addEventListener(
      "change",
      pl.v.employees.update.handleEmployeeSelectChangeEvent
    );
    /* Incomplete code: no responsive validation of "name" and "empNo" */
    // set up the employee category selection list
    util.fillSelectWithOptions(selectCategoryEl, EmployeeCategoryEL.labels);
    selectCategoryEl.addEventListener(
      "change",
      pl.v.employees.handleCategorySelectChangeEvent
    );
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    // set up the submit button
    saveButton.addEventListener("click", function (e) {
      const categoryStr = formEl.selectCategory.value;
      var slots = {
        personId: formEl.personId.value,
        name: formEl.name.value,
        empNo: formEl.empNo.value,
      };
      if (categoryStr) {
        // convert array index to enum index
        slots.category = parseInt(categoryStr) + 1;
        switch (slots.category) {
          case EmployeeCategoryEL.MANAGER:
            slots.department = formEl.department.value;
            formEl.department.setCustomValidity(
              Employee.checkDepartment(formEl.department.value, slots.category)
                .message
            );
            break;
        }
      }
      /* Incomplete code: no on-submit validation of "name" and "empNo" */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) Employee.update(slots);
    });
    document.getElementById("Employee-M").style.display = "none";
    document.getElementById("Employee-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle employee selection events
   * on selection, populate the form with the data of the selected employee
   */
  handleEmployeeSelectChangeEvent: function () {
    const formEl = document.querySelector("section#Employee-U > form");
    var key = "",
      emp = null;
    key = formEl.selectEmployee.value;
    if (key !== "") {
      emp = Employee.instances[key];
      formEl.personId.value = emp.personId;
      formEl.name.value = emp.name;
      formEl.empNo.value = emp.empNo;
      if (emp.category) {
        formEl.selectCategory.selectedIndex = parseInt(emp.category);
        pl.v.app.displaySegmentFields(
          formEl,
          EmployeeCategoryEL.labels,
          emp.category
        );
        switch (emp.category) {
          case EmployeeCategoryEL.MANAGER:
            formEl.department.value = emp.department;
            break;
        }
      } else {
        // no emp.category
        formEl.selectCategory.value = "";
        formEl.department.value = "";
        pl.v.app.undisplayAllSegmentFields(formEl, EmployeeCategoryEL.labels);
      }
    } else {
      formEl.reset();
    }
  },
};
/**********************************************
 * Use case Delete Employee
 **********************************************/
pl.v.employees.destroy = {
  /**
   * initialize the deleteEmployeeForm
   */
  setupUserInterface: function () {
    const formEl = document.querySelector("section#Employee-D > form"),
      deleteButton = formEl.commit,
      employeeSelectEl = formEl.selectEmployee;
    // set up the employee selection list
    util.fillSelectWithOptions(
      employeeSelectEl,
      Employee.instances,
      "personId",
      { displayProp: "name" }
    );
    deleteButton.addEventListener("click", function () {
      var personIdRef = formEl.selectEmployee.value;
      if (confirm("Do you really want to delete this employee?")) {
        Employee.destroy(personIdRef);
        formEl.selectEmployee.remove(formEl.selectEmployee.selectedIndex);
      }
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Employee-M").style.display = "none";
    document.getElementById("Employee-D").style.display = "block";
    formEl.reset();
  },
};
