import React from 'react';

export interface SearchProps {
    value?: string;
    className?: string;
    onChange?(e: React.FormEvent<HTMLInputElement>): void;
    onSubmit?(e: React.FormEvent<HTMLFormElement>): void;
}

const Search: React.SFC<SearchProps> = ({ value, className, onChange, onSubmit }) => (
    <form
        className={['input-group', className].filter(Boolean).join(' ')}
        onSubmit={onSubmit}
    >
        <input
            type="text"
            value={value}
            className="form-control"
            onChange={onChange}
        />
        <div className="input-group-append">
            <button
                className="btn btn-primary"
                type="submit"
            >
                Search
            </button>
        </div>
    </form>
);

export default Search;
