import React, { Component } from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import instance from "../AjaxCrtl";
import Header from "./Header";
import Grow from "@material-ui/core/es/Grow/Grow";
import TextField from "@material-ui/core/es/TextField/TextField";
import Grid from "@material-ui/core/es/Grid/Grid";


class ContestDetail extends Component {

    constructor(props){
        super(props);
        this.state={
            id:1,
            submissions:[]
        }
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){
        var url = '/contest/1/submissions';

        instance().get('contest/'+this.props.match.params.contestId+'/submissions')
            .then((response) => {
                this.setState({submissions:response.data})
                console.log(response);
            })
            .catch((error) => {
                console.log(error.response)
            });
    }

    render() {
        const { classes } = this.props;

        const props = this.props;

        return (
            <div className="main" style={{ marginTop: '75px' }} >
                <MuiThemeProvider theme={THEME}>
                    <Header
                        {...props}
                        brand={'Content manager'}
                        color={'info'}/>
                    { this.state.submissions ? (
                        <div>
                            {/*<TextField style={{padding: 24}}
                                           id="searchInput"
                                           placeholder="Search for Submissions"
                                           margin="normal"
                                />*/}
                            <Grid container spacing={24} style={{padding: 24}}>
                                { this.state.submissions.map(tile => (
                                    <Grid item xs={12} sm={4} md={3} xl={3}>
                                        <Card style={{padding: 10}} key={tile.id} >
                                            <CardMedia
                                                className={classes.media}
                                                image="/images.jpeg"
                                                title="video"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="headline" component="h2">
                                                    {tile.firstName} {tile.lastName}
                                                </Typography>
                                                <Typography component="p">
                                                    <strong>Email: </strong>{tile.email}
                                                </Typography>
                                                <Typography component="p">
                                                    <strong>Fecha:</strong> {tile.date}
                                                </Typography>
                                                <Typography component="p">
                                                    <strong>Estado:</strong> {tile.state}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" color="primary">
                                                    Ver original
                                                </Button>
                                                <Button size="small" color="primary">
                                                    Ver video convertido
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    ) : "No courses found" }
                </MuiThemeProvider>



            </div>




        );
    }
}


const styles = {

    media: {
        height: 0,
        paddingTop: '56.25%'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        //justifyContent: 'space-around',
        overflow: 'hidden',
        padding: 50,
        height: 'auto',
    }
};

const THEME = createMuiTheme({
    typography: {
        "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        "fontSize": 18,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    }
});


ContestDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContestDetail);
