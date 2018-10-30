import React, { Component } from 'react';
import logo from './movies-logo.png';
import './App.css';
import moviesList from './movies-list.json';
//import $ from "jquery";


class NavMenuItem extends Component {
  render() {
    return (
      <li>{this.props.menuItemName}</li>
    );
  }
}

class NavMenuCategories extends Component {
  render() {
    return (
      <nav className="nav-menu-cats-wrap">
        <h3>{this.props.categoryName}</h3>
        <ul>
        {this.props.menuItems.map(function(object, i){
            return <NavMenuItem menuItemName={object} key={i} />;
        })}
        </ul>
      </nav>
    );
  }
}

class NavMenu extends Component {
  render() {
    return (
      <div className="nav-menu-wrap">
        <a href="index.html" className="app-logo">
          <img src={logo} alt="app-logo" />
        </a>
        <NavMenuCategories categoryName={'Categories'} menuItems={['Action','Science Fiction','Drama','Music','Romance','Horror','Thriller','Fantasy','Animation']}  />
        <NavMenuCategories categoryName={'Type'} menuItems={['All','Coming Soon','New']}  />
      </div>
    );
  }
}

class MovieSearchBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      moviesFilter: ""
    }
  }

  handleChange = (e) => {
    this.setState({
      moviesFilter: e.target.value
    })

    this.props.onChangeFunction(e.target.value)
  }

  render() {
    return (
      <div className="search-bar-wrap">
        <div className="search-bar-icon">
          <i className="fa fa-search" ></i>
        </div>
        <div className="search-bar-inner">
          <input type="text" id="search-q" placeholder="Search for your favorite movie" value={this.state.moviesFilter}  onChange={this.handleChange} />
        </div>
      </div>
    );
  }
}

class SingleMovie extends Component {
  render() {

    let movieType;

    if ( this.props.movieData.Type.length > 0 ) {
      movieType = <span className="movie-type">{this.props.movieData.Type}</span>;
    }

    return (
      <div className="single-movie-wrap">
        <a className="popup-youtube" href={this.props.movieData.Trailer}>
          <div className="single-movie-inner">
            <div className="single-movie-img-outer">
              <img src={this.props.movieData.Image} alt={this.props.movieData.name} />
              {movieType}
            </div>
            <h3>{this.props.movieData.name} <span>({this.props.movieData.Year})</span></h3>
            <div className="single-movie-meta">
              <span>{this.props.movieData.Genre}</span>
              <span className="duration">{this.props.movieData.Duration}</span>
            </div>
          </div>
        </a>
      </div>
    );
  }
}

class MoviesList extends Component {
  render() {

    let displayedMovies = this.props.movies;

    const moviesArray = [];
    Object.keys(displayedMovies).forEach(function(key) {
      if ( ! displayedMovies[key]['name'] ) {
        displayedMovies[key]['name'] = key;
      }
      moviesArray.push(displayedMovies[key]);
    });


    return (
      <div className="movie-list-wrap">
        {moviesArray.map(function(object, i){
            return <SingleMovie movieData={object} key={i} />;
        })}

      </div>
    );
  }
}

class ContentWrap extends Component {

  constructor() {
    super()
    this.state = {
      moviesList: [],
      filteredMovies: [],
      moviesFilter: ""
    }
  }

  componentWillMount() {
    this.setState({
      moviesList:moviesList,
      filteredMovies: moviesList
    })
  }

  handleFilterChange = (inputVal) => {
    let filteredMovies = [];
    const allMovies = this.state.moviesList;

    Object.keys(allMovies).forEach(function(key) {

      let movieName = key.toLowerCase();
      let searchq = inputVal.toLowerCase();

      if ( movieName.indexOf(searchq) !== -1 ) {
        allMovies[key]['name'] = key;
        filteredMovies.push(allMovies[key]);
      }

    });

    this.setState({
      moviesFilter: inputVal,
      filteredMovies: filteredMovies
    })
    
  }

  render() {
    return (
      <div className="movie-trailer-app-content">
        <MovieSearchBar onChangeFunction={this.handleFilterChange} />
        <MoviesList movies={this.state.filteredMovies} match={this.props.match}  />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="movie-trailer-app">
        <NavMenu />
        <ContentWrap />
      </div>
    );
  }
}

export default App;
