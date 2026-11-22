import { Link } from "react-router-dom";
import { checkValue } from "../utils/helpers";


function AgentCard({agent}) {
    let lifeDates = null;
    if (checkValue(agent.birth_date) || checkValue(agent.death_date)) {
        lifeDates = `${agent.birth_date || '?'} - ${agent.death_date || '?'}`;
    }

    return (
        <Link className="card" to={`/agents/${agent.id}`}>
            <h2>{agent.title || "Unknown"}</h2>
            {checkValue(agent.agent_type_title) && <p>{agent.agent_type_title}</p>}
            {checkValue(lifeDates) && <p>{lifeDates}</p>}
            <p>{agent.is_artist ? 'Artist' : 'Not an Artist'}</p>
            <p>ID: {agent.id}</p>
        </Link>
    )
}

export default AgentCard;