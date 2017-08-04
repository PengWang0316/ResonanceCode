
import React from "react";
// import { CSSTransitionGroup } from 'react-transition-group';
// import Popular from "./Popular";
// import Home from "./Home";
// import Battle from "./Battle";
// import Results from "./Results";
import Nav from "./Nav";
import Login from "./Login";
import Reading from "./Reading";
import DetailedReading from "./DetailedReading";
import AddReading from "./AddReading";
import AddJournal from "./AddJournal";
import ShowJournal from "./ShowJournal";
import JournalList from "./JournalList";
import SignUp from "./SignUp";
import ReadingSearch from "./search/ReadingSearch";
import HexagramsSearch from "./search/HexagramsSearch";
import Hexagrams from "./administration/Hexagrams";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

const App=()=>{
  return(
    <Router>
      <div className="container">
        <Nav />
        <main>
          {/*
            <CSSTransitionGroup
            transitionName="csstransition-fade"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            */}
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/reading" component={Reading} />
            <Route path="/detailedreading" component={DetailedReading} />
            <Route path="/addreading" component={AddReading} />
            <Route path="/addJournal" component={AddJournal} />
            <Route path="/showJournal" component={ShowJournal} />
            <Route path="/journalList" component={JournalList} />
            <Route path="/readingSearch" component={ReadingSearch} />
            <Route path="/hexagramsSearch" component={HexagramsSearch} />
            <Route path="/signup" component={SignUp} />
            <Route path="/unattachedJournals" component={JournalList} />
            {/*For administrator*/}
            <Route path="/hexagrams" component={Hexagrams} />
            <Route render={()=>{return(<p>Not Fount!</p>)}} />
          </Switch>
          {/*</CSSTransitionGroup>*/}

        </main>
      </div>
    </Router>
  );
};

export default App;
