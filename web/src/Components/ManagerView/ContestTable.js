import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import instance from "../../Helpers/AjaxCrtl.js"
import {withStyles} from '@material-ui/core/styles';
import TableHead from "@material-ui/core/TableHead/TableHead";
import Table from '@material-ui/core/Table';
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Paper from "@material-ui/core/Paper/Paper";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Visibility from "@material-ui/icons/Visibility";
import {Pager} from "react-bootstrap";
import ErrorMessage from "../../Helpers/ErrorMessage";
import browserHistory from "../../Helpers/BrowserHistory.js"
import Typography from "@material-ui/core/Typography/Typography";

class ContestTable extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      name: "",
      url: null,
      banner: null,
      startDate: "2018-08-28",
      endDate: "2018-08-28",
      winnerPrize: "",
      create: false,
      update: false,
      delete: false,
      pageNum: 1,
      prevButton: false,
      nextButton: true,
      id: 0,
      contests: [],
    };
    
    this.getAll = this.getAll.bind(this);
    this.createContest = this.createContest.bind(this);
    this.updateContest = this.updateContest.bind(this);
    this.hideUpdate = this.hideUpdate.bind(this);
    this.viewUpdate = this.viewUpdate.bind(this);
    this.showCreate = this.showCreate.bind(this);
    this.showUpdate = this.showUpdate.bind(this);
    this.sendImg = this.sendImg.bind(this);
    this.deleteContest = this.deleteContest.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.upPage = this.upPage.bind(this);
    this.downPage = this.downPage.bind(this);
  }
  
  componentDidMount() {
    instance().get('user')
      .then((response) => {
        this.getAll();
        this.setState({user: response.data});
      })
      .catch((error) => {
        console.log(error.response)
      });
  }
  
  hideUpdate(e) {
    e.preventDefault();
    this.setState({update: false});
  }
  
  upPage(e) {
    e.preventDefault();
    const newPage = this.state.pageNum + 1;
    this.setState({pageNum: newPage}, this.getAll);
  }
  
  downPage(e) {
    e.preventDefault();
    if (this.state.pageNum > 1) {
      const newPage = this.state.pageNum - 1;
      this.setState({pageNum: newPage}, this.getAll)
    }
  }
  
  viewUpdate(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.setState({update: true});
  }
  
  getAll(e) {
    if (e && e.preventDefault) e.preventDefault();
    instance().get('contest/' + this.state.pageNum)
      .then((response) => {
        this.setState({
          contests: response.data,
          nextButton: response.data.length == 50,
          prevButton: this.state.pageNum > 1
        });
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
  }
  
  deleteContest(e) {
    if (e && e.preventDefault) e.preventDefault();
    const url = 'contest/' + this.state.id;
    instance().delete(url)
      .then((response) => {
        this.setState({delete: false}, () => this.getAll());
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
        console.log(error.response)
      });
  }
  
  createContest(e) {
    if (e && e.preventDefault) e.preventDefault();
    let sDate = new Date(this.state.startDate);
    let eDate = new Date(this.state.endDate);
    if (sDate.getTime() > eDate.getTime()) {
      this.setState({errorMessage: 'The ending date cannot be before the start date.'});
      return;
    }
    sDate.setUTCHours(sDate.getUTCHours() + 24);
    eDate.setUTCHours(eDate.getUTCHours() + 24);
    let obj = {
      name: this.state.name,
      url: this.state.url,
      description: this.state.winnerPrize,
      ownerEmail: this.state.user.email,
      creationDate: new Date(),
      startDate: sDate.getTime(),
      endDate: eDate.getTime()
    };
    instance().post('contest', obj)
      .then((response) => {
        this.setState({
          create: false,
          imgId: response.data.id
        }, () => {
          this.getAll();
          this.sendImg();
        });
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
      });
  }
  
  sendImg(e) {
    if (e && e.preventDefault) e.preventDefault();
    let formData = new FormData();
    formData.append('image', this.state.banner);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    instance().post('contest/' + this.state.imgId + "/img", formData, config)
      .then((response) =>
        this.getAll
      ).catch((error) => {
      console.log(error.response)
    });
  }
  
  formatDate(date) {
    let d = new Date(date);
    let day = d.getDate();
    let fDay = day < 10 ? "0" + day : day;
    let monthIndex = d.getMonth();
    let month = monthIndex < 8 ? "0" + (monthIndex + 1) : monthIndex + 1;
    let year = d.getFullYear();
    
    return year + "-" + month + "-" + fDay;
  }
  
  formatDateISO(date) {
    var curr = new Date(date);
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substr(0, 10);
  }
  
  updateContest(e) {
    e.preventDefault();
    let sDate = new Date(this.state.startDate);
    let eDate = new Date(this.state.endDate);
    sDate.setUTCHours(sDate.getUTCHours() + 24);
    eDate.setUTCHours(eDate.getUTCHours() + 24);
    if (sDate.getTime() > eDate.getTime()) {
      this.setState({errorMessage: 'The ending date cannot be before the start date.'});
      return;
    }
    instance().put('contest', {
      id: this.state.id,
      name: this.state.name,
      url: this.state.url,
      description: this.state.winnerPrize,
      ownerEmail: this.state.user.email,
      creationDate: new Date(),
      startDate: sDate.getTime(),
      endDate: eDate.getTime()
    })
      .then((response) => {
        this.setState({
          imgId: this.state.id,
          update: false,
          name: "",
          url: null,
          startDate: "2018-08-28",
          endDate: "2018-08-28",
          winnerPrize: ""
        }, () => {
          this.getAll();
          if (this.state.banner !== null) this.sendImg();
        });
      })
      .catch((error) => {
        this.setState({errorMessage: error.response});
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
              onChange={(e) => this.setState({name: e.target.value})}
              required
              fullWidth
            />
            <label htmlFor='imageTag' className='videoLabel'>
              Upload banner image:
              <input
                type="file"
                accept="image/*"
                label="Image"
                required
                onChange={(e) => this.setState({banner: e.target.files[0]})}
              />
            </label>
            <TextField
              margin="dense"
              id="contestUrl"
              label="Contest Unique URL"
              type="text"
              value={this.state.url}
              onChange={(e) => this.setState({url: e.target.value})}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="startDate"
              label="Start Date"
              type="date"
              value={this.state.startDate}
              onChange={(e) => this.setState({startDate: e.target.value})}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="endDate"
              label="End Date"
              type="date"
              value={this.state.endDate}
              onChange={(e) => this.setState({endDate: e.target.value})}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              id="winnerPrize"
              label="Winner's prize description"
              type="text"
              value={this.state.winnerPrize}
              onChange={(e) => this.setState({winnerPrize: e.target.value})}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({create: false})} color="primary">
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
              onChange={(e) => this.setState({name: e.target.value})}
              fullWidth
            />
            <label htmlFor='imageTag' className='videoLabel'>
              Upload banner image:
              <input
                type="file"
                accept="image/*"
                label="Image"
                onChange={(e) => this.setState({banner: e.target.files[0]})}
              />
            </label>
            <TextField
              margin="dense"
              id="contestUrl"
              label="Contest URL"
              type="text"
              value={this.state.url}
              onChange={(e) => this.setState({url: e.target.value})}
              fullWidth
            />
            <TextField
              margin="dense"
              id="startDate"
              label="Start Date"
              value={this.state.startDate}
              type="date"
              onChange={(e) => this.setState({startDate: e.target.value})}
              fullWidth
            />
            <TextField
              margin="dense"
              id="endDate"
              label="End Date"
              value={this.state.endDate}
              type="date"
              onChange={(e) => this.setState({endDate: e.target.value})}
              fullWidth
            />
            <TextField
              margin="dense"
              id="winnerPrize"
              label="Winner's prize description"
              type="text"
              value={this.state.winnerPrize}
              onChange={(e) => this.setState({winnerPrize: e.target.value})}
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
        onClose={() => this.setState({delete: false})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this contest? "}</DialogTitle>
        <DialogActions>
          <Button onClick={() => this.setState({delete: false})} color="primary" autoFocus>
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
    const rows = this.state.contests;
    return (
      <div>
        <Paper className={classes.root} style={{marginTop: '75px'}}>
          <Typography variant="display3" gutterBottom>
            Contest List
            <Button variant="contained" color="primary" className='pull-right'
                    onClick={() => this.setState({create: true})}>
              Add Contest
            </Button>
          </Typography>
          
          <Pager>
            <Pager.Item disabled={!this.state.prevButton} onClick={this.downPage} previous> &larr; Previous
              Page </Pager.Item>
            <Pager.Item disabled={!this.state.nextButton} onClick={this.upPage} next> Next Page &rarr; </Pager.Item>
          </Pager>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Contest</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.url}</TableCell>
                    <TableCell>{this.formatDate(row.startDate)}</TableCell>
                    <TableCell>{this.formatDate(row.endDate)}</TableCell>
                    <TableCell>
                      <Button className={classes.button}
                              onClick={() => browserHistory.push("contest/" + row.id, {url: row.url})}>
                        <Visibility className={classes.icon} color="primary"/>
                      </Button>
                      <Button className={classes.button} onClick={() => this.setState({
                        id: row.id,
                        name: row.name,
                        url: row.url,
                        startDate: this.formatDate(row.startDate),
                        endDate: this.formatDate(row.endDate),
                        winnerPrize: row.description
                      }, this.viewUpdate)}><Edit className={classes.icon} color="primary"/></Button>
                      <Button className={classes.button}
                              onClick={() => this.setState({id: row.id},
                                () => this.setState({delete: true}))}>
                        <Delete className={classes.icon} color="primary"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        {this.showCreate()}
        {this.showUpdate()}
        {this.showDelete()}
        {this.state.errorMessage ?
          <ErrorMessage
            close={() => this.setState({errorMessage: null})}
            errorData={this.state.errorMessage}
          /> : null}
      </div>
    );
  }
}


const styles = {
  button: {
    display: 'inline-block',
    padding: 0,
    minHeight: 0,
    minWidth: 0,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  table: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  
};


export default withStyles(styles)(ContestTable);