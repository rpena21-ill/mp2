import type { ApodPicture } from "../types";

interface ListViewProps {
    pictures: ApodPicture[];
}

export default function ListView({ pictures }: ListViewProps) {
    return (
    <ul>
        {pictures.map((picture) => (
        <li key={picture.date}>{picture.date} {picture.title}</li>
        ))}
    </ul>
    );
}