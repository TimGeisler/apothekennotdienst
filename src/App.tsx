import React from 'react';
import Container from 'react-bootstrap/Container';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { parse } from 'query-string';
import { Services } from './Services';

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      refetchInterval: 1000 * 60 * 10, // every 10 minutes
    },
  },
});

function App() {
  const { name, city } = parse(window.location.search);
  if (!name || !city) {
    return (
      <>
        <p>Falscher Aufruf der Web-Site</p>
        <p>Bitte URL-Parameter "name" und "city" angeben: {window.location.href}?name=XYZ-Apotheke&amp;city=Musterstadt</p>
      </>
    );
  }

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Container fluid>
        <Services />
      </Container>
    </ReactQueryCacheProvider>
  );
}

export default App;
