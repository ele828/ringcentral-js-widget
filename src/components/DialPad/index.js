import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DialButton from '../DialButton';
import styles from './styles.scss';

const keyConfig = [
  [{ value: '1', text: '' }, { value: '2', text: 'ABC', dx: '183.211' }, { value: '3', text: 'DEF', dx: '188.633' }],
  [{ value: '4', text: 'GHI', dx: '192.242' }, { value: '5', text: 'JKL', dx: '194.0235' }, { value: '6', text: 'MNO', dx: '174.211' }],
  [{ value: '7', text: 'PQRS', dx: '163.3595' }, { value: '8', text: 'TUV', dx: '188.633' }, { value: '9', text: 'WXYZ', dx: '161.5705' }],
  [
    { value: '*', text: '' },
    { value: '0', text: '+', alternativeValue: '+', dx: '228.5625' },
    { value: '#', text: '' },
  ],
];

export default function DialPad(props) {
  return (
    <div className={classnames(styles.root, props.className)}>
      {keyConfig.map((row, rowIdx) => (
        <div key={rowIdx} className={styles.row}>
          {row.map((btn) => {
            if (props.hideSpecial && (btn.value === '*' || btn.value === '#')) {
              return (
                <div key={btn.value} className={styles.btnPlaceholder} />
              );
            }
            return (
              <DialButton
                key={btn.value}
                btn={btn}
                onPress={props.onButtonPress}
                onOutput={props.onButtonOutput}
                alternativeTimeout={props.alternativeTimeout}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

DialPad.propTypes = {
  className: PropTypes.string,
  hideSpecial: PropTypes.bool,
  onButtonPress: PropTypes.func,
  onButtonOutput: PropTypes.func,
  alternativeTimeout: PropTypes.number,
};
