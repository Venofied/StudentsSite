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

function newGuid() {
  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', "https://localhost:7185/Main", true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Получаем данные из ответа
        var responseData = xhr.response;//xhr.responseText;
        resolve(responseData);
      }
    };
    xhr.send();
  });
}

function createGroup() {
  newGuid().then(
    response => {
      var nameGroup = document.getElementById('name').value;
      var group = {
        Id: response,
        Name: nameGroup,
      }
      postGroup(group);
    },
    error => alert(`Ошибка: ${error}`)
  );
}

function addGroup() {
  var group = createGroup();
  console.log(group);
}

function postGroup(group) {
  var urlpost = "https://localhost:7185/Group";
  var xhr = new XMLHttpRequest();
  //open the request
  xhr.open('POST', urlpost)
  xhr.setRequestHeader("Content-Type", "application/json");

  //send the form data
  xhr.send(JSON.stringify(group));

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