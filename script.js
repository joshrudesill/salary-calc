let employees = [];
let total = 0;
function onLoad() {
  let ls = window.localStorage.getItem("employees");
  if (ls) {
    employees = JSON.parse(ls);
  }
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
    parent.id = lastEmployee.UUID;
    total += employee.salary;

    document.querySelector("#employee-table").appendChild(clone);
  }
  document.querySelector("#salary-total").textContent = `${total}`;
}
onLoad();
function addEmployee(event) {
  event.preventDefault();

  let firstName = document.querySelector("#fn");
  let lastName = document.querySelector("#ln");
  let id = document.querySelector("#id");
  let title = document.querySelector("#t");
  let salary = document.querySelector("#s");

  let UUID = crypto.randomUUID();

  employees.push({
    firstName: firstName.value,
    lastName: lastName.value,
    id: id.value,
    title: title.value,
    salary: salary.value,
    UUID,
  });

  total += Number(salary.value);
  document.querySelector("#salary-total").textContent = `${total}`;
  if (total > 20000) {
    document.querySelector("footer").className = "over-budget";
  }

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
  parent.id = lastEmployee.UUID;

  document.querySelector("#employee-table").appendChild(clone);

  firstName.value = "";
  lastName.value = "";
  id.value = "";
  title.value = "";
  salary.value = "";
  window.localStorage.setItem("employees", JSON.stringify(employees));
}

function deleteParent(event) {
  let parent = event.target.parentElement.parentElement;
  let parentUUID = parent.getAttribute("id");
  total -= Number(parent.querySelectorAll("td")[4].innerText);
  if (total < 20000) {
    document.querySelector("footer").className = "";
  }
  document.querySelector("#salary-total").textContent = total;
  parent.remove();
  employees = employees.filter((e) => {
    if (e.UUID !== parentUUID) {
      return true;
    }
    return false;
  });
  window.localStorage.setItem("employees", JSON.stringify(employees));
}
