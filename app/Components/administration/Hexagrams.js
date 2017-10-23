import React, { Component } from 'react';
import { connect } from 'react-redux';

// import DatabaseApi from '../../apis/DatabaseApi';
import HexagramImgTable from '../HexagramImgTable';
import HexagramUpdateForm from './HexagramUpdateForm';
import { checkAuthentication } from '../../actions/UserActions';
import { clearHexagrams, getAllHexagrams, fetchHexagramBasedOnImg } from '../../actions/HexagramActions';
import { ADMINISTRATOR_ROLE } from '../../config';
// import LoginApi from '../../apis/LoginApi';

/** The component for changing Hexagrams' information. (Administrator using only) */
class Hexagrams extends Component {
  /** Setting some states, checking user authentication, and fetching the hexagrams' data for the component.
    * @returns {null} No return.
  */
  componentWillMount() {
  /*  this.state = {
      hexagrams: null,
      hexagram: null
    }; */
    if (!this.props.user.isAuth) this.props.checkAuthentication();
    this.props.clearHexagrams();
    // if no user does not login, direct user back to login page
    /* Deprecated old version.
    const user = LoginApi.isLogin(document);
    if (!user || user.role != 1) this.props.history.push('/');
    else {
      this.state = {
        hexagrams: null,
        hexagram: null
      };
      DatabaseApi.getHexagrams({}).then((result) => {
        // console.log(result.data);
        this.setState({ hexagrams: result.data });
      });
    } */
  }

  /** When user is authenticated, its role equal 1, and hexagrams is empty, fetch all Hexagrams for the component.
    * @params {object} nextProps is the object that contains new props.
    * @returns {null} No return.
  */
  componentWillReceiveProps({ hexagrams, user }) {
    if (hexagrams.length === 0 && user.isAuth && user.role * 1 === ADMINISTRATOR_ROLE)
      this.props.getAllHexagrams();
  }

  /** Fetching one hexagram's data when a user click the hexagram's icon.
    * @param {array} imgArray is the number array that represents a hexagram.
    * @returns {null} No return.
  */
  handleClickImgCallback = imgArray =>
    this.props.fetchHexagramBasedOnImg(imgArray);
    // console.log("HexagramUpdateForm", imgArray);
    /* Deprecated old version.
    DatabaseApi.getHexagramBasedOnImg(imgArray).then((result) => {
      // console.log("getHexagramBasedOnImg",result.data);
      this.setState({ hexagram: result.data });
    }); */

  /** After a hexagram was updated, set the state to null.
    * @returns {null} No return.
  */
  // handleHexagramUpdateCallback = () => this.setState({ hexagram: null });

  /** After the cancel button was clicked, set the state to null.
    * @returns {null} No return.
  */
  // handleHexagramFormCancelCallback = () => this.setState({ hexagram: null });

  /** Rendering the jsx for the component.
    * @returns {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <div>
        {/* Hexagram Imgs */}
        {this.props.hexagrams &&
          <HexagramImgTable
            hexagramsArray={this.props.hexagrams}
            onCallback={this.handleClickImgCallback}
          />}

        {/* Update form */}
        {this.props.hexagram &&
          <HexagramUpdateForm hexagram={this.props.hexagram} />}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user,
  hexagrams: state.hexagrams,
  hexagram: state.hexagram
});
const mapDispatchToProps = dispatch => ({
  checkAuthentication: _ => dispatch(checkAuthentication()),
  clearHexagrams: _ => dispatch(clearHexagrams()),
  getAllHexagrams: _ => dispatch(getAllHexagrams()),
  fetchHexagramBasedOnImg: imgArray => dispatch(fetchHexagramBasedOnImg(imgArray))
});
export default connect(mapStateToProps, mapDispatchToProps)(Hexagrams);
