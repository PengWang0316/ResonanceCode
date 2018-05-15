
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Loadable from 'react-loadable'; Does not work with react-hot-loader very well.
// import universal from 'react-universal-component'; Does not work with react-hot-loader very well.
import importedComponent from 'react-imported-component';
// import { CSSTransitionGroup } from 'react-transition-group';

import Navbar from './Navbar';
import LoadingAnimation from './SharedComponents/LoadingAnimation';
// import Login from './containers/LoginContainer';
// import Readings from './containers/ReadingsContainer';
// import AddReading from './containers/AddReadingContainer';
// import ReadingSearch from './containers/SearchReadingsContainer';
// import HexagramsSearch from './containers/SearchHexagramsContainer';
// import SignUp from './containers/SignUpContainer';
// import AddJournal from './containers/AddJournalContainer';
// import ShowJournal from './containers/ShowJournalContainer';
// import Settings from './containers/SettingsContainer';
// import SharedReadings from './containers/SharedReadingsContainer';
// import AllJournalListContainer from './containers/AllJournalListContainer';
// import HexagramListContainer from './containers/HexagramListContainer';
//
// import JournalList from './JournalList';
// import Hexagrams from './administra tion/Hexagrams';

// import() does not support webpack's webpackChunkName. System.import can do it.
/* istanbul ignore next */
const Login = importedComponent(() => import(/* webpackChunkName: 'LoginContainer' */ './containers/LoginContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const Readings = importedComponent(() => import(/* webpackChunkName: 'ReadingsContainer' */ './containers/ReadingsContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const AddReading = importedComponent(() => import(/* webpackChunkName: 'AddReadingContainer' */ './containers/AddReadingContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const ReadingSearch = importedComponent(() => import(/* webpackChunkName: 'SearchReadingsContainer' */ './containers/SearchReadingsContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const HexagramsSearch = importedComponent(() => import(/* webpackChunkName: 'SearchHexagramsContainer' */ './containers/SearchHexagramsContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const SignUp = importedComponent(() => import(/* webpackChunkName: 'SignUpContainer' */ './containers/SignUpContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const AddJournal = importedComponent(() => import(/* webpackChunkName: 'AddJournalContainer' */ './containers/AddJournalContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const ShowJournal = importedComponent(() => import(/* webpackChunkName: 'ShowJournalContainer' */ './containers/ShowJournalContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const Settings = importedComponent(() => import(/* webpackChunkName: 'SettingsContainer' */ './containers/SettingsContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const SharedReadings = importedComponent(() => import(/* webpackChunkName: 'SharedReadingsContainer' */ './containers/SharedReadingsContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const AllJournalListContainer = importedComponent(() => import(/* webpackChunkName: 'AllJournalListContainer' */ './containers/AllJournalListContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const HexagramListContainer = importedComponent(() => import(/* webpackChunkName: 'HexagramListContainer' */ './containers/HexagramListContainer'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const JournalList = importedComponent(() => import(/* webpackChunkName: 'JournalList' */ './JournalList'), { LoadingComponent: LoadingAnimation });
/* istanbul ignore next */
const Hexagrams = importedComponent(() => import(/* webpackChunkName: 'Hexagrams' */ './administration/Hexagrams'), { LoadingComponent: LoadingAnimation });

// const Login = Loadable({
//   loader: () => System.import(/* webpackChunkName: 'LoginContainer' */ './containers/LoginContainer'),
//   loading: LoadingAnimation,
// });
// // const Login = r => require.ensure([], () => r(require('./containers/LoginContainer')), 'LoginContainer');
//
// const Readings = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'ReadingsContainer' */ './containers/ReadingsContainer'),
//   loading: LoadingAnimation,
// });
//
// const AddReading = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'AddReadingContainer' */ './containers/AddReadingContainer'),
//   loading: LoadingAnimation,
// });
//
// const ReadingSearch = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'SearchReadingsContainer' */ './containers/SearchReadingsContainer'),
//   loading: LoadingAnimation,
// });
//
// const HexagramsSearch = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'SearchHexagramsContainer' */ './containers/SearchHexagramsContainer'),
//   loading: LoadingAnimation,
// });
//
// const SignUp = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'SignUpContainer' */ './containers/SignUpContainer'),
//   loading: LoadingAnimation,
// });
//
// const AddJournal = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'AddJournalContainer' */ './containers/AddJournalContainer'),
//   loading: LoadingAnimation,
// });
//
// const ShowJournal = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'ShowJournalContainer' */ './containers/ShowJournalContainer'),
//   loading: LoadingAnimation,
// });
//
// const Settings = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'SettingsContainer' */ './containers/SettingsContainer'),
//   loading: LoadingAnimation,
// });
//
// const SharedReadings = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'SharedReadingsContainer' */ './containers/SharedReadingsContainer'),
//   loading: LoadingAnimation,
// });
//
// const AllJournalListContainer = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'AllJournalListContainer' */ './containers/AllJournalListContainer'),
//   loading: LoadingAnimation,
// });
//
// const HexagramListContainer = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'HexagramListContainer' */ './containers/HexagramListContainer'),
//   loading: LoadingAnimation,
// });
//
// const JournalList = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'JournalList' */ './JournalList'),
//   loading: LoadingAnimation,
// });
//
// const Hexagrams = Loadable({
//   loader: () =>  System.import(/* webpackChunkName: 'Hexagrams' */ './administration/Hexagrams'),
//   loading: LoadingAnimation,
// });

const App = props => (
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
          <Route path="/reading" component={Readings} />
          {/* <Route path="/detailedreading" component={DetailedReading} /> */}
          <Route path="/addreading" component={AddReading} />
          <Route path="/addJournal" component={AddJournal} />
          <Route path="/showJournal" component={ShowJournal} />
          <Route path="/journalList" component={JournalList} />
          <Route path="/readingSearch" component={ReadingSearch} />
          <Route path="/hexagramsSearch" component={HexagramsSearch} />
          <Route path="/signup" component={SignUp} />
          <Route path="/allJournal" component={AllJournalListContainer} />
          <Route path="/unattachedJournals" component={JournalList} />
          <Route path="/sharedReadings" component={SharedReadings} />
          <Route path="/hexagramList" component={HexagramListContainer} />
          <Route path="/settings" component={Settings} />

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
