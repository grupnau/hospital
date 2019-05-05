function add_csrf_token(xhr, settings) {
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
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
      // Only send the token to relative URLs i.e. locally.
      xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
    }
  }
}

$("#selected_patient").on("submit", "#post_note", function(e) {
  e.preventDefault();

  let data_to_request = $(this).serialize();
  let user_object = {
    patient_id: $(this).children("input[name=patient_id]")[0].value,
    doctor_id: $(this).children("input[name=doctor_id]")[0].value
  };

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      return add_csrf_token(xhr, settings);
    }
  });
  $.ajax({
    url: "create",
    method: "post",
    data: data_to_request,
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
  $(this)[0].reset();
});

$(".main--user_card").on("click", function() {
  let user_ids = $(this).children("span");
  let user_object = {
    patient_id: user_ids[0].innerText,
    doctor_id: user_ids[1].innerText
  };

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      return add_csrf_token(xhr, settings);
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
