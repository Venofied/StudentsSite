
function clickGroups() {
  document.getElementById("dropDowngroupModal").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("dropDowngroupModal");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function sendGetAllGroups(callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.open("GET", "https://localhost:7185/Group", true);

  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var responseData = xhr.response;//xhr.responseText;
      callback(responseData);
    }
  };
}

function addGroupsDropdown(data) {
  $("#dropDowngroupModal").siblings("a").remove();
  for (var i = 0; i < data.length; i++) {
    var nameGroup = data[i].Name;
    var idGroup = data[i].Id;
    $('#dropDowngroupModal').append(`<a onClick="onAddGroup('${nameGroup}','${idGroup}')" option value="${idGroup}">${nameGroup}</a>`)
  }
}
function onAddGroup(nameGroup, idGroup) {
  var btnDropDownModal = document.getElementById('btnDropDowngroupModal');
  if (btnDropDownModal) {
    btnDropDownModal.value = idGroup;
    btnDropDownModal.textContent = nameGroup;
    
    var dropDownModal = document.getElementById("dropDowngroupModal");
    if (dropDownModal) {
      dropDownModal.classList.toggle("show");
    }
  }
}
function addDropDown() {
  document.getElementById("btnDropDowngroupModal").textContent = NoGroup.Name;
  document.getElementById('btnDropDowngroupModal').value = NoGroup.Id;

  $('#dropDowngroupModal').append('<input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">');
  sendGetAllGroups(addGroupsDropdown);
}

function newGuid() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', "https://localhost:7185/Main", true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var responseData = xhr.response;//xhr.responseText;
        resolve(responseData);
      }
    };
    xhr.send();
  });
}

function createStudent() {
  newGuid().then(
    response => {
      var nameStudent = document.getElementById('name').value;
      var surNameStudent = document.getElementById('surName').value;
      var patronymicStudent = document.getElementById('patronymic').value;
      var emailStudent = document.getElementById('email').value;
      var groupStudent = document.getElementById('btnDropDowngroupModal').value;
      var student = {
        Id: response,
        Name: nameStudent,
        SurName: surNameStudent,
        Patronymic: patronymicStudent,
        Email: emailStudent,
        GroupId: groupStudent,
        group: {
          Id: groupStudent,
          Name: ""
        }
      }
      postStudent(student);
    },
    error => alert(`Ошибка: ${error}`)
  );
}

function onAddStudent() {
  var student = createStudent();
  console.log(student);
}

function postStudent(student) {
  var urlpost = "https://localhost:7185/Student";
  var xhr = new XMLHttpRequest();

  xhr.open('POST', urlpost)

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(JSON.stringify(student));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.response) {
        alert("Добавлено");
        var table = document.getElementById("tableStudents");
        let event = new Event("newStudent", { bubbles: true });
        table.dispatchEvent(event)
      }
    }
  }
  return true;
}
