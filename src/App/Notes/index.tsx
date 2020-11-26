import React, { Component } from "react";
import { NotesType } from "../../common/notes";

interface NotesProps {
  notes: NotesType;
}

interface NotesState { }

export class Notes extends Component<NotesProps, NotesState> {
  render() {
    let notes = 
    this.props.notes.text.map((note, index) => {
      return <li key={index}>{note}</li>
    });

    return (
      <React.Fragment>
        <h2>Notes</h2> 
        <ul>
          { notes }
        </ul>
      </React.Fragment>
    );
  }
}
