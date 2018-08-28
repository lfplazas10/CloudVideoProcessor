import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import instance from "../AjaxCrtl.js"
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TableHead from "@material-ui/core/TableHead/TableHead";
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Paper from "@material-ui/core/Paper/Paper";
import axios from 'axios';

class ContestTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      url: "",
      banner: "",
      startDate: "2018-08-28",
      endDate: "2018-08-28",
      winnerPrize: "",
      create: false,
      update: false,
      delete: false,
      id:0
    };

    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.createContest = this.createContest.bind(this);
    this.updateContest = this.updateContest.bind(this);
    this.hideCreate = this.hideCreate.bind(this);
    this.viewCreate = this.viewCreate.bind(this);
    this.hideUpdate = this.hideUpdate.bind(this);
    this.viewUpdate = this.viewUpdate.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.viewDelete = this.viewDelete.bind(this);
    this.showCreate = this.showCreate.bind(this);
    this.showUpdate = this.showUpdate.bind(this);
    this.deleteContest = this.deleteContest.bind(this);
  }

  hideCreate(e) {
    e.preventDefault();
    this.setState({ create: false });
  }

  viewCreate(e) {
    e.preventDefault();
    this.setState({ create: true });
  }

  hideDelete(e) {
    e.preventDefault();
    this.setState({ delete: false });
  }

  viewDelete(e) {
    this.setState({ delete: true });
  }

  hideUpdate(e) {
    e.preventDefault();
    this.setState({ update: false });
  }

  viewUpdate(e) {
    e.preventDefault();
    this.setState({ update: true });
  }

  getOne(e) {
    e.preventDefault();
    instance().get('contest', {
      params: {
        foo: 'bar'
      }
    }).then((response) => {
      console.log(response);
    })
      .catch((error) => {
        console.log(error.response)
      });
  }

  getAll(e) {
    e.preventDefault();
    instance().get('contest')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response)
      });
  }

  deleteContest(id) {
    console.log("D",this.state);
    // instance().delete('contest/'+id)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error.response)
    //   });
  }
  
  createContest(e) {
    e.preventDefault();
    console.log("C");

    instance().post('contest', {
      name: this.state.name,
      url: this.state.url,
      description: this.state.winnerPrize,
      ownerEmail: ".",
      creationDate: new Date(),
      startDate: new Date(this.state.startDate),
      endDate: new Date(this.state.endDate)
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response)
      });
  }

  updateContest(e) {
    e.preventDefault();
    console.log("U");

    instance().put('contest', {
      name: this.state.name,
      url: this.state.url,
      description: this.state.winnerPrize,
      ownerEmail: ".",
      creationDate: new Date(),
      startDate: new Date(this.state.startDate),
      endDate: new Date(this.state.endDate)
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response)
      });
  }

  showCreate() {
    return (
      <Dialog
        open={this.state.create}
        fullScreen={this.props.fullScreen}>
        <form onSubmit={this.createContest}>
          <DialogTitle>Create Contest</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the contest information below.
          </DialogContentText>
            <TextField
              margin="dense"
              id="contestName"
              label="Contest name"
              type="text"
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="imageUrl"
              label="Contest banner URL"
              type="text"
              value={this.state.banner}
              onChange={(e) => this.setState({ banner: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="contestUrl"
              label="Contest URL"
              type="text"
              value={this.state.url}
              onChange={(e) => this.setState({ url: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="startDate"
              label="Start Date"
              type="date"
              value={this.state.startDate}
              onChange={(e) => this.setState({ startDate: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="endDate"
              label="End Date"
              type="date"
              value={this.state.endDate}
              onChange={(e) => this.setState({ endDate: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="winnerPrize"
              label="Winner's prize description"
              type="text"
              value={this.state.winnerPrize}
              onChange={(e) => this.setState({ winnerPrize: e.target.value })}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideCreate} color="primary">
              Cancel
          </Button>
            <Button color="primary" type="submit">
              Create
          </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  showUpdate() {
    return (
      <Dialog
        open={this.state.update}
        fullScreen={this.props.fullScreen}>
        <form onSubmit={this.updateContest}>
          <DialogTitle>Update Contest</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the contest information below.
          </DialogContentText>
            <TextField
              margin="dense"
              id="contestName"
              label="Contest name"
              type="text"
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="imageUrl"
              label="Contest banner URL"
              type="text"
              value={this.state.banner}
              onChange={(e) => this.setState({ banner: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="contestUrl"
              label="Contest URL"
              type="text"
              value={this.state.url}
              onChange={(e) => this.setState({ url: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="startDate"
              label="Start Date"
              value={this.state.startDate}
              type="date"
              onChange={(e) => this.setState({ startDate: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="endDate"
              label="End Date"
              value={this.state.endDate}
              type="date"
              onChange={(e) => this.setState({ endDate: e.target.value })}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="winnerPrize"
              label="Winner's prize description"
              type="text"
              value={this.state.winnerPrize}
              onChange={(e) => this.setState({ winnerPrize: e.target.value })}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hideUpdate} color="primary">
              Cancel
          </Button>
            <Button color="primary" type="submit">
              Update
          </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  showDelete() {
    return (
      <Dialog
          open={this.state.delete}
          onClose={this.hideDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this contest? "}</DialogTitle>
          <DialogActions>
          <Button onClick={this.hideDelete} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.deleteContest} color="primary" autoFocus>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
    )
  }

  

  render() {
    const {
      classes
    } = this.props;
    const rows = ["f"];
    return (
      <div>
        <Paper className={classes.root} style={{ marginTop: '75px' }}>
          <h3 className="centerAlign">Contest List <Button onClick={this.viewCreate}>Add Contest</Button></h3>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Contest</TableCell>
                <TableCell >URL</TableCell>
                <TableCell >Start Date</TableCell>
                <TableCell >End Date</TableCell>
                <TableCell >Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={"row.id"}>
                    <TableCell component="th" scope="row">
                      {"row.name"}
                    </TableCell>
                    <TableCell >{"row.url"}</TableCell>
                    <TableCell >{"row.startDate"}</TableCell>
                    <TableCell >{"row.endDate"}</TableCell>
                    <TableCell ><Button onClick={this.viewUpdate}>Edit Contest</Button><Button onClick={()=> this.setState({id:1},this.viewDelete)}>Delete Contest</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        {this.showCreate()}
        {this.showUpdate()}
        {this.showDelete()}
      </div>
    );
  }
}


export default ContestTable;