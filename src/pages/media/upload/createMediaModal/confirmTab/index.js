import Radium from 'radium';
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form/immutable';
import { buttonStyles, colors } from '../../../../_common/styles';
import createMediaStyles from '../styles';

@reduxForm({
  destroyOnUnmount: false,
  // fields: [
  //   'episode', 'episodeTitle', 'season', 'seriesName', // Description
  //   'video', // Source video
  //   'mediumExternalReference', 'mediumExternalReferenceSource', 'skipAudio', 'skipScenes' // Processing
  // ], // Note: all form fields on the last tab, see http://erikras.github.io/redux-form/#/examples/wizard?_k=s8rdrm
  form: 'createMedia'
})
@Radium
export default class ConfirmTab extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.onBack = ::this.onBack;
  }

  onBack (e) {
    e.preventDefault();
    this.props.onBack();
  }

  static styles = {
    info: {
      text: {
        color: colors.darkGray,
        paddingBottom: 10
      },
      emph: {
        textDecoration: 'underline'
      }
    },
    info2: {
      text: {
        color: colors.black
      },
      emph: {
        color: colors.secondaryPink
      }
    }
  };

  render () {
    const styles = this.constructor.styles;
    const { handleSubmit } = this.props;

    return (
      <form noValidate onSubmit={handleSubmit}>
        <div style={createMediaStyles.body}>
          <h1 style={createMediaStyles.title}>Almost there!</h1>

          {/* TODO: final notes, as designed */}

          {/* TODO: show estimation of number of bytes to upload */}
          <p style={styles.info.text}>It seems like you've got everything you need to start uploading to Apptvate!
             Please mind that the process could take a while. Whatever happens, <span style={styles.info.emph}>
             do not close your browser</span>.</p>
          <p style={styles.info2.text}>Press <span style={styles.info2.emph}>upload</span> to start the magic...</p>
        </div>

        <div style={createMediaStyles.footer.container}>
          <button key='back' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.gray, buttonStyles.small, buttonStyles.first ]} onClick={this.onBack}>BACK</button>
          <button key='next' style={[ buttonStyles.base, buttonStyles.small, buttonStyles.blue ]} type='submit'>UPLOAD</button>
        </div>
      </form>
    );
  }

}
