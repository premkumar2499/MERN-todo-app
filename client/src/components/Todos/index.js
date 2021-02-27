import React from 'react';
import Todo  from './todo'


const Todos = () =>{
    return(
        <div className="container">
            <Todo content="complete breakfast" time="Sun 18:00" />
            <Todo content="Learn React" time="Sun 18:00" />
            <Todo content="Exercise daily for 10 mins" time="Sun 18:00" />
            <Todo content="complete breakfast and Exercise daily for 10 mins" time="Sun 18:00" />
            <Todo content="complete breakfast" time="Sun 18:00" />
            <Todo content="complete breakfast" time="Sun 18:00" />
            <Todo content="complete breakfast" time="Sun 18:00" />
            <Todo content="complete breakfast" time="Sun 18:00" />
        </div>
    )
}

export default Todos