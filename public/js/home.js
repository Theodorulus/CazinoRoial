function sendGlobalMessage(message) {
   socket.emit('sendGlobalMessage', message)
}

window.onload = function() {
  socket.on('receiveGlobalMessage', data => {
      console.log(data)
      var chat = document.getElementById("chat1");
      var tbody = chat.children[0];
      var tr = document.createElement('tr');
      tr.classList.add("whole-message1");
      var td1 = document.createElement('td');
      td1.classList.add("user-and-message1");
      var div = document.createElement('div');
      div.classList.add("user-from-chat1");
      div.innerHTML="♠️ " + data.sender + ":";
      td1.appendChild(div);
      td1.innerHTML = td1.innerHTML + " " + data.message;
      var td2 = document.createElement('td');
      var span = document.createElement('span');
      span.classList.add("message-time1");
      var message_time = new Date(data.date).toLocaleString('en-GB')
      //console.log(message_time.slice(12, 17))
      span.innerHTML = message_time.slice(12, 17);
      td2.appendChild(span);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
      // do smth with data
  })

  
  document.getElementById("send_message").onclick = function (e) {
		e.preventDefault();
    //console.log(document.getElementById("input-chat1").value)

    if (document.getElementById("input-chat1").value != "") {

      var chat = document.getElementById("chat1");
      var tbody = chat.children[0];
      var tr = document.createElement('tr');
      tr.classList.add("whole-message1");
      var td1 = document.createElement('td');
      td1.classList.add("user-and-message1");
      var div = document.createElement('div');
      div.classList.add("user-from-chat1");
      div.innerHTML="♠️ " + "You" + ":";
      td1.appendChild(div);
      td1.innerHTML = td1.innerHTML + " " + document.getElementById("input-chat1").value;
      //console.log(td1.innerHTML);
      var td2 = document.createElement('td');
      var span = document.createElement('span');
      span.classList.add("message-time1");
      var ora = new Date().toString();
      //console.log(ora.slice(16, 21))
      span.innerHTML = ora.slice(16, 21);
      td2.appendChild(span);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
      sendGlobalMessage(document.getElementById("input-chat1").value)
      console.log(document.getElementById("input-chat1").value)
      document.getElementById("input-chat1").value = "";
      
    }
  }

};