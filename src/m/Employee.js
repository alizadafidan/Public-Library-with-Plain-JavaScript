/**
 * Enumeration type
 * @global
 */
EmployeeCategoryEL = new Enumeration(["Manager"]);
/**
 * Constructor function for the class Employee
 * @constructor
 * @param {{personId: string, name: string, empNo: number}} [slots] -
 *     A record of parameters.
 */
class Employee extends Person {
  // using a single record parameter with ES6 function parameter destructuring
  constructor({ personId, name, empNo, category, department }) {
    super({ personId, name });
    // assign additional properties
    this.empNo = empNo;
    if (category) this.category = category;
    if (department) this.department = department;
  }
  get empNo() {
    return this._empNo;
  }
  set empNo(n) {
    /*SIMPLIFIED CODE: no validation */
    this._empNo = n;
  }
  get category() {
    return this._category;
  }
  static checkCategory(v) {
    if (!v) {
      return new NoConstraintViolation();
    } else {
      if (!Number.isInteger(v) || v < 1 || v > EmployeeCategoryEL.MAX) {
        return new RangeConstraintViolation(
          "The value of category must represent an employee type!"
        );
      } else {
        return new NoConstraintViolation();
      }
    }
  }
  set category(v) {
    var validationResult = null;
    if (this.category) {
      // already set/assigned
      validationResult = new FrozenValueConstraintViolation(
        "The category cannot be changed!"
      );
    } else {
      v = parseInt(v);
      validationResult = Employee.checkCategory(v);
    }
    if (validationResult instanceof NoConstraintViolation) {
      this._category = v;
    } else {
      throw validationResult;
    }
  }
  get department() {
    return this._department;
  }
  /**
   * Check if the attribute "department" applies to the given category of book
   * and if the value for it is admissible
   * @method
   * @static
   * @param {string} d - The department of a manager.
   * @param {number} c - The category of an employee.
   */
  static checkDepartment(d, c) {
    c = parseInt(c);
    if (c === EmployeeCategoryEL.MANAGER && !d) {
      return new MandatoryValueConstraintViolation(
        "A department must be provided for a manager!"
      );
    } else if (c !== EmployeeCategoryEL.MANAGER && d) {
      return new ConstraintViolation(
        "A department must not be provided if the employee is not a manager!"
      );
    } else if (d && (typeof d !== "string" || d.trim() === "")) {
      return new RangeConstraintViolation(
        "The department must be a non-empty string!"
      );
    } else {
      return new NoConstraintViolation();
    }
  }
  set department(v) {
    var validationResult = Employee.checkDepartment(v, this.category);
    if (validationResult instanceof NoConstraintViolation) {
      this._department = v;
    } else {
      throw validationResult;
    }
  }
  /* Convert object to string */
  toString() {
    return (
      "Employee{ persID: " +
      this.personId +
      ", name: " +
      this.name +
      ", empNo:" +
      this.empNo +
      "}"
    );
  }
}
// ***********************************************
// *** Class-level ("static") properties *********
// ***********************************************
Employee.instances = {};

// *********************************************************
// *** Class-level ("static") storage management methods ***
// *********************************************************
/**
 * Create a new Employee row
 * @method
 * @static
 * @param {{personId: string, name: string, empNo: number}} slots - A record of parameters.
 */
Employee.add = function (slots) {
  var emp = null;
  try {
    emp = new Employee(slots);
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    emp = null;
  }
  if (emp) {
    Employee.instances[emp.personId] = emp;
    console.log(emp.toString() + " created!");
  }
};
/**
 * Update an existing Employee row
 * @method
 * @static
 * @param {{personId: string, name: string, empNo: number}} slots - A record of parameters.
 */
Employee.update = function ({ personId, name, empNo, category, department }) {
  const emp = Employee.instances[personId],
    objectBeforeUpdate = util.cloneObject(emp);
  var noConstraintViolated = true,
    updatedProperties = [];
  try {
    if (name && emp.name !== name) {
      emp.name = name;
      updatedProperties.push("name");
    }
    if (empNo && emp.empNo !== empNo) {
      emp.empNo = empNo;
      updatedProperties.push("empNo");
    }
    if (category && (!("category" in emp) || emp.category !== category)) {
      emp.category = category;
      updatedProperties.push("category");
    } else if (!category && "category" in emp) {
      // since the employee category represents a role, it can be unset
      delete emp._category; // drop category slot
      delete emp._department; // drop department slot
      updatedProperties.push("category");
    }
    if (department && emp.department !== department) {
      emp.department = department;
      updatedProperties.push("department");
    }
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    Employee.instances[personId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      let ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log(
        `Propert${ending} ${updatedProperties.toString()} modified for employee ${name}`
      );
    } else {
      console.log("No property value changed for Employee " + emp.name + " !");
    }
  }
};
/**
 * Delete an existing Employee row
 * @method
 * @static
 * @param {string} personId - The ID of a person.
 */
Employee.destroy = function (personId) {
  var name = Employee.instances[personId].name;
  delete Employee.instances[personId];
  console.log("Employee " + name + " deleted.");
};
/**
 * Save all Employee objects as rows
 * @method
 * @static
 */
Employee.saveAll = function () {
  const employees = {};
  for (let key of Object.keys(Employee.instances)) {
    let emp = Employee.instances[key];
    employees[key] = emp.toRecord();
  }
  try {
    localStorage["employees"] = JSON.stringify(employees);
    console.log(Object.keys(employees).length + " employees saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
