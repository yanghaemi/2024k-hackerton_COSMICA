import React, { useState } from 'react';
import Input from './Input.jsx';

const Send = () => {
    const [input, setInput] = useState({
        id:"",
        name: "",
    });

    const onChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        const user = {
            id: input.id,
            name: input.name
        };
        console.log(user);
        console.log(JSON.stringify(user));
        fetch(`api/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <Input input={input} onChange={onChange} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Send;
