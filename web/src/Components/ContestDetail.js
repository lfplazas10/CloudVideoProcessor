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


class ContestDetail extends Component {

    constructor(props){
        super(props);

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
        const cards = tileData.map((tile) => <Card key={tile.id} >
            <CardMedia
                className={classes.media}
                image={tile.img}
                title="Contemplative Reptile"
            />
            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    {tile.author}
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
            <div className={classes.root}>
                <GridList cellHeight={'auto'} cols={5} className={classes.gridList}>
                    {React.Children.toArray(cards)}
                </GridList>
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
        //width: 1000,
        //height: 450,
    },

};


ContestDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ContestDetail);
