import React, { useState, useEffect, ReactNode } from 'react';
import shortId from 'shortid';
import styles from './style.module.scss';

export interface DataTableProps {
    source: string;
    headers?: Array<string | object>;
    mutators?: { [key: string]: (data: object) => string | ReactNode };
    onDataSet?(): void;
}

export interface PaginationProps {
    pageCount: number;
    currentPage: number;
    onPageChange(page: number): void;
}

const Pagination: React.SFC<PaginationProps> = ({ currentPage, pageCount, onPageChange }) => {

    const left: Array<string | number> = currentPage - 3 > 0 ?
        [1, '...'] : [1, 2, 3];
    const middle: Array<string | number> = (currentPage - 3 > 0 && currentPage < pageCount - 2) ?
        [currentPage - 1, currentPage, currentPage + 1] : [];
    const right: Array<string | number> = currentPage + 2 < pageCount ?
        ['...', pageCount] : [pageCount - 2, pageCount - 1, pageCount];

    // Can't use [...new Set()] here because we dont want to filter out the '...' elements
    const pages = [...left, ...middle, ...right].filter((e, i, a) => Number(e) ?
        (a.indexOf(e) === i && e > 0) : e);

    // Less then 2 pages means no use for pagination
    return (pageCount || 0) < 2 ? null : (
        <div className={styles.pagination}>
            <nav>
                <ul className="pagination">
                    {currentPage - 1 > 0 &&
                        <li key={shortId.generate()} className="page-item" >
                            <span
                                className="page-link"
                                onClick={() => onPageChange(currentPage - 1)}
                            >
                                Previous
                            </span>
                        </li>
                    }
                    {pages.map(page =>
                        <li
                            key={shortId.generate()}
                            className={['page-item', page === currentPage && 'active']
                                .filter(Boolean)
                                .join(' ')}
                        >
                            <span
                                className="page-link"
                                onClick={() => Number(page) && onPageChange(Number(page))}
                            >
                                {page}
                            </span>
                        </li>,
                    )}
                    {currentPage < pageCount &&
                        <li key={shortId.generate()} className="page-item">
                            <span
                                className="page-link"
                                onClick={() => onPageChange(currentPage + 1)}
                            >
                                Next
                            </span>
                        </li>
                    }
                </ul>
            </nav>
        </div>
    );
};

const DataTable: React.SFC<DataTableProps> = ({ source, headers, mutators, onDataSet }) => {
    const perPage = 25; // could be a feature to make this changable later
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const getSource = () =>
        source.includes('?') ? `${source}&per_page=${perPage}` : `${source}?per_page=${perPage}`;

    const fetchData = async () => {
        if (source) {

            const res = await fetch(getSource());
            const json = await res.json();
            const count = json.total_count > 1000 ? 1000 : json.total_count; // Github limit
            const data = json.items ? json.items : json;

            setData(data);
            setPageCount(Math.ceil(count / perPage));
            setCurrentPage(1);
        }
    };

    useEffect(() => {
        fetchData();
    }, [source]);

    const onPageChange = async (page: number) => {
        const res = await fetch(`${getSource()}&page=${page}`);
        const json = await res.json();

        setData(json.items);
        setCurrentPage(page);
    };

    const columns = headers || Object.keys(data[0]);
    const columnNames = columns.map(c => typeof c === 'object' ?
        Object.values(c) : c).flat();
    const columnValues = columns.map(c => typeof c === 'object' ?
        Object.keys(c) : c).flat();

    return (
        <div>
            <table className="table">
                {data && data.length > 0 &&
                    <>
                        <thead>
                            <tr>
                                {columnNames.map(col => (
                                    <th key={shortId.generate()}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={shortId.generate()}>
                                    {columnValues.map(col => (
                                        <td key={shortId.generate()}>
                                            {(mutators && typeof mutators[col] === 'function') ?
                                                mutators[col](row) : row[col]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </>
                }
            </table>
            <Pagination
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default DataTable;
