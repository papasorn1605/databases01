import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import './Index.css';

const decodeHtmlEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};

export default function EmployeeIndex({ employees, query }) {
    const [search, setSearch] = useState(query || '');
    const [sort, setSort] = useState({ column: '', order: '' });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search') || '';
        setSearch(searchQuery);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`/employees?search=${search}`);
    };

    const handleSort = (column) => {
        setSort((prev) => {
            const newOrder =
                prev.column === column && prev.order === 'asc' ? 'desc' : 'asc';
            router.get('/employees', { search, sort: column, order: newOrder });
            return { column, order: newOrder };
        });
    };

    const handlePagination = (url) => {
        if (url) {
            const params = new URLSearchParams(
                new URL(url, window.location.origin).search,
            );
            if (search) params.set('search', search);
            if (sort.column)
                params.set('sort', sort.column).set('order', sort.order);
            router.get(`/employees?${params.toString()}`);
        }
    };

    const handleRefresh = () => {
        setSearch('');
        setSort({ column: '', order: '' });
        router.get('/employees');
    };

    return (
        <div className="container">
            <h1 className="title">Employee List</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="search-button">
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleRefresh}
                    className="refresh-button"
                >
                    Refresh
                </button>
            </form>

            {employees.data?.length ? (
                <div className="table-container">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                {[
                                    'emp_no',
                                    'first_name',
                                    'last_name',
                                    'birth_date',
                                ].map((column) => (
                                    <th key={column}>
                                        {column.replace('_', ' ').toUpperCase()}
                                        <button
                                            onClick={() => handleSort(column)}
                                        >
                                            {sort.column === column
                                                ? sort.order === 'asc'
                                                    ? '▲'
                                                    : '▼'
                                                : ''}
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.data.map((employee, index) => (
                                <tr
                                    key={employee.emp_no}
                                    className={
                                        index % 2 === 0 ? 'even-row' : 'odd-row'
                                    }
                                >
                                    <td>{employee.emp_no}</td>
                                    <td>{employee.first_name}</td>
                                    <td>{employee.last_name}</td>
                                    <td>{employee.birth_date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        {employees.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    link.url && handlePagination(link.url)
                                }
                                disabled={!link.url}
                                className={`pagination-button ${link.active ? 'active' : ''}`}
                            >
                                {decodeHtmlEntities(link.label || '')
                                    .replace('Previous', '\u00ab Previous')
                                    .replace('Next', 'Next \u00bb')}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <h2 className="no-employees">No employees found.</h2>
            )}
        </div>
    );
}
