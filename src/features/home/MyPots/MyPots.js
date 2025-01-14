import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, makeStyles } from '@material-ui/core';
import reduxActions from '../../redux/actions';
import BigNumber from 'bignumber.js';
import { isEmpty } from '../../../helpers/utils';
import { byDecimals } from '../../../helpers/format';
import NoPotsCard from './components/NoPotsCard/NoPotsCard';
import Pot from './components/Pot/Pot';
import { Cards } from '../../../components/Cards';
import styles from './styles';
import { ClaimableBonusNotification } from '../../../components/ClaimableBonusNotification';
import { MigrationNotices } from '../Moonpots/components/MigrationNotices/MigrationNotices';
import { useSortKey, sortPots } from '../Moonpots/hooks/filter';

const useStyles = makeStyles(styles);

const MyPots = ({ potStatus, sort }) => {
  const classes = useStyles();
  const { vault, prices } = useSelector(state => ({
    vault: state.vaultReducer,
    prices: state.pricesReducer,
  }));
  const [sortKey, sortDir] = useSortKey(sort);
  const walletAddress = useSelector(state => state.walletReducer.address);
  const tokenBalances = useSelector(state => state.balanceReducer.tokens);
  const dispatch = useDispatch();

  //Since filtered itself is not in the state we need to use a stateful variable to know when to update the page
  const [filteredUpdated, setFilteredUpdated] = useState(false);
  const filtered = useMemo(() => {
    const check = item => {
      if (item.status !== potStatus) {
        return false;
      }

      if (Number(tokenBalances[item.contractAddress + ':total'].balance) === 0) {
        return false;
      }

      return true;
    };

    return Object.values(vault.pools)
      .filter(check)
      .map(item => {
        if (walletAddress && !isEmpty(tokenBalances[item.contractAddress + ':total'])) {
          return {
            ...item,
            userBalance: byDecimals(
              new BigNumber(tokenBalances[item.contractAddress + ':total'].balance),
              item.tokenDecimals
            ),
          };
        }
        return item;
      });
  }, [potStatus, vault.pools, tokenBalances, walletAddress]);

  useEffect(() => {
    sortPots(filtered, sortKey, sortDir);
    setFilteredUpdated(true);
  }, [filtered, sortKey, sortDir]);

  useEffect(() => {
    if (filteredUpdated === true) {
      setFilteredUpdated(false);
    }
  }, [filteredUpdated]);

  useEffect(() => {
    if (prices.lastUpdated > 0) {
      dispatch(reduxActions.vault.fetchPools());
    }
  }, [dispatch, prices.lastUpdated]);

  useEffect(() => {
    if (walletAddress) {
      dispatch(reduxActions.balance.fetchBalances());
      dispatch(reduxActions.earned.fetchEarned());
    }
  }, [dispatch, walletAddress]);

  return (
    <React.Fragment>
      <Container maxWidth={false} style={{ padding: '0' }}>
        <div className={classes.potsContainer}>
          <div className={classes.spacer}>
            {potStatus === 'active' ? (
              <>
                <MigrationNotices potType="all" />
                <ClaimableBonusNotification className={classes.claimableBonuses} />
              </>
            ) : null}
            <Cards sameHeight={false}>
              {filtered.length === 0 ? (
                <NoPotsCard selected={potStatus} />
              ) : (
                filtered.map(item => <Pot key={item.id} item={item} />)
              )}
            </Cards>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default MyPots;
