import React, { useEffect, useState } from 'react';
import { Layout, DataTable } from '../components';

export interface ShowProps {
    match: any;
}

const Show: React.SFC<ShowProps> = ({ match: { params: { user } } }) => {
    return (
        <Layout>
            <h1 className="text-center">{user}</h1>
            <DataTable
                headers={[{ repo: 'repository', stargazers_count: 'stars' }, 'watchers', 'forks']}
                mutators={{
                    repo: (data: any) => {
                        return <a href={data.html_url}>{data.name}</a>
                    }
                }}
                source={`https://api.github.com/users/${user}/repos`}
            />
        </Layout >
    );
};

export default Show;
