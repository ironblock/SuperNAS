// NETWORK WIDGET
// ==========

import _ from "lodash";
import React from "react";

import ChartUtil from "../../../utility/ChartUtil";
import LineInverted from "../../../chartjs/LineInverted";

var Chart;

if ( typeof window !== "undefined" ) {
  Chart = require( "chart.js" );
} else {
  Chart = function () {
    return Promise().resolve( true );
  };
}

const NW_OPTIONS =
  { bezier                 : true
  , bezierCurveTension     : 0.01
  , scaleShowVerticalLines : false
  , showTooltips           : false
  , showScale              : false
  , pointDot               : false
  };

const CHART_OPTIONS = ChartUtil.getChartStyles( NW_OPTIONS );

const CHART_LABELS = _.fill( Array( 60 ), "" );

const Network = React.createClass(
  { componentDidMount () {
      let ctxIn = React.findDOMNode( this.refs.nwIn ).getContext( "2d" );
      let ctxOut = React.findDOMNode( this.refs.nwOut ).getContext( "2d" );

      this.chartIn =
        new Chart( ctxIn ).Line( this.lieIn(), CHART_OPTIONS );
      this.chartOut =
        new Chart( ctxOut ).Line( this.lieOut(), CHART_OPTIONS );

      this.interval = setInterval( this.tick, 1000 );
    }

  , componentWillUnmount () {
      this.chartIn = null;
      this.chartOut = null;
      clearInterval( this.interval );
    }

  , tick () {
      if ( this.chartIn ) {
        this.chartIn.addData( ChartUtil.rand( 2, 20, 1 ), "" );
        this.chartIn.removeData();
      }

      if ( this.chartOut ) {
        this.chartOut.addData( ChartUtil.rand( 2, 20, 1 ), "" );
        this.chartOut.removeData();
      }
    }

  , lieIn () {
      return (
        { labels: CHART_LABELS
        , datasets: ChartUtil.styleDatasets(
            [ { label: "Network In"
              , data: ChartUtil.rand( 2, 20, 60 )
              }
            ]
          )
        }
      );
    }

  , lieOut () {
      return (
        { labels: CHART_LABELS
        , datasets: ChartUtil.styleDatasets(
            [ { label: "Network Out"
              , data: ChartUtil.rand( 2, 20, 60 )
              }
            ]
            , 1
          )
        }
      );
    }

  , render () {
      return (
        <div className="network-widget-dual">
          <canvas ref="nwIn" />
          {/* HORRIBLE HACK */}
          <canvas
            ref = "nwOut"
            style = {{ transform: "scaleY(-1)" }}
          />
        </div>
      );
    }
  }
);

export default Network;