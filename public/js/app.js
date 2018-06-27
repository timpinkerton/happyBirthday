// *******************************************************************
// Global variables: today, startDate, endDate
// *******************************************************************
// .format("MM-DD-YYYY");
const today = moment().format("YYYY-MM-DD");
const startDate = moment().add(6, 'days').format("MM-DD-YYYY");
const endDate = moment().add(372, 'days').format("MM-DD-YYYY");


// *********************************************************************
// Functions for the Current List section on the MAIN page
// *********************************************************************

function getTodaysName() {
  //to get the current date and time
  // const today = moment().format("YYYY-MM-DD");

  let todaysName = '';

  getReservations()
    .then(reservations => {

      for (var i = 0; i < reservations.length; i++) {
        console.log(reservations[i].name + ": " + moment.utc(reservations[i].birthday).format("YYYY-MM-DD"));
        if (moment.utc(reservations[i].birthday).format("YYYY-MM-DD") === today) {
          console.log("match!");
          todaysName = reservations[i].name;
          console.log(todaysName);
          break;
        } else {
          console.log("nope!!");
          todaysName = "No One";
          console.log(todaysName);
        }
      }

      console.log("Today is: " + today);

      //jQuery selector getting the id# greeting and add the greetingTemplate defined below
      $('#greeting').html(greetingTemplate(todaysName));
    })
}

function greetingTemplate(todaysName) {
  // jQuery template string
  const greetingTemplate = `<p id="greeting">Happy Birthday, ${todaysName}!</p>`;
  // put the template data into the actual page
  $('body .bubble-img').first().after(greetingTemplate);
}


// the jQuery template to render the list of names and birthdays
function listTemplate(reservations) {

  // const todayNew = moment();
  console.log("****** Today is: " + today);

  const yesterday = moment(today).subtract(1, 'days');
  console.log("yesterday is: " + yesterday);

  var compiled = '';
  reservations.forEach(item => {
    //this if statment will only add an item to list it the birthday is today or later
    if (moment(item.birthday).isAfter(yesterday)) {
      compiled += `<tr>
      <td>${item.name}</td>
      <td>${moment.utc(item.birthday).format("MMMM, DD")}</td>
    </tr> `;
    }

    // ********* If the utc above is removed, dates will show 1 day earlier in the table ************* 

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

      // sorting the reservations array by birthday
      reservations.sort(function (a, b) {
        var c = new Date(a.birthday);
        var d = new Date(b.birthday);
        return c - d;
      })

      // saving the reservations array to a global window object
      window.reservationList = reservations;

      //jQuery selector getting the id# reservation-list and add the listTemplate
      $('#reservation-list').html(listTemplate(reservations));
    })
}


function submitNewReservation() {

  // const startDate = moment().add(6, 'days').format("MM-DD-YYYY");
  // const endDate = moment().add(372, 'days').format("MM-DD-YYYY");

  console.log('the submitNewReservation function has been called!');

  //getting the values from the input form and creating an object literal
  const newReservationData = {
    name: $('#name').val(),
    birthday: $('#birthday').val()
  }

  // console.log("new birthday before formatting: " + newReservationData.birthday); 
  // newReservationData.birthday = moment(newReservationData.birthday).format("YYYY-MM-DD");

  // console.log("This is the new data being entered: " + newReservationData.birthday);

  if (!newReservationData.name && !newReservationData.birthday) {
    swal({
      title: 'Ummmm.....',
      text: 'You didn\'t enter anything!',
      type: 'error',

      backdrop: true,
    })
  }
  //checking for a name
  else if (!newReservationData.name) {
    swal({
      title: 'Dang it!',
      text: 'You forgot to enter a name.  Please try again.',
      type: 'error',

      backdrop: true,
    })
    //checking for a birthday
  } else if (!newReservationData.birthday) {
    swal({
      title: 'Dang it!',
      text: 'You forgot to enter a birthday.  Please try again.',
      type: 'error',

      backdrop: true,
    })
    //checking to see if the date entered is between the start and end dates
  } else if (moment(newReservationData.birthday).isSameOrBefore(startDate) || moment(newReservationData.birthday).isSameOrAfter(endDate)) {

    swal({
      title: 'Dang it!',
      text: 'Please enter a birthday BETWEEN ' + startDate + ' and ' + endDate,
      type: 'error',

      backdrop: true,
    })

  } else {

    let isMatch;

    //Checking if the date is already submitted
    getReservations()
      .then(reservations => {

        for (var i = 0; i < reservations.length; i++) {
          // moment.utc(reservations[i].birthday).format("YYYY-MM-DD")
          console.log("bday already in the list: " + reservations[i].birthday);
          console.log("new birthday to add to list: " + newReservationData.birthday);


          if (moment.utc(reservations[i].birthday).format("YYYY-MM-DD") === newReservationData.birthday) {
            console.log("Match!!!!  that date is already taken");
            isMatch = true;

            swal({
              title: 'Dang it!',
              text: 'That date is already taken.  Please try again.',
              type: 'error',

              backdrop: true,
            })

            break;

          } else {

            console.log("No match. ");
            isMatch = false;

          }
        }
        //if there is no match a POST request is created
        if (!isMatch) {
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

              swal({
                title: 'Done!',
                text: newReservationData.name + ' has been added to the list',
                type: 'success',

                backdrop: true,
              })

            })
        }
      })

    console.log('Reservation data for the new reservation', newReservationData);

    clearForm();
  }
}


// .fail(function (error) {
//   console.log("did not work!", error);

//   swal({
//     title: 'Dang it!',
//     text: 'You must enter a name and a valid birthday.  Please try again.',
//     type: 'error',

//     backdrop: true,
//   })
// });



// this is to clear the input fields after the submit button is clicked
function clearForm() {
  document.getElementById("name").value = '';
  document.getElementById("birthday").value = '';
}


//getting the start and end dates 
function openDates() {

  let todayFormatted = moment(today).format('MM/DD/YYYY');
  // document.getElementById("valid-dates").innerText = "Please enter a date between " + startDate + " and " + endDate;

  const birthdayRules = ` (Enter a date between ${startDate} and ${endDate})`;

  const ruleTwo = `${todayFormatted}.  So enter a date between ${startDate} and ${endDate}`;

  $("#valid-dates").html(birthdayRules);
  $("#ruleTwo").html(ruleTwo);
}

//template literal for dynamic min and max dates in the birthday input
// date entered must be AFTER the min and BEFORE the max
function birthdayInput() {

  // changing the startDate and endDate format
  // const inputStartDate = moment(startDate).format("YYYY-MM-DD");
  // const inputEndDate = moment(endDate).format("YYYY-MM-DD");

  var birthdayInput = `<input type="date" class="form-control" id="birthday" min="${startDate}" max="${endDate}" required>`;

  $('#valid-dates').after(birthdayInput);
}

// *********************************************************************
// Functions for the Current List section on the EDIT page
// *********************************************************************
function editListTemplate(reservations) {

  //if I remove this line, there is a deprecation warning
  // const today = moment();

  var editItems = '';
  reservations.forEach(item => {
    //this if statment will only add an item to list it the birthday is today or later
    if (moment(item.birthday).isSameOrAfter(today)) {
      editItems += `
      <li class="list-group-item">
      <form class="form-inline">
        <label for="name" class="mr-2">Name</label>
        <input type="text" class="form-control mr-2 mb-2" id="name-${item._id}" placeholder="" value="${item.name}">

        <label for="birthday" class="mr-2">Birthday</label>

        <input type="text" class="form-control mr-2 mb-2" id="birthday-${item._id}" value="${moment.utc(item.birthday).format("MMMM D, YYYY")}">
        
        <button type="button" class="btn btn-warning mr-2" onclick="updateReservation('${item._id}')">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteReservation('${item._id}')">Delete</button>
      </form>  
      </li>
  `;
    }
  });
  return editItems;
}


// Refresh the reservation list on the edit page
function refreshEditReservationList() {
  getReservations()
    .then(reservations => {

      // sorting the reservations array by birthday
      reservations.sort(function (a, b) {
        var c = new Date(a.birthday);
        var d = new Date(b.birthday);
        return c - d;
      })

      // saving the reservations array to a global window object to be accessed in the updateReservation() function
      window.reservationList = reservations;

      $('#edit-reservation-list').html(editListTemplate(reservations));
    })
}

function updateReservation(_id) {
  // const reservation = window.reservationList.find(reservation => reservation._id === _id);

  let updateId = _id;
  console.log(_id + " is being updated");

  const updatedReservation = {
    _id: _id,
    //jQuery selector to update current reservation w/ value in the input field
    name: $("#name-" + updateId).val(),
    birthday: $("#birthday-" + updateId).val()
  }

  swal({
    title: 'Are you sure you want to update this reservation?',
    text: "please be careful",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, update it!'
  }).then((result) => {

    if (result.value) {

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
          console.log('Reservation data for the new reservation', updatedReservation);
          refreshReservationList();
          refreshEditReservationList();

          swal({
            title: 'Updated!',
            type: 'success',

            backdrop: true,
            toast: true
          })
        })
        .fail(function (error) {
          console.log(_id + " could not be updated", error);
        });


    } else if (

      result.dismiss === swal.DismissReason.cancel
    ) {
      console.log(_id, " has NOT been updated.");
      swal(
        'Cancelled',
        'Reservation has NOT been updated.',
        'error'
      )
    }

  })

}


// DELETE: to delete an existing post
function deleteReservation(_id) {
  console.log(_id + " is being deleted");

  swal({
    title: 'Are you sure you want to delete this reservation?',
    text: "please be careful",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {

      //$.ajax() w/ type DELETE creates a DELETE method 
      return $.ajax({
          type: 'DELETE',
          url: '/reservations/' + _id,
          dataType: 'json',
          contentType: 'application/json',
        })
        .done(function (response) {
          console.log(_id, " has been deleted.");

          swal(
            'Deleted!',
            'This reservation has been deleted.',
            'success'
          )

          refreshReservationList();
          refreshEditReservationList();
        })
        .fail(function (error) {
          console.log("This delete did not work.", error);
        })
    } else if (
      // Read more about handling dismissals
      result.dismiss === swal.DismissReason.cancel
    ) {

      console.log(_id, " has NOT been deleted.");
      swal(
        'Cancelled',
        'Reservation has NOT been deleted.',
        'error'
      )
    }

  })
}