document.addEventListener("DOMContentLoaded", () => {
    addTable();
})
document.addEventListener("newGroup", () => { // (1)
    addTable();
});

function sendGetAllGroups(callback) {
    // Создаем новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    // Указываем метод и URL-адрес сервера
    xhr.open("GET", "https://localhost:7185/Group", true);

    // Отправляем запрос
    xhr.send();

    // Обрабатываем ответ сервера
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Получаем данные из ответа
            var responseData = xhr.response;//xhr.responseText;
            callback(responseData);
        }
    };
}

function createBodyTableGroup(data) {
    for (var i = 0; i < data.length; i++) {
        var tableRow = '<tr>';
        tableRow += "<td id='idGroup'>" + data[i].Id + "</td>";
        tableRow += 
        "<td id='tdname'>" +
            "<div text-field>" +
                `<input class="text-field__input" id="Name" type="text" value="${data[i].Name}"></label>` +
              "</div>"+  
        "</td>";       
        tableRow +=
            "<td id='deleteGroup'>" +
            "<button id='buttonDelete" + [i] + "' class='btn delGroup'>Удалить</button>" +
            "</td>";
        tableRow += "</tr>";
        $('#tableGroups tbody').append(tableRow);
    }
    var rows = document.getElementById("tableGroups").rows;
    for (i = 1; i <= rows.length - 1; i++)
    {
        var id = rows[i].cells.idGroup.textContent;
        rows[i].cells.deleteGroup.onclick = function () 
        {
            return function ()
            {
                postDeleteGroup(id);
            };
        }
        (rows[i]);
    }
}

function postDeleteGroup(idGroup){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    // Указываем метод и URL-адрес сервера
    xhr.open("DELETE", "https://localhost:7185/Group", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    //send the form data
    xhr.send(JSON.stringify(idGroup));

    // Обрабатываем ответ сервера
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Получаем данные из ответа
            var responseData = xhr.response;//xhr.responseText;
            if(responseData){
                console.log("Удалено");
                addTable();
            }
            else{
                alert("Ошибка при удалении");
            }
        }
    };
}

function updateGroups(groupsArr) {
    var urlpost = "https://localhost:7185/Group";
    var xhr = new XMLHttpRequest();
    //open the request
    xhr.open('PUT', urlpost)
    xhr.setRequestHeader("Content-Type", "application/json");
  
    //send the form data
    xhr.send(JSON.stringify(groupsArr));
  
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if(xhr.response != 'false'){
            alert("Добавлено");
            var table = document.getElementById("tableGroups");
            let event = new Event("newGroup", {bubbles: true});
            table.dispatchEvent(event)
          } //reset form after AJAX success or do something else
        }
    }
    //Fail the onsubmit to avoid page refresh.
    return true;
  }

function onSaveGroup(){
    var rows = document.getElementById("tableGroups").rows;
    var groups = [];
    for (i = 1; i <= rows.length - 1; i++)
    {
        var group = {
            Id: rows[i].cells.idGroup.textContent,
            Name: rows[i].cells.tdname.children[0].children.Name.value
        };
        groups.push(group);
    }
    updateGroups(groups);

}

function addTable() {
    $("#tableGroups").remove();
    createHeadTableGroup();
    sendGetAllGroups(createBodyTableGroup);
}

function getDeleteButton() {
    return '<input type="button" class="btn deleteGroup" value="Удалить"></input>';
}

function createHeadTableGroup() {
    $('#content').append('<table id="tableGroups"><thead><tr></tr></thead><tbody></tbody></table>');
    var locHeadGrouplength = Object.keys(locHeadGroup).length;
    if (locHeadGrouplength > 1) {
        $.each(Object.keys(locHeadGroup), function (index, key) {
            $('#tableGroups thead tr').append('<th>' + locHeadGroup[key] + '</th>');
        });
    } else {
        $('#tableGroups thead tr').append('<th>' + locHeadGroup.name + '</th>');
    }
    $('#tableGroups thead tr').append('<th></th>');
}

