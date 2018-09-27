// import React from "react";
// import Dialog from "@material-ui/core/Dialog/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
// import DialogContent from "@material-ui/core/DialogContent/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
// import TextField from "@material-ui/core/TextField/TextField";
// import DialogActions from "@material-ui/core/DialogActions/DialogActions";
// import Button from "@material-ui/core/Button/Button";
//
//
// class ContestDialog extends React.Component {
//
//   render(){
//     return (
//       <Dialog
//         open={this.state.create}
//         fullScreen={this.props.fullScreen}>
//         <form onSubmit={this.createContest}>
//           <DialogTitle>Create Contest</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Enter the contest information below.
//             </DialogContentText>
//             <TextField
//               margin="dense"
//               id="contestName"
//               label="Contest name"
//               type="text"
//               value={this.state.name}
//               onChange={(e) => this.setState({name: e.target.value})}
//               required
//               fullWidth
//             />
//             <label htmlFor='imageTag' className='videoLabel'>
//               Upload banner image:
//               <input
//                 type="file"
//                 accept="image/*"
//                 label="Image"
//                 required
//                 onChange={(e) => this.setState({banner: e.target.files[0]})}
//               />
//             </label>
//             <TextField
//               margin="dense"
//               id="contestUrl"
//               label="Contest Unique URL"
//               type="text"
//               value={this.state.url}
//               onChange={(e) => this.setState({url: e.target.value})}
//               required
//               fullWidth
//             />
//             <TextField
//               margin="dense"
//               id="startDate"
//               label="Start Date"
//               type="date"
//               value={this.state.startDate}
//               onChange={(e) => this.setState({startDate: e.target.value})}
//               required
//               fullWidth
//             />
//             <TextField
//               margin="dense"
//               id="endDate"
//               label="End Date"
//               type="date"
//               value={this.state.endDate}
//               onChange={(e) => this.setState({endDate: e.target.value})}
//               required
//               fullWidth
//             />
//             <TextField
//               margin="dense"
//               id="winnerPrize"
//               label="Winner's prize description"
//               type="text"
//               value={this.state.winnerPrize}
//               onChange={(e) => this.setState({winnerPrize: e.target.value})}
//               required
//               fullWidth
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => this.setState({create: false})} color="primary">
//               Cancel
//             </Button>
//             <Button color="primary" type="submit">
//               Create
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     )
//   }
// }