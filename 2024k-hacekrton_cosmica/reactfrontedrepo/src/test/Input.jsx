const Input = ({ input, onChange }) => {
    return (
        <div>
            <input
                type={"text"}
                name={"id"}
                onChange={onChange}
            />
            <input
                type={"text"}
                name={"name"}
                onChange={onChange}
            />
        </div>
    );
};

export default Input;