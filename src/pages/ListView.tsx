import type { ApodPicture } from "../types";
import { useState } from "react";
import { Link } from "react-router";

interface ListViewProps {
    pictures: ApodPicture[];
}

export default function ListView({ pictures }: ListViewProps) {
    const [query, setQuery] = useState('');
    const [sortField, setSortField] = useState<'title' | 'date'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filtered = pictures.filter((picture) =>
        picture.title.toLowerCase().includes(query.toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
        const result = a[sortField].localeCompare(b[sortField]);
        return sortOrder === 'asc' ? result : -result;
    });

    return (
        <>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />

            <select value={sortField} onChange={(e) => setSortField(e.target.value as 'title' | 'date')}>
                <option value="title">Title</option>
                <option value="date">Date</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>

            <ul>
                {sorted.map((picture) => (
                    <li key={picture.date}>
                        <Link to={`/apod/${picture.date}`}>{picture.date} {picture.title}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}