// Global variables
let employees = [];
let total = 0;

// Function to load employee array from localStorage if it exists
function onLoad() {
  // This wont run on the main submission to the main branch. Certain stuff will be uncommented here and later in the code for the 'fancy' branch. This is
  // because localStorage breaks the tests. See fancy branch for working version with local storage
  // Get employees key
  let ls = window.localStorage.getItem("employees");
  // If there is something there
  //let ls = false;
  if (ls) {
    // Parse the json into an object
    employees = JSON.parse(ls);
    // Loop over each employee, clone template, fill it in, then append it to the DOM
    for (const employee of employees) {
      let template = document.querySelector("#employee-row");
      const clone = template.content.cloneNode(true);
      let parent = clone.querySelector("tr");
      let rows = clone.querySelectorAll("td");
      let lastEmployee = employees.at(-1);
      rows[0].textContent = employee.firstName;
      rows[1].textContent = employee.lastName;
      rows[2].textContent = employee.id;
      rows[3].textContent = employee.title;
      rows[4].textContent = employee.salary;
      rows[5].children[0].addEventListener("click", deleteParent);
      parent.id = lastEmployee.UUID;
      // Also start adding total meanwhile
      total += Number(employee.salary);

      document.querySelector("#employee-table").appendChild(clone);
    }
    // Fill in total
    document.querySelector("footer").textContent = `Total Monthly: ${
      total / 12
    }`;

    // Do over budget check
    if (total / 12 > 20000) {
      document.querySelector("footer").className = "over-budget";
    }
  }
}
// Call after DOM content loaded
onLoad();

function addEmployee(event) {
  event.preventDefault();

  // Get inputs
  let firstName = document.querySelector("#fn");
  let lastName = document.querySelector("#ln");
  let id = document.querySelector("#id");
  let title = document.querySelector("#t");
  let salary = document.querySelector("#s");

  // Create UUID. This will be for updating employees array later
  let UUID = crypto.randomUUID();

  // Push new employee into array
  employees.push({
    firstName: firstName.value,
    lastName: lastName.value,
    id: id.value,
    title: title.value,
    salary: salary.value,
    UUID,
  });

  // Update total
  total += Number(salary.value);
  document.querySelector("footer").textContent = `Total Monthly: ${total / 12}`;
  if (total / 12 > 20000) {
    document.querySelector("footer").className = "over-budget";
  }

  // Clone template and fill it out, then append to DOM
  let template = document.querySelector("#employee-row");
  const clone = template.content.cloneNode(true);
  let parent = clone.querySelector("tr");
  let rows = clone.querySelectorAll("td");
  let lastEmployee = employees.at(-1);

  rows[0].textContent = lastEmployee.firstName;
  rows[1].textContent = lastEmployee.lastName;
  rows[2].textContent = lastEmployee.id;
  rows[3].textContent = lastEmployee.title;
  rows[4].textContent = lastEmployee.salary;
  rows[5].children[0].addEventListener("click", deleteParent);
  parent.id = lastEmployee.UUID;

  document.querySelector("#employee-table").appendChild(clone);

  // Reset inputs
  firstName.value = "";
  lastName.value = "";
  id.value = "";
  title.value = "";
  salary.value = "";
  // Update local storage
  window.localStorage.setItem("employees", JSON.stringify(employees));
}

function deleteParent(event) {
  // Get parent row <tr>
  let parent = event.target.parentElement.parentElement;
  // Get the UUID which was assigned as an ID attribute on the td earlier
  let parentUUID = parent.getAttribute("id");
  // Adjust total
  total -= Number(parent.querySelectorAll("td")[4].innerText);
  if (total / 12 < 20000) {
    document.querySelector("footer").className = "";
  }
  document.querySelector("footer").textContent = `Total Monthly: ${total / 12}`;
  // Remove parent
  parent.remove();
  // Remove employee object from array
  employees = employees.filter((e) => {
    if (e.UUID !== parentUUID) {
      return true;
    }
    return false;
  });
  // Lastly update local storage again
  window.localStorage.setItem("employees", JSON.stringify(employees));
}
