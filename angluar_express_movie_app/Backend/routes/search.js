const express = require('express');
const router = express.Router();
const axios = require('axios');

const api_key = "14e0bae7c398f34a8ec8cc20ef06c1c7";

router.get('/multi', (req, res) => {
  res.json({});
})

router.get('/multi/:query', (req, res) => {
  let query = req.params.query;
  let url = "https://api.themoviedb.org/3/search/multi?api_key=" + 
            api_key + "&language=enUS&query=" + 
            query;
  axios.get(url).then(posts => {
    let data = posts.data.results;
    let max_count = 0;
    var ret = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i]['backdrop_path']==null) {continue;}
      let media_type = data[i]['media_type'];
      if (media_type!='movie' && media_type!='tv') {continue;}

      let single = {};
      single['id'] = data[i]['id'];
      if (media_type=='movie') {single['name'] = data[i]['title'];}
      if (media_type=='tv') {single['name'] = data[i]['name'];}
      single['backdrop_path'] = null;
      if (data[i]['backdrop_path']!=null) {
        single['backdrop_path'] = "https://image.tmdb.org/t/p/w500" + data[i]['backdrop_path'];
      }
      single['media_type'] = media_type;
      ret.push(single);
      max_count++;
      if (max_count>=7) {break;}
    }
    res.json(ret);
  }).catch(err => {
    res.send(err);
  })
});

module.exports = router;