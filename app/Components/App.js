
import React from "react";
// import { CSSTransitionGroup } from 'react-transition-group';
// import Popular from "./Popular";
// import Home from "./Home";
// import Battle from "./Battle";
// import Results from "./Results";
import Nav from "./Containers/NavContainer";
import Login from "./Containers/LoginContainer";
import ReadingsContainer from "./containers/ReadingsContainer";
import AddReading from "./Containers/AddReadingContainer";
import ReadingSearch from "./Containers/SearchReadingsContainer";
import HexagramsSearch from "./Containers/SearchHexagramsContainer";


// import DetailedReading from "./DetailedReading";
import AddJournal from "./AddJournal";
import ShowJournal from "./ShowJournal";
import JournalList from "./JournalList";
import SignUp from "./SignUp";
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
            <Route path="/reading" component={ReadingsContainer} />
            {/*<Route path="/detailedreading" component={DetailedReading} />*/}
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
