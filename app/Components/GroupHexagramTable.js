import React from 'react';
import PropTypes from 'prop-types';

import GroupHexagramRow from './GroupHexagramRow';
import styles from '../styles/GroupHexagramTable.module.css';

const GroupHexagramTable = ({ hexagramArray, handleHexagramClick, tableTitle }) => (
  <div>
    <div className="font-weight-bold mt-3 mb-2">{tableTitle}</div>
    <table className={styles.table}>
      <thead>
        <tr className={styles.headTR}>
          <th>Potentiation</th>
          <th>Hex No</th>
          <th>Hex Image</th>
          <th>Resonance Code Name</th>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {hexagramArray.map(hexagram => (
          <GroupHexagramRow
            key={hexagram.name}
            hexagram={hexagram}
            handleHexagramClick={handleHexagramClick}
          />))}
      </tbody>
    </table>
  </div>
);
GroupHexagramTable.propTypes = {
  hexagramArray: PropTypes.array.isRequired,
  handleHexagramClick: PropTypes.func.isRequired,
  tableTitle: PropTypes.string.isRequired
};
export default GroupHexagramTable;
