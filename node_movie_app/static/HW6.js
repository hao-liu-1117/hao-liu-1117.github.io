function switchContent(content_name, button_name) {
  resetResults();
  var contents = document.getElementsByClassName("content");
  var i;
  // set content to be displayed.
  for (i = 0; i < contents.length; i++) {
    contents[i].style.display = "none";
  }
  document.getElementById(content_name).style.display = "block";
  document.getElementById('SearchResults').style.display = "none";

  // set button text color.
  var buttons = document.getElementsByClassName("navbutton");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].style.color = "white";
    buttons[i].style.borderBottom = "0px solid white";
  }
  document.getElementById(button_name).style.color = "red";
  document.getElementById(button_name).style.borderBottom = "1px solid white";
  // resume fade-in fade-out show.
  if (content_name=='Home') {
    var trending_img = document.getElementById('trendingimg');
    var airing_img = document.getElementById('airingimg');
    if (trending_img.classList.contains('fade-out')) {
      trending_img.classList.remove('fade-out');
    }
    if (airing_img.classList.contains('fade-out')) {
      airing_img.classList.remove('fade-out');
    }
    trending_img.classList.add('fade-in');
    airing_img.classList.add('fade-in');
  }
}

function search() {
  // reset search result before next search.
  resetResults();

  var keyword = document.getElementById("keyword").value;
  var category = document.getElementById("category").value;

  // show result list
  document.getElementById('SearchResults').style.display = "block";
  console.log(keyword);
  console.log(category);
  if (keyword==null || keyword.length==0 || category.length==0) {
    alert("Please enter valid values.");
    return;
  }
  let movie_url = "/search/movie/" + keyword;
  let tv_url = "/search/tv/" + keyword;
  let multi_url = "/search/multi/" + keyword;

  if (category=="Movies") {
    SearchMovie(movie_url);
  }
  if (category=="TVShows") {
    SearchMovie(tv_url);
  }
  if (category=="All") {
    SearchMovie(multi_url);
  }
}

function SearchMovie(movie_url) {
  let request = new XMLHttpRequest();
  try {
    request.open("GET", movie_url, async=false);
    request.send(null);
    if (request.readyState==4 && request.status==200) {
      let movie_res = JSON.parse(request.responseText);
      // console.log(movie_res);
      console.log('fetch ok');
      buildList(movie_res)
    }
  } catch (e) {
    alert("Error Happened!");
  }
}

function buildList(data) {
  var res = document.getElementById('SearchResults');
  var i;
  for (i = 0; i < data.length; i++) {
    buildItem(res, data[i]);
  }
}

function buildItem(res, data) {
  var item = document.createElement('div');
  item.classList.add('reslist');
  // set red bar.
  var redbar = document.createElement('div');
  redbar.classList.add('redbar');
  item.appendChild(redbar);
  // set image.
  var img = document.createElement('img');
  img.setAttribute('src', data['poster_path']);
  img.setAttribute('onerror', "this.src='https://bytes.usc.edu/cs571/s21_JSwasm00/hw/HW6/imgs/movie-placeholder.jpg'");
  item.appendChild(img);
  // set list title.
  var title = document.createElement('p');
  title.classList.add('listtitle');
  if (data['media_type']=='movie') {
    title.innerHTML = data['title'];
  }
  else if (data['media_type']=='tv') {
    title.innerHTML = data['name'];
  }
  item.appendChild(title);
  // set year and genre.
  var genre = document.createElement('p');
  genre.classList.add('listgenre');
  // get genre by calling /movie/details/
  genre_list = getMovieGenreById(data);
  var genre_str = "";
  if ('release_date' in data) {
    genre_str += data['release_date'].substr(0, 4) + ' | ';
  }
  else if ('first_air_date' in data) {
    genre_str += data['first_air_date'].substr(0, 4) + ' | ';
  } 
  for (let j = 0; j < genre_list.length; j++) {
    genre_str += genre_list[j];
    if (j != genre_list.length-1) {
      genre_str += ', ';
    }
  }
  genre.innerHTML = genre_str;
  item.appendChild(genre);
  // set star and votes.
  var vote = document.createElement('p');
  vote.classList.add('listvote');
  vote.setAttribute('style', "color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;");
  var vote_str = '<span style="color: red;">&bigstar; ' + data['vote_average'] + '/5' + '</span> ' + data['vote_count'] + ' votes';
  vote.innerHTML = vote_str;
  item.appendChild(vote);
  // set overview.
  var view = document.createElement('p');
  view.classList.add('listview');
  view.innerHTML = data['overview'];
  item.appendChild(view);
  // set show more button with 'media_type' and 'id'.
  var more = document.createElement('button');
  more.classList.add('listbutton');
  more.setAttribute('onclick', "popup(" + "'" + data['media_type'] + "'" + "," + data['id'] + ")");
  more.innerHTML = 'Show more';
  item.appendChild(more);

  // append to final result
  res.appendChild(item);
}

function getMovieGenreById(data) {
  let request = new XMLHttpRequest();
  var arr_list = [];
  try {
    if (data['media_type']=='movie') {
      request.open("GET", '/movie/details/' + data['id'], async=false);
    }
    else if (data['media_type']=='tv') {
      request.open("GET", '/tv/details/' + data['id'], async=false);
    }
    request.send(null);
    if (request.readyState==4 && request.status==200) {
      let res = JSON.parse(request.responseText);
      let j = 0;
      for (; j < res['genres'].length; j++) {
        arr_list.push(res['genres'][j]['name']);
      }
    }
  } catch (e) {
    alert("Error Happened!");
  }
  return arr_list;
}

function popup(media_type, id) {
  var item = document.getElementById('modal');
  // reset modal content.
  item.innerHTML = "";
  // get data
  let request = new XMLHttpRequest();
  try {
    if (media_type=='movie') {
      request.open("GET", '/movie/details/' + id, async=false);
    }
    else if (media_type='tv') {
      request.open("GET", '/tv/details/' + id, async=false);
    }
    request.send(null);
    if (request.readyState==4 && request.status==200) {
      let res = JSON.parse(request.responseText);
      console.log("start build modal");
      buildModal(res);
      console.log("build finished");
      item.style.display = "block";
    }
  } catch (e) {
    alert("Error Happened!");
  }
}

function buildModal(data) {
  var modal = document.getElementById('modal');
  modal.innerHTML = "";
  console.log("build backdrop image");
  // build backdrop image.
  var img = document.createElement('img');
  img.classList.add('backdrop');
  img.setAttribute('src', data['backdrop_path']);
  img.setAttribute('onerror', "this.src='https://bytes.usc.edu/cs571/s21_JSwasm00/hw/HW6/imgs/movie-placeholder.jpg'");
  modal.appendChild(img);
  
  console.log("add close tab");
  // add close tab.
  var close_tab = document.createElement('span');
  close_tab.classList.add('close');
  close_tab.setAttribute('onclick', "closeModal()");
  close_tab.innerHTML = "&times";
  modal.appendChild(close_tab);

  console.log("add modal title");
  // add modal title.
  var modal_title = document.createElement('p');
  modal_title.classList.add('modaltitle');
  if (data['media_type']=='movie') {
    modal_title.innerHTML = data['title'] + '<span class="moreinfo" onclick="window.open(' + "'" + data['homepage'] + "'" +')">&#9432;</span>';
  }
  else if (data['media_type']=='tv') {
    modal_title.innerHTML = data['name'] + '<span class="moreinfo" onclick="window.open(' + "'" + data['homepage'] + "'" +')">&#9432;</span>';
  }
  modal.appendChild(modal_title);

  console.log("add modal genre");
  // add modal genre
  var modal_genre = document.createElement('p');
  modal_genre.classList.add('modalgenre');
  var genre_str = ""
  genre_list = getMovieGenreById(data);
  if ('release_date' in data) {
    genre_str += data['release_date'].substr(0, 4) + ' | ';
  }
  else if ('first_air_date' in data) {
    genre_str += data['first_air_date'].substr(0, 4) + ' | ';
  } 
  for (let j = 0; j < genre_list.length; j++) {
    genre_str += genre_list[j];
    if (j != genre_list.length-1) {
      genre_str += ', ';
    }
  }
  modal_genre.innerHTML = genre_str;
  modal.appendChild(modal_genre);

  console.log("add modal vote");
  // add modal vote
  var modal_vote = document.createElement('p');
  modal_vote.classList.add('modalvote');
  modal_vote.innerHTML = '<span style="color: red;">&bigstar; ' + data['vote_average'] + '/5 </span> ' + data['vote_count'] + 'votes';
  modal.appendChild(modal_vote);

  console.log("add modal view");
  // add modal view
  var modal_view = document.createElement('p');
  modal_view.classList.add('modalview');
  modal_view.innerHTML = data['overview'];
  modal.appendChild(modal_view);

  console.log("add modal languages");
  // add modal language
  var modal_language = document.createElement('p');
  modal_language.classList.add('modallanguage');
  var language_str = "Spoken languages: ";
  for (let j = 0; j < data['spoken_languages'].length; j++) {
    language_str += data['spoken_languages'][j]['english_name'];
    if (j!=data['spoken_languages'].length-1) {
      language_str += ', ';
    }
  }
  modal_language.innerHTML = language_str;
  modal.appendChild(modal_language);

  console.log("add modal cast title");
  // add modal cast title
  var modal_cast_title = document.createElement('p');
  modal_cast_title.classList.add('modalcasttitle');
  modal_cast_title.innerHTML = 'Cast';
  modal.appendChild(modal_cast_title);

  console.log("add modal cast");
  // add cast
  var cast_div = document.createElement('div');
  cast_div.setAttribute('id', 'modalcast');
  var cast_url;
  var cast_list;
  if (data['media_type']=='movie') {
    cast_url = '/movie/credits/' + data['id'];
  }
  else if (data['media_type']=='tv') {
    cast_url = '/tv/credits/' + data['id'];
  }
  cast_list = getContent(cast_url);
  for (let j=0; j < cast_list.length; j++) {
    var cast_item = document.createElement('div');
    cast_item.classList.add('castitem');
    // set cast image
    var cast_img = document.createElement('img');
    cast_img.setAttribute('src', cast_list[j]['profile_path']);
    cast_img.setAttribute('onerror', "this.src='https://bytes.usc.edu/cs571/s21_JSwasm00/hw/HW6/imgs/person-placeholder.png'");
    cast_item.appendChild(cast_img);
    // set cast name
    var cast_name = document.createElement('p');
    cast_name.classList.add('castname');
    cast_name.innerHTML = cast_list[j]['name'];
    cast_item.appendChild(cast_name);
    // set cast AS
    var cast_as = document.createElement('p');
    cast_as.classList.add('castAS');
    cast_as.innerHTML = "AS";
    cast_item.appendChild(cast_as);
    // set cast character
    var cast_who = document.createElement('p');
    cast_who.classList.add('castwho');
    cast_who.innerHTML = cast_list[j]['character'];
    cast_item.appendChild(cast_who);
    // append cast_item to cast div
    cast_div.appendChild(cast_item);
  }
  modal.appendChild(cast_div);

  console.log("add modal review title");
  // add modal review title
  var modal_review_title = document.createElement('p');
  modal_review_title.setAttribute('id', 'reviewtitle');
  modal_review_title.innerHTML = 'Reviews';
  modal.appendChild(modal_review_title);

  console.log("add modal reivew");
  // add review
  var review_div = document.createElement('div');
  review_div.setAttribute('id', 'review');
  var review_url;
  var review_list;
  if (data['media_type']=='movie') {
    review_url = '/movie/reviews/' + data['id'];
  }
  else if (data['media_type']=='tv') {
    review_url = '/tv/reviews/' + data['id'];
  }
  review_list = getContent(review_url);
  console.log("review_list length is: " + review_list.length);
  console.log("this moviw id is: " + data['id']);
  for (let j = 0; j < review_list.length; j++) {
    var review_item = document.createElement('div');
    review_item.classList.add('reviewitem');
    // set review name
    var review_name = document.createElement('div');
    review_name.classList.add('reviewname');
    var review_name_str = '<span style="font-weight: bold;">' + review_list[j]['username'] + '</span> on ';
    review_name_str += review_list[j]['created_at'].substr(5,2) + '/' + review_list[j]['created_at'].substr(8,2) + '/' + review_list[j]['created_at'].substr(0,4);
    review_name.innerHTML = review_name_str;
    review_item.appendChild(review_name);
    // set review star
    if ('rating' in review_list[j]) {
      var review_vote = document.createElement('p');
      review_vote.classList.add('ratingvote');
      review_vote.innerHTML = '<span style="color: red;">&bigstar;' + review_list[j]['rating']+ '/5';
      review_item.appendChild(review_vote);
    }
    // set review content
    var review_content = document.createElement('div');
    review_content.classList.add('reviewcontent');
    review_content.innerHTML = '<p>' + review_list[j]['content'] + '</p>';
    review_item.appendChild(review_content);
    // set review border
    var review_line = document.createElement('div');
    review_line.classList.add('reviewline');
    review_item.appendChild(review_line);
    // add review_item to review div
    review_div.appendChild(review_item);
  }
  modal.appendChild(review_div);

  console.log("add blank block");
  // add blank block
  var empty_block = document.createElement('div');
  empty_block.classList.add('emptymodal');
  modal.appendChild(empty_block);
}

function getContent(url) {
  let request = new XMLHttpRequest();
  try {
    request.open("GET", url, async=false);
    request.send(null);
    if (request.readyState==4 && request.status==200) {
      let res = JSON.parse(request.responseText);
      return res;
    }
  } catch (e) {
    alert("Error Happened!");
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function resetResults() {
  document.getElementById('SearchResults').innerHTML = "<p style='color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;'>Showing Results...</p>";
}

function clear() {
  var keyword = document.getElementById("keyword");
  var category = document.getElementById("category");
  keyword.value = "";
  category.options[0].selected = true;
}

// show images on home page.
window.onload = function loadHome() {
  // get movie trending and tv airing data.
  let movie_req = new XMLHttpRequest();
  var movie_res;
  try {
    movie_req.open("GET", "/trending", async=false);
    movie_req.send(null);
    if (movie_req.readyState==4 && movie_req.status==200) {
      movie_res = JSON.parse(movie_req.responseText);
    }
  } catch (e) {
    alert("Error Happened!");
  }
  let tv_req = new XMLHttpRequest();
  var tv_res;
  try {
    tv_req.open("GET", "/airing", async=false);
    tv_req.send(null);
    if (tv_req.readyState==4 && tv_req.status==200) {
      tv_res = JSON.parse(tv_req.responseText);
    }
  } catch (e) {
    alert("Error Happened!");
  }
  var trending_img = document.getElementById('trendingimg');
  var trending_text = document.getElementById('trendingtext');
  var airing_img = document.getElementById('airingimg');
  var airing_text = document.getElementById('airingtext');
  if (trending_img.classList.contains("fade-out")) {
    trending_img.classList.remove("fade-out");
  }
  if (airing_img.classList.contains("fade-out")) {
    airing_img.classList.remove("fade-out");
  }
  var trending_img_list = []
  var trending_text_list = []
  var airing_img_list = []
  var airing_text_list = []
  for (let j = 0; j < 5; j++) {
    trending_img_list.push(movie_res[j]['backdrop_path']);
    trending_text_list.push(movie_res[j]['title']+'('+movie_res[j]['release_date'].substr(0,4)+')');
    airing_img_list.push(tv_res[j]['backdrop_path']);
    airing_text_list.push(tv_res[j]['name']+'('+tv_res[j]['first_air_date'].substr(0,4)+')');
  }
  trending_img.setAttribute('src', trending_img_list[0]);
  trending_text.innerHTML = trending_text_list[0];
  airing_img.setAttribute('src', airing_img_list[0]);
  airing_text.innerHTML = airing_text_list[0];
  var n_img = 1;
  function switchImage() {
    // fade out
    trending_img.classList.remove("fade-in");
    airing_img.classList.remove("fade-in");
    trending_img.classList.add("fade-out");
    airing_img.classList.add("fade-out");

    trending_img.addEventListener("transitionend", function changeTrending() {
      trending_img.removeEventListener("transitionend", changeTrending);
      trending_img.setAttribute('src', trending_img_list[n_img]);
      trending_text.innerHTML = trending_text_list[n_img];
      trending_img.classList.remove("fade-out");
      trending_img.classList.add("fade-in");
    });

    airing_img.addEventListener("transitionend", function changeAiring() {
      airing_img.removeEventListener("transitionend", changeAiring);
      airing_img.setAttribute('src', airing_img_list[n_img]);
      airing_text.innerHTML = airing_text_list[n_img];
      airing_img.classList.remove("fade-out");
      airing_img.classList.add("fade-in");
    })
    
    n_img++;
    if (n_img==5) {
      n_img = 0;
    }
  }
  setInterval(switchImage, 5000);
}
