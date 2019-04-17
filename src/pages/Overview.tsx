import React, { useState } from 'react';
import { Layout, Search, DataTable } from '../components';
import { Link } from 'react-router-dom';

const Overview = () => {
  const [source, setSource] = useState();
  const [search, setSearch] = useState('asd');

  const onSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const onSearchSubmit = () => {
    setSource(`https://api.github.com/search/users?q=${search}&per_page=25`);
  };

  return (
    <Layout>
      <h1 className="text-center">Overview</h1>
      <Search
        className="mt-3"
        value={search}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
      />
      <DataTable
        headers={['login', { id: 'Ident' }]}
        mutators={{ login: (data: any) => <Link to="a">{data.login && data.login}</Link> }}
        source={source}
      />
    </Layout>
  );
};

export default Overview;
