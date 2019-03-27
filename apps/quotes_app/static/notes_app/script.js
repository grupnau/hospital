initialize();

$('#post_quote').submit(function(e){
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
            $('#wrapper_quotes').html(renderNotes(response));
        }
    });
    $(this)[0].reset();
})

$('#quotes').on("click", "#add_to_fav", function(){
    let quote_obj = {
        id: $('span').innerText
    }
    $(this).add_quote(quote_obj)

    //can't get this to run to refresh the quotes on the left
    $.ajax({
        url: 'refresh',
        method:'get',
        success: function(response){
            $('#wrapper_quotes').html(renderNotes(response));
        }
    })

});

$('#quotes').on("click", "#rm_fm_fav", function(e){
    let quote_obj = {
        id: $('span').innerText
    }
    $(this).delete_quote(quote_obj)
});

$('#quotes').on("click", "#rm_fm_fav", function(e){
    let quote_obj = {
        id: $('span').innerText
    }
    $(this).delete_quote(quote_obj)
});

function initialize(){
    $.ajax({
        url: 'quotes/initialize',
        method: 'get',
        success: function(response){
            initialize2();
            $('#wrapper_quotes').html(renderNotes(response));
        }
    })
}

//I used multiple initializes becuz I couldn't
//separate my loading of regular quotes vs favorite_quotes
function initialize2(){
    $.ajax({
        url: 'quotes/initialize2',
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
        url: 'quotes/initialize3',
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
function renderNotes(quotes){
    let el = document.createElement('div');
    el.setAttribute("class", "wrapper_quotes");
    for(let i=0;i<quotes.length;i++){
        var quote = document.createElement('div');
        quote.setAttribute('class', 'quotes');

        //build content
        content = document.createElement('p');
        content.setAttribute("class", "quote_content")
        content.innerText = quotes[i].fields.content;
        quote.appendChild(content);

        //build quote_by
        quoted_by = document.createElement('p');
        quoted_by.setAttribute("class", "quoted_by")
        quoted_by.innerText = quotes[i].fields.quoted_by;
        quote.appendChild(quoted_by);

        //build created_at and user_tag
        at_by = document.createElement('div');
        at_by.setAttribute("class", "links");
        created = document.createElement('p')
        created.setAttribute("class", "link_p")
        date = quotes[i].fields.created_at.toString();
        date_formatted = date.substring(0, 10)
        created.innerText = "Posted on " + date_formatted + " by "

        user_tag = document.createElement('p')
        user_tag.setAttribute("id", "user_tag")
        user_tag.setAttribute("class", "link_p_s")
        user_tag.innerText = " "


        at_by.appendChild(created)
        at_by.appendChild(user_tag)
        quote.appendChild(at_by);

        // build hidden span for id
        id_span = document.createElement('span')
        id_span.innerText = quotes[i].pk;
        quote.appendChild(id_span);
        el.appendChild(quote);

        // build add button
        add_btn = document.createElement('button');
        add_btn.setAttribute("id", "add_to_fav")
        add_btn.innerText = "Add to My List";
        add_btn.addEventListener("click", function(){
            $.ajax({
                url: 'add_to_list/'+quotes[i].pk,
                method: 'get',
                success: function(response){
                    $('#faves_scroll').html(renderFaves(response));
                }
            })
        })
        quote.appendChild(add_btn);

    }
    return el;
}

//not sure if I needed separate functions for favorites
//vs. regular quotes, but it was the only way I could
//figure out how to separate them
function renderFaves(quotes){
    let el = document.createElement('div');
    el.setAttribute("class", "faves_scroll");
    for(let i=0;i<quotes.length;i++){
        var quote = document.createElement('div');
        quote.setAttribute('class', 'quotes');

        //build content p
        content = document.createElement('p');
        content.setAttribute("class", "quote_content")
        content.innerText = quotes[i].fields.content;
        quote.appendChild(content);

        //build quote_by
        quoted_by = document.createElement('p');
        quoted_by.setAttribute("class", "quoted_by")
        quoted_by.innerText = quotes[i].fields.quoted_by;
        quote.appendChild(quoted_by);

        //build created_at and user_tag
        at_by = document.createElement('div');
        at_by.setAttribute("class", "links");
        created = document.createElement('p')
        created.setAttribute("class", "link_p")
        date = quotes[i].fields.created_at.toString();
        date_formatted = date.substring(0, 10)
        created.innerText = "Posted on " + date_formatted + " by "

        user_tag = document.createElement('p')
        user_tag.setAttribute("id", "user_tag")
        user_tag.setAttribute("class", "link_p_s")
        user_tag.innerText = " "


        at_by.appendChild(created)
        at_by.appendChild(user_tag)
        quote.appendChild(at_by);

        // build hidden span for id
        id_span = document.createElement('span')
        id_span.innerText = quotes[i].pk;
        quote.appendChild(id_span);
        el.appendChild(quote);

        // build delete button
        rm_btn = document.createElement('button');
        rm_btn.setAttribute("id", "rm_fm_fav")
        rm_btn.innerText = "Remove Quote";
        rm_btn.addEventListener("click", function(){
            $.ajax({
                url: 'rm_fm_list/'+quotes[i].pk,
                method: 'get',
                success: function(response){
                    $('#faves_scroll').html(renderFaves(response));
                }
            })
        })
        quote.appendChild(rm_btn);
    }
    return el;
}

//I wanted this function to refresh the left quotes
//but I couldn't get that to happen even with callbacks
function add_quote(quote_id){
    $.ajax({
        url: 'add_to_list/'+quote_id,
        method:'get',
        success: function(response){
            $('#faves_scroll').html(renderFaves(response));
        }

    })
    refresh();
}

//my attempt to add a function that simply refreshes left quotes
//after one was added to favorites
function refresh(){
    $.ajax({
        url: 'refresh',
        method:'get',
        success: function(response){
            $('#wrapper_quotes').html(renderNotes(response));
        }

    })
}
function delete_quote(quote_id){
    $.ajax({
        url: 'rm_fm_list/'+quote_id,
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
