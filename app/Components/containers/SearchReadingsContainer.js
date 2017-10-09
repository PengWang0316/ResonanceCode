import React, { Component } from "react";
import SearchReadingsForm from "../SearchReadingsForm";
import BriefReading from "../BriefReading";
// import Loading from "../Loading";
import LoadingAnimation from "../SharedComponents/LoadingAnimation";
// import { isLogin } from "../../apis/LoginApi";

// import { getReadings } from "../../apis/DatabaseApi";

import { connect } from "react-redux";
import { checkAuthentication } from "../../actions/UserActions";
import UnauthenticatedUserCheck from "../SharedComponents/UnauthenticatedUserCheck";
import { searchReadings, clearReadings } from "../../actions/ReadingActions";

class SearchReadingsContainer extends Component {

	componentWillMount(){
		// if(!isLogin(document)) this.props.history.push("/");
		if(!this.props.user.isAuth) this.props.checkAuthentication();
		this.props.clearReadings();
	}

	handleSubmitCallback(searchCriterias){
		// assemble for searching
		const searchObject = {
		  startDate: searchCriterias.startDate?new Date(searchCriterias.startDate):searchCriterias.startDate,
			endDate: searchCriterias.endDate?new Date(searchCriterias.endDate):searchCriterias.endDate,
			people: searchCriterias.people,
			upperId: searchCriterias.upper,
			lowerId: searchCriterias.lower,
			line13Id: searchCriterias.line13,
			line25Id: searchCriterias.line25,
			line46Id: searchCriterias.line46
		};
		this.props.searchReadings(searchObject);
	}

	render() {
		return (
			<UnauthenticatedUserCheck>
				<div className="readingContainer">
					<SearchReadingsForm handleSubmit = {(searchCriterias) => {this.handleSubmitCallback(searchCriterias);}} />          <LoadingAnimation />
					{/* start to show result for reading */}
					{this.props.readings.map(reading => <BriefReading key={reading._id} reading={reading} />)}
					{/* no result message */}
					{this.props.extraMessage != "" && <div className="no_result text-center">{this.props.extraMessage}</div>}
				</div>
			</UnauthenticatedUserCheck>
		);
	}

}
const mapStateToProps = state => ({
	readings: state.readings,
	extraMessage: state.extraMessage,
	isLoading: state.isLoading,
	user: state.user
});
const mapDispatchToProps = dispatch => ({
	searchReadings: searchCriterias => dispatch(searchReadings(searchCriterias)),
	checkAuthentication: _ => dispatch(checkAuthentication()),
	clearReadings: _ => dispatch(clearReadings())
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchReadingsContainer);
