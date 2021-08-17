const express = require('express');
const router = express.Router();
const axios = require('axios');
const { route } = require('./search');

const api_key = "14e0bae7c398f34a8ec8cc20ef06c1c7";
const default_key = "tzkWB85ULJY";

router.get('/current', (req, res) => {
  let url = "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    let max_count = 0;
    var ret = [];
    for (let i = 0; i < data.length; i++) {
      let single = {};
      let cur = data[i];
      single['id'] = cur['id'];
      single['title'] = cur['title'];
      single['backdrop_path'] = null;
      if (cur['backdrop_path']!=null) {
        single['backdrop_path'] = "https://image.tmdb.org/t/p/original" + cur['backdrop_path'];
      }
      else {continue;}
      ret.push(single);
      max_count++;
      if (max_count>=5) {break;}
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
});

router.get('/popular', (req, res) => {
  let url = "https://api.themoviedb.org/3/movie/popular?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    var ret = [];
    for (let i = 0; i < data.length; i++) {
      let single = {};
      let cur = data[i];
      single['id'] = cur['id'];
      single['title'] = cur['title'];
      single['poster_path'] = null;
      if (cur['poster_path']!=null) {
        single['poster_path'] = "https://image.tmdb.org/t/p/w500" + cur['poster_path'];
      }
      ret.push(single);
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
});

router.get('/top', (req, res) => {
  let url = "https://api.themoviedb.org/3/movie/top_rated?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    var ret = [];
    for (let i = 0; i < data.length; i++) {
      let single = {};
      let cur = data[i];
      single['id'] = cur['id'];
      single['title'] = cur['title'];
      single['poster_path'] = null;
      if (cur['poster_path']!=null) {
        single['poster_path'] = "https://image.tmdb.org/t/p/w500" + cur['poster_path'];
      }
      ret.push(single);
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/trending', (req, res) => {
  let url = "https://api.themoviedb.org/3/trending/movie/day?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    var ret = [];
    for (let i = 0; i < data.length; i++) {
      let single = {};
      let cur = data[i];
      single['id'] = cur['id'];
      single['title'] = cur['title'];
      single['poster_path'] = null;
      if (cur['poster_path']!=null) {
        single['poster_path'] = "https://image.tmdb.org/t/p/w500" + cur['poster_path'];
      }
      ret.push(single);
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/videos/:id', (req, res) => {
  let id = req.params.id;
  let url = "https://api.themoviedb.org/3/movie/" +
            id +
            "/videos?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    var ret = {};
    ret['id'] = id;
    ret['key'] = default_key;
    ret['site'] = null;
    ret['name'] = null;
    for (let i = 0; i < data.length; i++) {
      let cur = data[i];
      if (cur['site']!="YouTube") {continue;}
      ret['site'] = "YouTube";
      ret['name'] = cur['name'];
      ret['key'] = cur['key'];
      break;
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/details/:id', (req, res) => {
  let id = req.params.id;
  let url = "https://api.themoviedb.org/3/movie/" +
            id +
            "?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data;
    var ret = {};
    ret['name'] = data['title'];
    genre_str = "";
    for (let single of data['genres']) {
      genre_str += single["name"];
      genre_str += ", "
    }
    ret['genres'] = genre_str.slice(0, -2);
    if ('poster_path' in data) {
      ret['poster_path'] = "https://image.tmdb.org/t/p/w500" + data['poster_path'];
    } else if ('belongs_to_collection' in data && 'poster_path' in data['belongs_to_collection']) {
      ret['poster_path'] = "https://image.tmdb.org/t/p/w500" + data['belongs_to_collection']['poster_path'];
    } else if ('production_companies' in data && 'poster_path' in data['production_companies']['poster_path']) {
      ret['poster_path'] = "https://image.tmdb.org/t/p/w500" + data['production_companies']['poster_path'];
    }
    language_str = "";
    for (let single of data['spoken_languages']) {
      language_str += single['english_name'];
      language_str += ", ";
    }
    ret['spoken_languages'] = language_str.slice(0, -2);

    ret['release_date'] = data['release_date'].substring(0,4);
    mins = data['runtime'];
    hours = (Math.floor(mins/60));
    mins = mins % 60;
    ret['runtime'] = hours.toString() + "hrs " + mins.toString() + "mins";
    ret['overview'] = data['overview'];
    ret['vote_average'] = data['vote_average'];
    ret['tagline'] = data['tagline'];
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/cast/:id', (req, res) => {
  let id  = req.params.id;
  let url = "https://api.themoviedb.org/3/movie/" +
            id +
            "/credits?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.cast;
    var ret = [];
    for (let cast of data) {
      if (cast['profile_path']==null) {continue;}
      let single = {};
      single['id'] = cast['id'];
      single['name'] = cast['name'];
      single['character'] = cast['character'];
      single['profile_path'] = "https://image.tmdb.org/t/p/w500/" + cast['profile_path'];
      ret.push(single);
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/reviews/:id', (req, res) => {
  let id  = req.params.id;
  let url = "https://api.themoviedb.org/3/movie/" +
            id +
            "/reviews?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    var ret = [];
    let max_count = 0;
    for (let i = 0; i < data.length; i++) {
      let single = {};
      let review = data[i];
      single['author'] = review['author'];
      single['content'] = review['content'];
      single['created_at'] = review['created_at'];
      single['url'] = review['url'];
      single['rating'] = 0;
      if ('rating' in review['author_details'] && review['author_details']['rating']!=null) {
        single['rating'] = review['author_details']['rating'];
      }
      single['avatar_path'] = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU";
      if ('avatar_path' in review['author_details'] && review['author_details']['avatar_path']!=null) {
        let test_str = review['author_details']['avatar_path'];
        let head = test_str.substring(0, 9);
        if (head!="/https://") {
          single['avatar_path'] = "https://image.tmdb.org/t/p/original" + test_str;
        } else {
          single['avatar_path'] = test_str.substring(1);
        }
      }
      ret.push(single);
      max_count++;
      if (max_count>=10) {break;}
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/recommend/:id', (req, res) => {
  let id  = req.params.id;
  let url = "https://api.themoviedb.org/3/movie/" +
            id +
            "/recommendations?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    var ret = [];
    let max_count = 0;
    for (let mv of data) {
      let single = {};
      if (!'poster_path' in mv) {continue;}
      single['id'] = mv['id'];
      single['name'] = mv['title'];
      single['poster_path'] = "https://image.tmdb.org/t/p/w500" + mv['poster_path'];
      ret.push(single);
      max_count++;
      if (max_count>=24) {break;}
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/similar/:id', (req, res) => {
  let id  = req.params.id;
  let url = "https://api.themoviedb.org/3/movie/" +
            id +
            "/similar?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data.results;
    var ret = [];
    let max_count = 0;
    for (let mv of data) {
      let single = {};
      if (!'poster_path' in mv) {continue;}
      single['id'] = mv['id'];
      single['name'] = mv['title'];
      single['poster_path'] = "https://image.tmdb.org/t/p/w500" + mv['poster_path'];
      ret.push(single);
      max_count++;
      if (max_count>=24) {break;}
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

module.exports = router;