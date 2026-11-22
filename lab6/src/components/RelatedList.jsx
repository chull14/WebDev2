import { checkValue } from "../utils/helpers";
import { Link } from "react-router-dom";

function RelatedList({heading, items, path, message}) {
    if (!checkValue(items)) {
        return (
            <section>
                <h2>{heading}</h2>
                <p>{message}</p>
            </section>
        )
    }

    return (
        <section>
            <h2>{heading}</h2>
            <ul>
            {items.map((item) => (
                <li key={item.id}>
                    <Link to={`${path}/${item.id}`}>{item.title}</Link>
                </li>
            ))}
            </ul>
        </section>
    )
}

export default RelatedList;