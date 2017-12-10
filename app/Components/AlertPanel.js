import React from 'react';

import styles from '../styles/AlertPanel.module.css';

const AlertPanel = ({
  id = '', type = 'success', children = '', style = {}
}) => (
  <div id={id} className={`alert alert-${type} mt-3 ${styles.alertPanel}`} style={style} role="alert">
    {children}
  </div>
);
export default AlertPanel;
