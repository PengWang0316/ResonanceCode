
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { CSSTransitionGroup } from 'react-transition-group';
// import Popular from "./Popular";
// import Home from "./Home";
// import Battle from "./Battle";
// import Results from "./Results";
import Navbar from './Navbar';
import Login from './containers/LoginContainer';
import ReadingsContainer from './containers/ReadingsContainer';
import AddReading from './containers/AddReadingContainer';
import ReadingSearch from './containers/SearchReadingsContainer';
import HexagramsSearch from './containers/SearchHexagramsContainer';
import SignUp from './containers/SignUpContainer';
import AddJournal from './containers/AddJournalContainer';
import ShowJournal from './containers/ShowJournalContainer';

// import DetailedReading from "./DetailedReading";


import JournalList from './JournalList';
import Hexagrams from './administration/Hexagrams';


const App = _ => (
  <Router>
    <div>
      <Navbar />
      <main className="container">
        {/*
            <CSSTransitionGroup
            transitionName="csstransition-fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            */}
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/reading" component={ReadingsContainer} />
          {/* <Route path="/detailedreading" component={DetailedReading} /> */}
          <Route path="/addreading" component={AddReading} />
          <Route path="/addJournal" component={AddJournal} />
          <Route path="/showJournal" component={ShowJournal} />
          <Route path="/journalList" component={JournalList} />
          <Route path="/readingSearch" component={ReadingSearch} />
          <Route path="/hexagramsSearch" component={HexagramsSearch} />
          <Route path="/signup" component={SignUp} />
          <Route path="/unattachedJournals" component={JournalList} />


          {/* For administrator */}
          <Route path="/hexagrams" component={Hexagrams} />
          <Route render={() => <p>Not Fount!</p>} />
        </Switch>
        {/* </CSSTransitionGroup> */}

      </main>
    </div>
  </Router>
);

export default App;
