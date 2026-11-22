import { checkValue } from "../utils/helpers";

function DetailField({label, value}) {
    if (!checkValue(value)) return null;

    let displayVal = value;
    if (Array.isArray(value)) {
        displayVal = value.join(', ');
    };

    return (
        <p className="detail-field">
            <strong>{label}:</strong> {displayVal}
        </p>
    )
}

export default DetailField;