// DATASET
// =======
// Display and edit constituent datset for a ZFS pool

"use strict";

import React from "react";
import { ButtonGroup, Button, DropdownButton, MenuItem } from "react-bootstrap";

import ByteCalc from "../../../../../utility/ByteCalc";

import Icon from "../../../../components/Icon";
import BreakdownChart from "../../common/BreakdownChart";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Dataset.less" );

const SHARE_TYPES = [ "Off", "NFS", "CIFS", "AFP" ];

export default class Dataset extends React.Component {
  createProperty ( legend, content ) {
    return (
      <div className="dataset-property">
        <span className="property-legend">{ legend }</span>
        <span className="property-content">{ content }</span>
      </div>
    );
  }

  createChild ( dataset, index ) {
    return (
      <Dataset
        { ...dataset }
        key = { index }
        shares = { this.props.shares }
      />
    );
  }

  render () {
    const { name, children } = this.props;
    const { used, available, compression } = this.props.properties;
    const CHILDREN = children
                   ? children.map( this.createChild.bind( this ) )
                   : null;
    let pathArray = name.split( "/" );
    const DATASET_NAME = pathArray.pop();
    const PARENT_NAME = this.props.root
                      ? "Top Level"
                      : "ZFS Dataset";

    // HACK: Remove when dataset path is gettable
    const ACTIVE_SHARE = this.props.shares
                       ? this.props.shares.get( "/mnt/" + this.props.name )
                       : undefined;

    let classes = [ "dataset" ];

    if ( this.props.root ) classes.push( "root" );

    return (
      <div className={ classes.join( " " ) }>

        {/* DATASET TOOLBAR */}
        <div className="dataset-toolbar">
          <div className="dataset-property dataset-name">
            <span className="property-legend">
              { PARENT_NAME }
            </span>
            <span className="property-content">
              { DATASET_NAME }
            </span>
          </div>

        {/* PROPERTIES OF DATASET AND OPTIONS */}
          <div className="dataset-properties">
            { this.createProperty( "Used", ByteCalc.humanize( used.rawvalue ) ) }
            { this.createProperty( "Available", ByteCalc.humanize( available.rawvalue ) ) }
            { this.createProperty( "Compression", compression.rawvalue ) }

            {/* RADIO TOGGLES FOR CREATING SHARES */}
            <div className="dataset-property">
              <span className="property-legend">
                { "File Sharing" }
              </span>
              <span className="property-content">
                <ButtonGroup
                  className = "btn-group-radio btn-group-radio-primary"
                >
                  <Button
                    active = { !ACTIVE_SHARE }
                  >
                    { "Off" }
                  </Button>
                  <Button
                    active = { ACTIVE_SHARE && ACTIVE_SHARE.type === "nfs" }
                  >
                    { "NFS" }
                  </Button>
                  <Button
                    active = { ACTIVE_SHARE && ACTIVE_SHARE.type === "cifs" }
                  >
                    { "CIFS" }
                  </Button>
                  <Button
                    active = { ACTIVE_SHARE && ACTIVE_SHARE.type === "afp" }
                  >
                    { "AFP" }
                  </Button>
                </ButtonGroup>
              </span>
            </div>

            {/* "+" DROPDOWN BUTTON: ADD DATASETS AND ZVOLS */}
            <DropdownButton
              noCaret
              pullRight
              bsStyle   = "link"
              className = "add-child"
              id        = { this.props.name.replace( /\s/, "-" ) + "-add-btn" }
              title     = { <Icon glyph="icon-plus" /> }
            >
              <MenuItem disabled>{ "Add Dataset..." }</MenuItem>
              <MenuItem disabled>{ "Add ZVOL..." }</MenuItem>
            </DropdownButton>
          </div>
        </div>

        {/* BREAKDOWN */}
        <BreakdownChart
          used = { ByteCalc.convertString( used.rawvalue ) }
          free = { ByteCalc.convertString( available.rawvalue ) }
        />

        {/* CHILD DATASETS */}
        <div className="dataset-children">
          { CHILDREN }
        </div>
      </div>
    );
  }
}

Dataset.propTypes =
  { name             : React.PropTypes.string.isRequired
  , root             : React.PropTypes.bool
  , children         : React.PropTypes.array
  , pool             : React.PropTypes.string
  , permissions_type : React.PropTypes.oneOf([ "PERM", "ACL" ])
  , type             : React.PropTypes.oneOf([ "FILESYSTEM", "VOLUME" ])
  , share_type       : React.PropTypes.oneOf([ "UNIX", "MAC", "WINDOWS" ])
  , properties       : React.PropTypes.object // TODO: Get more specific
  , shares           : React.PropTypes.instanceOf( Map )
  , activeShare      : React.PropTypes.object
  , disallowSharing  : React.PropTypes.bool
  , parentIsShared   : React.PropTypes.bool
  };

Dataset.defaultProps =
  { name: ""
  , properties:
    { used      : { rawvalue: 0 }
    , available : { rawvalue: 0 }
    }
  }
