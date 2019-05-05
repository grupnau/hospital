$("#selected_patient").on("submit", "#post_note", function(e) {
  e.preventDefault();

  let data_to_request = $(this).serialize();
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (
        settings.type == "POST" ||
        settings.type == "PUT" ||
        settings.type == "DELETE"
      ) {
        function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(
                  cookie.substring(name.length + 1)
                );
                break;
              }
            }
          }
          return cookieValue;
        }
        if (
          !(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))
        ) {
          // Only send the token to relative URLs i.e. locally.
          xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
        }
      }
    }
  });
  $.ajax({
    url: "create",
    method: "post",
    data: data_to_request,
    success: function(response) {
      $("#notes_container").html(renderPatient(response));
    }
  });
  $(this)[0].reset();
});

$("#user_card").on("click", function() {
  let user_object = {
    patient_id: $("#p_id")[0].innerText,
    doctor_id: $("#d_id")[0].innerText
  };
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (
        settings.type == "POST" ||
        settings.type == "PUT" ||
        settings.type == "DELETE"
      ) {
        function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == name + "=") {
                cookieValue = decodeURIComponent(
                  cookie.substring(name.length + 1)
                );
                break;
              }
            }
          }
          return cookieValue;
        }
        if (
          !(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))
        ) {
          // Only send the token to relative URLs i.e. locally.
          xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
        }
      }
    }
  });
  $.ajax({
    url: "show_patient",
    method: "post",
    data: user_object,
    success: function(patient_res) {
      $.ajax({
        url: "show_patient_notes",
        method: "post",
        data: user_object,
        success: function(notes_res) {
          user_object = {
            patient: JSON.parse(patient_res),
            notes: JSON.parse(notes_res)
          };
          $("#selected_patient").html(renderPatient(user_object));
        }
      });
    }
  });
});

$("#notes").on("click", "#add_to_fav", function() {
  let note_obj = {
    id: $("span").innerText
  };
  $(this).add_note(note_obj);

  //can't get this to run to refresh the notes on the left
  $.ajax({
    url: "refresh",
    method: "get",
    success: function(response) {
      $("#notes_container").html(renderNotes(response));
    }
  });
});

$("#notes").on("click", "#rm_fm_fav", function(e) {
  let note_obj = {
    id: $("span").innerText
  };
  $(this).delete_note(note_obj);
});

$("#notes").on("click", "#rm_fm_fav", function(e) {
  let note_obj = {
    id: $("span").innerText
  };
  $(this).delete_note(note_obj);
});

function initialize() {
  $.ajax({
    url: "initialize",
    method: "get",
    success: function(response) {
      $("#notes_container").html(renderNotes(response));
    }
  });
}

//I used multiple initializes becuz I couldn't
//separate my loading of regular notes vs favorite_notes
function initialize2() {
  $.ajax({
    url: "initialize2",
    method: "get",
    success: function(response) {
      initialize3();
      $("#faves_scroll").html(renderFaves(response));
    }
  });
}

//a replaceWith function to add the links is a bad way
//to do this but I couldn't get the program to recognize
//"posted_by" field in my model unless i sent it as a
//response, so I used a whole function for it
function initialize3() {
  $.ajax({
    url: "initialize3",
    method: "get",
    success: function(response) {
      user_info = response.match(/[a-zA-Z]+|[0-9]+/g);
      console.log(user_info);
      user_link = "http://localhost:8000/user/" + user_info[0];
      $("p#user_tag").replaceWith(
        "<a href=" + user_link + ">" + user_info[1] + "</a>"
      );
    }
  });
}

//no matter how hard I tried to get links here with
//correct urls, the fields wouldnt load in this area for
//some reason
function renderNotes(notes) {
  let el = document.createElement("div");
  el.setAttribute("class", "notes_container");
  for (let i = 0; i < notes.length; i++) {
    var note = document.createElement("div");
    note.setAttribute("class", "notes");

    //build content
    content = document.createElement("p");
    content.setAttribute("class", "note_content");
    content.innerText = notes[i].fields.content;
    note.appendChild(content);

    //build note_by
    noted_by = document.createElement("p");
    noted_by.setAttribute("class", "noted_by");
    noted_by.innerText = notes[i].fields.noted_by;
    note.appendChild(noted_by);

    //build created_at and user_tag
    at_by = document.createElement("div");
    at_by.setAttribute("class", "links");
    created = document.createElement("p");
    created.setAttribute("class", "link_p");
    date = notes[i].fields.created_at.toString();
    date_formatted = date.substring(0, 10);
    created.innerText = "Posted on " + date_formatted + " by ";

    user_tag = document.createElement("p");
    user_tag.setAttribute("id", "user_tag");
    user_tag.setAttribute("class", "link_p_s");
    user_tag.innerText = " ";

    at_by.appendChild(created);
    at_by.appendChild(user_tag);
    note.appendChild(at_by);

    // build hidden span for id
    id_span = document.createElement("span");
    id_span.innerText = notes[i].pk;
    note.appendChild(id_span);
    el.appendChild(note);

    // build add button
    add_btn = document.createElement("button");
    add_btn.setAttribute("id", "add_to_fav");
    add_btn.innerText = "Add to My List";
    add_btn.addEventListener("click", function() {
      $.ajax({
        url: "add_to_list/" + notes[i].pk,
        method: "get",
        success: function(response) {
          $("#faves_scroll").html(renderFaves(response));
        }
      });
    });
    note.appendChild(add_btn);
  }
  return el;
}

//not sure if I needed separate functions for favorites
//vs. regular notes, but it was the only way I could
//figure out how to separate them
function renderFaves(notes) {
  let el = document.createElement("div");
  el.setAttribute("class", "faves_scroll");
  for (let i = 0; i < notes.length; i++) {
    var note = document.createElement("div");
    note.setAttribute("class", "notes");

    //build content p
    content = document.createElement("p");
    content.setAttribute("class", "note_content");
    content.innerText = notes[i].fields.content;
    note.appendChild(content);

    //build note_by
    noted_by = document.createElement("p");
    noted_by.setAttribute("class", "noted_by");
    noted_by.innerText = notes[i].fields.noted_by;
    note.appendChild(noted_by);

    //build created_at and user_tag
    at_by = document.createElement("div");
    at_by.setAttribute("class", "links");
    created = document.createElement("p");
    created.setAttribute("class", "link_p");
    date = notes[i].fields.created_at.toString();
    date_formatted = date.substring(0, 10);
    created.innerText = "Posted on " + date_formatted + " by ";

    user_tag = document.createElement("p");
    user_tag.setAttribute("id", "user_tag");
    user_tag.setAttribute("class", "link_p_s");
    user_tag.innerText = " ";

    at_by.appendChild(created);
    at_by.appendChild(user_tag);
    note.appendChild(at_by);

    // build hidden span for id
    id_span = document.createElement("span");
    id_span.innerText = notes[i].pk;
    note.appendChild(id_span);
    el.appendChild(note);

    // build delete button
    rm_btn = document.createElement("button");
    rm_btn.setAttribute("id", "rm_fm_fav");
    rm_btn.innerText = "Remove Note";
    rm_btn.addEventListener("click", function() {
      $.ajax({
        url: "rm_fm_list/" + notes[i].pk,
        method: "get",
        success: function(response) {
          $("#faves_scroll").html(renderFaves(response));
        }
      });
    });
    note.appendChild(rm_btn);
  }
  return el;
}

//I wanted this function to refresh the left notes
//but I couldn't get that to happen even with callbacks

function show_patient(id_obj) {
  $.ajax({
    url: show_patient,
    method: "post",
    data: id_obj,
    success: function(user_object) {
      $("#selected_patient").html(renderPatient(user_object));
    }
  });
}
function add_note(note_id) {
  $.ajax({
    url: "add_to_list/" + note_id,
    method: "get",
    success: function(response) {
      $("#faves_scroll").html(renderFaves(response));
    }
  });
  refresh();
}

//my attempt to add a function that simply refreshes left notes
//after one was added to favorites
function refresh() {
  $.ajax({
    url: "refresh",
    method: "get",
    success: function(response) {
      $("#notes_container").html(renderNotes(response));
    }
  });
}
function delete_note(note_id) {
  $.ajax({
    url: "rm_fm_list/" + note_id,
    method: "get",
    success: function(response) {
      initialize();
      $("#faves_scroll").html(renderFaves(response));
    }
  });
}

function renderPatient(user_object) {
  function formatDate(date) {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + " " + day + ", " + year;
  }
  patient = user_object.patient[0];
  doctor = user_object.patient[1];
  pat_obj = {
    id: patient.pk,
    fields: { ...patient.fields, password: undefined }
  };
  doc_obj = {
    id: doctor.pk,
    fields: { ...doctor.fields, password: undefined }
  };
  notes = user_object.notes;

  let el = document.createElement("div");
  el.setAttribute("class", "main--selected_container");
  el.style.height = "100%";

  let tile_upper = document.createElement("div");
  tile_upper.setAttribute("class", "main--tile_info_container");

  let head = document.createElement("div");
  head.setAttribute("class", "main--tile_info_head");
  head.innerText = pat_obj.fields.first_name + " " + pat_obj.fields.last_name;
  let patient_id = document.createElement("span");
  patient_id.innerText = pat_obj.id;
  head.appendChild(patient_id);

  tile_upper.appendChild(head);

  let content = document.createElement("div");
  content.setAttribute("class", "main--tile_info_content");
  let outer = document.createElement("div");
  outer.setAttribute("class", "main--patient_notes_outer");

  let card_container = document.createElement("div");
  card_container.setAttribute("class", "main--card_container_rev");
  card_container.setAttribute("id", "notes_container");
  if (notes.length)
    for (let i = 0; i < notes.length; i++) {
      let wrapper = document.createElement("div");
      wrapper.setAttribute("class", "main--card_border_wrapper_rev");

      let note = document.createElement("div");
      note.setAttribute("class", "main--user_card_rev");
      note.setAttribute("id", notes[i].pk);

      let number_container = document.createElement("div");
      number_container.setAttribute("class", "main--num_container");
      let number = document.createElement("div");
      number.setAttribute("class", "main--num");
      number.innerText = i + 1;
      number_container.appendChild(number);

      let note_content = document.createElement("p");
      note_content.setAttribute("class", "main--note_content");
      note_content.innerText = notes[i].fields.content;

      let note_date = document.createElement("p");
      note_date.setAttribute("class", "main--note_date");
      note_date.innerText = formatDate(new Date(notes[i].fields.created_at));

      note_id = document.createElement("span");
      note_id.innerText = notes[i].pk;
      note.appendChild(note_id);
      note.appendChild(number_container);
      note.appendChild(note_content);
      note.appendChild(note_date);
      wrapper.appendChild(note);
      card_container.appendChild(wrapper);
    }
  else {
    let no_notes = document.createElement("p");
    no_notes.innerText = "No notes found.";
    card_container.appendChild(no_notes);
  }
  outer.appendChild(card_container);
  content.appendChild(outer);
  tile_upper.appendChild(content);
  tile_upper.style.marginBottom = "1rem";

  //form
  let tile_lower = document.createElement("div");
  tile_lower.setAttribute("class", "main--tile_info_container");
  tile_lower.style.height = "31%";

  let form = document.createElement("form");
  form.setAttribute("id", "post_note");
  form.setAttribute("class", "main--tile_info_content");
  form.setAttribute("action", "create");
  form.setAttribute("method", "post");

  let doctor_id = document.createElement("input");
  doctor_id.setAttribute("type", "hidden");
  doctor_id.setAttribute("name", "doctor_id");
  doctor_id.setAttribute("value", doc_obj.id);

  let pat_id = document.createElement("input");
  pat_id.setAttribute("type", "hidden");
  pat_id.setAttribute("name", "patient_id");
  pat_id.setAttribute("value", pat_obj.id);

  let form_head = document.createElement("h3");
  form_head.setAttribute("class", "main--tile_info_head");
  form_head.innerText = "Post Note";

  let form_input_wrap = document.createElement("div");
  form_input_wrap.setAttribute("class", "doc--note_input");
  let form_input = document.createElement("textarea");
  form_input.setAttribute("class", "form-control");
  form_input.setAttribute("name", "content");
  form_input.setAttribute("placeholder", "Type note here...");
  form_input_wrap.appendChild(form_input);

  let form_button_wrap = document.createElement("div");
  form_button_wrap.setAttribute("class", "doc--note_button_container");
  let form_button = document.createElement("input");
  form_button.setAttribute("id", "post_note");
  form_button.setAttribute("class", "btn btn-primary main--button");
  form_button.setAttribute("type", "submit");
  form_button.setAttribute("name", "add_pat_note");
  form_button.setAttribute("value", "Post");
  form_button_wrap.appendChild(form_button);

  form.appendChild(doctor_id);
  form.appendChild(pat_id);
  form.appendChild(form_head);
  form.appendChild(form_input_wrap);
  form.appendChild(form_button_wrap);
  tile_lower.appendChild(form);
  el.appendChild(tile_upper);
  el.appendChild(tile_lower);

  return el;
}

// from django docs
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}
