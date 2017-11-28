import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { NUMBER_OF_READING_PER_PAGE } from '../config';

/** The pagination for the page.
  *Keeping amount and fetchContent out of Pagination component can help it raising reusability.
*/
class Pagination extends Component {
  static propTypes = {
    numberPerpage: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    fetchContent: PropTypes.func.isRequired
  };

  state = { currentPage: 0 };

  /** Calculating the .
    * @return {null} No return.
  */
  componentWillMount() {
    // this.totalPage = this.props.amount / this.props.numberPerpage < 1 ?
    //   1 : this.props.amount / this.props.numberPerpage;
    this.currentPage = 0;
    this.initialPaginationArray(this.props.amount, this.props.numberPerpage);
    // this.assemblePaginationArray();
  }

  /** ReAssemble page number when the component receives a new totalPage number.
    * @param {object} nextProps is an object that contains new props' values.
    * @return {null} No return.
  */
  componentWillReceiveProps(nextProps) {
    if (this.props.amount !== nextProps.amount)
      this.initialPaginationArray(nextProps.amount, nextProps.numberPerpage);
  }

  /** Calculating the totalPage and call assembling method.
    * @param {number} amount is the total amount of the content will be showed.
    * @param {number} numberPerpage is the number amount will be showed in one page.
    * @return {null} No return.
  */
  initialPaginationArray(amount, numberPerpage) {
    this.totalPage = amount / numberPerpage < 1 ?
      1 : amount / numberPerpage;
    this.assemblePaginationArray();
  }

  /** Assembling an array for the pagination elements.
    * @return {null} No return.
  */
  assemblePaginationArray() {
    this.state.paginationArray = [];
    for (let i = 0; i < this.totalPage; i++) this.state.paginationArray.push(<li key={i} className={this.currentPage === i ? 'page-item active' : 'page-item'}><a href="#" role="button" tabIndex="-2" onClick={this.handleClickPageNumber} className="page-link">{i + 1}</a></li>);
    this.setState({ paginationArray: this.state.paginationArray });
  }

  /** Fetching the reading information when a user click the page number.
    * Also, set the currentPage state to this number.
    * @param {object} event is an object that comes from the element was clicked.
    * @return {null} No return.
  */
  handleClickPageNumber = ({ target }) => {
    if (this.currentPage !== (target.innerText * 1) - 1) {
      this.currentPage = (target.innerText * 1) - 1;
      this.props.fetchContent(this.currentPage);
      this.setState({ currentPage: this.currentPage });
      this.assemblePaginationArray();
    }
  };

  /** Going to preverious page when a user clicks the previous button.
    * @return {null} No return.
  */
  goPreviousPage = () => {
    this.currentPage = this.state.currentPage - 1;
    this.props.fetchContent(this.currentPage);
    this.setState({ currentPage: this.currentPage });
    this.assemblePaginationArray();
  };

  /** Going to next page when a user clicks the previous button.
    * @return {null} No return.
  */
  goNextPage = () => {
    this.currentPage = this.state.currentPage + 1;
    this.props.fetchContent(this.currentPage);
    this.setState({ currentPage: this.currentPage });
    this.assemblePaginationArray();
  };

  /** The render method for the component.
    * @return {jsx} Return the jsx for the component.
  */
  render() {
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination pagination-sm justify-content-end">
          <li className={this.state.currentPage === 0 ? 'page-item disabled' : 'page-item'}>
            <a href="#" role="button" onClick={this.goPreviousPage} className="page-link" tabIndex="-1">Previous</a>
          </li>
          {this.state.paginationArray}
          <li className={(this.state.currentPage + 1) * this.props.numberPerpage >= this.props.amount ? 'page-item disabled' : 'page-item'}>
            <a href="#" onClick={this.goNextPage} role="button" className="page-link">Next</a>
          </li>
        </ul>
      </nav>
    );
  }
}
export default Pagination;
