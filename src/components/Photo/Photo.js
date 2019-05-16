import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withContext } from "../../contexts/AppContext";

import "./Photo.css";

class Photo extends Component {
  state = {
    photo: {},
    isLoading: true,
    error: null
  };

  abortController = new AbortController();

  componentDidMount() {
    fetch(
      `https://jsonplaceholder.typicode.com/photos?id=${
        this.props.match.params.photoId
      }`,
      {
        signal: this.abortController.signal
      }
    )
      .then(response => response.json())
      .then(photo =>
        this.setState({ photo: photo[0], isLoading: false, error: null })
      )
      .catch(error =>
        this.setState({ error: error.message, isLoading: false })
      );
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  render() {
    const { photo, isLoading, error } = this.state;
    error && console.error(error);
    const {
      getUserDataByAlbumId,
      isLoading: isContextDataLoading
    } = this.props.appContext;

    const userData = getUserDataByAlbumId(photo.albumId);
    return (
      <div className="top-bar-fix">
        <div className="photo__display">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <img className="photo__img" src={photo.url} alt="fullsize" />
          )}
        </div>
        <div className="photo__info">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <h3 className="photo__info__title">{photo.title}</h3>
          )}
          {isContextDataLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <span className="photo__info__span"> by </span>
              <Link to={`/user/${userData !== undefined && userData.id}`}>
                <p className="photo__info__author">
                  {userData !== undefined && userData.username}
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default withContext(Photo);
