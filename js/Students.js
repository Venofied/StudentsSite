document.addEventListener("newStudent", () => {
    addTable();
});
document.addEventListener("DOMContentLoaded", () => {
    addTable();
})

function getStudents(callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open("GET", "https://localhost:7185/Student", true);

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = xhr.response;//xhr.responseText;
            callback(responseData);
        }
    };
}

function createBodyTable(data) {
    var checkTable = document.getElementById("tableStudents");
    if (data.length > 1 && checkTable) {
        for (var i = 0; i < data.length; i++) {
            var tableRow = '<tr>';
            tableRow += "<td id='idStudent'>" + data[i].Id + "</td>";
            tableRow +=
                "<td id='tdname'>" +
                "<div text-field>" +
                `<input class="text-field__input" id="Name" type="text" value="${data[i].Name}"></label>` +
                "</div>" +
                "</td>";
            tableRow +=
                "<td id='tdsurName'>" +
                "<div text-field>" +
                `<input class="text-field__input" id="SurName" type="text" value="${data[i].SurName}"></label>` +
                "</div>" +
                "</td>";
            tableRow +=
                "<td id='tdpatronymic'>" +
                "<div text-field>" +
                `<input class="text-field__input" id="Patronymic" type="text" value="${data[i].Patronymic}"></label>` +
                "</div>" +
                "</td>";
            tableRow +=
                "<td id='tdemail'>" +
                "<div text-field>" +
                `<input class="text-field__input" id="Email" type="text" value="${data[i].Email}"></label>` +
                "</div>" +
                "</td>";
            tableRow +=
                "<td id='nameGroup'>" +
                "<div class='dropdown'></div>" +
                `<button id='btnDropDowngroup${[i]}' class='dropbtn' value="${data[i].group.Id}">${data[i].group.Name}</button>` +
                `<div id='dropDowngroup${[i]}' class='dropdown-content'></div>` +
                "</div>" +
                "</td>";
            tableRow += "<td id='idGroup' style='display:none;'>" + data[i].group.Id + "</td>";
            tableRow +=
                "<td id='deleteStudent'>" +
                "<button id='buttonDelete" + [i] + "' class='btn delStudent'>Удалить</button>" +
                "</td>";
            tableRow += "</tr>";
            $('#tableStudents tbody').append(tableRow);
        }
        addFuncOnclickDropDownTable();
    }
}

function addFuncOnclickDropDownTable() {
    var table = document.getElementById("tableStudents");
    if (table) {
        var rows = table.rows;
        for (i = 1; i <= rows.length - 1; i++) {
            var id = rows[i].cells.idStudent.textContent;
            rows[i].cells.deleteStudent.onclick = function () {
                return function () {
                    postDeleteStudent(id);
                };
            }(rows[i]);
            rows[i].cells.nameGroup.children[1].onclick = function () {
                return function () {
                    var row = $(this).parent()[0].children[2];
                    sendGetAllGroupsTable(row, addGroupsDropdownTable).then(
                        response => {
                            $(this).parent()[0].children[2].classList.toggle("show");
                        }
                    );
                };
            }(rows[i]);

        }
    }
}

function addGroupsDropdownTable(data, rowId, rowbtnId) {
    /*for(var i = 0; i < row.children.length; i++){
        row[i].parentNode.removeChild(row[i]);
    }*/
    //row.siblings("a").remove();
    if (data.length > 1 && rowId) {
        for (var i = 0; i < data.length; i++) {
            var nameGroup = data[i].Name;
            var idGroup = data[i].Id;
            $(`#${rowId.id}`).append(`<a onClick="onAddGroup('${nameGroup}','${idGroup}','${row.id}')" option value="${idGroup}">${nameGroup}</a>`)
        }
    }
}

function onAddGroup(nameGroup, idGroup, rowId) {
    var table = document.getElementById('btnDropDowngroupModal');
    if (table) {
        table.value = idGroup;
        table.textContent = nameGroup;

        if (rowId) {
            document.getElementById(rowId).classList.toggle("show");
        }
    }
}

function addTable() {
    $("#tableStudents").remove();
    createHeadTable();
    getStudents(createBodyTable);
}

function sendGetAllGroupsTable(row, callback) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';

        xhr.open("GET", "https://localhost:7185/Group", true);

        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var responseData = xhr.response;//xhr.responseText;
                resolve(callback(responseData, row));
            }
        };
    });
}

function postDeleteStudent(idStudent) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open("DELETE", "https://localhost:7185/Student", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(idStudent));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = xhr.response;
            if (responseData) {
                console.log("Удалено");
                addTable();
            }
            else {
                alert("Ошибка при удалении");
            }
        }
    };
}

function updateStudents(studentsArr) {
    var urlpost = "https://localhost:7185/Student";
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', urlpost)
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(studentsArr));

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.response != 'false') {
                console.log("Сохранено");
                var table = document.getElementById("tableStudents");
                let event = new Event("newStudent", { bubbles: true });
                table.dispatchEvent(event)
            }
        }
    }

    return true;
}

function onSaveStudent() {
    var table = document.getElementById("tableStudents");
    if (table) {
        var rows = table.rows;
        var students = [];
        for (i = 1; i <= rows.length - 1; i++) {
            var student = {
                Id: rows[i].cells.idStudent.textContent,
                Name: rows[i].cells.tdname.children[0].children.Name.value,
                SurName: rows[i].cells.tdsurName.children[0].children.SurName.value,
                Patronymic: rows[i].cells.tdpatronymic.children[0].children.Patronymic.value,
                Email: rows[i].cells.tdemail.children[0].children.Email.value,
                GroupId: rows[i].cells.idGroup.textContent,
                group: {
                    Id: rows[i].cells.idGroup.textContent,
                    Name: rows[i].cells.nameGroup.textContent
                }
            };
            students.push(student);
        }
        updateStudents(students);
    }

}


function createHeadTable() {
    $('#content').append('<table id="tableStudents"><thead><tr></tr></thead><tbody></tbody></table>');

    $.each(Object.keys(locHeadStudent), function (index, key) {
        $('#tableStudents thead tr').append('<th>' + locHeadStudent[key] + '</th>');
    });
    $('#tableStudents thead tr').append('<th></th>');
}


