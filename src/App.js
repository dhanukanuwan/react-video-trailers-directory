import React, { Component } from 'react';
import logo from './movies-logo.png';
import './App.css';
import moviesList from './movies-list.json';
//import $ from "jquery";


class NavMenuItem extends Component {

  constructor() {
    super()
    this.state = {
      clickedItemType: "",
      clickedItemText: ""
    }
  }

  handleClick = (e) => {

    const filterType = e.target.innerText.toLowerCase();
    const filterMethod = e.target.getAttribute("method").toLowerCase();
    const filterData = [filterType, filterMethod];

    this.setState({
      clickedItemType: filterMethod,
      clickedItemText: filterType
    })

    this.props.onClickFunction( filterData );

  }

  render() {
    return (
      <li method={this.props.method} onClick={this.handleClick}>{this.props.menuItemName}</li>
    );
  }
}

class NavMenuCategories extends Component {

   passClickedItemData = (passedData) => {
    //return passedData;
    this.props.onClickFunction( passedData );
   }


  render() {

    let categoryName = this.props.categoryName;

    return (
      <nav className="nav-menu-cats-wrap">
        <h3>{categoryName}</h3>
        <ul>
        {this.props.menuItems.map(function(object, i){
            return <NavMenuItem onClickFunction={this.passClickedItemData} menuItemName={object} key={i} method={categoryName.toLowerCase()} />;
        }, this )}
        </ul>
      </nav>
    );
  }
}

class NavMenu extends Component {

  passClickedItemData = (passedData) => {
   this.props.onClickFunction( passedData );
  }

  render() {
    return (
      <div className="nav-menu-wrap">
        <a href="index.html" className="app-logo">
          <img src={logo} alt="app-logo" />
        </a>
        <NavMenuCategories onClickFunction={this.passClickedItemData} categoryName={'Categories'} menuItems={['Action','Science Fiction','Drama','Music','Romance','Horror','Thriller','Fantasy','Animation']}  />
        <NavMenuCategories onClickFunction={this.passClickedItemData} categoryName={'Type'} menuItems={['All','Coming Soon','New']}  />
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

  handleFilterChange = (inputVal) => {

    //this.props.visibleMovies( filteredMovies );
    this.props.searchInputVal(inputVal);

  }

  render() {

    return (
      <div className="movie-trailer-app-content">
        <MovieSearchBar onChangeFunction={this.handleFilterChange} />
        <MoviesList movies={this.props.filteredMovies}  />
      </div>
    );
  }
}

class App extends Component {

  constructor() {
    super()
    this.state = {
      clickedMenuItem: [],
      allMovies: moviesList,
      visibleMovies: moviesList,
      searchInput: ""
    }
  }

  handleMenuItemClick = (clickedItem) => {

    const filterType = clickedItem[0];
    const filterMethod = clickedItem[1];

    let filteredMovies = [];
    const allMovies = this.state.allMovies;

    Object.keys(allMovies).forEach(function(key) {

      if ( filterMethod === 'categories' ) {

        let movieGenre = allMovies[key]['Genre'];
        movieGenre = movieGenre.split(',');

        if ( movieGenre.includes( filterType ) ) {
          allMovies[key]['name'] = key;
          filteredMovies.push(allMovies[key]);
        }

      } else if ( filterMethod === 'type' ) {

        const movieType = allMovies[key]['Type'].toLowerCase();

        if ( movieType === filterType || filterType === 'all' ) {
          allMovies[key]['name'] = key;
          filteredMovies.push(allMovies[key]);
        }

      }

    });

    this.setState({
      visibleMovies: filteredMovies
    })

  }

  getSearchInputVal = (inputVal) => {
    this.setState({
      searchInput: inputVal
    })

    let filteredMovies = [];
    const allMovies = this.state.allMovies;

    Object.keys(allMovies).forEach(function(key) {

      let movieName = key.toLowerCase();
      let searchq = inputVal.toLowerCase();

      if ( movieName.indexOf(searchq) !== -1 ) {
        allMovies[key]['name'] = key;
        filteredMovies.push(allMovies[key]);
      }

    });

    this.setState({
      visibleMovies: filteredMovies
    })
  }

  render() {
    return (
      <div className="movie-trailer-app">
        <NavMenu onClickFunction={this.handleMenuItemClick} />
        <ContentWrap searchInputVal={this.getSearchInputVal} visibleMovies={this.handleVisibleMovies} filteredMovies={this.state.visibleMovies}  />
      </div>
    );
  }
}

export default App;
