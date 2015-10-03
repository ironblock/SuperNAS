// TASKS FEED
// ==========
// Show ongoing system tasks, and contextually hide when no tasks are ongoing.

"use strict";

import _ from "lodash";
import React from "react";

import Task from "./Task";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Tasks.less" );

export default class Tasks extends React.Component {
  createTask ( task, index ) {
    return (
      <Task
        { ...task }
        key = { index }
      />
    );
  }

  render () {
    const TASKS =
      _.chain( this.props.tasks )
       .map( function ( taskType ) { return _.values( taskType ); } )
       .flatten()
       .filter( function omitChildTasks ( task ) {
           return task.parent === null;
         }
       )
       .value();

    return (
      <div className="tasks-feed">
        <h4 className="news-feed-header">{ "Active Tasks" }</h4>
        { TASKS.map( this.createTask ) }
      </div>
    );
  }
};

Tasks.propTypes =
  { tasks: React.PropTypes.shape(
      { CREATED   : React.PropTypes.object
      , WAITING   : React.PropTypes.object
      , EXECUTING : React.PropTypes.object
      , FINISHED  : React.PropTypes.object
      , FAILED    : React.PropTypes.object
      , ABORTED   : React.PropTypes.object
      }
    )
  };
