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
        console.log("holi");
        instance().get('contest/'+this.state.id+'/submissions')
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
        const tileData = [
            {
                key:'1',
                img: "/images.jpeg",
                author: 'author',
                email:'email',
                date:'',
                state:''
            },
            {
                key:'2',

                img: "/images.jpeg",
                author: 'author',
                email:'email',
                date:'',
                state:''
            },
            {
                key:'3',
                img: "/images.jpeg",
                author: 'author',
                email:'email',
                date:'',
                state:''
            },
            {
                key:'4',
                img: "/images.jpeg",
                author: 'author',
                email:'email',
                date:'',
                state:''
            },
            {
                key:'5',

                img: "/images.jpeg",
                author: 'author',
                email:'email',
                date:'',
                state:''
            },
            {
                key:'6',

                img: "/images.jpeg",
                author: 'author',
                email:'email',
                date:'',
                state:''
            }
        ];
        const cards = this.state.submissions.map((tile) => <Card key={tile.id} >
            <CardMedia
                className={classes.media}
                image="/images.jpeg"
                title="Contemplative Reptile"
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
        </Card>);
        return (
            <div >
                {(this.state.submissions !== undefined && this.state.submissions !== {}) &&
                <GridList className={classes.root} cellHeight={'auto'} cols={5} >
                    {React.Children.toArray(cards)}
                </GridList>}
            </div>
        );
    }
}


const styles = {
    card: {
        margin:10
    },
    media: {
        height: 140,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden'
    },
    gridList: {
        width: 100,
        height: 450,
    },

};


ContestDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContestDetail);
