import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DialPad from '../DialPad';
import BackHeader from '../BackHeader';
import ActiveCallButton from '../ActiveCallButton';
import dynamicsFont from '../../assets/DynamicsFont/DynamicsFont.scss';
import TransferIcon from '../../assets/images/Transfer.svg';
import styles from './styles.scss';
import i18n from './i18n';

export default class TransferPanel extends PureComponent {
  static propTypes = {
    transfer: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    toggleTransferPanel: PropTypes.func.isRequired,
    isOnTransfer: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onButtonOutput = (key) => {
    this.setState((preState) => {
      const value = preState.value + key;
      return { value };
    });
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  clearText = () => {
    this.setState({
      value: ''
    });
  }

  transfer = () => {
    this.props.transfer(this.state.value);
  }

  render() {
    const showClearButton = this.state.value === '' ? { display: 'none' } : { display: 'block' };
    const isButtonDisabled = this.state.value === '' || this.props.isOnTransfer;
    return (
      <div className={styles.root}>
        <BackHeader
          onBackClick={this.props.toggleTransferPanel}
          backButton={(
            <span className={styles.backButton}>
              <i className={classnames(dynamicsFont.arrow, styles.backIcon)} />
            </span>
          )}
          buttons={[]}
        >
          {i18n.getString('transferTo', this.props.currentLocale)}
        </BackHeader>
        <div className={styles.dialInput}>
          <label>
            {i18n.getString('to', this.props.currentLocale)}
          </label>
          <input
            className={styles.input}
            onChange={this.handleChange}
            value={this.state.value}
          />
          <span
            style={showClearButton}
            className={classnames(styles.clear, dynamicsFont.clear)}
            onClick={this.clearText}
          />
        </div>
        <div className={styles.padContainer}>
          <DialPad
            className={styles.dialPad}
            onButtonOutput={this.onButtonOutput}
          />
          <div className={styles.buttonRow}>
            <ActiveCallButton
              onClick={this.transfer}
              className={styles.button}
              icon={TransferIcon}
              title={i18n.getString('blindTransfer', this.props.currentLocale)}
              disabled={isButtonDisabled}
              showBorder
            />
          </div>
        </div>
      </div>
    );
  }
}