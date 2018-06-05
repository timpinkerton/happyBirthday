// the jQuery template to render the list of names and birthdays
function listItemTemplate(data) {
  var compiled = '';
  data.forEach(item => {
    compiled += `
      <li class="list-group-item">
        <strong>${item.name}</strong> - ${item.birthday}
      </li>
    `;
  });
  return compiled;
}

// getReservations function will get the file list. 
function getReservations() {
  return $.ajax('/api/reservation')
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
      const data = {
        reservations: reservations
      };
      $('#list-container').html(listItemTemplate(data.reservations));
    })
}

function submitNewReservation() {
  console.log('the submitNewReservation function has been called!');

  //getting the values from the input form and creating an object literal
  const newReservationData = {
    id: $('#postId').val(),
    name: $('#name').val(),
    birthday: $('#birthday').val()
  };

  //If id (a post) already exist, method will be PUT and id is appended to the url. If not, it's a new POST
  let method, url;
  if (newReservationData.id) {
    method = 'PUT',
      url = '/api/reservation/' + newReservationData.id;
  } else {
    method = 'POST',
      url = '/api/reservation'
  }

  //.ajax() based on the method decided above (PUT or POST)
  $.ajax({
      type: method,
      url: url,
      data: JSON.stringify(newReservationData),
      dataType: 'json',
      contentType: 'application/json',
    })
    .done(function (response) {
      console.log("new post!");
      refreshReservationList();
    })
    .fail(function (error) {
      console.log("did not work!", error);
    });

  console.log('post data for the new post', newReservationData);

}