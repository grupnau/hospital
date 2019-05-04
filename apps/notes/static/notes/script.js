initialize();

$('#post_note').submit(function(e){
    e.preventDefault();
    let data_to_request = $(this).serialize();
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", window.CSRF_TOKEN);
            }
        }
    });
    $.ajax({
        url: e.target.action,
        method: 'post',
        data: data_to_request,
        success: function(response){
            $('#notes_container').html(renderNotes(response));
        }
    });
    $(this)[0].reset();
})

$('#notes').on("click", "#add_to_fav", function(){
    let note_obj = {
        id: $('span').innerText
    }
    $(this).add_note(note_obj)

    //can't get this to run to refresh the notes on the left
    $.ajax({
        url: 'refresh',
        method:'get',
        success: function(response){
            $('#notes_container').html(renderNotes(response));
        }
    })

});

$('#notes').on("click", "#rm_fm_fav", function(e){
    let note_obj = {
        id: $('span').innerText
    }
    $(this).delete_note(note_obj)
});

$('#notes').on("click", "#rm_fm_fav", function(e){
    let note_obj = {
        id: $('span').innerText
    }
    $(this).delete_note(note_obj)
});

function initialize(){
    $.ajax({
        url: 'notes/initialize',
        method: 'get',
        success: function(response){
            initialize2();
            $('#notes_container').html(renderNotes(response));
        }
    })
}

//I used multiple initializes becuz I couldn't
//separate my loading of regular notes vs favorite_notes
function initialize2(){
    $.ajax({
        url: 'notes/initialize2',
        method: 'get',
        success: function(response){
            initialize3();
            $('#faves_scroll').html(renderFaves(response));
        }
    })
}

 //a replaceWith function to add the links is a bad way
 //to do this but I couldn't get the program to recognize
 //"posted_by" field in my model unless i sent it as a
 //response, so I used a whole function for it
function initialize3(){
    $.ajax({
        url: 'notes/initialize3',
        method: 'get',
        success: function(response){
            user_info = response.match(/[a-zA-Z]+|[0-9]+/g)
            console.log(user_info);
            user_link = "http://localhost:8000/user/" + user_info[0]
            $('p#user_tag').replaceWith("<a href=" + user_link + ">" + user_info[1] + "</a>");
        }
    })
}

//no matter how hard I tried to get links here with
//correct urls, the fields wouldnt load in this area for
//some reason
function renderNotes(notes){
    let el = document.createElement('div');
    el.setAttribute("class", "notes_container");
    for(let i=0;i<notes.length;i++){
        var note = document.createElement('div');
        note.setAttribute('class', 'notes');

        //build content
        content = document.createElement('p');
        content.setAttribute("class", "note_content")
        content.innerText = notes[i].fields.content;
        note.appendChild(content);

        //build note_by
        noted_by = document.createElement('p');
        noted_by.setAttribute("class", "noted_by")
        noted_by.innerText = notes[i].fields.noted_by;
        note.appendChild(noted_by);

        //build created_at and user_tag
        at_by = document.createElement('div');
        at_by.setAttribute("class", "links");
        created = document.createElement('p')
        created.setAttribute("class", "link_p")
        date = notes[i].fields.created_at.toString();
        date_formatted = date.substring(0, 10)
        created.innerText = "Posted on " + date_formatted + " by "

        user_tag = document.createElement('p')
        user_tag.setAttribute("id", "user_tag")
        user_tag.setAttribute("class", "link_p_s")
        user_tag.innerText = " "


        at_by.appendChild(created)
        at_by.appendChild(user_tag)
        note.appendChild(at_by);

        // build hidden span for id
        id_span = document.createElement('span')
        id_span.innerText = notes[i].pk;
        note.appendChild(id_span);
        el.appendChild(note);

        // build add button
        add_btn = document.createElement('button');
        add_btn.setAttribute("id", "add_to_fav")
        add_btn.innerText = "Add to My List";
        add_btn.addEventListener("click", function(){
            $.ajax({
                url: 'add_to_list/'+notes[i].pk,
                method: 'get',
                success: function(response){
                    $('#faves_scroll').html(renderFaves(response));
                }
            })
        })
        note.appendChild(add_btn);

    }
    return el;
}

//not sure if I needed separate functions for favorites
//vs. regular notes, but it was the only way I could
//figure out how to separate them
function renderFaves(notes){
    let el = document.createElement('div');
    el.setAttribute("class", "faves_scroll");
    for(let i=0;i<notes.length;i++){
        var note = document.createElement('div');
        note.setAttribute('class', 'notes');

        //build content p
        content = document.createElement('p');
        content.setAttribute("class", "note_content")
        content.innerText = notes[i].fields.content;
        note.appendChild(content);

        //build note_by
        noted_by = document.createElement('p');
        noted_by.setAttribute("class", "noted_by")
        noted_by.innerText = notes[i].fields.noted_by;
        note.appendChild(noted_by);

        //build created_at and user_tag
        at_by = document.createElement('div');
        at_by.setAttribute("class", "links");
        created = document.createElement('p')
        created.setAttribute("class", "link_p")
        date = notes[i].fields.created_at.toString();
        date_formatted = date.substring(0, 10)
        created.innerText = "Posted on " + date_formatted + " by "

        user_tag = document.createElement('p')
        user_tag.setAttribute("id", "user_tag")
        user_tag.setAttribute("class", "link_p_s")
        user_tag.innerText = " "


        at_by.appendChild(created)
        at_by.appendChild(user_tag)
        note.appendChild(at_by);

        // build hidden span for id
        id_span = document.createElement('span')
        id_span.innerText = notes[i].pk;
        note.appendChild(id_span);
        el.appendChild(note);

        // build delete button
        rm_btn = document.createElement('button');
        rm_btn.setAttribute("id", "rm_fm_fav")
        rm_btn.innerText = "Remove Note";
        rm_btn.addEventListener("click", function(){
            $.ajax({
                url: 'rm_fm_list/'+notes[i].pk,
                method: 'get',
                success: function(response){
                    $('#faves_scroll').html(renderFaves(response));
                }
            })
        })
        note.appendChild(rm_btn);
    }
    return el;
}

//I wanted this function to refresh the left notes
//but I couldn't get that to happen even with callbacks
function add_note(note_id){
    $.ajax({
        url: 'add_to_list/'+note_id,
        method:'get',
        success: function(response){
            $('#faves_scroll').html(renderFaves(response));
        }

    })
    refresh();
}

//my attempt to add a function that simply refreshes left notes
//after one was added to favorites
function refresh(){
    $.ajax({
        url: 'refresh',
        method:'get',
        success: function(response){
            $('#notes_container').html(renderNotes(response));
        }

    })
}
function delete_note(note_id){
    $.ajax({
        url: 'rm_fm_list/'+note_id,
        method:'get',
        success: function(response){
            initialize();
            $('#faves_scroll').html(renderFaves(response));
        }
    })
}

// from django docs
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
