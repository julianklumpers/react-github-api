import React, { useState, useEffect } from 'react';
import shortId from 'shortid';

export interface DataTableProps {
    source: string;
    headers: Array<string | object>;
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
        (a.indexOf(e) === i && e > 0) : e)

    // Less then 2 pages means no use for pagination
    return pageCount < 2 ? null : <nav>
        <ul className="pagination">
            {currentPage - 1 > 0 &&
                <li key={shortId.generate()} className="page-item" >
                    <span className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                        Previous
                    </span>
                </li>
            }
            {pages.map(page =>
                <li key={shortId.generate()}
                    className={['page-item', page === currentPage && 'active'].filter(Boolean).join(' ')}>
                    <span className="page-link" onClick={() => Number(page) && onPageChange(Number(page))}>
                        {page}
                    </span>
                </li>
            )}
            {currentPage < pageCount &&
                <li key={shortId.generate()} className="page-item">
                    <span className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                        Next
                    </span>
                </li>
            }
        </ul>
    </nav>;
}


const DataTable: React.SFC<DataTableProps> = ({ source, headers, onDataSet }) => {
    const perPage = 25 // could be a feature to make this changable later
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        (async () => {
            if (source) {

                const res = await fetch(source);
                const json = await res.json()
                const count = json.total_count > 1000 ? 1000 : json.total_count; // Github limitation
                setData(json.items);
                setPageCount(Math.ceil(count / perPage))
                setCurrentPage(1);
            }

        })()
    }, [source])

    const onPageChange = async (page: number) => {
        const res = await fetch(`${source}&page=${page}`);
        const json = await res.json()

        setData(json.items);
        setCurrentPage(page);
    }

    const _headers = headers || Object.keys(data[0]);
    // typeof header ===  <th key={shortId.generate()}>{header}</th>

    return (
        <div>
            <table className="table">
                {data.length > 0 &&
                    <>
                        <thead>
                            <tr>
                                {_headers.map(header => typeof header === 'object'
                                    ? <th key={shortId.generate()}></th>
                                    : <th key={shortId.generate()}>{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={shortId.generate()}>
                                    {Object.values(row).map(col => (
                                        <td>{col}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </>
                }
            </table>
            <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={onPageChange} />
        </div>
    );
}

export default DataTable;