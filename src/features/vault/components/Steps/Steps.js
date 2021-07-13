import {Backdrop, Grid, Box, Button, Link, Fade, makeStyles, Modal, Typography} from "@material-ui/core";
import * as React from "react";
import {byDecimals} from "../../../../helpers/format";
import BigNumber from "bignumber.js";
import {OpenInNew } from "@material-ui/icons";
import {isEmpty} from "../../../../helpers/utils";
import {Alert, AlertTitle} from "@material-ui/lab";
import Loader from "../../../../components/loader";
import styles from "../../styles";
import {useSelector} from "react-redux";

const useStyles = makeStyles(styles);

const Steps = ({item, steps, handleClose}) => {
    const classes = useStyles();
    const wallet = useSelector(state => state.walletReducer);

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={steps.modal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={steps.modal}>
                {steps.finished ? (
                    <Box className={classes.modalForeground}>
                        <Grid container className={classes.modalText}>
                            <Grid item xs={3}>
                                <img alt="Moonpot Deposit" className={classes.confirmationImage} align={"left"} src={require('../../../../images/ziggy/depositSuccessful.svg').default} />
                            </Grid>
                            {steps.items[steps.currentStep].step === 'deposit' ? (
                                <React.Fragment>
                                    <Typography className={classes.stepsTitleText}>Deposit Successful!</Typography>
                                    <Typography className={classes.successfulDepositAmountText}>You have successfully deposited {byDecimals(new BigNumber(wallet.action.data.amount), item.tokenDecimals).toFixed(8)} {item.token}</Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Typography variant={"h2"}>{byDecimals(new BigNumber(wallet.action.data.amount).multipliedBy(byDecimals(item.pricePerShare)), item.tokenDecimals).toFixed(8)} {item.token}</Typography>
                                    <Typography variant={"h2"}>withdraw confirmed</Typography>
                                </React.Fragment>
                            )}
                            <Box className={classes.viewMyMoonpots} textAlign={"center"}>
                                <Button href={"/my-moonpots"}>View My Moonpots</Button>
                            </Box>
                            <Box textAlign={"center"}>
                                <Link className={classes.blockExplorerLink} variant={"outlined"} href={wallet.explorer[item.network] + '/tx/' + wallet.action.data.receipt.transactionHash} target="_blank">See deposit on Block Explorer <OpenInNew /></Link> 
                            </Box>
                        </Grid>
                    </Box>
                ) : (
                    <React.Fragment>
                        <Box className={classes.modalForeground}>
                            <Grid container className={classes.modalText}>
                                <Grid item xs={3}>
                                    <img alt="Moonpot Deposit" className={classes.confirmationImage} align={"left"} src={require('../../../../images/ziggy/deposit.svg').default} />
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography id="transition-modal-title" className={classes.transactionConfirmations}>{steps.currentStep} / {steps.items.length} Transactions Confirmed</Typography>
                                </Grid>
                                <Typography id="transition-modal-description">{!isEmpty(steps.items[steps.currentStep]) ? steps.items[steps.currentStep].message : ''}</Typography>
                                
                                {wallet.action && wallet.action.result === 'error' ? (
                                    <Alert severity={"error"}>
                                        <AlertTitle>Error</AlertTitle>
                                        <Typography>{wallet.action.data.error}</Typography>
                                    </Alert>
                                ) : ''}
                                {wallet.action && wallet.action.result === 'success_pending' ? (
                                    <Alert severity={"info"}>
                                        <AlertTitle>Confirmation Pending</AlertTitle>
                                        <Typography>Waiting for network to confirm transaction...</Typography>
                                        <Box textAlign={"center"}><Loader /></Box>
                                        <Box textAlign={"center"} mt={2}>
                                            <Button variant={"outlined"} color={"primary"} href={wallet.explorer[item.network] + '/tx/' + wallet.action.data.hash} target="_blank">See deposit on Block Explorer</Button>
                                            
                                        </Box>
                                    </Alert>
                                ) : ''}
                            </Grid>
                        </Box>
                        <Button variant={"outlined"} onClick={handleClose}>Close</Button>
                    </React.Fragment>
                )}
            </Fade>
        </Modal>
    )
}

export default Steps;