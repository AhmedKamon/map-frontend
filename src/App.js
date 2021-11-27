import { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import './App.css';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  //input value
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 23.685,
    longitude: 90.3563,
    zoom: 4,
  });

  useEffect(() => {
    const getPin = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPin();
  }, []);

  const handelMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handelAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({ lat, long });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post('/pins', newPin);
      setPins([...pins, res.data]);
      // setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };
  const handelLogout = () => {
    myStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/ahmed0/ckvqraaup7imm15qtlt7sbkfr"
        onDblClick={handelAddClick}
        transitionDuration="200"
      >
        {pins.map((p) => (
          <>
            <Marker
              key={p._id}
              latitude={p?.lat}
              longitude={p?.long}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <Room
                onClick={() => handelMarkerClick(p?._id, p?.lat, p?.long)}
                style={{
                  fontSize: viewport.zoom * 7,

                  color: p?.username === currentUser ? 'tomato' : '#7FFFD4',
                  cursor: 'pointer',
                }}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                latitude={p?.lat}
                longitude={p?.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label for="">Place</label>
                  <h4 className="place">{p?.title}</h4>
                  <label for="">Review</label>
                  <p className="desc">{p?.desc}</p>
                  <label for="">Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label for="">Information</label>
                  <span className="username">
                    Created by <b>{p?.username}</b>
                  </span>
                  <span className="date">{format(p?.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace?.lat}
            longitude={newPlace?.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="enter a title"
                  name=""
                  value={title}
                />
                <label>Review</label>
                <textarea
                  rows=""
                  placeholder="sonthing about this place"
                  cols=""
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button
                  className="submitBtn"
                  type="submit"
                  style={{ marginTop: '15px' }}
                >
                  Add Pin
                </button>
                {!currentUser && (
                  <span className="fail">
                    Please login or register to add pin
                  </span>
                )}
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button type="" className="btn logout" onClick={handelLogout}>
            Log Out
          </button>
        ) : (
          <div className="btns">
            <button
              type=""
              className="btn login"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              type=""
              className="btn register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
