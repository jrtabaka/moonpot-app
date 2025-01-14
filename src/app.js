import React, { memo, Suspense, useEffect } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import appTheme from './appTheme.js';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { RouteLoading } from './components/RouteLoading';
import { PageNotFound } from './PageNotFound';
import { Header } from './components/Header';
import Footer from './components/footer';
import ModalPopup from './components/Modal/modal.js';
import { useLocation } from 'react-router';
import { useImpersonate } from './helpers/hooks';
import { GoogleAnalytics } from './googleAnalytics';
import { GlobalDataLoader } from './components/GlobalDataLoader/GlobalDataLoader';

require('dotenv').config();

const Home = React.lazy(() => import(`./features/home`));
const Vault = React.lazy(() => import(`./features/vault`));
const Winners = React.lazy(() => import(`./features/winners`));
const Dao = React.lazy(() => import(`./features/dao`));
const Promo = React.lazy(() => import(`./features/promo`));
const Promos = React.lazy(() => import(`./features/promo/promos`));

function Pages() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route
          exact
          path={[
            '/:bottom(featured|all|xmas|main|lp|stable|community|side|nft)?',
            '/:top(my-moonpots)',
          ]}
        >
          <Home />
          <Footer variant="light" />
        </Route>
        <Route strict sensitive exact path="/pot/:id">
          <Vault />
          <Footer variant="dark" />
        </Route>
        <Route strict sensitive exact path="/winners">
          <Winners />
          <Footer variant="dark" />
        </Route>
        <Route strict sensitive exact path="/ido">
          <Dao />
          <Footer variant="dark" />
        </Route>
        <Route strict sensitive exact path="/promos">
          <Promos />
          <Footer variant="dark" />
        </Route>
        <Route strict sensitive exact path="/promo/:name">
          <Promo />
          <Footer variant="dark" />
        </Route>
        <Route>
          <PageNotFound />
          <Footer variant="dark" />
        </Route>
      </Switch>
    </Suspense>
  );
}

const ScrollToTop = memo(function () {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (!state || !state.tabbed) {
      window.scrollTo(0, 0);
    }
  }, [pathname, state]);

  return null;
});

export default function App() {
  const theme = appTheme();
  useImpersonate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalDataLoader />
      <ModalPopup />
      <HashRouter>
        <ScrollToTop />
        <GoogleAnalytics />
        <Header />
        <Pages />
      </HashRouter>
    </ThemeProvider>
  );
}
