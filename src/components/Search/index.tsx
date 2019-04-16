import React from 'react';

export interface SearchProps {
    value?: string;
    className?: string;
    onChange?(e: React.FormEvent<HTMLInputElement>): void;
    onSubmit?(): void;
}

const Search: React.SFC<SearchProps> = ({ value, className, onChange, onSubmit }) => (
    <div className={['input-group', className].filter(Boolean).join(' ')}>
        <input
            type="text"
            value={value}
            className="form-control"
            onChange={onChange}
        />
        <div className="input-group-append">
            <button
                className="btn btn-primary"
                type="button"
                onClick={onSubmit}
            >
                Search
            </button>
        </div>
    </div>
);

export default Search;
