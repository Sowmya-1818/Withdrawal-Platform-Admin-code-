import React from 'react'
import {
    Box,
    Button,
    makeStyles,
    Typography,
    Grid,
    Dialog
} from "@material-ui/core";
import { ImCross } from "react-icons/im";
const useStyles = makeStyles((theme) => ({
    muiMainContainer: {
        "& .head": {
            padding: "50px 20px 20px 20px",
            borderBottom: "1px solid #000",
        },
        "& h3": {
            fontWeight: "700",
            fontSize: "32px",
            lineHeight: "normal",
            fontFamily: "'Arial Bold', 'Arial', sans-serif",
        },
        "& .mainBox": {
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            "& h5": {
                fontWeight: "700",
                fontSize: "20px",
                lineHeight: "normal",
                fontFamily: "'Arial Bold', 'Arial', sans-serif",
            },
            "& h6": {
                fontWeight: "400",
                fontSize: "18px",
                lineHeight: "normal",
                fontFamily: "'Arial Bold', 'Arial', sans-serif",
            }
        },
        "& .secendMainBox": {
            height: "300px",
            maxWidth: "1000px",
            width: "100%",
            display: "flex", gap: "30px",
            "& .filterBtn": {
                height: "55px",
                maxWidth: "180px",
                width: "100%"
            }
        },
       
    },
    dialog: {
        "& .dialogMainContainer": {
            padding: "20px 10px",
        },
        "& .MuiDialog-paperWidthSm":{maxWidth:"510px !important",width:"100%"},
        "& .dialogSubBox":{
            display:"flex",
            flexDirection:"column",
            gap:"50px",
            padding:"30px 10px",
            "& h6": {
                fontWeight: "400",
                fontSize: "18px",
                lineHeight: "30px",
                fontFamily: "'Arial Bold', 'Arial', sans-serif",
                [theme.breakpoints.down('xs')]:{lineHeight:"30px"}
            },
            "& .dialogButtonBox":{gap:"20px"}
        }
    }

}))
const data = [
    { label: 'Username:', value: 'Oyeeamol' },
    { label: 'Email Id:', value: 'amol@mailinator.com' },
    { label: 'Transaction Hash:', value: '0xjsje7374hesshehwew727232e' },
    { label: 'Amount (In USDT):', value: '23.5' },
    { label: 'Created Date & Time:', value: 'January 22nd, 2024, 9:34 PM' },
    { label: 'Transaction Type:', value: 'Withdrawal' },
];

const WalletTransaction = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Box className={classes.muiMainContainer}>
            <Typography variant='h3' className='head'>Withdraw Transaction Details</Typography>
            <Box className='mainBox'>
                {data.map((item, index) => (
                    <Grid container spacing={2} key={index}>
                        <Grid item lg={3} md={3} sm={4} xs={12}>
                            <Typography variant='h5'>{item.label}</Typography>
                        </Grid>
                        <Grid item lg={9} md={9} sm={8} xs={12}>
                            <Typography variant='h6'>{item.value}</Typography>
                        </Grid>
                    </Grid>
                ))}
            </Box>
            <Box className='displayCenter secendMainBox'>
                <Button variant='contained' color='primary' className="filterBtn" onClick={handleClickOpen}>APPROVE</Button>
                <Button variant='outlined' className="filterBtn">BACK</Button>
            </Box>
            <Dialog className={classes.dialog} open={open} onClose={handleClose}>
                <Box className='dialogMainContainer'>
                    <Box display="flex" justifyContent="end"><ImCross onClick={handleClose} /></Box>
                    <Box className='dialogSubBox'>
                        <Typography variant='h6'>YES NO Are you sure, you want to Approve this Withdrawal Request ?</Typography>
                        <Box className='displayCenter dialogButtonBox'>
                            <Button variant='contained' color="primary">YES</Button>
                            <Button variant='contained' color="primary">No</Button>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    )
}

export default WalletTransaction