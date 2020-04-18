// *******************************************************************
// Global variables: today, yesterday, startDate, endDate
// *******************************************************************
const today = moment().format("YYYY-MM-DD");
const yesterday = moment(today).subtract(1, 'days').format("YYYY-MM-DD");
const startDate = moment().add(6, 'days').format("YYYY-MM-DD");
const endDate = moment().add(372, 'days').format("YYYY-MM-DD");

const todayFormatted = moment(today).format('MM/DD/YYYY');
const startDateFormatted = moment(startDate).format('MM/DD/YYYY');
const endDateFormatted = moment(endDate).format('MM/DD/YYYY');

// configuring cloudinary and instantiating a new Cloudinary class
const cl = new cloudinary.Cloudinary({
  cloud_name: "smoketron",
  secure: true
});

cl.responsive();

function windowRefresh() {
  location.reload();
}

// *********************************************************************
// Functions for the Current List section on the MAIN page
// *********************************************************************

function getTodaysName() {

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

      // jQuery selector getting the id# greeting and add the greetingTemplate defined below
      $('#greeting').html(greetingTemplate(todaysName));

      getTodaysCard(todaysName);
    })
}


function greetingTemplate(todaysName) {
  // jQuery template string
  console.log('********* today name is: ' + todaysName);

  // **************   This is the old greeting that needs to be put back
  // const greetingTemplate = `<p id="greeting">Happy Birthday, ${todaysName}!</p>`;

  // **************   This is the temporary greeting
  const greetingTemplate = `<p id="greeting">Happy Birthday Denny !!! </p>`;
  
  // put the template data into the actual page
  $('body .bubble-img').first().after(greetingTemplate);
}


function getTodaysCard(todaysName) {

  var todaysCard;

  if (todaysName === 'No One') {

    // **************   Change this back to noOne.png *************************************
    todaysCard = cl.imageTag('happyBirthday/denny2020.png').toHtml();
  } else {
    todaysCard = cl.imageTag(`happyBirthday/${today}.png`).toHtml();
  }

  $('.cardImage').prepend(todaysCard);
  $('span.cardImage > img').addClass('img-fluid');
}


// the jQuery template to render the list of names and birthdays
function listTemplate(reservations) {

  // const todayNew = moment();
  console.log("*** Today is: " + today);
  // const yesterday = moment(today).subtract(1, 'days');
  console.log("*** Yesterday is: " + yesterday);

  var compiled = '';
  reservations.forEach(item => {
    //this if statment will only add an item to list it the birthday is after yesterday's date defined above
    if (moment(item.birthday).isAfter(yesterday)) {
      compiled += `<tr>
      <td>${item.name}</td>
      <td>${moment.utc(item.birthday).format("MMMM DD, YYYY")}</td>
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

  console.log('the submitNewReservation function has been called');

  //getting the values from the input form and creating an object literal
  const newReservationData = {
    name: $('#name').val(),
    birthday: $('#birthday').val()
  }

  // if name and birthday inputs are both blank, user receive a pop up
  if (!newReservationData.name && !newReservationData.birthday) {
    swal.fire({
      title: 'Ummmm.....',
      text: 'You didn\'t enter anything!',
      confirmButtonText: 'Try Again',
      // type: 'error',
      // imageUrl: '../images/alert1.png',
      animation: false,
      imageWidth: 100,
      imageHeight: 100,
      backdrop: true,
    })
  }
  //checking for a name
  else if (!newReservationData.name) {
    swal.fire({
      title: 'Dang it!',
      text: 'You forgot to enter a name.  Please try again.',
      type: 'error',

      backdrop: true,
    })
  }
  //checking for a birthday
  else if (!newReservationData.birthday) {
    swal.fire({
      title: 'Dang it!',
      text: 'You forgot to enter a birthday.  Please try again.',
      type: 'error',

      backdrop: true,
    })
  }
  //checking to see if the date entered is between the start and end dates
  else if (moment(newReservationData.birthday).isSameOrBefore(startDate) || moment(newReservationData.birthday).isSameOrAfter(endDate)) {

    swal.fire({
      title: 'Dang it!',
      text: 'Please enter a birthday BETWEEN ' + startDateFormatted + ' and ' + endDateFormatted,
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

            swal.fire({
              title: 'Dang it!',
              text: 'That date is already taken.  Please try again.',
              type: 'error',

              backdrop: true,
            })

          } else {

            console.log("No match. ");
            isMatch = false;

          }

          //if a match is found the program will stop checking the rest of the reservations
          if (isMatch === true) {
            break;
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

              swal.fire({
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

//   swal.fire({
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

  const birthdayRules = ` (Enter a date between ${startDateFormatted} and ${endDateFormatted})`;

  const ruleTwo = `Today is: ${todayFormatted}.<p> So enter a date between ${startDateFormatted} and ${endDateFormatted}</p>`;

  $("#valid-dates").html(birthdayRules);
  $("#ruleTwo").html(ruleTwo);
}


//template literal for dynamic min and max dates in the birthday input
// date entered must be AFTER the min and BEFORE the max
function birthdayInput() {

  // reformatting start and end dates for min and max values
  // adding 1 day to startDate and subtracting 1 from endDate to restrict calendar dates available
  const inputStartDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
  const inputEndDate = moment(endDate).subtract(1, 'days').format("YYYY-MM-DD");

  var birthdayInput = `<input type="date" class="form-control" name="birthday" id="birthday" min="${inputStartDate}" max="${inputEndDate}">`;

  $('#valid-dates').after(birthdayInput);
}

// *********************************************************************
// Functions for the Current List section on the EDIT page
// *********************************************************************

function editListTemplate(reservations) {

  var editItems = '';
  reservations.forEach(item => {
    //this if statment will only add an item to list it the birthday is today or later
    if (moment(item.birthday).isAfter(yesterday)) {
      editItems += `
      <li class="list-group-item">
      <form class="form-inline mb-0">
        <label for="name" class="mr-2">Name</label>
        <input type="text" class="form-control mr-2" id="name-${item._id}" value="${item.name}">

        <label for="birthday" class="mr-2">Birthday</label>

        <input type="date" class="form-control mr-2" id="birthday-${item._id}" value="${moment.utc(item.birthday).format("YYYY-MM-DD")}">
        
        <button type="button" class="btn btn-warning mr-2 hover" onclick="updateReservation('${item._id}')">
          <span class="hoverText">Edit</span>
          <i class="fas fa-edit" style="color: white"></i>
        </button>

        <button type="button" class="btn btn-danger hover" onclick="deleteReservation('${item._id}')">
          <span class="hoverText">Delete</span>
          <i class="far fa-trash-alt"></i>
        </button>
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

  let updatedBirthdayFormatted = moment(updatedReservation.birthday).format("YYYY-MM-DD");

  console.log("the updated birthday formatted: " + updatedBirthdayFormatted);

  // checking if both fields are blank
  if (!updatedReservation.name && !updatedReservation.birthday) {
    swal.fire({
      title: 'Ummmm.....',
      text: 'You can\'t leave those blank!',
      type: 'error',

      backdrop: true,
    })
  }
  //checking for a name
  else if (!updatedReservation.name) {
    swal.fire({
      title: 'Dang it!',
      text: 'You must enter a name.  Please try again.',
      type: 'error',

      backdrop: true,
    })
    //checking for a birthday
  } else if (!updatedReservation.birthday) {
    swal.fire({
      title: 'Dang it!',
      text: 'You must enter a birthday.  Please try again.',
      type: 'error',

      backdrop: true,
    })
    // checking to see if the date entered is between the start and end dates
    // Date range for editing will be today up to the endDate
  } else if (moment(updatedBirthdayFormatted).isBefore(today) || moment(updatedBirthdayFormatted).isSameOrAfter(endDate)) {

    swal.fire({
      title: 'Dang it!',
      text: 'Please enter a birthday between ' + yesterday + ' and ' + endDate,
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
          console.log("Trying to change to this birthday: " + updatedBirthdayFormatted);

          const beforeChange = moment.utc($("#birthday-" + updateId).val()).format("YYYY-MM-DD");
          console.log(beforeChange);

          // checks to see if the updated birthday matches any birthday that is already in the list, except for the birthday in that entry.  
          // This allows the user to edit the name and keep the birthday the same. 
          if (moment.utc(reservations[i].birthday).format("YYYY-MM-DD") === updatedBirthdayFormatted && updatedBirthdayFormatted != beforeChange) {
            console.log("Match!!!!  that date is already taken");
            isMatch = true;

            swal.fire({
              title: 'Dang it!',
              text: 'That date is already taken. No updates made. Please try again.',
              type: 'error',

              backdrop: true,
            })

            break;

          } else {

            console.log("No match. ");
            isMatch = false;

          }
        }

        if (!isMatch) {

          swal.fire({
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

                  swal.fire({
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

              swal.fire(
                'Cancelled',
                'Reservation has NOT been updated.',
                'error'
              )
            }
          })
        }
      })
  }
}
// End of function updateReservation(_id)


// DELETE: to delete an existing post
function deleteReservation(_id) {
  console.log(_id + " is being deleted");

  swal.fire({
    title: 'Are you sure you want to delete this reservation?',
    text: "please be careful",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {

      //$.ajax() for the DELETE method 
      return $.ajax({
          type: 'DELETE',
          url: '/reservations/' + _id,
          dataType: 'json',
          contentType: 'application/json',
        })
        .done(function (response) {
          console.log(_id, " has been deleted.");

          swal.fire(
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
      swal.fire(
        'Cancelled',
        'Reservation has NOT been deleted.',
        'error'
      )
    }
  })
}

// *********************************************************************
// Functions for scrollToTop button
// *********************************************************************

// When the user scrolls down 200px from the top of the document, the button will become visible
window.onscroll = function () {
  topScroll()
};

function topScroll() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    document.getElementById("scrollToTop").style.display = "block";
  } else {
    document.getElementById("scrollToTop").style.display = "none";
  }
}

// scrolls to the top of the document. 
function scrollToTop() {
  document.body.scrollTop = 0; // Safari
  document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
}