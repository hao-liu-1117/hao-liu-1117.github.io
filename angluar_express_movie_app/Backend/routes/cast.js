const express = require('express');
const router = express.Router();
const axios = require('axios');

const api_key = "14e0bae7c398f34a8ec8cc20ef06c1c7";

router.get('/details/:id', (req, res) => {
  let id  = req.params.id;
  let url = "https://api.themoviedb.org/3/person/" +
            id +
            "?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data;
    var ret = {};
    ret['birthday'] = data['birthday'];
    ret['gender'] = "undefined";
    if ('gender' in data) {
      if (data['gender']==1) {ret['gender'] = "female";}
      if (data['gender']==2) {ret['gender'] = "male";}
    }
    ret['name'] = data['name'];
    ret['homepage'] = data['hoomepage'];
    ret['also_known_as'] = data['also_known_as'];
    ret['known_for_department'] = data['known_for_department'];
    ret['biography'] = data['biography'];
    ret['place_of_birth'] = data['place_of_birth'];
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

router.get('/external/:id', (req, res) => {
  let id = req.params.id;
  let url = "https://api.themoviedb.org/3/person/" +
            id +
            "/external_ids?api_key=" +
            api_key +
            "&language=en-US&page=1";
  axios.get(url).then(posts => {
    let data = posts.data;
    var ret = {};
    ret['imdb_url'] = "https://imdb.com";
    if (data['imdb_id'] != null) {ret['imdb_url'] = "https://imdb.com/name/" + data['imdb_id'];}
    ret['facebook_url'] = "https://facebook.com";
    if (data['facebook_id'] != null) {ret['facebook_url'] = "https://facebook.com/" + data['facebook_id'];}
    ret['instagram_url'] = "https://instagram.com";
    if (data['instagram_id'] != null) {ret['instagram_url'] = "https://instagram.com/" + data['instagram_id'];}
    ret['twitter_url'] = "https://twitter.com";
    if (data['twitter_id'] != null) {ret['twitter_url'] = "https://twitter.com/" + data['twitter_id'];}
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
})

module.exports = router;