// *********************************************************************
// Functions for the Current List section on the MAIN page
// *********************************************************************

// the jQuery template to render the list of names and birthdays
function listTemplate(data) {
  var compiled = '';
  data.forEach(item => {
    compiled += `<tr>
                  <td>${item.name}</td>
                  <td>${item.birthday}</td>
                </tr> `;
  });
  return compiled;
}

// getReservations function will get the full list. 
function getReservations() {
  return $.ajax('/reservations')
    .then(res => {
      console.log("Results from getReservations()", res);
      return res;
    })
    .fail(err => {
      console.log("Error in getReservations()", err);
      throw err;
    });
}

function refreshReservationList() {
  getReservations()
    .then(reservations => {

      // saving the reservations array to a global window object
      window.reservationList = reservations;

      const data = {
        reservations: reservations
      };
      //jQuery selector getting the id# reservation-list and add the listTemplate
      $('#reservation-list').html(listTemplate(data.reservations));
    })
}


function dateFormatting() {
  var inputBday = $('#birthday').val();
  console.log(inputBday);

  // replacin "-" with "/" to prevent issues with timezone and day being off by 1
  var d = new Date(inputBday.replace(/-/g, '\/'));
  console.log(d);

  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  inputBday = months[d.getMonth()] + " " + d.getDate();

  return inputBday;
}

function submitNewReservation() {
  console.log('the submitNewReservation function has been called!');

  var birthday = dateFormatting();

  //getting the values from the input form and creating an object literal
  const newReservationData = {
    name: $('#name').val(),
    birthday: birthday
  };


  $.ajax({
      type: 'POST',
      url: '/reservations',
      data: JSON.stringify(newReservationData),
      dataType: 'json',
      contentType: 'application/json',
    })
    .done(function (response) {
      console.log("new reservation!");
      refreshReservationList();
    })
    .fail(function (error) {
      console.log("did not work!", error);
    });
  console.log('Reservation data for the new reservation', newReservationData);

  clearForm(); 
}

// this is to clear the input fields
function clearForm() {
  document.getElementById("name").value = '';
  document.getElementById("birthday").value = '';
}


// *********************************************************************
// Functions for the Current List section on the EDIT page
// *********************************************************************
function editListTemplate(data) {
  var editItems = '';
  data.forEach(item => {
    editItems += `
      <li class="list-group-item">
      <form class="form-inline">
        <label for="name" class="mr-2">Name</label>
        <input type="text" class="form-control mr-2 mb-2" id="name-${item._id}" placeholder="" value="${item.name}">

        <label for="birthday" class="mr-2">Birthday</label>

        <input type="text" class="form-control mr-2 mb-2" id="birthday-${item._id}" value="${item.birthday}">
        
        <button type="button" class="btn btn-warning mr-2" onclick="updateReservation('${item._id}')">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteReservation('${item._id}')">Delete</button>
      </form>  
      </li>
  `;
  });
  return editItems;
}


// Refresh the reservation list on the edit page
function refreshEditReservationList() {
  getReservations()
    .then(reservations => {

      // saving the reservations array to a global window object to be accessed in the updateReservation() function
      window.reservationList = reservations;
      const data = {
        reservations: reservations
      };
      $('#edit-reservation-list').html(editListTemplate(data.reservations));
    })
}

function updateReservation(_id) {
  const reservation = window.reservationList.find(reservation => reservation._id === _id);
  let myId = _id;
  console.log(reservation);
  console.log(myId);

  const updatedReservation = {
    _id: _id,
    //jQuery selector to update current reservation w/ value in the input field
    name: $("#name-" + myId).val(),
    birthday: $("#birthday-" + myId).val()
  };

  // .ajax() call for the PUT
  $.ajax({
      type: 'PUT',
      url: '/reservations/' + _id,
      data: JSON.stringify(updatedReservation),
      dataType: 'json',
      contentType: 'application/json',
    })
    .done(function (response) {
      console.log("Reservation w/ id: " + _id + " has been updated.");
      refreshReservationList();
      refreshEditReservationList();
    })
    .fail(function (error) {
      console.log(_id + " could not be updated", error);
    });
  console.log('Reservation data for the new reservation', updatedReservation);
}


// DELETE: to delete an existing post
function deleteReservation(_id) {
  console.log(_id + " is being deleted");
  //$.ajax() w/ type DELETE creates a DELETE method 
  return $.ajax({
      type: 'DELETE',
      url: '/reservations/' + _id,
      dataType: 'json',
      contentType: 'application/json',
    })
    .done(function (response) {
      console.log(_id, " has been deleted.");
      refreshReservationList();
      refreshEditReservationList();
    })
    .fail(function (error) {
      console.log("This delete did not work.", error);
    })
}