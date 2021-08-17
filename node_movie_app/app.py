from flask import Flask, json, jsonify, request
import requests
api_key = "14e0bae7c398f34a8ec8cc20ef06c1c7"

app = Flask(__name__)

def parseMovie(cur):
  elem = dict()
  elem['id'] = cur['id']
  elem['title'] = cur['title']
  elem['overview'] = cur['overview']
  elem['poster_path'] = ''
  if 'poster_path' in cur and cur['poster_path']!=None:
    elem['poster_path'] = 'https://image.tmdb.org/t/p/original' + cur['poster_path']
  elem['release_date'] = ''
  if 'release_date' in cur:
    elem['release_date'] = cur['release_date']
  elem['vote_average'] = 0
  elem['vote_count'] = 0
  if 'vote_average' in cur:
    elem['vote_average'] = cur['vote_average']/2
    elem['vote_count'] = cur['vote_count']
  elem['genre_ids'] = cur['genre_ids']
  elem['media_type'] = 'movie'
  return elem

def parseTV(cur):
  elem = dict()
  elem['id'] = cur['id']
  elem['name'] = cur['name']
  elem['overview'] = cur['overview']
  elem['poster_path'] = ''
  if 'poster_path' in cur and cur['poster_path']!=None:
    elem['poster_path'] = 'https://image.tmdb.org/t/p/original' + cur['poster_path']
  elem['first_air_date'] = ''
  if 'first_air_date' in cur:
    elem['first_air_date'] = cur['first_air_date']
  elem['vote_average'] = 0
  elem['vote_count'] = 0
  if 'vote_average' in cur:
    elem['vote_average'] = cur['vote_average']/2
    elem['vote_count'] = cur['vote_count']
  elem['genre_ids'] = cur['genre_ids']
  elem['media_type'] = 'tv'
  return elem

@app.route('/', methods=['GET'])
def entry():
  print("received request")
  return app.send_static_file('HW6.html')

@app.route('/trending', methods=['GET'])
def getTrending():
  res = requests.get("https://api.themoviedb.org/3/trending/movie/week?api_key="
                     + api_key)
  data = res.json()
  return_arr = list()
  for i in range(5):
    elem = dict()
    elem['title'] = data['results'][i]['title']
    elem['backdrop_path'] = ''
    if 'backdrop_path' in data['results'][i] and data['results'][i]['backdrop_path']!=None:
      elem['backdrop_path'] = 'https://image.tmdb.org/t/p/original' + data['results'][i]['backdrop_path']
    elem['release_date'] = data['results'][i]['release_date']
    return_arr.append(elem)
  
  return json.dumps(return_arr)

@app.route('/airing', methods=['GET'])
def getAiring():
  res = requests.get("https://api.themoviedb.org/3/tv/airing_today?api_key="
                     + api_key)
  data = res.json()
  return_arr = list()
  for i in range(5):
    elem = dict()
    elem['name'] = data['results'][i]['name']
    elem['backdrop_path'] = ''
    if 'backdrop_path' in data['results'][i] and data['results'][i]['backdrop_path']!=None:
      elem['backdrop_path'] = 'https://image.tmdb.org/t/p/original' + data['results'][i]['backdrop_path']
    elem['first_air_date'] = data['results'][i]['first_air_date']
    return_arr.append(elem)

  return json.dumps(return_arr)

@app.route('/search/movie/<movie_query>', methods=['GET'])
def getMoive(movie_query):
  res = requests.get("https://api.themoviedb.org/3/search/movie?api_key="
                   + api_key + "&language=en-US&query="
                   + movie_query + "&page=1&include_adult=false")
  data = res.json()
  return_arr = list()
  for i in range(len(data['results'])):
    elem = parseMovie(data['results'][i])
    return_arr.append(elem)

  return json.dumps(return_arr)

@app.route('/search/tv/<tv_query>', methods=['GET'])
def getTV(tv_query):
  res = requests.get("https://api.themoviedb.org/3/search/tv?api_key="
                   + api_key + "&language=en-US&page=1&query="
                   + tv_query + "&include_adult=false")
  data = res.json()
  return_arr = list()
  for i in range(len(data['results'])):
    elem = parseTV(data['results'][i])
    return_arr.append(elem)

  return json.dumps(return_arr)
  
@app.route('/search/multi/<multi_query>', methods=['GET'])
def getMulti(multi_query):
  res = requests.get("https://api.themoviedb.org/3/search/multi?api_key="
                      + api_key + "&language=en-US&query="
                      + multi_query + "&page=1&include_adult=false")
  data = res.json()
  return_arr = list()
  for i in range(len(data['results'])):
    cur = data['results'][i]
    if 'media_type' not in cur:
      continue
    if cur['media_type']!='movie' and cur['media_type']!='tv':
      continue
    if cur['media_type']=='movie':
      return_arr.append(parseMovie(cur))
    if cur['media_type']=='tv':
      return_arr.append(parseTV(cur))
  
  return json.dumps(return_arr)

@app.route('/movie/details/<movie_id>', methods=['GET'])
def getMovieDetails(movie_id):
  res = requests.get("https://api.themoviedb.org/3/movie/"
                     + movie_id + "?api_key="
                     + api_key + "&language=en-US")
  data = res.json()
  return_dict = dict()
  if 'id' not in data:
    return json.dumps(retun_dict)
  cur = data
  return_dict['id'] = cur['id']
  return_dict['title'] = cur['title']
  return_dict['runtime'] = cur['runtime']
  return_dict['release_date'] = cur['release_date']
  return_dict['spoken_languages'] = cur['spoken_languages']
  return_dict['vote_average'] = cur['vote_average']/2
  return_dict['vote_count'] = cur['vote_count']
  return_dict['overview'] = cur['overview']
  return_dict['path'] = ''
  if 'poster_path' in cur and cur['poster_path']!=None:
    return_dict['path'] = 'https://image.tmdb.org/t/p/original' + cur['poster_path']
  return_dict['backdrop_path'] = ''
  if 'backdrop_path' in cur and cur['backdrop_path']!=None:
    return_dict['backdrop_path'] = 'https://image.tmdb.org/t/p/original' + cur['backdrop_path']
  return_dict['genres'] = cur['genres']
  return_dict['media_type'] = 'movie'
  if 'homepage' in cur:
    return_dict['homepage'] = cur['homepage']

  return json.dumps(return_dict)

@app.route('/movie/credits/<movie_id>', methods=['GET'])
def getMovieCredits(movie_id):
  print("get request")
  res = requests.get("https://api.themoviedb.org/3/movie/"
                     + movie_id + "/credits?api_key="
                     + api_key + "&language=en-US")
  data = res.json()
  return_arr = list()
  if 'id' not in data:
    return json.dumps(return_arr)
  for i in range(min(8, len(data['cast']))):
    cast = data['cast'][i]
    elem = dict()
    elem['name'] = cast['name']
    elem['profile_path'] = ''
    if 'profile_path' in cast and cast['profile_path']!=None:
      elem['profile_path'] = 'https://image.tmdb.org/t/p/original' + cast['profile_path']
    elem['character'] = cast['character']
    return_arr.append(elem)
  
  return json.dumps(return_arr)

@app.route('/movie/reviews/<movie_id>', methods=['GET'])
def getMovieReviews(movie_id):
  res = requests.get("https://api.themoviedb.org/3/movie/"
                     + movie_id + "/reviews?api_key="
                     + api_key + "&language=en-US&page=1")
  data = res.json()
  return_arr = list()
  if 'id' not in data:
    return json.dumps(return_arr)
  for i in range(min(5, len(data['results']))):
    review = data['results'][i]
    elem = dict()
    elem['username'] = review['author_details']['username']
    elem['content'] = review['content']
    if ('rating' in review['author_details'] and review['author_details']['rating']!=None):
      elem['rating'] = review['author_details']['rating']/2
    elem['created_at'] = review['created_at']
    return_arr.append(elem)

  return json.dumps(return_arr)

@app.route('/tv/details/<tv_show_id>', methods=['GET'])
def getTVDetails(tv_show_id):
  res = requests.get("https://api.themoviedb.org/3/tv/"
                     + tv_show_id + "?api_key="
                     + api_key + "&language=en-US")
  data = res.json()
  return_dict = dict()
  if 'id' not in data:
    return json.dumps(return_dict)
  return_dict['backdrop_path'] = ''
  cur = data
  if 'backdrop_path' in cur:
    return_dict['backdrop_path'] = 'https://image.tmdb.org/t/p/original' + cur['backdrop_path']
  return_dict['episode_run_time'] = cur['episode_run_time']
  return_dict['first_air_date'] = ''
  if 'first_air_date' in cur:
    return_dict['first_air_date'] = cur['first_air_date']
  return_dict['genres'] = cur['genres']
  return_dict['id'] = cur['id']
  return_dict['name'] = cur['name']
  return_dict['number_of_seasons'] = cur['number_of_seasons']
  return_dict['overview'] = cur['overview']
  return_dict['poster_path'] = ''
  if 'poster_path' in cur:
    return_dict['poster_path'] = 'https://image.tmdb.org/t/p/original' + cur['poster_path']
  return_dict['spoken_languages'] = cur['spoken_languages']
  return_dict['vote_average'] = cur['vote_average']/2
  return_dict['vote_count'] = cur['vote_count']
  return_dict['media_type'] = 'tv'
  if 'homepage' in cur:
    return_dict['homepage'] = cur['homepage']

  return json.dumps(return_dict)

@app.route('/tv/credits/<tv_show_id>', methods = ['GET'])
def getTVCredits(tv_show_id):
  res = requests.get("https://api.themoviedb.org/3/tv/"
                     + tv_show_id + "/credits?api_key="
                     + api_key + "&language=en-US")
  data = res.json()
  return_arr = list()
  if 'id' not in data:
    return json.dumps(return_arr)
  for i in range(min(8, len(data['cast']))):
    cast = data['cast'][i]
    elem = dict()
    elem['name'] = cast['name']
    elem['profile_path'] = ''
    if 'profile_path' in cast and cast['profile_path']!=None:
      elem['profile_path'] = 'https://image.tmdb.org/t/p/original' + cast['profile_path']
    elem['character'] = cast['character']
    return_arr.append(elem)
  
  return json.dumps(return_arr)
  
@app.route('/tv/reviews/<tv_show_id>', methods = ['GET'])
def getTVReviews(tv_show_id):
  res = requests.get("https://api.themoviedb.org/3/tv/"
                     + tv_show_id + "/reviews?api_key="
                     + api_key + "&language=en-US&page=1")
  data = res.json()
  return_arr = list()
  if 'id' not in data:
    return json.dumps(return_arr)
  for i in range(min(5, len(data['results']))):
    review = data['results'][i]
    elem = dict()
    elem['username'] = review['author_details']['username']
    elem['content'] = review['content']
    if ('rating' in review['author_details'] and review['author_details']['rating']!=None):
      elem['rating'] = review['author_details']['rating']/2
    elem['created_at'] = review['created_at']
    return_arr.append(elem)

  return json.dumps(return_arr)
